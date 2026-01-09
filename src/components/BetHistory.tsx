'use client'

import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Search, Filter, Ticket, User, Trophy, Clock } from 'lucide-react'
import { useState } from 'react'
import { formatCurrency } from '@/lib/format'

interface Bet {
    id: string
    number: number
    amount: number
    isWinner: boolean
    prizeAmount: number
    createdAt: Date
    lottery: { name: string }
    seller: { name: string; parent?: { name: string } | null }
}

export default function BetHistory({ bets, userRole }: { bets: any[], userRole: string }) {
    const [filter, setFilter] = useState('')

    const filteredBets = bets.filter(b =>
        b.lottery.name.toLowerCase().includes(filter.toLowerCase()) ||
        b.seller.name.toLowerCase().includes(filter.toLowerCase()) ||
        b.number.toString().includes(filter) ||
        (b.seller.parent?.name || '').toLowerCase().includes(filter.toLowerCase())
    )

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Historial de Compras</h1>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Seguimiento de apuestas</p>
            </div>

            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input
                    type="text"
                    placeholder="Buscar por lote, vendedor o número..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-white border-2 border-slate-100 rounded-3xl font-bold focus:border-red-500 outline-none transition-all shadow-sm text-slate-900 placeholder:text-slate-400 placeholder:font-black placeholder:uppercase placeholder:tracking-widest placeholder:text-[10px]"
                />
            </div>

            <div className="space-y-4">
                {filteredBets.map((bet) => (
                    <div key={bet.id} className="bg-white p-5 rounded-[32px] border-2 border-slate-100 shadow-sm space-y-3">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bet.isWinner ? 'bg-green-100 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                    <Ticket className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-black text-slate-800 uppercase">{bet.lottery.name}</p>
                                    <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase">
                                        <Clock className="w-3 h-3" /> {format(new Date(bet.createdAt), "d 'de' MMM, HH:mm", { locale: es })}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${bet.isWinner ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                                    {bet.isWinner ? 'Ganador' : 'Pendiente'}
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-between items-end bg-slate-50 p-4 rounded-2xl">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Número Jugado</p>
                                <p className="text-3xl font-black text-slate-800 tracking-tighter">{bet.number.toString().padStart(2, '0')}</p>
                            </div>
                            <div className="text-right space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Monto Apostado</p>
                                <p className="text-xl font-black text-red-600">${formatCurrency(bet.amount)}</p>
                            </div>
                        </div>

                        {bet.isWinner && (
                            <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-100">
                                <div className="flex items-center gap-2 text-green-700">
                                    <Trophy className="w-4 h-4" />
                                    <span className="text-xs font-black uppercase">Premio Ganado:</span>
                                </div>
                                <span className="text-sm font-black text-green-700">${formatCurrency(bet.prizeAmount)}</span>
                            </div>
                        )}

                        <div className="flex items-center gap-2 pt-1">
                            <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase">
                                <User className="w-3 h-3" /> {bet.seller.name}
                                {bet.seller.parent && (
                                    <>
                                        <span className="text-slate-200 mx-1">/</span>
                                        {bet.seller.parent.name}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {filteredBets.length === 0 && (
                    <div className="text-center py-12 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
                        <p className="text-slate-400 font-bold">No se encontraron apuestas</p>
                    </div>
                )}
            </div>
        </div>
    )
}
