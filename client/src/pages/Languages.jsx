import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import client from '../api/client'
import PageLoader from '../components/PageLoader'

const ICONS = { python: '🐍', java: '☕', cpp: '⚙️', c: '🔧' }

const FALLBACK_LANGUAGES = [
  { id: 'python', name: 'Python', description: 'Clean syntax, dynamic typing, and massive real-world ecosystem from automation to AI.', moduleCount: 5 },
  { id: 'java', name: 'Java', description: 'Object-oriented, statically typed, platform independent through the JVM. Industry enterprise standard.', moduleCount: 5 },
  { id: 'cpp', name: 'C++', description: 'High performance, low-level memory control, STL, and systems-level engineering power.', moduleCount: 5 },
  { id: 'c', name: 'C', description: 'The foundation of modern computing — memory addresses, pointers, structs, and hardware proximity.', moduleCount: 5 },
]

export default function Languages() {
  const [languages, setLanguages] = useState([])
  const [loading, setLoading] = useState(true)
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    client.get('/languages')
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setLanguages(res.data)
        } else {
          setLanguages(FALLBACK_LANGUAGES)
        }
      })
      .catch(() => {
        setLanguages(FALLBACK_LANGUAGES)
        setIsOffline(true)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <PageLoader label="Loading languages..." />

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      {isOffline && (
        <div className="mb-6 p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
          <span>✨ <strong>Static Demo Mode:</strong> Browsing curriculum and lessons. Run <code className="bg-slate-800 px-1 py-0.5 rounded">start.bat</code> locally or connect a live backend for online code compilation.</span>
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 mb-2">Choose a Language Track</h1>
          <p className="text-slate-400">Learn visually with curated video lessons, structured notes, and live interactive coding.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 rounded-full self-start sm:self-auto">
          <span>📺 HD Video Lessons Included</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {languages.map((lang) => (
          <Link
            key={lang.id}
            to={`/course/${lang.id}`}
            className="card p-6 hover:border-emerald-400/50 hover:bg-slate-900 transition-all group relative overflow-hidden"
          >
            <div className="flex items-start justify-between">
              <div className="text-4xl mb-3 transition-transform group-hover:scale-110">{ICONS[lang.id] || '💻'}</div>
              <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full font-bold uppercase">
                📺 Video + Practice
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">{lang.name}</h2>
            <p className="text-slate-400 text-sm mt-1 leading-relaxed">{lang.description}</p>
            
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800 text-xs">
              <span className="text-emerald-400 font-medium">📚 {lang.moduleCount} Interactive Modules</span>
              <span className="text-slate-400 font-semibold group-hover:text-white transition-colors">Start Learning →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
