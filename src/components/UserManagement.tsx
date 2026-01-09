'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, UserPlus, Mail, Shield, Wallet, ArrowRightLeft, X, Save, Trash2, Loader2 } from 'lucide-react'
import { createAdmin, createSeller, updateUser, deleteUser } from '@/actions/users'
import { transferCredit } from '@/actions/transfers'
import { formatCurrency } from '@/lib/format'

interface UserItem {
    id: string
    name: string
    email: string
    role: string
    balance: number
    createdAt: Date
}

export default function UserManagement({
    initialUsers,
    roleToCreate,
    currentBalance
}: {
    initialUsers: UserItem[],
    roleToCreate: 'ADMIN' | 'SELLER',
    currentBalance: number
}) {
    const [users, setUsers] = useState(initialUsers)
    const [isAdding, setIsAdding] = useState(false)
    const [transferringTo, setTransferringTo] = useState<UserItem | null>(null)
    const [amount, setAmount] = useState('')
    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    })

    const handleCreate = async () => {
        setLoading(true)
        try {
            if (roleToCreate === 'ADMIN') {
                await createAdmin(formData)
            } else {
                await createSeller(formData)
            }
            window.location.reload()
        } catch (error: any) {
            alert(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleTransfer = async () => {
        if (!transferringTo || !amount) return
        setLoading(true)
        try {
            await transferCredit({
                toUserId: transferringTo.id,
                amount: Number(amount)
            })
            window.location.reload()
        } catch (error: any) {
            alert(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-6 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
                        {roleToCreate === 'ADMIN' ? 'Administradores' : 'Vendedores'}
                    </h1>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Gestión de cuenta y créditos
                    </p>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100 active:scale-90 transition-transform"
                >
                    <UserPlus className="w-6 h-6" />
                </button>
            </div>

            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-white p-6 rounded-[32px] border-2 border-blue-100 shadow-xl space-y-4 overflow-hidden"
                    >
                        <div className="flex justify-between items-center">
                            <h2 className="font-bold text-blue-800 uppercase text-xs tracking-widest pl-1">Registrar Nuevo</h2>
                            <button onClick={() => setIsAdding(false)} className="text-slate-400"><X className="w-5 h-5" /></button>
                        </div>
                        <input
                            type="text"
                            placeholder="Nombre Completo"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none font-bold text-slate-900 placeholder:text-slate-500 placeholder:font-black placeholder:uppercase placeholder:tracking-widest placeholder:text-[10px]"
                        />
                        <input
                            type="email"
                            placeholder="Correo Electrónico"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none font-bold text-slate-900 placeholder:text-slate-500 placeholder:font-black placeholder:uppercase placeholder:tracking-widest placeholder:text-[10px]"
                        />
                        <input
                            type="password"
                            placeholder="Contraseña (Mín. 6 caracteres)"
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                            className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none font-bold text-slate-900 placeholder:text-slate-500 placeholder:font-black placeholder:uppercase placeholder:tracking-widest placeholder:text-[10px]"
                        />
                        <button
                            onClick={handleCreate}
                            disabled={loading}
                            className="w-full py-4 bg-blue-600 text-white font-black rounded-3xl shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'CREAR CUENTA'}
                        </button>
                    </motion.div>
                )}

                {transferringTo && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white p-8 rounded-[40px] shadow-2xl w-full max-w-sm space-y-6"
                        >
                            <div className="text-center space-y-2">
                                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
                                    <ArrowRightLeft className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-black text-slate-800">Transferir Créditos</h3>
                                <p className="text-sm text-slate-400">Enviando a <b>{transferringTo.name}</b></p>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Monto a Enviar</label>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={e => setAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-3xl text-2xl font-black text-center focus:border-blue-500 outline-none text-slate-900 placeholder:text-slate-400"
                                    />
                                    <p className="text-[10px] text-slate-400 text-center mt-2 uppercase font-bold tracking-tight">
                                        Tu saldo disponible: <span className="text-blue-600">${formatCurrency(currentBalance)}</span>
                                    </p>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        onClick={() => setTransferringTo(null)}
                                        className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl"
                                    >
                                        CANCELAR
                                    </button>
                                    <button
                                        onClick={handleTransfer}
                                        disabled={loading || !amount || Number(amount) > currentBalance}
                                        className="flex-[2] py-4 bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-100 disabled:opacity-50"
                                    >
                                        {loading ? <Loader2 className="animate-spin mx-auto" /> : 'TRANSFERIR'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="space-y-4">
                {users.map(user => (
                    <div key={user.id} className="bg-white p-5 rounded-[32px] border-2 border-slate-100 flex items-center gap-4">
                        <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center shrink-0">
                            <Shield className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-slate-800 truncate">{user.name}</h3>
                            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                                <Mail className="w-3 h-3" /> {user.email}
                            </div>
                            <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black">
                                <Wallet className="w-3 h-3 mr-1" /> ${formatCurrency(user.balance)}
                            </div>
                        </div>
                        <button
                            onClick={() => setTransferringTo(user)}
                            className="w-12 h-12 bg-slate-50 text-blue-600 rounded-2xl flex items-center justify-center hover:bg-blue-50 transition-colors active:scale-95"
                        >
                            <ArrowRightLeft className="w-5 h-5" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}
