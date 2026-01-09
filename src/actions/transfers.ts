'use server'

import prisma from '@/lib/prisma'
import { z } from 'zod'
import { getSession } from './auth'
import { revalidatePath } from 'next/cache'

const transferSchema = z.object({
    toUserId: z.string(),
    amount: z.number().positive(),
})

export async function transferCredit(data: z.infer<typeof transferSchema>) {
    const session = await getSession()
    if (!session) throw new Error('No autorizado')

    const { toUserId, amount } = data

    return await prisma.$transaction(async (tx) => {
        const fromUser = await tx.user.findUnique({
            where: { id: session.id }
        })

        if (!fromUser || fromUser.balance < amount) {
            throw new Error('Saldo insuficiente')
        }

        const toUser = await tx.user.findUnique({
            where: { id: toUserId }
        })

        if (!toUser) throw new Error('Usuario destinatario no existe')

        // Hierarchical check
        if (toUser.parentId !== session.id) {
            throw new Error('Transferencia solo permitida en la jerarquía directa')
        }

        const type = fromUser.role === 'OWNER' ? 'OWNER_TO_ADMIN' : 'ADMIN_TO_SELLER'

        // Perform transfer
        await tx.user.update({
            where: { id: session.id },
            data: { balance: { decrement: amount } }
        })

        await tx.user.update({
            where: { id: toUserId },
            data: { balance: { increment: amount } }
        })

        // Record transfer
        await tx.transfer.create({
            data: {
                fromUserId: session.id,
                toUserId,
                amount,
                type,
            }
        })

        revalidatePath('/')
        return { success: true }
    })
}
