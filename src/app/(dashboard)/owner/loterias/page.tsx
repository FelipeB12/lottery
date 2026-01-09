import { getSession } from '@/actions/auth'
import prisma from '@/lib/prisma'
import DashboardLayout from '@/components/DashboardLayout'
import LotteryAdmin from '@/components/LotteryAdmin'
import { redirect } from 'next/navigation'

export default async function OwnerLotteriesPage() {
    const session = await getSession()
    if (!session || session.role !== 'OWNER') redirect('/login')

    const user = await prisma.user.findUnique({
        where: { id: session.id }
    })

    if (!user) redirect('/login')

    const lotteries = await prisma.lottery.findMany({
        orderBy: { name: 'asc' }
    })

    const formattedLotteries = lotteries.map(l => ({
        ...l,
        status: l.status as 'ACTIVE' | 'INACTIVE'
    }))

    return (
        <DashboardLayout user={{
            name: user.name,
            balance: user.balance,
            hasUnreadPrize: user.hasUnreadPrize,
            role: user.role
        }}>
            <LotteryAdmin initialLotteries={formattedLotteries} />
        </DashboardLayout>
    )
}
