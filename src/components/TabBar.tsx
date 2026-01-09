import { Home, ShoppingCart, Ticket, Fingerprint } from 'lucide-react'
import Link from 'next/link'

interface TabBarProps {
    activeTab: 'inicio' | 'compras' | 'premios' | 'pay'
    hasUnreadPrize?: boolean
}

export default function TabBar({ activeTab, hasUnreadPrize }: TabBarProps) {
    return (
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] bg-white rounded-full shadow-2xl py-3 px-6 px-1 flex justify-between items-center z-50">
            <Link href="/inicio" className={`flex flex-col items-center gap-1 ${activeTab === 'inicio' ? 'text-blue-900' : 'text-slate-400'}`}>
                <Home className="w-6 h-6" />
                <span className="text-[10px] font-bold">Inicio</span>
            </Link>

            <Link href="/compras" className={`flex flex-col items-center gap-1 ${activeTab === 'compras' ? 'text-blue-900' : 'text-slate-400'}`}>
                <ShoppingCart className="w-6 h-6" />
                <span className="text-[10px] font-bold">Compras</span>
            </Link>

            <Link href="/premios" className={`flex flex-col items-center gap-1 relative ${activeTab === 'premios' ? 'text-blue-900' : 'text-slate-400'}`}>
                <Ticket className="w-6 h-6" />
                <span className="text-[10px] font-bold">Premios</span>
                {hasUnreadPrize && (
                    <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-600 rounded-full border-2 border-white" />
                )}
            </Link>

            <Link href="/pay" className="flex flex-col items-center">
                <div className="flex flex-col items-center leading-tight">
                    <span className="text-red-600 font-extrabold text-lg italic">Tedo</span>
                    <span className="text-blue-900 font-bold text-xs -mt-1">pay</span>
                </div>
            </Link>
        </nav>
    )
}
