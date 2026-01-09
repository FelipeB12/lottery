'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, UserPlus, Mail, Shield, Wallet, ArrowRightLeft, X, Save, Trash2, Loader2, Edit2 } from 'lucide-react'
import { createAdmin, createSeller, createUser, updateUser, deleteUser } from '@/actions/users'
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
    currentBalance,
    canChooseRole = false
}: {
    initialUsers: UserItem[],
    roleToCreate: 'ADMIN' | 'SELLER',
    currentBalance: number,
    canChooseRole?: boolean
}) {
    const [users, setUsers] = useState(initialUsers)
    const [isAdding, setIsAdding] = useState(false)
    const [editingUser, setEditingUser] = useState<UserItem | null>(null)
    const [transferringTo, setTransferringTo] = useState<UserItem | null>(null)
    const [amount, setAmount] = useState('')
    const [loading, setLoading] = useState(false)
    const [selectedRole, setSelectedRole] = useState<'ADMIN' | 'SELLER'>(roleToCreate)

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    })

    const [editFormData, setEditFormData] = useState({
        name: '',
        email: '',
        password: ''
    })

    const handleCreate = async () => {
        setLoading(true)
        try {
            if (canChooseRole) {
                await createUser({ ...formData, role: selectedRole })
            } else if (roleToCreate === 'ADMIN') {
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

    const handleEdit = async () => {
        if (!editingUser) return
        setLoading(true)
        try {
            const dataToUpdate: any = {
                name: editFormData.name,
                email: editFormData.email
            }
            if (editFormData.password) {
                dataToUpdate.password = editFormData.password
            }
            await updateUser(editingUser.id, dataToUpdate)
            window.location.reload()
        } catch (error: any) {
            alert(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (userId: string, userName: string) => {
        if (!confirm(`¿Estás seguro de eliminar a ${userName}?`)) return
        setLoading(true)
        try {
            await deleteUser(userId)
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
                        {canChooseRole ? 'Usuarios' : (roleToCreate === 'ADMIN' ? 'Administradores' : 'Vendedores')}
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
                        {canChooseRole && (
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tipo de Cuenta</label>
                                <select
                                    value={selectedRole}
                                    onChange={e => setSelectedRole(e.target.value as 'ADMIN' | 'SELLER')}
                                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none font-bold text-slate-900"
                                >
                                    <option value="ADMIN">Administrador</option>
                                    <option value="SELLER">Vendedor</option>
                                </select>
                            </div>
                        )}
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

                {editingUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white p-8 rounded-[40px] shadow-2xl w-full max-w-sm space-y-6"
                        >
                            <div className="flex justify-between items-center">
                                <div className="text-center space-y-2 flex-1">
                                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
                                        <Edit2 className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-800">Editar Usuario</h3>
                                    <p className="text-sm text-slate-400">Modificando <b>{editingUser.name}</b></p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Nombre Completo"
                                    value={editFormData.name}
                                    onChange={e => setEditFormData({ ...editFormData, name: e.target.value })}
                                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none font-bold text-slate-900"
                                />
                                <input
                                    type="email"
                                    placeholder="Correo Electrónico"
                                    value={editFormData.email}
                                    onChange={e => setEditFormData({ ...editFormData, email: e.target.value })}
                                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none font-bold text-slate-900"
                                />
                                <input
                                    type="password"
                                    placeholder="Nueva Contraseña (dejar vacío para no cambiar)"
                                    value={editFormData.password}
                                    onChange={e => setEditFormData({ ...editFormData, password: e.target.value })}
                                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none font-bold text-slate-900"
                                />

                                <div className="flex gap-3 pt-2">
                                    <button
                                        onClick={() => setEditingUser(null)}
                                        className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl"
                                    >
                                        CANCELAR
                                    </button>
                                    <button
                                        onClick={handleEdit}
                                        disabled={loading || !editFormData.name || !editFormData.email}
                                        className="flex-[2] py-4 bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-100 disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {loading ? <Loader2 className="animate-spin" /> : 'GUARDAR'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="space-y-3 md:space-y-4">
                {users.map(user => (
                    <div key={user.id} className="bg-white p-3 md:p-5 rounded-[20px] md:rounded-[32px] border-2 border-slate-100 flex items-center gap-3 md:gap-4 transition-colors hover:border-blue-100">
                        <div className="w-12 h-12 md:w-14 md:h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center shrink-0">
                            <Shield className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-slate-800 truncate text-base md:text-lg">{user.name}</h3>
                            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4 mt-0.5">
                                <div className="flex items-center gap-1.5 text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-tighter">
                                    <Mail className="w-3 h-3" /> <span className="truncate max-w-[120px] md:max-w-none">{user.email}</span>
                                </div>
                                <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[10px] md:text-xs font-black self-start md:self-auto">
                                    <Wallet className="w-3 h-3 mr-1" /> ${formatCurrency(user.balance)}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-1.5 md:gap-2">
                            <button
                                onClick={() => {
                                    setEditingUser(user)
                                    setEditFormData({
                                        name: user.name,
                                        email: user.email,
                                        password: ''
                                    })
                                }}
                                className="w-9 h-9 md:w-10 md:h-10 bg-slate-50 text-slate-600 rounded-xl md:rounded-2xl flex items-center justify-center hover:bg-slate-100 transition-colors active:scale-95"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => handleDelete(user.id, user.name)}
                                className="w-9 h-9 md:w-10 md:h-10 bg-red-50 text-red-600 rounded-xl md:rounded-2xl flex items-center justify-center hover:bg-red-100 transition-colors active:scale-95"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setTransferringTo(user)}
                                className="w-9 h-9 md:w-10 md:h-10 bg-blue-50 text-blue-600 rounded-xl md:rounded-2xl flex items-center justify-center hover:bg-blue-100 transition-colors active:scale-95"
                            >
                                <ArrowRightLeft className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
