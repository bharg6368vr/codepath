import { Link } from 'react-router-dom'
import InteractiveGreetingHero from '../components/InteractiveGreetingHero'

const LANGUAGES = [
  { icon: '🐍', name: 'Python' },
  { icon: '☕', name: 'Java' },
  { icon: '⚙️', name: 'C++' },
  { icon: '🔧', name: 'C' },
]

const FEATURES = [
  {
    icon: '📘',
    title: 'Structured tracks',
    body: 'Ten modules per language, from syntax basics through OOP, error handling, and memory management — read, then practice inline.',
  },
  {
    icon: '🧑‍💻',
    title: 'Live code editor',
    body: 'Monaco-powered editor (the engine behind VS Code) embedded in every module and in a standalone compiler workspace.',
  },
  {
    icon: '🤖',
    title: 'AI-generated quizzes',
    body: 'Each quiz is generated on the fly by an LLM grounded in the course content via retrieval — never the same static question bank.',
  },
  {
    icon: '🎓',
    title: 'Verifiable certificates',
    body: 'Pass the quiz and get a downloadable PDF certificate with a public verification link anyone can check.',
  },
]

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Interactive Conversation Guide */}
      <InteractiveGreetingHero />

      {/* Top Value Banner */}
      <div className="text-center pt-8 pb-12">
        <div className="inline-flex items-center gap-2 text-xs font-medium text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3.5 py-1 mb-5">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 -ml-3.5" />
          Self-paced · Zero infrastructure · Free to start
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-100">
          Master programming with <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">CodePath</span>
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Structured courses for Python, Java, C++, and C. Read interactive lessons, practice in an embedded Monaco editor, and earn verified certificates.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link to="/languages" className="btn-primary px-6 py-3">Explore All Courses →</Link>
          <Link to="/workspace" className="btn-secondary px-6 py-3">Open Compiler Workspace 💻</Link>
        </div>

        <div className="mt-12 flex justify-center gap-8 flex-wrap">
          {LANGUAGES.map((l) => (
            <div key={l.name} className="flex flex-col items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer group">
              <span className="text-3xl group-hover:scale-125 transition-transform">{l.icon}</span>
              <span className="text-xs font-medium">{l.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {FEATURES.map((f) => (
            <div key={f.title} className="card p-6">
              <span className="text-2xl">{f.icon}</span>
              <h3 className="text-slate-100 font-semibold mt-3">{f.title}</h3>
              <p className="text-slate-400 text-sm mt-1.5 leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
