import { Home, ShoppingCart, Ticket, Dices } from 'lucide-react'
import Link from 'next/link'

interface TabBarProps {
    activeTab: 'inicio' | 'compras' | 'premios' | 'pay'
    hasUnreadPrize?: boolean
    role: string
}

export default function TabBar({ activeTab, hasUnreadPrize, role }: TabBarProps) {
    const getHomeLink = () => {
        if (role === 'OWNER') return '/owner'
        if (role === 'ADMIN') return '/admin'
        return '/seller'
    }

    const getHistoryLink = () => {
        if (role === 'OWNER') return '/owner/compras'
        if (role === 'ADMIN') return '/admin/compras'
        return '/seller/compras'
    }

    const canPlay = role === 'OWNER' || role === 'ADMIN' || role === 'SELLER'

    return (
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] bg-white rounded-full shadow-2xl py-3 px-1 flex justify-between items-center z-50">
            <Link href={getHomeLink()} className={`flex flex-col items-center gap-1 flex-1 ${activeTab === 'inicio' ? 'text-red-700' : 'text-slate-400'}`}>
                <Home className="w-6 h-6" />
                <span className="text-[10px] font-bold">Inicio</span>
            </Link>

            <Link href={getHistoryLink()} className={`flex flex-col items-center gap-1 flex-1 ${activeTab === 'compras' ? 'text-red-700' : 'text-slate-400'}`}>
                <ShoppingCart className="w-6 h-6" />
                <span className="text-[10px] font-bold">Compras</span>
            </Link>

            <Link href="/premios" className={`flex flex-col items-center gap-1 flex-1 relative ${activeTab === 'premios' ? 'text-red-700' : 'text-slate-400'}`}>
                <Ticket className="w-6 h-6" />
                <span className="text-[10px] font-bold">Premios</span>
                {hasUnreadPrize && (
                    <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-white" />
                )}
            </Link>

            {canPlay && (
                <Link href="/pay" className={`flex flex-col items-center gap-1 flex-1 ${activeTab === 'pay' ? 'text-red-700' : 'text-slate-400'}`}>
                    <Dices className="w-6 h-6" />
                    <span className="text-[10px] font-bold">Jugar</span>
                </Link>
            )}
        </nav>
    )
}
