import { getSession } from '@/actions/auth'
import prisma from '@/lib/prisma'
import DashboardLayout from '@/components/DashboardLayout'
import { redirect } from 'next/navigation'
import { ShoppingCart, DollarSign } from 'lucide-react'
import WinnerNotifications from '@/components/WinnerNotifications'

export default async function SellerPage() {
    const session = await getSession()
    if (!session || session.role !== 'SELLER') redirect('/login')

    const user = await prisma.user.findUnique({
        where: { id: session.id }
    })

    if (!user) redirect('/login')

    const stats = {
        totalBets: await prisma.bet.count({ where: { sellerId: user.id } }),
        totalSales: await prisma.bet.aggregate({
            where: { sellerId: user.id },
            _sum: { amount: true }
        })
    }

    return (
        <DashboardLayout user={{
            name: user.name,
            balance: user.balance,
            hasUnreadPrize: user.hasUnreadPrize,
            role: user.role
        }}>
            <WinnerNotifications userRole="SELLER" />
            <div className="p-6 space-y-6">
                <h1 className="text-2xl font-bold text-slate-800">Panel Vendedor</h1>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-3xl border border-blue-100">
                        <ShoppingCart className="text-blue-600 mb-2" />
                        <p className="text-2xl font-black text-blue-900">{stats.totalBets}</p>
                        <p className="text-xs text-blue-700 font-bold uppercase tracking-wider">Apuestas</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-3xl border border-green-100">
                        <DollarSign className="text-green-600 mb-2" />
                        <p className="text-2xl font-black text-green-900">${stats.totalSales._sum.amount || 0}</p>
                        <p className="text-xs text-green-700 font-bold uppercase tracking-wider">Ventas</p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
