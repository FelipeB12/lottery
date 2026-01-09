import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import LotterySelector from '@/components/LotterySelector'
import BetForm from '@/components/BetForm'
import { placeBet } from '@/actions/bets'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'

interface Lottery {
    id: string
    name: string
    closingTime: string
    dayOfWeek?: number | null
    isRepeating?: boolean
    specificDate?: string | null
}

export default function SellerClient({
    user,
    lotteries
}: {
    user: any,
    lotteries: Lottery[]
}) {
    const [mounted, setMounted] = useState(false)
    const [step, setStep] = useState(1)
    const [selectedLotteryIds, setSelectedLotteryIds] = useState<string[]>([])
    const [betDetails, setBetDetails] = useState<{ number: number; amount: number } | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <DashboardLayout user={user}>
                <div className="h-full flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
                </div>
            </DashboardLayout>
        )
    }

    const handleLotterySelect = (ids: string[]) => {
        setSelectedLotteryIds(ids)
        setStep(2)
    }

    const handleBetSubmit = async (number: number, amount: number) => {
        setLoading(true)
        setError(null)

        try {
            // Place bets for all selected lotteries
            for (const lotteryId of selectedLotteryIds) {
                await placeBet({ lotteryId, number, amount })
            }
            setBetDetails({ number, amount })
            setStep(3) // Go to confirmation screen
            router.refresh()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleStartOver = () => {
        setStep(1)
        setSelectedLotteryIds([])
        setBetDetails(null)
        setError(null)
    }

    const handleGoHome = () => {
        const homeRoute = user.role === 'OWNER' ? '/owner' : user.role === 'ADMIN' ? '/admin' : '/seller'
        router.push(homeRoute)
    }

    const selectedLotteryNames = lotteries
        .filter(l => selectedLotteryIds.includes(l.id))
        .map(l => l.name)

    return (
        <DashboardLayout user={user}>
            <div className="h-full">
                {step === 1 ? (
                    <LotterySelector
                        lotteries={lotteries}
                        onContinue={handleLotterySelect}
                    />
                ) : step === 2 ? (
                    <div className="relative h-full">
                        <BetForm
                            balance={user.balance}
                            lotteryNames={selectedLotteryNames}
                            onBack={() => setStep(1)}
                            onSubmit={handleBetSubmit}
                        />
                        {loading && (
                            <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-50">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
                                    <p className="font-bold text-slate-800">Procesando apuestas...</p>
                                </div>
                            </div>
                        )}
                        <div className="fixed top-24 left-6 right-6 bg-red-100 border border-red-200 text-red-700 p-4 rounded-2xl font-bold text-center animate-in fade-in slide-in-from-top-4 shadow-lg z-50 flex items-center justify-between gap-4">
                            <span className="flex-1">{error}</span>
                            <button
                                onClick={() => setError(null)}
                                className="w-8 h-8 flex items-center justify-center bg-red-200 rounded-full hover:bg-red-300 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        )}
                    </div>
                ) : (
                    <div className="p-6 space-y-6 pb-32">
                        <div className="text-center space-y-2">
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-black text-slate-800">¡Apuesta Realizada!</h2>
                            <p className="text-sm text-slate-500">Tu apuesta ha sido registrada exitosamente</p>
                        </div>

                        <div className="bg-white p-6 rounded-3xl border-2 border-slate-100 space-y-4">
                            <h3 className="font-bold text-slate-800 uppercase text-xs tracking-widest">Resumen de Compra</h3>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                                    <span className="text-sm text-slate-500">Número jugado</span>
                                    <span className="text-2xl font-black text-red-600">{betDetails?.number.toString().padStart(2, '0')}</span>
                                </div>

                                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                                    <span className="text-sm text-slate-500">Monto por lotería</span>
                                    <span className="text-xl font-bold text-slate-800">${betDetails?.amount}</span>
                                </div>

                                <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                                    <span className="text-sm text-slate-500">Loterías</span>
                                    <span className="text-lg font-bold text-slate-800">{selectedLotteryIds.length}</span>
                                </div>

                                <div className="bg-slate-50 p-3 rounded-2xl space-y-1">
                                    {selectedLotteryNames.map((name, idx) => (
                                        <div key={idx} className="text-xs font-bold text-slate-600">• {name}</div>
                                    ))}
                                </div>

                                <div className="flex justify-between items-center pt-3 border-t-2 border-slate-200">
                                    <span className="text-base font-bold text-slate-700">Total Invertido</span>
                                    <span className="text-2xl font-black text-green-600">${(betDetails?.amount || 0) * selectedLotteryIds.length}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={handleStartOver}
                                className="w-full py-4 bg-blue-600 text-white font-black rounded-3xl shadow-lg active:scale-95 transition-transform"
                            >
                                AGREGAR OTRA LOTERÍA
                            </button>
                            <button
                                onClick={handleGoHome}
                                className="w-full py-4 bg-slate-100 text-slate-700 font-bold rounded-3xl active:scale-95 transition-transform"
                            >
                                CONTINUAR
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}
