'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Calendar, Clock, RotateCcw, Save, X, Trash2, Trophy, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { createLottery, updateLottery, updateLotteryStatus } from '@/actions/lottery'
import { setWinningNumber } from '@/actions/winners'

interface Lottery {
    id: string
    name: string
    dayOfWeek: number | null
    specificDate: Date | null
    playTime: string
    multiplier: number
    status: 'ACTIVE' | 'INACTIVE' | 'CLOSED'
    isRepeating: boolean
    winningNumber: number | null
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

    // Winner setting state
    const [settingWinnerFor, setSettingWinnerFor] = useState<Lottery | null>(null)
    const [winningNumberInput, setWinningNumberInput] = useState('')
    const [confirmationStep, setConfirmationStep] = useState(0)
    const [isSubmittingWinner, setIsSubmittingWinner] = useState(false)

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

    const handleSetWinner = async () => {
        if (!settingWinnerFor) return

        setIsSubmittingWinner(true)
        try {
            const result = await setWinningNumber(settingWinnerFor.id, Number(winningNumberInput))
            alert(`¡Ganador establecido! ${result.winnersCount} ganadores, Total Premios: $${result.totalPrizes}`)
            window.location.reload()
        } catch (error: any) {
            alert(error.message)
            setConfirmationStep(0)
        } finally {
            setIsSubmittingWinner(false)
        }
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

            <AnimatePresence>
                {/* Edit Modal */}
                {isEditing && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                    >
                        <div className="bg-white p-6 rounded-[32px] w-full max-w-md shadow-2xl space-y-6">
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
                        </div>
                    </motion.div>
                )}

                {/* Winner Setting Modal */}
                {settingWinnerFor && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white w-full max-w-sm rounded-[40px] p-8 text-center space-y-6 relative overflow-hidden"
                        >
                            <button
                                onClick={() => {
                                    setSettingWinnerFor(null)
                                    setConfirmationStep(0)
                                    setWinningNumberInput('')
                                }}
                                className="absolute top-6 right-6 text-slate-300 hover:text-slate-500"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <div className="w-20 h-20 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto">
                                <Trophy className="w-10 h-10" />
                            </div>

                            <div className="space-y-1">
                                <h3 className="text-xl font-black text-slate-800 uppercase leading-none">
                                    {settingWinnerFor.name}
                                </h3>
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                                    Definir Ganador
                                </p>
                            </div>

                            {confirmationStep === 0 && (
                                <div className="space-y-4">
                                    <input
                                        type="number"
                                        value={winningNumberInput}
                                        onChange={e => setWinningNumberInput(e.target.value)}
                                        placeholder="00"
                                        className="w-32 h-32 text-6xl font-black text-center bg-slate-50 border-4 border-slate-100 rounded-3xl outline-none focus:border-yellow-400 transition-colors mx-auto block"
                                        maxLength={2}
                                    />
                                    <p className="text-xs text-slate-400">Ingresa el número ganador (0-99)</p>
                                    <button
                                        onClick={() => {
                                            if (winningNumberInput === '') return
                                            setConfirmationStep(1)
                                        }}
                                        disabled={winningNumberInput === ''}
                                        className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl disabled:opacity-50"
                                    >
                                        Continuar
                                    </button>
                                </div>
                            )}

                            {confirmationStep === 1 && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                                    <div className="bg-yellow-50 p-4 rounded-2xl border border-yellow-100">
                                        <p className="text-sm text-yellow-800 font-medium">
                                            Vas a establecer el número <span className="font-black text-lg">{winningNumberInput}</span> como ganador.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setConfirmationStep(2)}
                                        className="w-full py-4 bg-yellow-500 text-white font-bold rounded-2xl shadow-lg shadow-yellow-200"
                                    >
                                        Sí, confirmar número
                                    </button>
                                </div>
                            )}

                            {confirmationStep === 2 && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                                    <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
                                    <p className="font-bold text-slate-800">
                                        ¿Estás absolutamente seguro?
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        Esta acción calculará premios y no se puede deshacer fácilmente.
                                    </p>
                                    <button
                                        onClick={() => setConfirmationStep(3)}
                                        className="w-full py-4 bg-red-600 text-white font-bold rounded-2xl shadow-lg shadow-red-200"
                                    >
                                        CONFIRMAR FINALMENTE
                                    </button>
                                </div>
                            )}

                            {confirmationStep === 3 && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                                    <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
                                    <p className="text-lg font-black text-slate-800">Todo listo</p>
                                    <button
                                        onClick={handleSetWinner}
                                        disabled={isSubmittingWinner}
                                        className="w-full py-4 bg-green-600 text-white font-bold rounded-2xl shadow-lg shadow-green-200 disabled:opacity-70"
                                    >
                                        {isSubmittingWinner ? 'Procesando...' : 'ESTABLECER GANADOR'}
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid gap-4">
                {lotteries.map(lottery => (
                    <motion.div
                        key={lottery.id}
                        layout
                        className={`bg-white p-5 rounded-[28px] border-2 flex items-center gap-4 transition-colors group
                         ${lottery.winningNumber !== null ? 'border-yellow-200 bg-yellow-50/30' : 'border-slate-100 hover:border-red-100'}`}
                    >
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 
                            ${lottery.winningNumber !== null ? 'bg-yellow-100 text-yellow-600' :
                                lottery.status === 'ACTIVE' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-400'}`}>
                            {lottery.winningNumber !== null ? (
                                <span className="text-xl font-black">{lottery.winningNumber}</span>
                            ) : (
                                lottery.isRepeating ? <RotateCcw className="w-6 h-6" /> : <Calendar className="w-6 h-6" />
                            )}
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
                            {/* Winner Button - Only for CLOSED lotteries with no winner yet */}
                            {lottery.status !== 'ACTIVE' && lottery.winningNumber === null && (
                                <button
                                    onClick={() => setSettingWinnerFor(lottery)}
                                    className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-xl font-bold text-xs hover:bg-yellow-200 transition-colors"
                                >
                                    DEFINIR GANADOR
                                </button>
                            )}

                            {lottery.winningNumber === null && (
                                <>
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
                                </>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
