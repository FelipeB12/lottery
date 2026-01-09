'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, LogOut, User, Shield, Wallet } from 'lucide-react'
import { logout } from '@/actions/auth'
import { useRouter } from 'next/navigation'

interface SidebarProps {
    isOpen: boolean
    onClose: () => void
    userName: string
    userRole: string
}

export default function Sidebar({ isOpen, onClose, userName, userRole }: SidebarProps) {
    const router = useRouter()

    const handleLogout = async () => {
        await logout()
        router.push('/login')
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                    />

                    {/* Sidebar Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-4/5 max-w-xs bg-white z-[70] shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <span className="font-black text-xl text-red-600 tracking-tighter">MENÚ</span>
                            <button onClick={onClose} className="p-2 bg-slate-50 rounded-xl text-slate-400">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* User Profile Info */}
                        <div className="p-8 flex flex-col items-center border-b border-slate-100 bg-slate-50/50">
                            <div className="w-20 h-20 bg-red-100 text-red-600 rounded-3xl flex items-center justify-center mb-4 shadow-inner">
                                <User className="w-10 h-10" />
                            </div>
                            <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight">{userName}</h3>
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-red-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest mt-2 shadow-sm">
                                <Shield className="w-3 h-3" />
                                {userRole}
                            </div>
                        </div>

                        {/* Menu Items */}
                        <div className="flex-1 p-6 space-y-4">
                            {/* You can add more menu items here if needed */}
                        </div>

                        {/* Logout Button */}
                        <div className="p-6 border-t border-slate-100">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-3 py-4 border-2 border-slate-100 text-slate-500 font-bold rounded-2xl active:scale-95 transition-all hover:bg-slate-50 hover:text-red-600 hover:border-red-100"
                            >
                                <LogOut className="w-5 h-5" />
                                CERRAR SESIÓN
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
