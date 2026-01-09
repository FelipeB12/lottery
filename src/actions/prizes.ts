'use server'

import prisma from '@/lib/prisma'
import { getSession } from './auth'
import { revalidatePath } from 'next/cache'

export async function submitWinningNumber(lotteryId: string, winningNumber: number) {
    const session = await getSession()
    if (!session || session.role !== 'OWNER') {
        throw new Error('No autorizado')
    }

    return await prisma.$transaction(async (tx) => {
        // 1. Set winning number
        const lottery = await tx.lottery.update({
            where: { id: lotteryId },
            data: { winningNumber }
        })

        // 2. Mark winners
        const winningBets = await tx.bet.findMany({
            where: {
                lotteryId,
                number: winningNumber,
                isWinner: false
            },
            include: {
                seller: true
            }
        })

        for (const bet of winningBets) {
            const prizeAmount = Math.floor(bet.amount * lottery.multiplier)

            await tx.bet.update({
                where: { id: bet.id },
                data: {
                    isWinner: true,
                    prizeAmount
                }
            })

            // 3. Set red badges
            // Seller
            await tx.user.update({
                where: { id: bet.sellerId },
                data: { hasUnreadPrize: true }
            })

            // Admin (parent of seller)
            if (bet.seller.parentId) {
                const admin = await tx.user.update({
                    where: { id: bet.seller.parentId },
                    data: { hasUnreadPrize: true }
                })

                // Owner (parent of admin)
                if (admin.parentId) {
                    await tx.user.update({
                        where: { id: admin.parentId },
                        data: { hasUnreadPrize: true }
                    })
                }
            }
        }

        revalidatePath('/')
        return lottery
    })
}

export async function clearUnreadPrize() {
    const session = await getSession()
    if (!session) return

    await prisma.user.update({
        where: { id: session.id },
        data: { hasUnreadPrize: false }
    })

    revalidatePath('/')
}
