import { getSession } from '@/actions/auth'
import prisma from '@/lib/prisma'
import DashboardLayout from '@/components/DashboardLayout'
import UserManagement from '@/components/UserManagement'
import { redirect } from 'next/navigation'

export default async function AdminSellersPage() {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') redirect('/login')

    const admin = await prisma.user.findUnique({
        where: { id: session.id }
    })

    if (!admin) redirect('/login')

    const sellers = await prisma.user.findMany({
        where: { parentId: admin.id, role: 'SELLER' },
        orderBy: { createdAt: 'desc' }
    })

    return (
        <DashboardLayout user={{
            name: admin.name,
            balance: admin.balance,
            hasUnreadPrize: admin.hasUnreadPrize,
            role: admin.role
        }}>
            <UserManagement
                initialUsers={sellers}
                roleToCreate="SELLER"
                currentBalance={admin.balance}
            />
        </DashboardLayout>
    )
}
