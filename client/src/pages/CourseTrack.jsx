import { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import client from '../api/client'
import CodeEditor from '../components/CodeEditor'
import PageLoader from '../components/PageLoader'
import VideoLessonPlayer from '../components/VideoLessonPlayer'
import InteractiveVisualAnimator from '../components/InteractiveVisualAnimator'
import BookmarksPanel from '../components/BookmarksPanel'
import NotesPanel from '../components/NotesPanel'
import CodeReviewPanel from '../components/CodeReviewPanel'
import { notifyProgressUpdate } from '../utils/events'

export default function CourseTrack() {
  const { languageId } = useParams()
  const [modules, setModules] = useState([])
  const [activeIdx, setActiveIdx] = useState(0)
  const [pageIdx, setPageIdx] = useState(0)
  const [completed, setCompleted] = useState([])
  const [loading, setLoading] = useState(true)
  const [lessonTab, setLessonTab] = useState('video') // 'video' | 'animator' | 'reading' | 'practice'
  const [showBookmarks, setShowBookmarks] = useState(false)
  const [showNotes, setShowNotes] = useState(false)
  const [showCodeReview, setShowCodeReview] = useState(false)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      client.get(`/languages/${languageId}/modules`),
      client.get(`/progress/${languageId}`),
    ]).then(([modsRes, progRes]) => {
      setModules(modsRes.data)
      setCompleted(progRes.data.completedModuleIds || [])
    }).finally(() => setLoading(false))
  }, [languageId])

  const active = modules[activeIdx]
  const pages = active?.pages?.length ? active.pages : [{ title: active?.title, markdown: active?.explanationMarkdown || '' }]
  const activePage = pages[pageIdx] || pages[0]
  const isLastPage = pageIdx === pages.length - 1

  const allDone = useMemo(
    () => modules.length > 0 && modules.every((m) => completed.includes(m.id)),
    [modules, completed]
  )

  const selectModule = (i) => {
    setActiveIdx(i)
    setPageIdx(0)
  }

  const markComplete = async (moduleId) => {
    await client.post(`/progress/${languageId}/complete-module/${moduleId}`)
    setCompleted((prev) => (prev.includes(moduleId) ? prev : [...prev, moduleId]))
    notifyProgressUpdate()
  }

  if (loading) return <PageLoader label="Loading course..." />
  if (!active) return <div className="text-center py-20 text-slate-400">No modules found.</div>

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8">
      <aside className="space-y-1">
        <div className="mb-4">
          <div className="text-xs text-slate-400 mb-1">
            {completed.length}/{modules.length} modules complete
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500"
              style={{ width: `${(completed.length / modules.length) * 100}%` }}
            />
          </div>
        </div>
        {modules.map((m, i) => (
          <button
            key={m.id}
            onClick={() => selectModule(i)}
            className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center gap-2 transition-colors ${
              i === activeIdx ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span>{completed.includes(m.id) ? '✅' : '○'}</span>
            <span>{m.order}. {m.title}</span>
          </button>
        ))}

        {allDone && (
          <Link to={`/quiz/${languageId}`} className="btn-primary w-full mt-4">
            Take the quiz →
          </Link>
        )}

        {/* Study Tools Toolbar */}
        <div className="pt-4 mt-4 border-t border-slate-800 space-y-1.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-1 mb-2">Study Tools</p>
          <button
            onClick={() => setShowNotes(true)}
            className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 flex items-center justify-between cursor-pointer transition"
          >
            <span className="flex items-center gap-2"><span>📝</span> My Notes</span>
            <span className="text-[10px] text-purple-400 font-bold">Open</span>
          </button>
          <button
            onClick={() => setShowBookmarks(true)}
            className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 flex items-center justify-between cursor-pointer transition"
          >
            <span className="flex items-center gap-2"><span>📌</span> Bookmarks</span>
            <span className="text-[10px] text-blue-400 font-bold">Open</span>
          </button>
          <button
            onClick={() => setShowCodeReview(true)}
            className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 flex items-center justify-between cursor-pointer transition"
          >
            <span className="flex items-center gap-2"><span>🔍</span> AI Code Review</span>
            <span className="text-[10px] text-emerald-400 font-bold">AI</span>
          </button>
        </div>
      </aside>

      <main>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">{active.title}</h1>
            <p className="text-slate-500 text-xs mt-0.5">Module {active.order || activeIdx + 1} of {modules.length}</p>
          </div>

          {/* Lesson Mode Switcher Tabs */}
          <div className="flex flex-wrap items-center gap-1 bg-slate-900 p-1 rounded-2xl border border-slate-800 self-start sm:self-auto">
            <button
              onClick={() => setLessonTab('video')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                lessonTab === 'video'
                  ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>📺</span>
              <span>Video Lesson</span>
            </button>
            <button
              onClick={() => setLessonTab('animator')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                lessonTab === 'animator'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>✨</span>
              <span>Visual Animator</span>
            </button>
            <button
              onClick={() => setLessonTab('reading')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                lessonTab === 'reading'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>📖</span>
              <span>Reading Notes</span>
            </button>
            <button
              onClick={() => setLessonTab('practice')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                lessonTab === 'practice'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>💻</span>
              <span>Practice Code</span>
            </button>
          </div>
        </div>

        {/* --- TAB 1: VIDEO LESSON --- */}
        {lessonTab === 'video' && (
          <VideoLessonPlayer
            languageId={languageId}
            moduleOrder={active.order || activeIdx + 1}
            moduleTitle={active.title}
          />
        )}

        {/* --- TAB 2: INTERACTIVE VISUAL ANIMATOR --- */}
        {lessonTab === 'animator' && (
          <InteractiveVisualAnimator
            languageId={languageId}
            moduleTitle={active.title}
          />
        )}

        {/* --- TAB 2: READING NOTES --- */}
        {lessonTab === 'reading' && (
          <div className="animate-fade-in-up space-y-4">
            <p className="text-slate-500 text-xs">Page {pageIdx + 1} of {pages.length} — {activePage.title}</p>

            {pages.length > 1 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {pages.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => setPageIdx(i)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      i === pageIdx
                        ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300'
                        : 'border-slate-700 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {i + 1}. {p.title}
                  </button>
                ))}
              </div>
            )}

            <div className="prose-content text-slate-300">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{activePage.markdown}</ReactMarkdown>
            </div>

            <div className="flex items-center justify-between mt-6">
              <button
                disabled={pageIdx === 0}
                onClick={() => setPageIdx((i) => i - 1)}
                className="btn-ghost text-sm disabled:opacity-30"
              >
                ← Previous page
              </button>
              <button
                disabled={isLastPage}
                onClick={() => setPageIdx((i) => i + 1)}
                className="btn-ghost text-sm disabled:opacity-30"
              >
                Next page →
              </button>
            </div>
          </div>
        )}

        {/* --- TAB 3: PRACTICE CODE & EXERCISES --- */}
        {lessonTab === 'practice' && (
          <div className="animate-fade-in-up space-y-6">
            {active.tryItYourself?.length > 0 ? (
              active.tryItYourself.map((snippet, i) => (
                <div key={i} className="my-4">
                  <h3 className="text-slate-200 font-medium mb-2">Practice Exercise: {snippet.prompt}</h3>
                  <CodeEditor language={languageId} starterCode={snippet.starterCode} height="280px" />
                </div>
              ))
            ) : (
              <div className="my-4">
                <h3 className="text-slate-200 font-medium mb-2">Interactive Code Playground for {active.title}</h3>
                <CodeEditor language={languageId} starterCode={`// Practice your code for ${active.title} here!\n`} height="280px" />
              </div>
            )}
          </div>
        )}

        {/* --- KEY TAKEAWAYS & EXAMPLES (AVAILABLE IN ALL MODES) --- */}
        {active.keyTakeaways?.length > 0 && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 my-6">
            <h3 className="text-emerald-400 font-bold text-sm mb-2 flex items-center gap-2">
              <span>📌</span>
              <span>Key Takeaways for {active.title}</span>
            </h3>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-300 text-sm">
              {active.keyTakeaways.map((k, i) => <li key={i}>{k}</li>)}
            </ul>
          </div>
        )}

        {active.codeExamples?.map((ex, i) => (
          <div key={i} className="my-6 card p-5 border border-slate-800">
            <h3 className="text-slate-200 font-bold text-sm mb-2">{ex.title || `Example ${i + 1}`}</h3>
            <pre className="prose-content p-3 bg-slate-950 rounded-xl text-emerald-300"><code>{ex.code}</code></pre>
            {ex.explanation && <p className="text-slate-400 text-xs mt-2 leading-relaxed">{ex.explanation}</p>}
          </div>
        ))}

        <div className="flex items-center justify-between mt-8 border-t border-slate-800 pt-6">
          <button
            disabled={activeIdx === 0}
            onClick={() => selectModule(activeIdx - 1)}
            className="text-slate-400 hover:text-slate-100 disabled:opacity-30"
          >
            ← Previous module
          </button>
          <button
            onClick={() => markComplete(active.id)}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              completed.includes(active.id)
                ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-900'
            }`}
          >
            {completed.includes(active.id) ? 'Completed ✓' : 'Mark as complete'}
          </button>
          <button
            disabled={activeIdx === modules.length - 1}
            onClick={() => selectModule(activeIdx + 1)}
            className="text-slate-400 hover:text-slate-100 disabled:opacity-30"
          >
            Next module →
          </button>
        </div>
      </main>

      {/* Floating Side Panels */}
      <BookmarksPanel
        moduleId={active?.id}
        isOpen={showBookmarks}
        onClose={() => setShowBookmarks(false)}
      />

      <NotesPanel
        moduleId={active?.id}
        isOpen={showNotes}
        onClose={() => setShowNotes(false)}
      />

      <CodeReviewPanel
        isOpen={showCodeReview}
        onClose={() => setShowCodeReview(false)}
      />
    </div>
  )
}
