import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import client from '../api/client'
import PageLoader from '../components/PageLoader'
import { notifyProgressUpdate } from '../utils/events'

const LANGUAGE_LABELS = { python: 'Python', java: 'Java', cpp: 'C++', c: 'C' }

export default function Quiz() {
  const { languageId } = useParams()
  const navigate = useNavigate()
  const [attempt, setAttempt] = useState(null)
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const loadQuiz = () => {
    setLoading(true)
    setError('')
    setResult(null)
    setAnswers({})
    client.post(`/quiz/${languageId}/generate`)
      .then((res) => setAttempt(res.data))
      .catch((err) => setError(err.response?.data?.error || 'Failed to generate quiz'))
      .finally(() => setLoading(false))
  }

  useEffect(loadQuiz, [languageId])

  const submit = async () => {
    setSubmitting(true)
    try {
      const { data } = await client.post(`/quiz/${attempt.attemptId}/submit`, { answers })
      setResult(data)
      notifyProgressUpdate()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit quiz')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <PageLoader label="Generating your quiz..." />
  if (error && !attempt) return <p className="text-center py-20 text-red-400">{error}</p>

  if (result) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <h1 className="text-3xl font-bold text-slate-100 mb-2">
          {result.passed ? '🎉 You passed!' : 'Almost there'}
        </h1>
        <p className="text-slate-400 mb-6">
          Score: <span className="text-emerald-400 font-semibold">{result.score}%</span>
          {' '}(threshold: {result.passingThreshold}%)
        </p>
        <div className="space-y-3 text-left mb-8">
          {result.feedback.map((f, i) => (
            <div key={i} className={`border rounded-lg p-3 ${f.correct ? 'border-emerald-500/40 bg-emerald-500/10' : 'border-red-500/40 bg-red-500/10'}`}>
              <p className="text-slate-200 text-sm font-medium">{f.question}</p>
              <p className="text-slate-400 text-xs mt-1">Your answer: {f.userAnswer || '(blank)'}</p>
              <p className="text-slate-400 text-xs">{f.explanation}</p>
            </div>
          ))}
        </div>
        {result.passed ? (
          <button onClick={() => navigate(`/certificate/${languageId}`)} className="btn-primary px-6 py-3">
            Get your certificate →
          </button>
        ) : (
          <button onClick={loadQuiz} className="btn-secondary px-6 py-3">
            Retake quiz
          </button>
        )}
      </div>
    )
  }

  const answeredCount = Object.values(answers).filter((v) => v && v.trim?.() !== '').length

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-slate-100">{LANGUAGE_LABELS[languageId] || languageId} quiz</h1>
        <span className="text-xs text-slate-400">{answeredCount}/{attempt.questions.length} answered</span>
      </div>
      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-emerald-500 transition-all"
          style={{ width: `${(answeredCount / attempt.questions.length) * 100}%` }}
        />
      </div>
      <div className="space-y-6">
        {attempt.questions.map((q, i) => (
          <div key={q.id} className="card p-4">
            <p className="text-slate-100 font-medium mb-3">{i + 1}. {q.question}</p>
            {q.type === 'mcq' || q.type === 'true_false' ? (
              <div className="space-y-2">
                {q.options.map((opt, oi) => (
                  <label
                    key={oi}
                    className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm cursor-pointer border transition-colors ${
                      answers[q.id] === opt
                        ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-200'
                        : 'border-slate-800 text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <input
                      type="radio"
                      name={q.id}
                      className="accent-emerald-500"
                      checked={answers[q.id] === opt}
                      onChange={() => setAnswers((a) => ({ ...a, [q.id]: opt }))}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            ) : (
              <input
                type="text"
                value={answers[q.id] || ''}
                onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                placeholder="Your answer"
                className="field-input"
              />
            )}
          </div>
        ))}
      </div>
      {error && <p role="alert" className="text-red-400 text-sm mt-4">{error}</p>}
      <button onClick={submit} disabled={submitting} className="btn-primary mt-6 px-6 py-3">
        {submitting && <span className="spinner" />}
        {submitting ? 'Submitting...' : 'Submit quiz'}
      </button>
    </div>
  )
}
