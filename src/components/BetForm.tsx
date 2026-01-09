'use client'

import { useState } from 'react'
import { formatCurrency } from '@/lib/format'

interface BetFormProps {
    lotteryNames: string[]
    onSubmit: (number: number, amount: number) => void
    onBack: () => void
    balance: number
}

export default function BetForm({ lotteryNames, onSubmit, onBack, balance }: BetFormProps) {
    const [number, setNumber] = useState('')
    const [amount, setAmount] = useState('')

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, '').slice(0, 4)
        setNumber(val)
    }

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, '')
        setAmount(val)
    }

    const isFormValid = number.length > 0 && amount.length > 0 && parseInt(amount) <= balance

    return (
        <div className="flex flex-col h-full bg-white p-6">
            {/* Step Indicator */}
            <div className="flex items-center justify-center gap-3 mb-8 text-sm text-slate-500">
                <div className="flex items-center gap-2 opacity-50">
                    <span className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs text-slate-600">1</span>
                    <span className="border-b-2 border-transparent">Loterias</span>
                </div>
                <div className="w-8 h-px bg-slate-300" />
                <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-900 text-white flex items-center justify-center text-xs">2</span>
                    <span className="font-medium text-blue-900 border-b-2 border-slate-300 pb-0.5">Monto/Número</span>
                </div>
                <div className="w-8 h-px bg-slate-300" />
                <span className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs">3</span>
            </div>

            <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-800 mb-1">Tu Jugada</h2>
                <p className="text-sm text-slate-400">Para: {lotteryNames.join(', ')}</p>
            </div>

            <div className="space-y-6 flex-1">
                <div>
                    <label className="block text-sm font-bold text-slate-600 mb-2 uppercase tracking-tight">Número (0000-9999)</label>
                    <input
                        type="text"
                        inputMode="numeric"
                        value={number}
                        onChange={handleNumberChange}
                        className="w-full text-5xl font-black p-4 rounded-2xl border-2 border-slate-100 bg-slate-50 text-center tracking-[1rem] outline-none focus:border-red-500 transition-colors text-slate-900 placeholder:text-slate-300"
                        placeholder="0000"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-600 mb-2 uppercase tracking-tight">Monto a apostar</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">$</span>
                        <input
                            type="text"
                            inputMode="numeric"
                            value={amount}
                            onChange={handleAmountChange}
                            className="w-full text-3xl font-bold pl-10 p-5 rounded-2xl border-2 border-slate-100 bg-slate-50 outline-none focus:border-red-500 transition-colors text-slate-900 placeholder:text-slate-300"
                            placeholder="0.00"
                        />
                    </div>
                    <p className="mt-2 text-xs text-slate-400 text-right">Saldo disponible: ${formatCurrency(balance)}</p>
                </div>
            </div>

            <div className="flex gap-4 pt-6 mb-24">
                <button
                    onClick={onBack}
                    className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-full font-bold text-lg active:scale-95 transition-transform"
                >
                    Atrás
                </button>
                <button
                    disabled={!isFormValid}
                    onClick={() => onSubmit(parseInt(number), parseInt(amount))}
                    className="flex-[2] bg-black text-white py-4 rounded-full font-bold text-lg active:scale-95 transition-transform disabled:opacity-30 disabled:pointer-events-none"
                >
                    Confirmar Apuesta
                </button>
            </div>
        </div>
    )
}
