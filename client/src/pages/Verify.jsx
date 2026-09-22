import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import client from '../api/client'
import PageLoader from '../components/PageLoader'

const LANGUAGE_LABELS = {
  python: 'Python Systems & Software Engineering',
  java: 'Java Enterprise & Object-Oriented Architecture',
  cpp: 'C++ High Performance & Systems Programming',
  c: 'C Low-Level Programming & Memory Architecture'
}

export default function Verify() {
  const { certificateId } = useParams()
  const [cert, setCert] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    client.get(`/certificate/${certificateId}`)
      .then((res) => setCert(res.data))
      .catch(() => setError('No valid credential found matching this identifier. The record may have expired or was typed incorrectly.'))
      .finally(() => setLoading(false))
  }, [certificateId])

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      {loading && <PageLoader label="Verifying digital certificate authenticity..." />}

      {!loading && error && (
        <div className="bg-slate-900 border border-red-500/30 rounded-3xl p-8 text-center shadow-2xl space-y-4 animate-fade-in-up">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-3xl mx-auto">
            ✕
          </div>
          <h2 className="text-xl font-bold text-white">Credential Verification Failed</h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">{error}</p>
          <div className="pt-2">
            <Link to="/" className="btn-secondary py-2.5 px-6 text-xs font-semibold">
              Return to CodePath Home →
            </Link>
          </div>
        </div>
      )}

      {!loading && cert && (
        <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 animate-fade-in-up text-center relative overflow-hidden">
          {/* Subtle green ambient glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Official Verification Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>✓ Verified Authenticity Guaranteed</span>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 tracking-widest uppercase">
              CodePath Academy of Computer Science
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Official Credential Record
            </h1>
          </div>

          {/* Recipient Card */}
          <div className="p-6 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-3">
            <p className="text-xs text-slate-400 uppercase tracking-wide">Recipient</p>
            <h3 className="text-2xl sm:text-3xl font-bold text-white font-serif">
              {cert.learnerName}
            </h3>
            <p className="text-sm text-slate-300">
              has completed all requirements for the
            </p>
            <p className="text-base sm:text-lg font-bold text-amber-400">
              {LANGUAGE_LABELS[cert.languageId] || cert.languageId} Track
            </p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 text-left">
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 font-medium block">Evaluation Score</span>
              <span className="text-xl font-bold text-emerald-400">{cert.score}% Passing</span>
            </div>
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <span className="text-[11px] text-slate-400 font-medium block">Issue Date</span>
              <span className="text-sm font-semibold text-white mt-1 block">
                {new Date(cert.issuedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
          </div>

          {/* Credential ID and Link Details */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 text-left space-y-2 text-xs font-mono">
            <div>
              <span className="text-slate-500">CREDENTIAL ID: </span>
              <span className="text-slate-200 select-all font-bold">{cert.certificateId}</span>
            </div>
            <div>
              <span className="text-slate-500">ACCREDITATION: </span>
              <span className="text-emerald-400 font-semibold">Active & Permanently Recorded</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href={`/api/certificate/${cert.certificateId}/download`}
              download={`CodePath-Certificate-${cert.certificateId}.pdf`}
              className="btn-primary py-2.5 px-6 text-xs font-bold"
            >
              Download PDF Document ↓
            </a>
            <Link to="/languages" className="btn-secondary py-2.5 px-5 text-xs font-semibold">
              Explore Courses →
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
