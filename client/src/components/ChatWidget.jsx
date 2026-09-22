import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import client from '../api/client'
import { useAuth } from '../context/AuthContext'

const LANGUAGE_LABELS = { python: 'Python', java: 'Java', cpp: 'C++', c: 'C' }

function detectLanguageFromPath(pathname) {
  const match = pathname.match(/^\/(course|quiz|certificate)\/([a-z]+)/)
  return match ? match[2] : null
}

export default function ChatWidget() {
  const { user } = useAuth()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const scrollRef = useRef(null)

  const languageId = detectLanguageFromPath(location.pathname)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, open, sending])

  if (!user) return null

  const send = async () => {
    const text = input.trim()
    if (!text || sending) return
    const nextMessages = [...messages, { role: 'user', content: text }]
    setMessages(nextMessages)
    setInput('')
    setSending(true)
    setError('')
    try {
      const { data } = await client.post('/chat/ask', { messages: nextMessages, languageId })
      setMessages((m) => [...m, { role: 'assistant', content: data.reply }])
    } catch (err) {
      setError(err.response?.data?.error || 'Could not reach the study buddy')
    } finally {
      setSending(false)
    }
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-40 h-14 w-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 shadow-lg shadow-emerald-500/30 flex items-center justify-center text-2xl transition-transform hover:scale-105"
        aria-label={open ? 'Close study buddy chat' : 'Ask the study buddy a question'}
      >
        {open ? '✕' : '💬'}
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-40 w-[min(380px,calc(100vw-2.5rem))] h-[min(560px,calc(100vh-8rem))] card bg-slate-900 shadow-2xl flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-800 bg-slate-950/60 shrink-0">
            <p className="text-slate-100 font-semibold text-sm">Study Buddy</p>
            <p className="text-slate-500 text-xs">
              Ask about theory, code, or errors{languageId ? ` · ${LANGUAGE_LABELS[languageId]} context` : ''}
            </p>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.length === 0 && (
              <p className="text-slate-500 text-sm">
                Hi! Ask me anything about Python, Java, C++, or C — theory, your own code, or an error
                message you're stuck on.
              </p>
            )}
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                <div
                  className={`inline-block text-left rounded-lg px-3 py-2 max-w-[90%] text-sm ${
                    m.role === 'user' ? 'bg-emerald-500/15 text-emerald-100' : 'bg-slate-800 text-slate-200'
                  }`}
                >
                  {m.role === 'assistant' ? (
                    <div className="prose-content prose-chat">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{m.content}</p>
                  )}
                </div>
              </div>
            ))}
            {sending && (
              <p className="text-slate-500 text-xs flex items-center gap-1.5">
                <span className="spinner" />Thinking...
              </p>
            )}
          </div>

          {error && <p role="alert" className="text-red-400 text-xs px-4 pb-1 shrink-0">{error}</p>}

          <div className="border-t border-slate-800 p-3 flex gap-2 shrink-0">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Ask a question..."
              rows={1}
              className="field-input resize-none flex-1 text-sm"
            />
            <button onClick={send} disabled={sending || !input.trim()} className="btn-primary px-3 text-sm">
              Send
            </button>
          </div>
        </div>
      )}
    </>
  )
}
