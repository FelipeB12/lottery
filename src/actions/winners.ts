'use server'

import { getSession } from './auth'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function setWinningNumber(lotteryId: string, winningNumber: number) {
    const session = await getSession()
    if (!session || session.role !== 'OWNER') {
        throw new Error('Solo el dueño puede establecer números ganadores')
    }

    const lottery = await prisma.lottery.findUnique({
        where: { id: lotteryId }
    })

    if (!lottery) throw new Error('Lotería no encontrada')
    if (lottery.status !== 'CLOSED') throw new Error('La lotería debe estar cerrada para definir ganador')
    if (lottery.winningNumber !== null) throw new Error('Esta lotería ya tiene un número ganador')

    // 1. Update lottery with winning number
    await prisma.lottery.update({
        where: { id: lotteryId },
        data: {
            winningNumber,
            winSetAt: new Date()
        }
    })

    // 2. Find and update winning bets
    const winningBets = await prisma.bet.findMany({
        where: {
            lotteryId,
            number: winningNumber
        }
    })

    // Update each winning bet individually to trigger any DB triggers/logs if needed
    for (const bet of winningBets) {
        const prizeAmount = bet.amount * lottery.multiplier

        await prisma.bet.update({
            where: { id: bet.id },
            data: {
                isWinner: true,
                prizeAmount
            }
        })

        // Also update user's unread prize flag
        await prisma.user.update({
            where: { id: bet.sellerId },
            data: { hasUnreadPrize: true }
        })
    }

    // Also notify admins whose sellers won
    const sellerIds = winningBets.map(b => b.sellerId)
    const sellers = await prisma.user.findMany({
        where: { id: { in: sellerIds } },
        select: { parentId: true }
    })

    // Mark admins as having unread prizes too
    const adminIds = sellers.map(s => s.parentId).filter(Boolean) as string[]
    if (adminIds.length > 0) {
        await prisma.user.updateMany({
            where: { id: { in: adminIds } },
            data: { hasUnreadPrize: true }
        })
    }

    revalidatePath('/')
    revalidatePath('/owner')
    revalidatePath('/admin')
    revalidatePath('/seller')

    return {
        success: true,
        winnersCount: winningBets.length,
        totalPrizes: winningBets.reduce((acc, b) => acc + (b.amount * lottery.multiplier), 0)
    }
}

export async function getWinnerNotifications() {
    const session = await getSession()
    if (!session) return []

    // Base query for winning bets
    const baseQuery = {
        isWinner: true,
        // Only show recent wins (last 7 days)
        lottery: {
            winSetAt: {
                gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            }
        }
    }

    let whereClause: any = {}

    // Role-based filtering
    if (session.role === 'OWNER') {
        // Owner sees ALL winners
        whereClause = { ...baseQuery }
    } else if (session.role === 'ADMIN') {
        // Admin sees winners from their sellers
        whereClause = {
            ...baseQuery,
            seller: { parentId: session.id }
        }
    } else if (session.role === 'SELLER') {
        // Seller sees only their own wins
        whereClause = {
            ...baseQuery,
            sellerId: session.id
        }
    }

    const winningBets = await prisma.bet.findMany({
        where: whereClause,
        include: {
            lottery: {
                select: { name: true, winSetAt: true, winningNumber: true }
            },
            seller: {
                select: {
                    name: true,
                    parent: { select: { name: true } }
                }
            }
        },
        orderBy: {
            lottery: { winSetAt: 'desc' }
        }
    })

    return winningBets.map(bet => ({
        id: bet.id,
        lotteryName: bet.lottery.name,
        winningNumber: bet.lottery.winningNumber,
        prizeAmount: bet.prizeAmount,
        sellerName: bet.seller.name,
        adminName: bet.seller.parent?.name,
        playedNumber: bet.number, // The number they played (same as winning but explicit)
        winDate: bet.lottery.winSetAt
    }))
}

export async function markNotificationsAsRead() {
    const session = await getSession()
    if (!session) return

    await prisma.user.update({
        where: { id: session.id },
        data: { hasUnreadPrize: false }
    })

    revalidatePath('/')
}
