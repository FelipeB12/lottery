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

        // Check 30-min restriction
        const [hours, minutes] = lottery.playTime.split(':').map(Number)

        // Get strict current time in Colombia
        const now = new Date()
        const colombiaTime = new Date(now.toLocaleString("en-US", { timeZone: "America/Bogota" }))

        // Create play deadline for "Today in Colombia"
        const playTime = new Date(colombiaTime)
        playTime.setHours(hours, minutes, 0, 0)

        // If the play time is for "tomorrow" relative to UTC but we want today's lottery... 
        // Actually, simplicity: 
        // We compare the total minutes of the day if it's a daily cycle, 
        // but for safety we compare full Date objects assuming "today" is the relevant day.

        // 30 mins buffer
        const thirtyMinsFromNow = new Date(colombiaTime.getTime() + 30 * 60 * 1000)

        // Debug log if needed (will show in Vercel logs)
        // console.log({ colombiaTime, playTime, thirtyMinsFromNow })

        if (thirtyMinsFromNow >= playTime) {
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
