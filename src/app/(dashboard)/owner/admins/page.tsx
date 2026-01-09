import { getSession } from '@/actions/auth'
import prisma from '@/lib/prisma'
import DashboardLayout from '@/components/DashboardLayout'
import UserManagement from '@/components/UserManagement'
import { redirect } from 'next/navigation'

export default async function OwnerAdminsPage() {
    const session = await getSession()
    if (!session || session.role !== 'OWNER') redirect('/login')

    const owner = await prisma.user.findUnique({
        where: { id: session.id }
    })

    if (!owner) redirect('/login')

    const admins = await prisma.user.findMany({
        where: { role: 'ADMIN' },
        orderBy: { createdAt: 'desc' }
    })

    return (
        <DashboardLayout user={{
            name: owner.name,
            balance: owner.balance,
            hasUnreadPrize: owner.hasUnreadPrize,
            role: owner.role
        }}>
            <UserManagement
                initialUsers={admins}
                roleToCreate="ADMIN"
                currentBalance={owner.balance}
            />
        </DashboardLayout>
    )
}
