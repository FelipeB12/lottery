'use server'

import prisma from '@/lib/prisma'
import { z } from 'zod'
import { getSession } from './auth'
import { revalidatePath } from 'next/cache'

const betSchema = z.object({
    lotteryId: z.string(),
    number: z.number().min(0).max(9999),
    amount: z.number().positive(),
})

export async function placeBet(data: z.infer<typeof betSchema>) {
    const session = await getSession()
    if (!session) {
        throw new Error('No autorizado')
    }

    const { lotteryId, number, amount } = data

    return await prisma.$transaction(async (tx) => {
        const user = await tx.user.findUnique({
            where: { id: session.id }
        })

        if (!user || user.balance < amount) {
            throw new Error('Saldo insuficiente')
        }

        const lottery = await tx.lottery.findUnique({
            where: { id: lotteryId }
        })

        if (!lottery || lottery.status === 'INACTIVE') {
            throw new Error('Lotería no disponible')
        }

        // Check 30-min restriction (Colombia Time GMT-5)
        const now = new Date()

        // Get "Today" in Bogota (YYYY-MM-DD)
        const bogotaDateStr = now.toLocaleDateString("en-CA", { timeZone: "America/Bogota" })

        // Construct deadline: YYYY-MM-DDTHH:MM:00-05:00
        // This ensures the deadline is treated as 8:00 PM Colombia Time, regardless of Server Time
        const deadline = new Date(`${bogotaDateStr}T${lottery.playTime}:00-05:00`)

        const thirtyMinsFromNow = new Date(now.getTime() + 30 * 60 * 1000)

        if (thirtyMinsFromNow >= deadline) {
            throw new Error('Venta cerrada para esta lotería')
        }

        // Create bet
        const bet = await tx.bet.create({
            data: {
                lotteryId,
                sellerId: session.id,
                number,
                amount,
            }
        })

        // Deduct balance
        await tx.user.update({
            where: { id: session.id },
            data: { balance: { decrement: amount } }
        })

        revalidatePath('/seller')
        return bet
    })
}
