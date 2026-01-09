import { getSession } from '@/actions/auth'
import prisma from '@/lib/prisma'
import DashboardLayout from '@/components/DashboardLayout'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Users, CreditCard, ListChecks, History } from 'lucide-react'

export default async function AdminPage() {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') redirect('/login')

    const user = await prisma.user.findUnique({
        where: { id: session.id }
    })

    if (!user) redirect('/login')

    const stats = {
        totalSellers: await prisma.user.count({ where: { parentId: user.id } }),
        totalBets: await prisma.bet.count({ where: { seller: { parentId: user.id } } }),
    }

    return (
        <DashboardLayout user={user}>
            <div className="p-6 space-y-6">
                <h1 className="text-2xl font-bold text-slate-800">Panel Admin</h1>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-3xl border border-blue-100">
                        <Users className="text-blue-600 mb-2" />
                        <p className="text-2xl font-black text-blue-900">{stats.totalSellers}</p>
                        <p className="text-xs text-blue-700 font-bold uppercase tracking-wider">Vendedores</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-3xl border border-green-100">
                        <ListChecks className="text-green-600 mb-2" />
                        <p className="text-2xl font-black text-green-900">{stats.totalBets}</p>
                        <p className="text-xs text-green-700 font-bold uppercase tracking-wider">Ventas</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="font-bold text-slate-800 uppercase text-xs tracking-widest pl-1">Herramientas</h2>

                    <Link href="/admin/sellers" className="flex items-center gap-4 p-5 bg-white border-2 border-slate-100 rounded-3xl hover:border-blue-200 transition-colors">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                            <Users className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-slate-700">Mis Vendedores</p>
                            <p className="text-xs text-slate-400">Crear y asignar créditos</p>
                        </div>
                    </Link>

                    <Link href="/admin/bets" className="flex items-center gap-4 p-5 bg-white border-2 border-slate-100 rounded-3xl hover:border-slate-200 transition-colors">
                        <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center">
                            <ListChecks className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-slate-700">Ver Apuestas</p>
                            <p className="text-xs text-slate-400">Ventas en tiempo real</p>
                        </div>
                    </Link>

                    <Link href="/admin/transfers" className="flex items-center gap-4 p-5 bg-white border-2 border-slate-100 rounded-3xl hover:border-slate-200 transition-colors">
                        <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center">
                            <History className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-slate-700">Historial</p>
                            <p className="text-xs text-slate-400">Tus transferencias</p>
                        </div>
                    </Link>
                </div>
            </div>
        </DashboardLayout>
    )
}
