import { getSession } from '@/actions/auth'
import prisma from '@/lib/prisma'
import DashboardLayout from '@/components/DashboardLayout'
import BetHistory from '@/components/BetHistory'
import { redirect } from 'next/navigation'

export default async function OwnerBetsPage() {
    const session = await getSession()
    if (!session || session.role !== 'OWNER') redirect('/login')

    const user = await prisma.user.findUnique({
        where: { id: session.id }
    })

    if (!user) redirect('/login')

    const bets = await prisma.bet.findMany({
        include: {
            lottery: { select: { name: true } },
            seller: {
                select: {
                    name: true,
                    parent: { select: { name: true } }
                }
            }
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
            <BetHistory bets={bets} userRole={user.role} />
        </DashboardLayout>
    )
}
