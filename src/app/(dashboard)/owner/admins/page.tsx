import { getSession } from '@/actions/auth'
import prisma from '@/lib/prisma'
import DashboardLayout from '@/components/DashboardLayout'
import UserManagement from '@/components/UserManagement'
import { redirect } from 'next/navigation'

export default async function OwnerUsersPage() {
    const session = await getSession()
    if (!session || session.role !== 'OWNER') redirect('/login')

    const owner = await prisma.user.findUnique({
        where: { id: session.id }
    })

    if (!owner) redirect('/login')

    // Fetch all users (Admins and Sellers) for the Owner
    const users = await prisma.user.findMany({
        where: {
            role: { in: ['ADMIN', 'SELLER'] }
        },
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
                initialUsers={users}
                roleToCreate="ADMIN"
                currentBalance={owner.balance}
                canChooseRole={true}
            />
        </DashboardLayout>
    )
}
