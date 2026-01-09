'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit2, Calendar, Clock, RotateCcw, Save, X, Trash2 } from 'lucide-react'
import { createLottery, updateLottery, updateLotteryStatus } from '@/actions/lottery'

interface Lottery {
    id: string
    name: string
    dayOfWeek: number | null
    specificDate: Date | null
    playTime: string
    multiplier: number
    status: 'ACTIVE' | 'INACTIVE'
    isRepeating: boolean
}

export default function LotteryAdmin({ initialLotteries }: { initialLotteries: Lottery[] }) {
    const [lotteries, setLotteries] = useState(initialLotteries)
    const [isEditing, setIsEditing] = useState(false)
    const [currentLottery, setCurrentLottery] = useState<Partial<Lottery>>({
        name: '',
        dayOfWeek: 1,
        playTime: '20:00',
        multiplier: 1000,
        isRepeating: true,
        status: 'ACTIVE'
    })

    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

    const handleSave = async () => {
        try {
            const data: any = {
                name: currentLottery.name,
                dayOfWeek: currentLottery.isRepeating ? Number(currentLottery.dayOfWeek) : null,
                specificDate: !currentLottery.isRepeating ? currentLottery.specificDate?.toString() : null,
                playTime: currentLottery.playTime,
                multiplier: Number(currentLottery.multiplier),
                isRepeating: currentLottery.isRepeating
            }

            if (currentLottery.id) {
                await updateLottery(currentLottery.id, data)
            } else {
                await createLottery(data)
            }

            window.location.reload()
        } catch (error: any) {
            alert(error.message)
        }
    }

    const toggleStatus = async (id: string, current: string) => {
        const newStatus = current === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
        await updateLotteryStatus(id, newStatus)
        window.location.reload()
    }

    return (
        <div className="p-6 space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Loterías</h1>
                <button
                    onClick={() => {
                        setCurrentLottery({
                            name: '',
                            dayOfWeek: 1,
                            playTime: '20:00',
                            multiplier: 1000,
                            isRepeating: true,
                            status: 'ACTIVE'
                        })
                        setIsEditing(true)
                    }}
                    className="w-12 h-12 bg-red-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-red-100 active:scale-90 transition-transform"
                >
                    <Plus className="w-6 h-6" />
                </button>
            </div>

            {isEditing && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-6 rounded-[32px] border-2 border-slate-100 shadow-xl space-y-6"
                >
                    <div className="flex justify-between items-center">
                        <h2 className="font-bold text-slate-800 uppercase text-xs tracking-widest pl-1">
                            {currentLottery.id ? 'Editar Lotería' : 'Nueva Lotería'}
                        </h2>
                        <button onClick={() => setIsEditing(false)} className="text-slate-400">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre</label>
                            <input
                                type="text"
                                value={currentLottery.name}
                                onChange={e => setCurrentLottery({ ...currentLottery, name: e.target.value })}
                                className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-red-500 outline-none transition-colors font-bold text-slate-900 placeholder:text-slate-500 placeholder:font-black placeholder:uppercase placeholder:tracking-widest placeholder:text-[10px]"
                                placeholder="Ej: Loteria Nacional Night"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hora Sorteo</label>
                                <input
                                    type="time"
                                    value={currentLottery.playTime}
                                    onChange={e => setCurrentLottery({ ...currentLottery, playTime: e.target.value })}
                                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-red-500 outline-none transition-colors font-bold text-center text-slate-900"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Multiplicador (x)</label>
                                <input
                                    type="number"
                                    value={currentLottery.multiplier}
                                    onChange={e => setCurrentLottery({ ...currentLottery, multiplier: Number(e.target.value) })}
                                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-red-500 outline-none transition-colors font-bold text-center text-slate-900"
                                />
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50 rounded-3xl border-2 border-slate-100 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-slate-600">¿Es recurrente?</span>
                                <button
                                    onClick={() => setCurrentLottery({ ...currentLottery, isRepeating: !currentLottery.isRepeating })}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${currentLottery.isRepeating ? 'bg-red-600' : 'bg-slate-300'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${currentLottery.isRepeating ? 'right-1' : 'left-1'}`} />
                                </button>
                            </div>

                            {currentLottery.isRepeating ? (
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Día de la Semana</label>
                                    <select
                                        value={currentLottery.dayOfWeek ?? 1}
                                        onChange={e => setCurrentLottery({ ...currentLottery, dayOfWeek: Number(e.target.value) })}
                                        className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-red-500 outline-none font-bold appearance-none"
                                    >
                                        {days.map((d, i) => <option key={i} value={i}>{d}</option>)}
                                    </select>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fecha Específica</label>
                                    <input
                                        type="date"
                                        onChange={e => setCurrentLottery({ ...currentLottery, specificDate: new Date(e.target.value) })}
                                        className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-red-500 outline-none font-bold text-slate-900"
                                    />
                                </div>
                            )}
                        </div>

                        <button
                            onClick={handleSave}
                            className="w-full py-5 bg-red-600 text-white font-black rounded-3xl shadow-lg shadow-red-100 hover:bg-red-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            <Save className="w-5 h-5" />
                            GUARDAR LOTERÍA
                        </button>
                    </div>
                </motion.div>
            )}

            <div className="grid gap-4">
                {lotteries.map(lottery => (
                    <motion.div
                        key={lottery.id}
                        layout
                        className="bg-white p-5 rounded-[28px] border-2 border-slate-100 flex items-center gap-4 hover:border-red-100 transition-colors group"
                    >
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${lottery.status === 'ACTIVE' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-400'}`}>
                            {lottery.isRepeating ? <RotateCcw className="w-6 h-6" /> : <Calendar className="w-6 h-6" />}
                        </div>

                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-slate-800 truncate">{lottery.name}</h3>
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                                <Clock className="w-3 h-3" /> {lottery.playTime}
                                <span className="text-slate-200">|</span>
                                <span>{lottery.isRepeating ? days[lottery.dayOfWeek ?? 0] : 'Evento único'}</span>
                                <span className="text-slate-200">|</span>
                                <span className="text-red-500">x{lottery.multiplier}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => {
                                    setCurrentLottery(lottery)
                                    setIsEditing(true)
                                }}
                                className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                            >
                                <Edit2 className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => toggleStatus(lottery.id, lottery.status)}
                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${lottery.status === 'ACTIVE' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
