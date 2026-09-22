import React, { useState } from 'react';
import client from '../api/client';

export default function CodeReviewPanel({ isOpen, onClose }) {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [activeTab, setActiveTab] = useState('explain'); // explain, review, debug
  const [error, setError] = useState('');
  const [debugError, setDebugError] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const languages = ['python', 'java', 'cpp', 'c', 'javascript'];

  const handleExplainCode = async () => {
    if (!code.trim()) {
      setError('Please paste some code first!');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await client.post('/code-review/explain-code', {
        code,
        language
      });

      setResult({
        type: 'explanation',
        explanation: response.data.explanation,
        improvements: response.data.suggested_improvements,
        demoMode: response.data.demo_mode
      });
    } catch (err) {
      setError('Error explaining code. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCodeReview = async () => {
    if (!code.trim()) {
      setError('Please paste some code first!');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await client.post('/code-review/code-review', {
        code,
        language
      });

      setResult({
        type: 'review',
        review: response.data.review,
        score: response.data.score,
        demoMode: response.data.demo_mode
      });
    } catch (err) {
      setError('Error reviewing code. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDebugHelp = async () => {
    if (!code.trim() || !debugError.trim()) {
      setError('Please paste code and error message!');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await client.post('/code-review/debug-help', {
        code,
        error: debugError,
        language
      });

      setResult({
        type: 'debug',
        solution: response.data.solution,
        demoMode: response.data.demo_mode
      });
    } catch (err) {
      setError('Error getting debug help. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-up">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">💻</span>
            <h2 className="text-base font-bold text-white">AI Code Review & Debug Assistant</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg hover:bg-slate-800 w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer transition"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Left Side - Input */}
          <div className="flex-1 border-b md:border-b-0 md:border-r border-slate-800 p-5 overflow-y-auto space-y-4">
            {/* Language Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400"
              >
                {languages.map(lang => (
                  <option key={lang} value={lang}>{lang.toUpperCase()}</option>
                ))}
              </select>
            </div>

            {/* Code Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5">Your Code</label>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Paste your code snippet here..."
                rows={6}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl font-mono text-xs text-emerald-300 placeholder-slate-600 focus:outline-none focus:border-emerald-400 resize-none"
              />
            </div>

            {/* Debug Error (only for debug tab) */}
            {activeTab === 'debug' && (
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">Error Message / Stack Trace</label>
                <textarea
                  value={debugError}
                  onChange={(e) => setDebugError(e.target.value)}
                  placeholder="Paste the error message you are seeing..."
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl font-mono text-xs text-red-300 placeholder-slate-600 focus:outline-none focus:border-red-400 resize-none"
                />
              </div>
            )}

            {/* Tabs and Buttons */}
            <div className="space-y-3 pt-1">
              <div className="flex gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                {[
                  { id: 'explain', label: '📖 Explain' },
                  { id: 'review', label: '🔍 Review' },
                  { id: 'debug', label: '🐛 Debug' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  if (activeTab === 'explain') handleExplainCode();
                  else if (activeTab === 'review') handleCodeReview();
                  else handleDebugHelp();
                }}
                disabled={loading || !code.trim()}
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold rounded-xl transition text-xs cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                {loading ? 'Analyzing with AI...' : `Run ${activeTab.toUpperCase()} Analysis 🚀`}
              </button>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl">
                <p className="text-red-400 text-xs">{error}</p>
              </div>
            )}
          </div>

          {/* Right Side - Result */}
          <div className="flex-1 bg-slate-950/60 p-5 overflow-y-auto">
            {result ? (
              <div className="space-y-4">
                {result.demoMode && (
                  <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl text-xs text-amber-300">
                    💡 Local Analysis Mode — Add GEMINI_API_KEY for dynamic cloud AI intelligence.
                  </div>
                )}

                {result.type === 'explanation' && (
                  <>
                    <div className="space-y-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">📖 Explanation</h3>
                      <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">{result.explanation}</p>
                    </div>
                    {result.improvements && (
                      <div className="space-y-2 pt-2 border-t border-slate-800">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400">💡 Suggested Improvements</h3>
                        <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">{result.improvements}</p>
                      </div>
                    )}
                  </>
                )}

                {result.type === 'review' && (
                  <>
                    <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl flex items-center justify-between">
                      <span className="text-xs text-slate-300 font-medium">Quality Score:</span>
                      <span className="text-lg font-bold text-emerald-400">{result.score}/10</span>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400">🔍 Code Review</h3>
                      <p className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">{result.review}</p>
                    </div>
                  </>
                )}

                {result.type === 'debug' && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400">🐛 Debug Solution</h3>
                    <p className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed font-mono bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                      {result.solution}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 py-12">
                <span className="text-3xl mb-2 block">✨</span>
                <p className="text-xs font-semibold text-slate-300">Ready for Analysis</p>
                <p className="text-[11px] text-slate-500 mt-1 max-w-xs">
                  Paste your code on the left and choose Explain, Review, or Debug.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
