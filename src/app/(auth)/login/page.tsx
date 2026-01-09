'use client'

import { login } from '@/actions/auth'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setError(null)
        const result = await login(formData)

        if (result.error) {
            setError(result.error)
            setLoading(false)
        } else {
            router.push(`/${result.role?.toLowerCase()}`)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
                <div className="text-center mb-10">
                    <div className="flex flex-col items-center leading-tight mb-2">
                        <span className="text-red-600 font-black text-4xl italic">Loterias</span>
                        <span className="text-blue-900 font-bold text-sm tracking-widest uppercase">Management System</span>
                    </div>
                </div>

                <form action={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                        <input
                            name="email"
                            type="email"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                            placeholder="correo@ejemplo.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Contraseña</label>
                        <input
                            name="password"
                            type="password"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

                    <button
                        disabled={loading}
                        className="w-full bg-red-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-all disabled:opacity-50"
                    >
                        {loading ? 'Cargando...' : 'Iniciar Sesión'}
                    </button>
                </form>
            </div>
        </div>
    )
}
