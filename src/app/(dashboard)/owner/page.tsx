import { getSession } from '@/actions/auth'
import prisma from '@/lib/prisma'
import DashboardLayout from '@/components/DashboardLayout'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, Users, Ticket, History } from 'lucide-react'
import WinnerNotifications from '@/components/WinnerNotifications'

export default async function OwnerPage() {
    const session = await getSession()
    if (!session || session.role !== 'OWNER') redirect('/login')

    const user = await prisma.user.findUnique({
        where: { id: session.id }
    })

    if (!user) redirect('/login')

    const stats = {
        totalAdmins: await prisma.user.count({ where: { role: 'ADMIN' } }),
        totalSellers: await prisma.user.count({ where: { role: 'SELLER' } }),
        activeLotteries: await prisma.lottery.count({ where: { status: 'ACTIVE' } }),
        totalBets: await prisma.bet.count(),
    }

    return (
        <DashboardLayout user={{
            name: user.name,
            balance: user.balance,
            hasUnreadPrize: user.hasUnreadPrize,
            role: user.role
        }}>
            <WinnerNotifications userRole="OWNER" />
            <div className="p-6 space-y-6">
                <h1 className="text-2xl font-bold text-slate-800">Panel de Control</h1>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-3xl border border-blue-100">
                        <Users className="text-blue-600 mb-2" />
                        <p className="text-2xl font-black text-blue-900">{stats.totalAdmins}</p>
                        <p className="text-xs text-blue-700 font-bold uppercase tracking-wider">Admins</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-3xl border border-red-100">
                        <Ticket className="text-red-600 mb-2" />
                        <p className="text-2xl font-black text-red-900">{stats.activeLotteries}</p>
                        <p className="text-xs text-red-700 font-bold uppercase tracking-wider">Loterías</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="font-bold text-slate-800 uppercase text-xs tracking-widest pl-1">Accesos Rápidos</h2>

                    <Link href="/owner/loterias" className="flex items-center justify-between p-5 bg-white border-2 border-slate-100 rounded-3xl hover:border-red-200 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center">
                                <Ticket className="w-6 h-6" />
                            </div>
                            <span className="font-bold text-slate-700">Gestionar Loterías</span>
                        </div>
                        <Plus className="text-slate-300" />
                    </Link>

                    <Link href="/owner/admins" className="flex items-center justify-between p-5 bg-white border-2 border-slate-100 rounded-3xl hover:border-blue-200 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                                <Users className="w-6 h-6" />
                            </div>
                            <span className="font-bold text-slate-700">Gestionar Usuarios</span>
                        </div>
                        <Plus className="text-slate-300" />
                    </Link>

                    <Link href="/owner/transfers" className="flex items-center justify-between p-5 bg-white border-2 border-slate-100 rounded-3xl hover:border-slate-200 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center">
                                <History className="w-6 h-6" />
                            </div>
                            <span className="font-bold text-slate-700">Historial de Créditos</span>
                        </div>
                        <Plus className="text-slate-300" />
                    </Link>
                </div>
            </div>
        </DashboardLayout>
    )
}
