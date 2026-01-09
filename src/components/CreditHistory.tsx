'use client'

import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { ArrowUpRight, ArrowDownLeft, PlusCircle, Search, Filter } from 'lucide-react'
import { useState } from 'react'
import { formatCurrency } from '@/lib/format'

interface Transfer {
    id: string
    amount: number
    type: string
    createdAt: Date
    fromUser: { name: string } | null
    toUser: { name: string }
}

export default function CreditHistory({ transfers, userRole }: { transfers: any[], userRole: string }) {
    const [filter, setFilter] = useState('')

    const filteredTransfers = transfers.filter(t =>
        t.toUser.name.toLowerCase().includes(filter.toLowerCase()) ||
        (t.fromUser?.name || 'Sistema').toLowerCase().includes(filter.toLowerCase()) ||
        t.type.replace(/_/g, ' ').toLowerCase().includes(filter.toLowerCase())
    )

    const getTypeIcon = (type: string) => {
        if (type === 'RECHARGE') return <PlusCircle className="text-green-600" />
        return <ArrowRightLeft className="text-blue-600" />
    }

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'RECHARGE': return 'REC. SISTEMA'
            case 'OWNER_TO_ADMIN': return 'OWNER → ADMIN'
            case 'ADMIN_TO_SELLER': return 'ADMIN → SELLER'
            default: return type
        }
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Historial de Créditos</h1>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Auditoría de movimientos</p>
            </div>

            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input
                    type="text"
                    placeholder="Buscar por usuario o tipo..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-white border-2 border-slate-100 rounded-3xl font-bold focus:border-blue-500 outline-none transition-all shadow-sm text-slate-900 placeholder:text-slate-400 placeholder:font-black placeholder:uppercase placeholder:tracking-widest placeholder:text-[10px]"
                />
            </div>

            <div className="space-y-3">
                {filteredTransfers.map((transfer) => (
                    <div key={transfer.id} className="bg-white p-4 rounded-[28px] border-2 border-slate-50 flex items-center gap-4 shadow-sm">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${transfer.type === 'RECHARGE' ? 'bg-green-100' : 'bg-blue-100'
                            }`}>
                            {transfer.type === 'RECHARGE' ? <PlusCircle className="w-5 h-5 text-green-600" /> : <ArrowDownLeft className="w-5 h-5 text-blue-600" />}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                                    {getTypeLabel(transfer.type)}
                                </span>
                                <span className="text-[10px] font-bold text-slate-300">
                                    {format(new Date(transfer.createdAt), "d 'de' MMM, HH:mm", { locale: es })}
                                </span>
                            </div>
                            <div className="flex justify-between items-end mt-0.5">
                                <div className="truncate">
                                    <p className="text-sm font-bold text-slate-700">
                                        {transfer.type === 'RECHARGE' ? 'Inyección de Saldo' : `${transfer.fromUser?.name} → ${transfer.toUser.name}`}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-black text-slate-800">
                                        ${formatCurrency(transfer.amount)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredTransfers.length === 0 && (
                    <div className="text-center py-12 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
                        <p className="text-slate-400 font-bold">No se encontraron movimientos</p>
                    </div>
                )}
            </div>
        </div>
    )
}

function ArrowRightLeft({ className }: { className?: string }) {
    return <ArrowUpRight className={className} />
}
