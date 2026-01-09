'use server'

import prisma from '@/lib/prisma'
import { z } from 'zod'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})

export async function login(formData: FormData) {
    const validatedFields = loginSchema.safeParse(Object.fromEntries(formData))

    if (!validatedFields.success) {
        return { error: 'Campos inválidos' }
    }

    const { email, password } = validatedFields.data

    const user = await prisma.user.findUnique({
        where: { email },
    })

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return { error: 'Credenciales inválidas' }
    }

    // Set session cookie (Simplified for this project)
    const cookieStore = await cookies()
    cookieStore.set('session', JSON.stringify({
        id: user.id,
        role: user.role,
        name: user.name
    }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 1 week
    })

    return { success: true, role: user.role }
}

export async function logout() {
    const cookieStore = await cookies()
    cookieStore.delete('session')
}

export async function getSession() {
    const cookieStore = await cookies()
    const session = cookieStore.get('session')
    if (!session) return null
    return JSON.parse(session.value)
}
