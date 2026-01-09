import { getSession } from '@/actions/auth'
import prisma from '@/lib/prisma'
import SellerClient from '@/components/SellerClient'
import { redirect } from 'next/navigation'

export default async function PayPage() {
    try {
        const session = await getSession()
        if (!session) redirect('/login')

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
            closingTime: l.playTime,
            dayOfWeek: l.dayOfWeek ?? null,
            isRepeating: !!l.isRepeating,
            specificDate: l.specificDate ? l.specificDate.toISOString() : null
        }))

        return (
            <SellerClient
                user={{
                    name: user.name,
                    balance: user.balance,
                    hasUnreadPrize: user.hasUnreadPrize,
                    role: user.role
                }}
                lotteries={formattedLotteries}
            />
        )
    } catch (error: any) {
        // Allow redirects to function
        if (error.digest?.startsWith('NEXT_REDIRECT')) {
            throw error;
        }
        return (
            <div className="p-10 text-center text-red-600 font-bold">
                Error al cargar la página de pago: {error.message}
                <br />
                <span className="text-xs text-slate-400">{JSON.stringify(error)}</span>
            </div>
        )
    }
}
