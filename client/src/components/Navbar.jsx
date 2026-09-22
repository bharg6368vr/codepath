import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NAV_LINKS = [
  { to: '/languages', label: 'Courses' },
  { to: '/videos', label: '📺 Videos' },
  { to: '/workspace', label: 'Workspace' },
  { to: '/arcade', label: '🕹️ Arcade' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/leaderboard', label: 'Leaderboard' },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const linkClass = ({ isActive }) =>
    `text-sm transition-colors ${
      isActive ? 'text-emerald-400 font-medium' : 'text-slate-300 hover:text-emerald-400'
    }`

  return (
    <nav className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-emerald-400">
          <span aria-hidden className="text-emerald-400">{'</>'}</span>
          CodePath
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-slate-400 text-sm">
                Hi, {user.name ? user.name.split(' ')[0] : 'Developer'}
              </span>
              <button
                onClick={() => {
                  logout()
                  navigate('/')
                }}
                className="btn-secondary py-1.5 px-3.5 text-sm"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <NavLink to="/login" className={linkClass}>Log in</NavLink>
              <Link to="/signup" className="btn-primary py-1.5 px-3.5 text-sm">Sign up</Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden text-slate-300 p-2 -mr-2"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-800 px-6 py-4 space-y-3 bg-slate-950">
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className="block text-slate-200 text-sm py-1 hover:text-emerald-400 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
          {user ? (
            <div className="pt-2 border-t border-slate-800/80 space-y-2">
              <p className="text-slate-400 text-xs px-1">
                Signed in as <strong className="text-slate-200">{user.name}</strong>
              </p>
              <button
                onClick={() => {
                  logout()
                  setMenuOpen(false)
                  navigate('/')
                }}
                className="btn-secondary w-full py-2 text-sm"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="flex gap-3 pt-2">
              <Link to="/login" className="btn-secondary flex-1 py-2 text-sm text-center" onClick={() => setMenuOpen(false)}>Log in</Link>
              <Link to="/signup" className="btn-primary flex-1 py-2 text-sm text-center" onClick={() => setMenuOpen(false)}>Sign up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}