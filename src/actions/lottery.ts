'use server'

import prisma from '@/lib/prisma'
import { z } from 'zod'
import { getSession } from './auth'
import { revalidatePath } from 'next/cache'

const lotterySchema = z.object({
    name: z.string().min(2),
    dayOfWeek: z.number().min(0).max(6),
    playTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
    multiplier: z.number().positive(),
})

export async function createLottery(data: z.infer<typeof lotterySchema>) {
    const session = await getSession()
    if (!session || session.role !== 'OWNER') {
        throw new Error('No autorizado')
    }

    const lottery = await prisma.lottery.create({
        data: {
            ...data,
            status: 'ACTIVE'
        }
    })

    revalidatePath('/owner/loterias')
    return lottery
}

export async function updateLotteryStatus(id: string, status: 'ACTIVE' | 'INACTIVE') {
    const session = await getSession()
    if (!session || session.role !== 'OWNER') {
        throw new Error('No autorizado')
    }

    await prisma.lottery.update({
        where: { id },
        data: { status }
    })

    revalidatePath('/owner/loterias')
}
