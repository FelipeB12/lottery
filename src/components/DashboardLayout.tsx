'use client'

import Header from '@/components/Header'
import TabBar from '@/components/TabBar'
import { usePathname } from 'next/navigation'

export default function DashboardLayout({
    children,
    user
}: {
    children: React.ReactNode
    user: { name: string; balance: number; hasUnreadPrize: boolean }
}) {
    const pathname = usePathname()

    const getActiveTab = () => {
        if (pathname.includes('premios')) return 'premios'
        if (pathname.includes('compras')) return 'compras'
        if (pathname.includes('pay')) return 'pay'
        return 'inicio'
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col pb-32">
            <Header
                userName={user.name}
                balance={user.balance}
                hasUnreadPrize={user.hasUnreadPrize}
            />
            <main className="flex-1 -mt-6 rounded-t-3xl bg-white overflow-hidden z-10">
                {children}
            </main>
            <TabBar activeTab={getActiveTab()} hasUnreadPrize={user.hasUnreadPrize} />
        </div>
    )
}
