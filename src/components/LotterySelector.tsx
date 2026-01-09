'use client'

import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'

interface Lottery {
    id: string
    name: string
    closingTime: string
}

interface LotterySelectorProps {
    lotteries: Lottery[]
    onContinue: (selectedIds: string[]) => void
}

const DAYS = [
    { label: 'Lun.', date: '1' },
    { label: 'Mar.', date: '2' },
    { label: 'Mié.', date: '3' },
    { label: 'Jue.', date: '4', active: true },
    { label: 'Vie.', date: '5' },
]

export default function LotterySelector({ lotteries, onContinue }: LotterySelectorProps) {
    const [selectedIds, setSelectedIds] = useState<string[]>([])

    const toggleLottery = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        )
    }

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Step Indicator */}
            <div className="flex items-center justify-center gap-3 p-6 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-900 text-white flex items-center justify-center text-xs">1</span>
                    <span className="font-medium text-blue-900 border-b-2 border-slate-300 pb-0.5">Loterias/Sorteos</span>
                </div>
                <div className="w-8 h-px bg-slate-300" />
                <span className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs">2</span>
                <div className="w-8 h-px bg-slate-300" />
                <span className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs">3</span>
            </div>

            {/* Day Filter */}
            <div className="flex gap-3 px-6 overflow-x-auto pb-6 scrollbar-hide">
                {DAYS.map((day) => (
                    <button
                        key={day.label}
                        className={`flex-shrink-0 w-16 h-20 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-colors ${day.active
                                ? 'bg-black border-black text-white'
                                : 'bg-white border-slate-200 text-slate-600'
                            }`}
                    >
                        <span className="text-xs font-medium">{day.label}</span>
                        <span className="text-xl font-bold">{day.date}</span>
                    </button>
                ))}
            </div>

            <div className="px-6 space-y-3 pb-24">
                <p className="text-sm text-slate-700 font-medium mb-4">
                    Selecciona una o varias de las siguientes loterías y/o sorteos disponibles.
                </p>

                {lotteries.map((lottery) => (
                    <button
                        key={lottery.id}
                        onClick={() => toggleLottery(lottery.id)}
                        className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${selectedIds.includes(lottery.id)
                                ? 'border-slate-200 bg-white'
                                : 'border-slate-100 bg-white'
                            }`}
                    >
                        <div className="text-left">
                            <h3 className="font-bold text-slate-800 text-lg">{lottery.name}</h3>
                            <p className="text-sm text-slate-400">Hora de cierre - {lottery.closingTime}</p>
                        </div>
                        {selectedIds.includes(lottery.id) && (
                            <CheckCircle2 className="w-6 h-6 text-green-500 fill-green-500 text-white" />
                        )}
                    </button>
                ))}
            </div>

            {/* Footer Button */}
            {selectedIds.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent pointer-events-none">
                    <button
                        onClick={() => onContinue(selectedIds)}
                        className="w-full bg-black text-white py-4 rounded-full font-bold text-lg pointer-events-auto active:scale-95 transition-transform"
                    >
                        Continuar
                    </button>
                </div>
            )}
        </div>
    )
}
