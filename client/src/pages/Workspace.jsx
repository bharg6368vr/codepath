import { useEffect, useState } from 'react'
import client from '../api/client'
import CodeEditor from '../components/CodeEditor'
import CodeReviewPanel from '../components/CodeReviewPanel'

const LANGUAGES = [
  { id: 'python', name: 'Python' },
  { id: 'java', name: 'Java' },
  { id: 'cpp', name: 'C++' },
  { id: 'c', name: 'C' },
]

export default function Workspace() {
  const [language, setLanguage] = useState('python')
  const [problems, setProblems] = useState([])
  const [activeProblem, setActiveProblem] = useState(null)
  const [showReview, setShowReview] = useState(false)

  useEffect(() => {
    setActiveProblem(null)
    client.get(`/compiler/problems/${language}`)
      .then((res) => setProblems(res.data))
      .catch(() => setProblems([]))
  }, [language])

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-slate-100 mb-1">Coding Workspace</h1>
      <p className="text-slate-400 text-sm mb-8">Write, run, and test code in any of the four languages — no course required.</p>

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
        <aside>
          <label htmlFor="language" className="field-label">Language</label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="field-input mb-5"
          >
            {LANGUAGES.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>

          <h3 className="text-slate-200 font-semibold mb-2 text-sm uppercase tracking-wide">Practice problems</h3>
          <div className="space-y-1">
            <button
              onClick={() => setActiveProblem(null)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${!activeProblem ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-300 hover:bg-slate-800'}`}
            >
              Blank editor
            </button>
            {problems.map((p) => (
              <button
                key={p.id}
                onClick={() => setActiveProblem(p)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${activeProblem?.id === p.id ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-300 hover:bg-slate-800'}`}
              >
                {p.title}
              </button>
            ))}
          </div>

          <div className="pt-4 mt-6 border-t border-slate-800">
            <button
              onClick={() => setShowReview(true)}
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition shadow-md shadow-emerald-500/5"
            >
              <span>🔍</span>
              <span>AI Code Review & Debug</span>
            </button>
          </div>
        </aside>

        <main>
          {activeProblem && (
            <div className="card p-4 mb-4">
              <h2 className="text-lg font-semibold text-slate-100">{activeProblem.title}</h2>
              <p className="text-slate-300 text-sm mt-1">{activeProblem.description}</p>
              <div className="mt-2 text-xs text-slate-400 font-mono space-y-0.5">
                <div>Sample input: {activeProblem.sampleInput || '(none)'}</div>
                <div>Sample output: {activeProblem.sampleOutput}</div>
              </div>
            </div>
          )}
          <CodeEditor
            key={`${language}-${activeProblem?.id || 'blank'}`}
            language={language}
            starterCode={activeProblem?.starterCode || ''}
            height="420px"
          />
        </main>
      </div>

      <CodeReviewPanel
        isOpen={showReview}
        onClose={() => setShowReview(false)}
      />
    </div>
  )
}
