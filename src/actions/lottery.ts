'use server'

import prisma from '@/lib/prisma'
import { z } from 'zod'
import { getSession } from './auth'
import { revalidatePath } from 'next/cache'

const lotterySchema = z.object({
    name: z.string().min(2),
    dayOfWeek: z.number().min(0).max(6).optional().nullable(),
    specificDate: z.string().optional().nullable(),
    playTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
    multiplier: z.number().positive(),
    isRepeating: z.boolean().default(true),
})

/**
 * Creates a new lottery configuration.
 * Supports recurring (weekly day) or special one-time events.
 */
export async function createLottery(data: z.infer<typeof lotterySchema>) {
    const session = await getSession()
    if (!session || session.role !== 'OWNER') {
        throw new Error('No autorizado')
    }

    const { specificDate, ...rest } = data

    const lottery = await prisma.lottery.create({
        data: {
            ...rest,
            specificDate: specificDate ? new Date(specificDate) : null,
            status: 'ACTIVE'
        }
    })

    revalidatePath('/owner/loterias')
    return lottery
}

export async function updateLottery(id: string, data: z.infer<typeof lotterySchema>) {
    const session = await getSession()
    if (!session || session.role !== 'OWNER') {
        throw new Error('No autorizado')
    }

    const { specificDate, ...rest } = data

    const lottery = await prisma.lottery.update({
        where: { id },
        data: {
            ...rest,
            specificDate: specificDate ? new Date(specificDate) : null,
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
