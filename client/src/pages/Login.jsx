import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await login(email, password)
      navigate('/languages')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="max-w-sm mx-auto px-6 py-20">
      <h1 className="text-2xl font-bold text-slate-100 mb-1">Welcome back</h1>
      <p className="text-slate-400 text-sm mb-6">Log in to continue your progress.</p>
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="email" className="field-label">Email</label>
          <input
            id="email" type="email" required autoComplete="email" placeholder="you@example.com"
            value={email} onChange={(e) => setEmail(e.target.value)} className="field-input"
          />
        </div>
        <div>
          <label htmlFor="password" className="field-label">Password</label>
          <input
            id="password" type="password" required autoComplete="current-password" placeholder="••••••••"
            value={password} onChange={(e) => setPassword(e.target.value)} className="field-input"
          />
        </div>
        {error && <p role="alert" className="text-red-400 text-sm">{error}</p>}
        <button disabled={busy} className="btn-primary w-full py-2.5">
          {busy && <span className="spinner" />}
          {busy ? 'Logging in...' : 'Log in'}
        </button>
      </form>
      <p className="text-slate-400 text-sm mt-5">
        No account? <Link to="/signup" className="text-emerald-400 hover:text-emerald-300">Sign up</Link>
      </p>
    </div>
  )
}
