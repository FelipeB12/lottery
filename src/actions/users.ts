'use server'

import prisma from '@/lib/prisma'
import { z } from 'zod'
import { getSession } from './auth'
import bcrypt from 'bcryptjs'
import { revalidatePath } from 'next/cache'

const userSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
})

export async function createAdmin(data: z.infer<typeof userSchema>) {
    const session = await getSession()
    if (!session || session.role !== 'OWNER') {
        throw new Error('No autorizado')
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)

    const admin = await prisma.user.create({
        data: {
            ...data,
            password: hashedPassword,
            role: 'ADMIN',
            parentId: session.id,
        }
    })

    revalidatePath('/owner')
    return admin
}

export async function createSeller(data: z.infer<typeof userSchema>) {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
        throw new Error('No autorizado')
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)

    const seller = await prisma.user.create({
        data: {
            ...data,
            password: hashedPassword,
            role: 'SELLER',
            parentId: session.id,
        }
    })

    revalidatePath('/admin')
    return seller
}

export async function getUsersForParent(parentId: string) {
    const session = await getSession()
    if (!session) throw new Error('No autorizado')

    return await prisma.user.findMany({
        where: { parentId },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            balance: true,
            createdAt: true,
        },
        orderBy: { createdAt: 'desc' }
    })
}

export async function updateUser(id: string, data: Partial<z.infer<typeof userSchema>>) {
    const session = await getSession()
    if (!session) throw new Error('No autorizado')

    const updateData: any = { ...data }
    if (data.password) {
        updateData.password = await bcrypt.hash(data.password, 10)
    }

    const updated = await prisma.user.update({
        where: { id },
        data: updateData
    })

    revalidatePath('/')
    return updated
}

export async function deleteUser(id: string) {
    const session = await getSession()
    if (!session || session.role === 'SELLER') {
        throw new Error('No autorizado')
    }

    // Check if user has balance or activity (soft delete or safety check)
    // For now, simple delete
    await prisma.user.delete({
        where: { id }
    })

    revalidatePath('/')
}
