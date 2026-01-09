'use client'

import { useState } from 'react'
import { Menu, ChevronDown } from 'lucide-react'
import RechargeModal from './RechargeModal'
import { formatCurrency } from '@/lib/format'

interface HeaderProps {
    userName: string
    balance: number
    hasUnreadPrize?: boolean
    isOwner?: boolean
    userRole: string
    onMenuClick: () => void
}

export default function Header({ userName, balance, hasUnreadPrize, isOwner, userRole, onMenuClick }: HeaderProps) {
    const [isModalOpen, setIsModalOpen] = useState(false)

    return (
        <header className="bg-red-600 text-white p-4 pb-12 rounded-b-[2rem] shadow-lg relative">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold uppercase tracking-wide">
                    HOLA <span className="font-normal">{userName}</span>
                </h1>
                <button onClick={onMenuClick} className="p-1 active:scale-95 transition-transform">
                    <Menu className="w-8 h-8" />
                </button>
            </div>

            <div className="flex justify-between items-end">
                <div>
                    <button className="flex items-center gap-1 text-sm opacity-90 mb-1">
                        Tu saldo <ChevronDown className="w-4 h-4" />
                    </button>
                    <div className="text-4xl font-bold">
                        ${formatCurrency(balance)}
                    </div>
                </div>

                {isOwner && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-white text-red-600 px-6 py-2 rounded-full font-bold shadow-md active:scale-95 transition-transform"
                    >
                        Recargar
                    </button>
                )}
            </div>

            {hasUnreadPrize && (
                <div className="absolute top-4 right-12 w-3 h-3 bg-white rounded-full border-2 border-red-600 animate-pulse" />
            )}

            <RechargeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </header>
    )
}
