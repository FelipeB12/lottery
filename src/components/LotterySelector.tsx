'use client'

import { useState, useEffect } from 'react'
import { CheckCircle2 } from 'lucide-react'

interface Lottery {
    id: string
    name: string
    closingTime: string
    dayOfWeek?: number | null // 0-6
    isRepeating?: boolean
    specificDate?: string | null
}

interface LotterySelectorProps {
    lotteries: Lottery[]
    onContinue: (selectedIds: string[]) => void
}

export default function LotterySelector({ lotteries, onContinue }: LotterySelectorProps) {
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [selectedDayIndex, setSelectedDayIndex] = useState(0) // 0 = Today
    const [days, setDays] = useState<{ label: string, date: string, dayOfWeek: number, fullDate: Date }[]>([])
    const [currentDateDisplay, setCurrentDateDisplay] = useState('')

    useEffect(() => {
        const d = []
        setCurrentDateDisplay(new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" }))
        // Get 'today' in Colombia (GMT-5)
        const now = new Date()
        const colombiaTime = new Date(now.toLocaleString("en-US", { timeZone: "America/Bogota" }))

        const dayNames = ['Dom.', 'Lun.', 'Mar.', 'Mié.', 'Jue.', 'Vie.', 'Sáb.']

        for (let i = 0; i < 7; i++) {
            const date = new Date(colombiaTime)
            date.setDate(colombiaTime.getDate() + i)
            d.push({
                label: dayNames[date.getDay()],
                date: date.getDate().toString(),
                dayOfWeek: date.getDay(),
                fullDate: date
            })
        }
        setDays(d)
    }, [])

    const toggleLottery = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        )
    }

    // Filter lotteries for the selected day
    const filteredLotteries = lotteries.filter(lottery => {
        const selectedDay = days[selectedDayIndex]
        if (!selectedDay) return false

        // If repeating, check day of week
        if (lottery.isRepeating) {
            // Ensure dayOfWeek is treated as number
            return (lottery.dayOfWeek ?? -1) === selectedDay.dayOfWeek
        }

        // If specific date, check date string match (YYYY-MM-DD)
        if (lottery.specificDate) {
            // lottery.specificDate is ISO string (e.g., 2026-01-09T00:00:00.000Z)
            // We take the date part directly to avoid timezone shifts
            const lotDateString = lottery.specificDate.split('T')[0]

            // Format selected day as YYYY-MM-DD in Colombia Time
            const selDateString = selectedDay.fullDate.toLocaleDateString('en-CA', {
                timeZone: 'America/Bogota',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            }) // en-CA gives YYYY-MM-DD format

            return lotDateString === selDateString
        }

        return false
    })

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Debug Info */}
            <div className="text-[10px] text-center text-slate-300 pt-2">
                Hoy: {currentDateDisplay}
            </div>

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
                {days.map((day, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedDayIndex(index)}
                        className={`flex-shrink-0 w-16 h-20 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-colors ${selectedDayIndex === index
                            ? 'bg-black border-black text-white'
                            : 'bg-white border-slate-200 text-slate-600'
                            }`}
                    >
                        <span className="text-xl font-bold">{day.date}</span>
                        <span className="text-xs font-medium">{day.label}</span>
                    </button>
                ))}
            </div>

            <div className="px-6 space-y-3 pb-48">
                <p className="text-sm text-slate-700 font-medium mb-4">
                    Selecciona una o varias de las siguientes loterías y/o sorteos disponibles.
                </p>

                {filteredLotteries.length === 0 ? (
                    <div className="text-center py-10 text-slate-400">
                        <p>No hay sorteos disponibles para este día.</p>
                    </div>
                ) : (
                    filteredLotteries.map((lottery) => (
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
                    ))
                )}
            </div>

            {/* Footer Button */}
            {selectedIds.length > 0 && (
                <div className="fixed bottom-28 left-1/2 -translate-x-1/2 w-[90%] pointer-events-none z-40">
                    <button
                        onClick={() => onContinue(selectedIds)}
                        className="w-full bg-black text-white py-4 rounded-full font-bold text-lg pointer-events-auto shadow-2xl active:scale-95 transition-transform"
                    >
                        Continuar
                    </button>
                </div>
            )}
        </div>
    )
}
