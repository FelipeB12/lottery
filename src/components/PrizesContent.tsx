'use client'

import { useEffect, useState } from 'react'
import { clearUnreadPrize } from '@/actions/prizes'
import { Trophy } from 'lucide-react'

interface Prize {
    id: string
    lotteryName: string
    number: number
    amount: number
    prizeAmount: number
    createdAt: string
    sellerName?: string
}

export default function PrizesContent({ prizes, role }: { prizes: Prize[], role: string }) {
    useEffect(() => {
        clearUnreadPrize()
    }, [])

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-3 mb-2">
                <Trophy className="w-8 h-8 text-yellow-500" />
                <h1 className="text-2xl font-bold text-slate-800">Tus Premios</h1>
            </div>

            {prizes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                    <Trophy className="w-16 h-16 opacity-20 mb-4" />
                    <p className="font-medium text-lg">No hay premios ganados aún</p>
                    <p className="text-sm">¡Sigue intentando!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {prizes.map((prize) => (
                        <div key={prize.id} className="bg-white border-2 border-green-100 rounded-3xl p-6 shadow-sm border-l-8 border-l-green-500">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg">{prize.lotteryName}</h3>
                                    <p className="text-xs text-slate-400">{new Date(prize.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
                                    Ganador
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="bg-slate-50 p-3 rounded-2xl">
                                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Número</p>
                                    <p className="text-2xl font-black text-slate-800">{prize.number.toString().padStart(4, '0')}</p>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-2xl">
                                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Apostado</p>
                                    <p className="text-xl font-bold text-slate-800">${prize.amount}</p>
                                </div>
                            </div>

                            <div className="bg-green-600 text-white p-4 rounded-2xl flex justify-between items-center">
                                <span className="font-bold">Premio:</span>
                                <span className="text-2xl font-black">${prize.prizeAmount.toLocaleString()}</span>
                            </div>

                            <p className="mt-4 text-xs font-medium text-slate-500 text-center">
                                {role === 'SELLER'
                                    ? 'Contacta a tu Administrador para cobrar tu premio.'
                                    : role === 'ADMIN'
                                        ? `El vendedor ${prize.sellerName} ganó. Contacta al Dueño.`
                                        : 'Registrado en el historial de pagos.'
                                }
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
