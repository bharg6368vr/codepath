import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-6 py-24 text-center">
      <p className="text-emerald-400 font-mono text-sm mb-2">404</p>
      <h1 className="text-2xl font-bold text-slate-100 mb-2">Page not found</h1>
      <p className="text-slate-400 mb-8">The page you're looking for doesn't exist or has moved.</p>
      <Link
        to="/"
        className="inline-block bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold px-6 py-3 rounded-lg transition-colors"
      >
        Back to home
      </Link>
    </div>
  )
}
