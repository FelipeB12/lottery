import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function seed() {
    const ownerEmail = 'owner@loterias.com'
    const existingOwner = await prisma.user.findUnique({
        where: { email: ownerEmail }
    })

    if (!existingOwner) {
        const hashedPassword = await bcrypt.hash('admin123', 10)
        await prisma.user.create({
            data: {
                name: 'Super Owner',
                email: ownerEmail,
                password: hashedPassword,
                role: 'OWNER',
                balance: 1000000,
            }
        })
        console.log('Owner created: owner@loterias.com / admin123')
    }
}
