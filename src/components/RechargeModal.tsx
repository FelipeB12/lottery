'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CreditCard, Loader2 } from 'lucide-react'
import { rechargeOwner } from '@/actions/transfers'

interface RechargeModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function RechargeModal({ isOpen, onClose }: RechargeModalProps) {
    const [amount, setAmount] = useState('')
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState('')

    const handleRecharge = async () => {
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            setError('Monto inválido')
            return
        }

        setIsPending(true)
        setError('')
        try {
            await rechargeOwner(Number(amount))
            onClose()
            setAmount('')
        } catch (err: any) {
            setError(err.message || 'Error al recargar')
        } finally {
            setIsPending(false)
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-sm bg-white rounded-[40px] shadow-2xl overflow-hidden"
                    >
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-600">
                                    <CreditCard className="w-6 h-6" />
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>

                            <h2 className="text-2xl font-black text-slate-800 mb-2">Recargar Saldo</h2>
                            <p className="text-slate-500 text-sm mb-6">
                                Inyecta saldo del sistema a tu cuenta de Dueño.
                            </p>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                                        Monto a Recargar
                                    </label>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full text-2xl font-black p-5 bg-slate-50 border-2 border-slate-100 rounded-3xl focus:border-red-500 focus:outline-none transition-colors text-slate-900 placeholder:text-slate-400"
                                    />
                                </div>

                                {error && (
                                    <p className="text-red-500 text-sm font-bold ml-1">{error}</p>
                                )}

                                <button
                                    onClick={handleRecharge}
                                    disabled={isPending}
                                    className="w-full py-5 bg-red-600 text-white font-black rounded-3xl shadow-lg shadow-red-200 hover:bg-red-700 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isPending ? (
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                    ) : (
                                        'CONFIRMAR RECARGA'
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
