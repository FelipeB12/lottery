'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Check, X, Bell } from 'lucide-react'
import { getWinnerNotifications, markNotificationsAsRead } from '@/actions/winners'
import { formatCurrency } from '@/lib/format'

interface Notification {
    id: string
    lotteryName: string
    winningNumber: number
    prizeAmount: number
    sellerName: string
    adminName?: string
    playedNumber: number
    winDate: Date
}

export default function WinnerNotifications({ userRole }: { userRole: string }) {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [hasUnread, setHasUnread] = useState(false)

    useEffect(() => {
        // Poll for notifications every 30 seconds
        const fetchNotifications = async () => {
            const data = await getWinnerNotifications()
            setNotifications(data)
            if (data.length > 0) setHasUnread(true)
        }

        fetchNotifications()
        const interval = setInterval(fetchNotifications, 30000)
        return () => clearInterval(interval)
    }, [])

    const handleOpen = async () => {
        setIsOpen(true)
        setHasUnread(false)
        await markNotificationsAsRead()
    }

    if (notifications.length === 0) return null

    return (
        <div className="relative z-40">
            {/* Notification Bell Badge */}
            {hasUnread && (
                <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    onClick={handleOpen}
                    className="fixed top-6 right-20 w-10 h-10 bg-yellow-400 text-yellow-900 rounded-full flex items-center justify-center shadow-lg shadow-yellow-200 z-50 animate-bounce"
                >
                    <Trophy className="w-5 h-5" />
                </motion.button>
            )}

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl max-h-[80vh] flex flex-col"
                        >
                            <div className="p-6 bg-yellow-500 text-white flex justify-between items-center sticky top-0 z-10">
                                <div>
                                    <h2 className="text-xl font-black uppercase">¡Ganadores!</h2>
                                    <p className="text-yellow-100 text-sm font-bold">Últimos premios registrados</p>
                                </div>
                                <button onClick={() => setIsOpen(false)} className="p-2 bg-yellow-600 rounded-xl hover:bg-yellow-700 transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="overflow-y-auto p-4 space-y-4">
                                {notifications.map((notif) => (
                                    <div key={notif.id} className="bg-white border-2 border-yellow-100 p-5 rounded-3xl shadow-sm relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4 opacity-10">
                                            <Trophy className="w-24 h-24 text-yellow-500" />
                                        </div>

                                        <div className="relative z-10 space-y-3">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest bg-yellow-50 px-2 py-1 rounded-lg">
                                                        {notif.lotteryName}
                                                    </span>
                                                    <h3 className="text-3xl font-black text-slate-800 mt-2 tracking-widest">
                                                        #{notif.winningNumber.toString().padStart(4, '0')}
                                                    </h3>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs font-bold text-slate-400 uppercase">Premio</p>
                                                    <p className="text-xl font-black text-green-600">
                                                        ${formatCurrency(notif.prizeAmount)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="pt-3 border-t border-slate-100">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                                                    <p className="text-xs text-slate-500 font-medium">
                                                        Vendido por: <strong className="text-slate-800">{notif.sellerName}</strong>
                                                    </p>
                                                </div>
                                                {userRole === 'OWNER' && notif.adminName && (
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                                                        <p className="text-xs text-slate-500 font-medium">
                                                            Admin: <strong className="text-slate-800">{notif.adminName}</strong>
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
