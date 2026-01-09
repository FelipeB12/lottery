import { getSession } from '@/actions/auth'
import prisma from '@/lib/prisma'
import DashboardLayout from '@/components/DashboardLayout'
import PrizesContent from '@/components/PrizesContent'
import { redirect } from 'next/navigation'

export default async function PrizesPage() {
    const session = await getSession()
    if (!session) redirect('/login')

    const user = await prisma.user.findUnique({
        where: { id: session.id }
    })

    if (!user) redirect('/login')

    // Build hierarchical prizes query
    let where: any = { isWinner: true }

    if (user.role === 'SELLER') {
        where.sellerId = user.id
    } else if (user.role === 'ADMIN') {
        where.seller = { parentId: user.id }
    } else if (user.role === 'OWNER') {
        // Owner sees all winners
    }

    const prizes = await prisma.bet.findMany({
        where,
        include: {
            lottery: true,
            seller: true,
        },
        orderBy: { createdAt: 'desc' }
    })

    const formattedPrizes = prizes.map(p => ({
        id: p.id,
        lotteryName: p.lottery.name,
        number: p.number,
        amount: p.amount,
        prizeAmount: p.prizeAmount,
        createdAt: p.createdAt.toISOString(),
        sellerName: p.seller.name
    }))

    return (
        <DashboardLayout user={user}>
            <PrizesContent prizes={formattedPrizes} role={user.role} />
        </DashboardLayout>
    )
}
