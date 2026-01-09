export default function Loading() {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-slate-50">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
                <p className="font-bold text-slate-400 animate-pulse text-sm tracking-widest uppercase">Cargando...</p>
            </div>
        </div>
    )
}
