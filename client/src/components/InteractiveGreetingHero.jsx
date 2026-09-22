import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const GOAL_OPTIONS = [
  { id: 'ai', icon: '🤖', title: 'AI & Data Science', lang: 'python', reason: 'Python is the #1 language for machine learning, data analysis, and AI development.' },
  { id: 'career', icon: '💼', title: 'Job Ready / Enterprise', lang: 'java', reason: 'Java powers backend enterprise systems, Android apps, and high-scale cloud platforms.' },
  { id: 'systems', icon: '⚙️', title: 'High Performance / Games', lang: 'cpp', reason: 'C++ gives you deep hardware control, game engine speeds, and powerful STL capabilities.' },
  { id: 'college', icon: '🧱', title: 'Core Fundamentals / College', lang: 'c', reason: 'C teaches pointers, memory models, and how computers actually work from the ground up.' },
  { id: 'hobby', icon: '💡', title: 'Beginner / Fun Projects', lang: 'python', reason: 'Python is intuitive, easy to read, and allows you to build real apps in hours.' },
];

const STYLE_OPTIONS = [
  { id: 'practice', icon: '⚡', label: 'Hands-on practice with live code snippets' },
  { id: 'theory', icon: '📖', label: 'Step-by-step concept explanations with examples' },
];

const LANG_DETAILS = {
  python: { name: 'Python', icon: '🐍', color: 'from-amber-500/20 to-emerald-500/20 border-emerald-500/40 text-emerald-400' },
  java: { name: 'Java', icon: '☕', color: 'from-amber-600/20 to-orange-500/20 border-orange-500/40 text-orange-400' },
  cpp: { name: 'C++', icon: '⚙️', color: 'from-blue-600/20 to-cyan-500/20 border-cyan-500/40 text-cyan-400' },
  c: { name: 'C Language', icon: '🔧', color: 'from-indigo-600/20 to-blue-500/20 border-blue-500/40 text-blue-400' },
};

