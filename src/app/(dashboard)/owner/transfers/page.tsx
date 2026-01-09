import { getSession } from '@/actions/auth'
import prisma from '@/lib/prisma'
import DashboardLayout from '@/components/DashboardLayout'
import CreditHistory from '@/components/CreditHistory'
import { redirect } from 'next/navigation'

export default async function OwnerTransfersPage() {
    const session = await getSession()
    if (!session || session.role !== 'OWNER') redirect('/login')

    const user = await prisma.user.findUnique({
        where: { id: session.id }
    })

    if (!user) redirect('/login')

    const transfers = await prisma.transfer.findMany({
        include: {
            fromUser: { select: { name: true } },
            toUser: { select: { name: true } }
        },
        orderBy: { createdAt: 'desc' }
    })

    return (
        <DashboardLayout user={{
            name: user.name,
            balance: user.balance,
            hasUnreadPrize: user.hasUnreadPrize,
            role: user.role
        }}>
            <CreditHistory transfers={transfers} userRole={user.role} />
        </DashboardLayout>
    )
}
