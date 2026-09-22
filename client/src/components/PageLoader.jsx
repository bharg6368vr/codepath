export default function PageLoader({ label = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-slate-400">
      <span className="spinner h-6 w-6 text-emerald-400" />
      <span className="text-sm">{label}</span>
    </div>
  )
}