export default function InteractiveGreetingHero() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: greeting/name, 2: goal, 3: style, 4: recommendation
  const [userName, setUserName] = useState('');
  const [inputName, setInputName] = useState('');
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (user?.name) {
      setUserName(user.name.split(' ')[0]);
    }
  }, [user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNameSubmit = (e) => {
    e?.preventDefault();
    if (!inputName.trim()) return;
    const name = inputName.trim();
    setUserName(name);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setStep(2);
    }, 600);
  };

  const handleGoalSelect = (goal) => {
    setSelectedGoal(goal);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setStep(3);
    }, 600);
  };

  const handleStyleSelect = (style) => {
    setSelectedStyle(style);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setStep(4);
    }, 700);
  };

  const handleReset = () => {
    setStep(1);
    setInputName('');
    setSelectedGoal(null);
    setSelectedStyle(null);
  };

  const recommendedLangId = selectedGoal?.lang || 'python';
  const recommendedLang = LANG_DETAILS[recommendedLangId] || LANG_DETAILS.python;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-2xl p-6 sm:p-8 my-8 text-left transition-all">
      {/* Decorative Glow Elements */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-glow" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none animate-glow" />

      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-xl shadow-lg shadow-emerald-500/20 animate-float">
              🤖
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              CodePath Interactive Guide
              <span className="text-[10px] uppercase tracking-wider font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                AI Companion
              </span>
            </h2>
            <p className="text-xs text-slate-400">Personalized coding tracks & real-time guidance</p>
          </div>
        </div>

        {user ? (
          <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full font-medium">
            Active Session
          </span>
        ) : (
          step > 1 && (
            <button
              onClick={handleReset}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 bg-slate-800/80 hover:bg-slate-800 px-3 py-1.5 rounded-lg transition cursor-pointer"
            >
              🔄 Restart
            </button>
          )
        )}
      </div>

      {/* --- LOGGED IN USER VIEW --- */}
      {user ? (
        <div className="space-y-6 animate-fade-in-up">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-lg shrink-0 mt-0.5">
              👋
            </div>
            <div className="space-y-2 max-w-xl">
              <div className="bg-slate-800/90 border border-slate-700/60 rounded-2xl rounded-tl-none p-4 text-sm text-slate-200 leading-relaxed shadow-md">
                <p className="font-semibold text-white text-base mb-1">
                  Hii! Hello, <span className="text-emerald-400 capitalize">{userName || 'Developer'}</span>! <span className="animate-wave">👋</span>
                </p>
                <p className="text-slate-300">
                  Welcome back to <strong>CodePath</strong>! Ready to sharpen your programming skills today?
                </p>
              </div>
            </div>
          </div>

          {/* Quick Action Navigation Grid */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Quick Shortcuts
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <button
                onClick={() => navigate('/arcade')}
                className="group p-4 bg-slate-800/70 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/50 rounded-xl transition text-left cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">🕹️</span>
                  <h4 className="text-white font-bold text-sm group-hover:text-amber-400 transition-colors">Play Arcade Games</h4>
                  <p className="text-xs text-slate-400 mt-1">Bug hunt, output blitz & block puzzles</p>
                </div>
                <span className="text-xs text-amber-400 font-semibold mt-3 flex items-center gap-1">
                  Play & Earn XP →
                </span>
              </button>

              <button
                onClick={() => navigate('/dashboard')}
                className="group p-4 bg-slate-800/70 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/50 rounded-xl transition text-left cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">📊</span>
                  <h4 className="text-white font-bold text-sm group-hover:text-emerald-400 transition-colors">My Dashboard</h4>
                  <p className="text-xs text-slate-400 mt-1">Track modules, streak & achievements</p>
                </div>
                <span className="text-xs text-emerald-400 font-semibold mt-3 flex items-center gap-1">
                  View Progress →
                </span>
              </button>

              <button
                onClick={() => navigate('/languages')}
                className="group p-4 bg-slate-800/70 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/50 rounded-xl transition text-left cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">📚</span>
                  <h4 className="text-white font-bold text-sm group-hover:text-emerald-400 transition-colors">Continue Courses</h4>
                  <p className="text-xs text-slate-400 mt-1">Python, Java, C++, and C tracks</p>
                </div>
                <span className="text-xs text-emerald-400 font-semibold mt-3 flex items-center gap-1">
                  Browse Tracks →
                </span>
              </button>

              <button
                onClick={() => navigate('/workspace')}
                className="group p-4 bg-slate-800/70 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/50 rounded-xl transition text-left cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">💻</span>
                  <h4 className="text-white font-bold text-sm group-hover:text-emerald-400 transition-colors">Online Compiler</h4>
                  <p className="text-xs text-slate-400 mt-1">Write, compile & test practice problems</p>
                </div>
                <span className="text-xs text-emerald-400 font-semibold mt-3 flex items-center gap-1">
                  Launch Editor →
                </span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* --- GUEST INTERACTIVE CONVERSATION FLOW --- */
        <div className="space-y-5">
          {/* Chat Stream */}
          <div className="space-y-4">
            {/* Step 1: Initial Bot Greeting */}
            <div className="flex items-start gap-3 animate-fade-in-up">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-base shrink-0 mt-0.5">
                🤖
              </div>
              <div className="space-y-2 max-w-xl">
                <div className="bg-slate-800/90 border border-slate-700/60 rounded-2xl rounded-tl-none p-4 text-sm text-slate-200 shadow-md space-y-2">
                  <p className="font-semibold text-white text-base">
                    Hii! Hello there! <span className="animate-wave">👋</span>
                  </p>
                  <p>
                    Welcome to <strong>CodePath</strong>! I'm your interactive learning companion.
                  </p>
                  <p className="text-emerald-400 font-medium">
                    What's your name?
                  </p>
                </div>
              </div>
            </div>

            {/* User Name Input (Step 1) */}
            {step === 1 && (
              <form onSubmit={handleNameSubmit} className="flex gap-2 max-w-md ml-11 animate-fade-in-up">
                <input
                  type="text"
                  autoFocus
                  placeholder="Type your name here..."
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-700 focus:border-emerald-400 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
                />
                <button
                  type="submit"
                  disabled={!inputName.trim()}
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold text-sm rounded-xl transition cursor-pointer flex items-center gap-1 shadow-lg shadow-emerald-500/20"
                >
                  Next →
                </button>
              </form>
            )}

            {/* Step 2: User Name Bubble + Goal Question */}
            {step >= 2 && (
              <>
                <div className="flex justify-end animate-fade-in-up">
                  <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-4 py-2 rounded-2xl rounded-tr-none text-sm font-medium">
                    My name is <strong>{userName}</strong>! 👋
                  </div>
                </div>

                <div className="flex items-start gap-3 animate-fade-in-up">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-base shrink-0 mt-0.5">
                    🤖
                  </div>
                  <div className="space-y-2 max-w-xl">
                    <div className="bg-slate-800/90 border border-slate-700/60 rounded-2xl rounded-tl-none p-4 text-sm text-slate-200 shadow-md">
                      <p>
                        Awesome to meet you, <span className="text-emerald-400 font-bold">{userName}</span>! 🎉
                      </p>
                      <p className="mt-1 text-slate-300">
                        What's your primary coding goal?
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Goal Options (Step 2) */}
            {step === 2 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 ml-11 max-w-2xl animate-fade-in-up">
                {GOAL_OPTIONS.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => handleGoalSelect(g)}
                    className="p-3 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 rounded-xl text-left transition flex items-center gap-3 cursor-pointer group"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform">{g.icon}</span>
                    <div>
                      <p className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">{g.title}</p>
                      <p className="text-xs text-slate-400">Recommends {g.lang.toUpperCase()}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Step 3: User Goal Bubble + Learning Style Question */}
            {step >= 3 && selectedGoal && (
              <>
                <div className="flex justify-end animate-fade-in-up">
                  <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-4 py-2 rounded-2xl rounded-tr-none text-sm font-medium flex items-center gap-2">
                    <span>{selectedGoal.icon}</span>
                    <span>Goal: {selectedGoal.title}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 animate-fade-in-up">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-base shrink-0 mt-0.5">
                    🤖
                  </div>
                  <div className="space-y-2 max-w-xl">
                    <div className="bg-slate-800/90 border border-slate-700/60 rounded-2xl rounded-tl-none p-4 text-sm text-slate-200 shadow-md">
                      <p>
                        Great choice! How do you prefer to learn best?
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Style Options (Step 3) */}
            {step === 3 && (
              <div className="space-y-2 ml-11 max-w-xl animate-fade-in-up">
                {STYLE_OPTIONS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleStyleSelect(s)}
                    className="w-full p-3.5 bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 rounded-xl text-left transition flex items-center gap-3 cursor-pointer group"
                  >
                    <span className="text-xl">{s.icon}</span>
                    <span className="text-sm font-medium text-slate-200 group-hover:text-white">{s.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Step 4: Final Recommendation Banner */}
            {step === 4 && selectedGoal && (
              <>
                <div className="flex justify-end animate-fade-in-up">
                  <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-4 py-2 rounded-2xl rounded-tr-none text-sm font-medium flex items-center gap-2">
                    <span>{selectedStyle?.icon}</span>
                    <span>{selectedStyle?.label}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 animate-fade-in-up">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-base shrink-0 mt-0.5">
                    🎯
                  </div>
                  <div className="space-y-3 w-full max-w-2xl">
                    <div className="bg-slate-800/90 border border-slate-700/60 rounded-2xl rounded-tl-none p-5 text-sm text-slate-200 shadow-md space-y-3">
                      <p className="text-base font-bold text-white">
                        Here is your tailored learning track, <span className="text-emerald-400 capitalize">{userName}</span>! 🚀
                      </p>

                      <div className={`p-4 rounded-xl border bg-gradient-to-r ${recommendedLang.color} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
                        <div className="flex items-center gap-3">
                          <span className="text-4xl">{recommendedLang.icon}</span>
                          <div>
                            <h3 className="text-lg font-bold text-white">{recommendedLang.name} Track</h3>
                            <p className="text-xs text-slate-300 mt-0.5">{selectedGoal.reason}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => navigate(`/course/${recommendedLangId}`)}
                          className="w-full sm:w-auto px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl transition shadow-lg shadow-emerald-500/20 cursor-pointer text-center shrink-0"
                        >
                          Start Course →
                        </button>
                      </div>

                      <p className="text-xs text-slate-400">
                        💡 You can switch tracks or jump into the standalone compiler anytime!
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3 ml-1">
                      <button
                        onClick={() => navigate('/arcade')}
                        className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-bold rounded-lg shadow-md transition cursor-pointer"
                      >
                        Play Arcade Mini-Games 🕹️
                      </button>
                      <button
                        onClick={() => navigate('/signup')}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg border border-slate-700 transition cursor-pointer"
                      >
                        Create Account to Save Progress
                      </button>
                      <button
                        onClick={() => navigate('/workspace')}
                        className="px-4 py-2 bg-slate-850 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-lg border border-slate-800 transition cursor-pointer"
                      >
                        Try Code Workspace 💻
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Typing Animation Indicator */}
            {isTyping && (
              <div className="flex items-center gap-3 ml-1 animate-fade-in-up">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-xs text-emerald-400 shrink-0">
                  🤖
                </div>
                <div className="bg-slate-800 border border-slate-700 px-4 py-2.5 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.15s]" />
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.3s]" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      )}
    </div>
  );
}
