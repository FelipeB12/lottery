import { getSession } from '@/actions/auth'
import prisma from '@/lib/prisma'
import SellerClient from '@/components/SellerClient'
import { redirect } from 'next/navigation'

export default async function SellerPage() {
    const session = await getSession()
    if (!session || session.role !== 'SELLER') redirect('/login')

    const user = await prisma.user.findUnique({
        where: { id: session.id }
    })

    if (!user) redirect('/login')

    const lotteries = await prisma.lottery.findMany({
        where: { status: 'ACTIVE' }
    })

    const formattedLotteries = lotteries.map(l => ({
        id: l.id,
        name: l.name,
        closingTime: l.playTime
    }))

    return (
        <SellerClient
            user={{
                name: user.name,
                balance: user.balance,
                hasUnreadPrize: user.hasUnreadPrize
            }}
            lotteries={formattedLotteries}
        />
    )
}
