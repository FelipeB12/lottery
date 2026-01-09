'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import LotterySelector from '@/components/LotterySelector'
import BetForm from '@/components/BetForm'
import { placeBet } from '@/actions/bets'
import { useRouter } from 'next/navigation'

interface Lottery {
    id: string
    name: string
    closingTime: string
}

export default function SellerClient({
    user,
    lotteries
}: {
    user: any,
    lotteries: Lottery[]
}) {
    const [step, setStep] = useState(1)
    const [selectedLotteryIds, setSelectedLotteryIds] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

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
            router.refresh()
            setStep(1)
            setSelectedLotteryIds([])
            alert('¡Apuesta realizada con éxito!')
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
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
                ) : (
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
                        {error && (
                            <div className="fixed top-24 left-6 right-6 bg-red-100 text-red-600 p-4 rounded-2xl font-bold text-center animate-bounce z-50">
                                {error}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}
