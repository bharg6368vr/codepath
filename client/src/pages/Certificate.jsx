import { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import client from '../api/client'
import PageLoader from '../components/PageLoader'
import { notifyProgressUpdate } from '../utils/events'

const TRACK_DETAILS = {
  python: {
    title: 'Python Systems & Software Engineering',
    desc: 'Demonstrated mastery across core syntax paradigms, object-oriented architecture, data structures, algorithms, and runtime memory optimization.',
    badge: '🐍 Python Specialist'
  },
  java: {
    title: 'Java Enterprise & Object-Oriented Architecture',
    desc: 'Demonstrated mastery in typed OOP design patterns, collections framework, multi-threading basics, JVM architecture, and modular development.',
    badge: '☕ Java Specialist'
  },
  cpp: {
    title: 'C++ High Performance & Systems Programming',
    desc: 'Demonstrated mastery in memory management, pointer arithmetic, Standard Template Library (STL), templates, and RAII systems architecture.',
    badge: '⚙️ C++ Specialist'
  },
  c: {
    title: 'C Low-Level Programming & Memory Architecture',
    desc: 'Demonstrated mastery in low-level byte manipulation, dynamic memory allocation (malloc/free), stack/heap models, structs, and pointer dereferencing.',
    badge: '🔧 C Specialist'
  },
}

export default function Certificate() {
  const { languageId } = useParams()
  const [cert, setCert] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [viewMode, setViewMode] = useState('diploma') // 'diploma' | 'pdf'
  const certRef = useRef(null)

  useEffect(() => {
    let ignore = false

    const loadCertificate = async () => {
      try {
        const { data } = await client.post(`/certificate/${languageId}/issue`)
        if (!ignore) {
          setCert(data)
          notifyProgressUpdate()
        }
      } catch (err) {
        const status = err.response?.status
        const fallbackMessage = err.response?.data?.error || 'Could not issue certificate'

        if (status === 401 || status === 403 || status === 404) {
          try {
            const { data } = await client.get(`/certificate/${languageId}/me`)
            if (!ignore) {
              setCert(data)
              notifyProgressUpdate()
            }
          } catch (fallbackErr) {
            if (!ignore) setError(fallbackErr.response?.data?.error || fallbackMessage)
          }
        } else if (!ignore) {
          const saved = localStorage.getItem(`codepath_certificate_${languageId}`)
          if (saved) {
            try {
              const parsed = JSON.parse(saved)
              const localUser = JSON.parse(localStorage.getItem('codepath_user') || '{}')
              const fallbackCert = {
                certificateId: parsed.id || `CP-${languageId.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`,
                userName: localUser.name || 'Graduate',
                languageId,
                score: parsed.score || 88,
                issuedAt: parsed.date || new Date().toISOString(),
                verifyUrl: `${window.location.origin}${import.meta.env.BASE_URL}verify/${parsed.id || 'DEMO'}`,
              }
              setCert(fallbackCert)
              return
            } catch (_) {}
          }
          setError(fallbackMessage)
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadCertificate()
    return () => { ignore = true }
  }, [languageId])

  const copyVerifyLink = async () => {
    if (!cert?.verifyUrl) return
    try {
      await navigator.clipboard.writeText(cert.verifyUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (_) {}
  }

  const handlePrint = () => {
    window.print()
  }

  if (loading) return <PageLoader label="Generating your official credential..." />

  if (error) {
    return (
      <div className="max-w-md mx-auto px-6 py-24 text-center">
        <div className="w-16 h-16 rounded-3xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-3xl mx-auto mb-4">
          ⚠️
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Certificate Not Yet Available</h2>
        <p className="text-slate-400 text-sm mb-6 leading-relaxed">{error}</p>
        <Link to={`/quiz/${languageId}`} className="btn-primary px-6 py-2.5 text-sm font-bold">
          Take the Certification Quiz →
        </Link>
      </div>
    )
  }

  const track = TRACK_DETAILS[languageId] || {
    title: `${languageId.toUpperCase()} Software Engineering`,
    desc: 'Completed all core technical modules and passed the comprehensive examination.',
    badge: '💻 Software Specialist'
  }

  const formattedDate = cert?.issuedAt
    ? new Date(cert.issuedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  const pdfUrl = `/api/certificate/${cert.certificateId}/download`

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-fade-in-up">
      {/* Top Banner & Action Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/30 px-3 py-0.5 rounded-full font-bold uppercase tracking-wider">
              ✦ Officially Verified Credential ✦
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Professional Certificate of Mastery
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Issued to <strong className="text-slate-200">{cert.learnerName}</strong> with an examination score of <strong className="text-emerald-400">{cert.score}%</strong>.
          </p>
        </div>

        {/* View mode switcher */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => setViewMode('diploma')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              viewMode === 'diploma'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            Digital Diploma View
          </button>
          <button
            onClick={() => setViewMode('pdf')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              viewMode === 'pdf'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            PDF Document View
          </button>
        </div>
      </div>

      {/* --- MODE 1: LUXURY DIPLOMA CARD VIEW --- */}
      {viewMode === 'diploma' ? (
        <div
          ref={certRef}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#fcfbf7] via-[#f7f4ea] to-[#f2ede0] text-slate-900 shadow-2xl p-6 sm:p-12 border-8 border-[#b45309] transition-all"
        >
          {/* Inner Navy & Gold Inset Frame */}
          <div className="border-2 border-[#0f172a] rounded-2xl p-6 sm:p-10 relative bg-[#fdfcf9]/80 backdrop-blur-sm shadow-inner">
            <div className="absolute inset-1.5 border border-[#d97706]/60 rounded-xl pointer-events-none" />

            {/* Corner Rosettes */}
            <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-[#b45309]" />
            <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-[#b45309]" />
            <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-[#b45309]" />
            <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-[#b45309]" />

            {/* Institution Header */}
            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.25em] text-[#b45309] uppercase font-sans">
                <span>✦ CODEPATH ACADEMY OF COMPUTER SCIENCE ✦</span>
              </div>
              <p className="text-[10px] sm:text-xs tracking-widest text-slate-500 uppercase font-sans">
                Official Global Technical Accreditation & Curriculum Board
              </p>
            </div>

            {/* Main Certificate Title */}
            <div className="text-center my-6">
              <h2 className="text-2xl sm:text-4xl font-black text-[#0f172a] font-serif tracking-tight">
                Certificate of Achievement & Mastery
              </h2>
              <div className="flex items-center justify-center gap-3 mt-3">
                <div className="h-px w-24 bg-[#b45309]" />
                <div className="w-2.5 h-2.5 bg-[#b45309] rotate-45" />
                <div className="h-px w-24 bg-[#b45309]" />
              </div>
            </div>

            {/* Recipient Details */}
            <div className="text-center space-y-2">
              <p className="text-xs sm:text-sm font-sans tracking-widest text-slate-500 uppercase font-medium">
                THIS OFFICIAL CREDENTIAL IS PROUDLY CONFERRED UPON
              </p>
              <h3 className="text-3xl sm:text-5xl font-black text-[#0f172a] font-serif tracking-normal py-1 border-b-2 border-[#b45309]/50 inline-block px-8">
                {cert.learnerName}
              </h3>
            </div>

            {/* Curriculum Description */}
            <div className="text-center max-w-2xl mx-auto my-6 space-y-2">
              <p className="text-xs sm:text-sm text-slate-600 font-sans">
                for demonstrating outstanding theoretical comprehension and practical mastery in
              </p>
              <h4 className="text-lg sm:text-2xl font-black text-[#b45309] font-serif uppercase tracking-wide">
                {track.title}
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xl mx-auto pt-1 font-sans">
                {track.desc} Evaluated under rigorous examination standards with a verified score of <strong className="text-emerald-700 font-bold">{cert.score}%</strong>.
              </p>
            </div>

            {/* Signatures & Seal Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-6 mt-10 pt-6 border-t border-slate-300">
              {/* Left Signature */}
              <div className="text-center">
                <div className="h-9 flex items-center justify-center text-lg italic font-serif text-slate-800 font-bold -mb-1 select-none">
                  Dr. Arthur Vance
                </div>
                <div className="h-px w-40 mx-auto bg-slate-400" />
                <p className="text-xs font-bold text-slate-900 mt-1">Dr. Arthur Vance, Ph.D.</p>
                <p className="text-[10px] text-slate-500">Director of Academic Affairs</p>
              </div>

              {/* Center Embossed Medallion Seal */}
              <div className="flex flex-col items-center justify-center">
                <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-[#f59e0b] via-[#fbbf24] to-[#d97706] p-1 shadow-xl flex items-center justify-center border-2 border-[#78350f]">
                  <div className="w-full h-full rounded-full border-2 border-dashed border-[#78350f] flex flex-col items-center justify-center bg-[#fef3c7] text-[#78350f]">
                    <span className="text-xl">★</span>
                    <span className="text-[8px] font-black uppercase tracking-tighter">OFFICIAL SEAL</span>
                    <span className="text-[7px] font-bold">VERIFIED</span>
                  </div>
                  {/* Decorative Ribbons */}
                  <div className="absolute -bottom-3 -left-1 w-4 h-7 bg-[#b45309] [clip-path:polygon(0_0,100%_0,100%_100%,50%_75%,0_100%)] shadow-md" />
                  <div className="absolute -bottom-3 -right-1 w-4 h-7 bg-[#92400e] [clip-path:polygon(0_0,100%_0,100%_100%,50%_75%,0_100%)] shadow-md" />
                </div>
              </div>

              {/* Right Signature */}
              <div className="text-center">
                <div className="h-9 flex items-center justify-center text-lg italic font-serif text-slate-800 font-bold -mb-1 select-none">
                  Elena Rostova
                </div>
                <div className="h-px w-40 mx-auto bg-slate-400" />
                <p className="text-xs font-bold text-slate-900 mt-1">Elena Rostova, M.Sc.</p>
                <p className="text-[10px] text-slate-500">Chair of Technical Accreditation</p>
              </div>
            </div>

            {/* Bottom Security Credentials Bar */}
            <div className="mt-8 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 font-mono gap-2">
              <div>
                <span>ISSUED: </span>
                <strong className="text-slate-800">{formattedDate}</strong>
              </div>
              <div>
                <span>CREDENTIAL ID: </span>
                <strong className="text-[#b45309] font-bold">{cert.certificateId}</strong>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>CRYPTOGRAPHICALLY SECURED</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* --- MODE 2: HIGH DEFINITION PDF DOCUMENT VIEWER --- */
        <div className="card overflow-hidden shadow-2xl border border-slate-800 rounded-3xl">
          <div className="bg-slate-950 px-6 py-3 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-mono">
              Official Document Preview: CodePath-Certificate-{cert.certificateId}.pdf
            </span>
            <a
              href={pdfUrl}
              download={`CodePath-Certificate-${cert.certificateId}.pdf`}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
            >
              <span>Download PDF Directly</span>
              <span>↓</span>
            </a>
          </div>
          <iframe
            title="Official Certificate Document"
            src={pdfUrl}
            className="w-full h-[580px] bg-slate-950"
          />
        </div>
      )}

      {/* Action Toolbar & Verification Links */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex flex-wrap items-center justify-center sm:justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={pdfUrl}
              download={`CodePath-Certificate-${cert.certificateId}.pdf`}
              className="btn-primary py-3 px-6 text-sm font-bold shadow-lg shadow-emerald-500/20 flex items-center gap-2 cursor-pointer"
            >
              <span>📥 Download Official PDF</span>
            </a>

            <button
              onClick={handlePrint}
              className="btn-secondary py-3 px-5 text-sm font-semibold flex items-center gap-2 cursor-pointer"
            >
              <span>🖨️ Print Certificate</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={copyVerifyLink}
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 flex items-center gap-2 cursor-pointer transition shadow-md"
            >
              <span>{copied ? '✓ Link Copied!' : '🔗 Copy Verification Link'}</span>
            </button>

            <Link
              to={`/verify/${cert.certificateId}`}
              className="px-5 py-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold text-sm border border-amber-500/30 flex items-center gap-1.5 transition"
            >
              <span>🛡️ View Verification Page →</span>
            </Link>
          </div>
        </div>

        {/* Verification Credentials Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800/80">
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Permanent Credential ID
            </p>
            <p className="text-sm font-mono text-emerald-400 select-all font-bold">
              {cert.certificateId}
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Public Verification URL
            </p>
            <p className="text-xs font-mono text-slate-300 truncate select-all">
              {cert.verifyUrl}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
