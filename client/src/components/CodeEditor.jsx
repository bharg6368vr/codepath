import { useState } from 'react'
import Editor from '@monaco-editor/react'
import client from '../api/client'

const MONACO_LANG = {
  python: 'python',
  java: 'java',
  cpp: 'cpp',
  c: 'c',
}

export default function CodeEditor({ language, starterCode = '', height = '320px', showStdin = true }) {
  const [code, setCode] = useState(starterCode)
  const [stdin, setStdin] = useState('')
  const [output, setOutput] = useState(null)
  const [running, setRunning] = useState(false)
  const [error, setError] = useState('')

  const runCode = async () => {
    setRunning(true)
    setError('')
    setOutput(null)
    try {
      const { data } = await client.post('/compiler/run', { language, code, stdin })
      setOutput(data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to run code')
    } finally {
      setRunning(false)
    }
  }

  return (
    <div className="border border-slate-700 rounded-lg overflow-hidden bg-slate-900">
      <div className="flex items-center justify-between bg-slate-800 px-3 py-2">
        <span className="text-xs uppercase tracking-wide text-slate-400">{language}</span>
        <button
          onClick={runCode}
          disabled={running}
          className="btn-primary py-1 px-3 text-sm"
        >
          {running && <span className="spinner" />}
          {running ? 'Running...' : 'Run ▶'}
        </button>
      </div>
      <Editor
        height={height}
        language={MONACO_LANG[language] || 'plaintext'}
        theme="vs-dark"
        value={code}
        onChange={(v) => setCode(v ?? '')}
        options={{ fontSize: 14, minimap: { enabled: false }, scrollBeyondLastLine: false }}
      />
      {showStdin && (
        <div className="border-t border-slate-700 p-3">
          <label className="text-xs text-slate-400">stdin (optional)</label>
          <textarea
            className="w-full mt-1 bg-slate-950 text-slate-100 text-sm rounded p-2 font-mono"
            rows={2}
            value={stdin}
            onChange={(e) => setStdin(e.target.value)}
          />
        </div>
      )}
      {(output || error) && (
        <div className="border-t border-slate-700 p-3 bg-slate-950 font-mono text-sm">
          {error && <div className="text-red-400">{error}</div>}
          {output && (
            <>
              {output.stdout && <pre className="text-emerald-300 whitespace-pre-wrap">{output.stdout}</pre>}
              {output.stderr && <pre className="text-red-400 whitespace-pre-wrap">{output.stderr}</pre>}
              {!output.stdout && !output.stderr && (
                <div className="text-slate-500 italic">(no output)</div>
              )}
              {output.time != null && (
                <div className="text-slate-500 text-xs mt-1">Executed in {output.time}ms</div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
