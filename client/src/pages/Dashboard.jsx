import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { notifyProgressUpdate } from '../utils/events';
import { getFallbackModules } from '../data/curriculumHelper';

// Available base tracks fallback
const BASE_TRACKS = [
  { id: 'python', name: 'Python', icon: '🐍', desc: 'Variables, Data Structures, OOP & AI basics' },
  { id: 'java', name: 'Java', icon: '☕', desc: 'Syntax, OOP principles, Collections & Spring' },
  { id: 'cpp', name: 'C++', icon: '⚙️', desc: 'Pointers, Memory Mgmt, STL & Algorithms' },
  { id: 'c', name: 'C Language', icon: '🧱', desc: 'Core fundamentals, Pointers & System programming' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  const fetchStats = async () => {
    try {
      const response = await client.get('/dashboard/me');
      setStats(response.data || {});
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setStats({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    const handleUpdate = () => fetchStats();
    window.addEventListener('userProgressUpdated', handleUpdate);

    return () => window.removeEventListener('userProgressUpdated', handleUpdate);
  }, []);

  const handleStartTrack = async (languageId) => {
    try {
      await client.post(`/languages/${languageId}/enroll`).catch(() => 
        client.post(`/dashboard/enroll/${languageId}`)
      );
      
      if (typeof notifyProgressUpdate === 'function') {
        notifyProgressUpdate();
      }
      
      await fetchStats();
      setSelectedLanguage(languageId);
    } catch (err) {
      console.error('Error starting track:', err);
      setSelectedLanguage(languageId);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4"></div>
          <p className="text-slate-400 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const userName = user?.name ? user.name.split(' ')[0] : 'Learner';

  // Filter dynamic progress tracks vs available tracks
  const activeTracks = stats?.activeLanguages || stats?.progressByLanguage?.filter(l => l.status === 'in_progress' || l.status === 'completed' || l.completedModules > 0) || [];
  
  const activeIds = new Set(activeTracks.map(t => t.languageId || t.id));
  const availableTracksToStart = BASE_TRACKS.filter(track => !activeIds.has(track.id));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              Welcome back, <span className="text-emerald-400 capitalize">{userName}</span>! 🚀
            </h1>
            <p className="text-slate-400 text-sm mt-1">Here's your learning progress across all code tracks.</p>
          </div>

          {stats?.streak > 0 && (
            <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl text-sm">
              <span className="text-2xl">🔥</span>
              <div>
                <p className="text-xs text-slate-400 uppercase font-semibold">Streak</p>
                <p className="text-emerald-400 font-bold">{stats.streak} Days Active</p>
              </div>
            </div>
          )}
        </div>

        {/* Top Dynamic Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Languages Learning"
            value={stats?.languagesLearning ?? activeTracks.length}
            icon="📚"
            color="emerald"
            subtitle="Active courses"
          />
          <StatCard
            title="Modules Completed"
            value={stats?.completedModules ?? 0}
            icon="✅"
            color="emerald"
            subtitle="Total progress"
          />
          <StatCard
            title="Average Quiz Score"
            value={`${stats?.averageScore ?? 0}%`}
            icon="🎯"
            color="purple"
            subtitle="Your performance"
          />
          <StatCard
            title="Certificates Earned"
            value={stats?.certificatesEarned ?? stats?.certificates?.length ?? 0}
            icon="🏆"
            color="amber"
            subtitle="Achievements"
          />
        </div>

        {/* Section 1: Active Enrolled Languages */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white tracking-tight">Your Languages</h2>
          </div>

          {activeTracks.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {activeTracks.map((lang, index) => (
                <LanguageProgressCard
                  key={lang.languageId || index}
                  language={lang}
                  onSelect={() => setSelectedLanguage(lang.languageId)}
                  onNavigate={(path) => navigate(path)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 text-center">
              <p className="text-slate-300 font-medium">No active language tracks found yet.</p>
              <p className="text-slate-400 text-xs mt-1">Choose a language track below to start learning and tracking your progress!</p>
            </div>
          )}
        </div>

        {/* Section 2: Explore / Start New Language Tracks */}
        {availableTracksToStart.length > 0 && (
          <div className="space-y-6 pt-4">
            <h3 className="text-xl font-bold text-white tracking-tight">Available Tracks</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {availableTracksToStart.map((track) => (
                <div
                  key={track.id}
                  className="bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 rounded-xl p-6 transition hover:shadow-lg flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-3xl">{track.icon}</span>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        NEW TRACK
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white">{track.name}</h3>
                    <p className="text-xs text-slate-400 mt-1">{track.desc}</p>
                  </div>

                  <button
                    onClick={() => handleStartTrack(track.id)}
                    className="w-full mt-6 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition text-sm cursor-pointer"
                  >
                    Start Track →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 3: Earned Certificates Section */}
        {stats?.certificates && stats.certificates.length > 0 && (
          <div className="space-y-6 pt-4 border-t border-slate-800">
            <h2 className="text-2xl font-bold text-white tracking-tight">Your Earned Certificates</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {stats.certificates.map((cert, idx) => (
                <div key={cert.id || idx} className="bg-slate-900/90 border border-amber-500/30 rounded-xl p-5 flex items-center gap-4">
                  <span className="text-4xl">🏆</span>
                  <div>
                    <h4 className="text-white font-bold capitalize">{cert.languageId || cert.title || 'Course Certificate'}</h4>
                    <p className="text-xs text-amber-400 font-medium">Issued {cert.date ? new Date(cert.date).toLocaleDateString() : 'Recently'}</p>
                    <button 
                      onClick={() => navigate(`/certificate/${cert.languageId || cert.id}`)}
                      className="text-xs text-slate-300 underline mt-2 hover:text-white"
                    >
                      View Certificate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Module Progress Modal */}
        {selectedLanguage && (
          <ModuleDetailView
            languageId={selectedLanguage}
            onClose={() => {
              setSelectedLanguage(null);
              fetchStats();
            }}
            onNavigate={(path) => navigate(path)}
          />
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, subtitle }) {
  const colorStyles = {
    emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition">
      <div className="flex items-center justify-between mb-3">
        <span className="text-3xl">{icon}</span>
        <span className={`text-xs px-2.5 py-1 rounded-full border uppercase font-medium ${colorStyles[color] || colorStyles.emerald}`}>
          {subtitle}
        </span>
      </div>
      <p className="text-slate-400 text-xs uppercase font-semibold tracking-wider">{title}</p>
      <p className="text-3xl font-bold text-white mt-1">{value}</p>
    </div>
  );
}

function LanguageProgressCard({ language, onSelect, onNavigate }) {
  const completed = language.completedModules || 0;
  const total = language.totalModules || 10;
  const progressPercent = Math.min(100, Math.round((completed / Math.max(1, total)) * 100));

  const statusEmoji = {
    passed: '✅',
    completed: '✅',
    ready_for_quiz: '🚀',
    in_progress: '📚',
  };

  return (
    <div
      className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 hover:border-emerald-500/40 hover:shadow-lg transition cursor-pointer flex flex-col justify-between"
      onClick={onSelect}
    >
      <div>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-white capitalize">{language.languageName || language.languageId}</h3>
          <span className="text-2xl">{statusEmoji[language.status] || '🎓'}</span>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2 text-sm">
            <span className="text-slate-400 font-medium">Progress</span>
            <span className="text-white font-bold">{completed}/{total}</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-400 font-medium">{progressPercent}% Complete</span>
          <span
            className={`px-3 py-1 rounded-full font-semibold capitalize border ${
              language.status === 'passed' || language.status === 'completed'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : language.status === 'ready_for_quiz'
                ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                : 'bg-slate-800 border-slate-700 text-slate-300'
            }`}
          >
            {(language.status || 'In Progress').replace(/_/g, ' ')}
          </span>
        </div>
      </div>

      <div className="mt-6 flex gap-2">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition text-sm font-semibold border border-slate-700 cursor-pointer"
        >
          View Modules →
        </button>

        {(language.status === 'passed' || language.status === 'completed') && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(`/certificate/${language.languageId}`);
            }}
            className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-sm font-semibold transition cursor-pointer"
          >
            🏆 Certificate
          </button>
        )}

        {(completed >= total || language.status === 'ready_for_quiz') && language.status !== 'passed' && language.status !== 'completed' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate(`/quiz/${language.languageId}`);
            }}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg text-sm font-bold transition cursor-pointer"
          >
            📝 Take Quiz
          </button>
        )}
      </div>
    </div>
  );
}

function ModuleDetailView({ languageId, onClose, onNavigate }) {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchModules = async () => {
    try {
      const response = await client.get(`/dashboard/language/${languageId}`);
      if (response.data?.modules?.length > 0) {
        setModules(response.data.modules);
      } else {
        setModules(getFallbackModules(languageId));
      }
    } catch (error) {
      setModules(getFallbackModules(languageId));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (languageId) {
      fetchModules();
    }
  }, [languageId]);

  const toggleModuleCompletion = async (moduleId, currentStatus) => {
    try {
      await client.post(`/dashboard/modules/${moduleId}/toggle`, {
        isCompleted: !currentStatus,
      });
      await fetchModules();
      if (typeof notifyProgressUpdate === 'function') {
        notifyProgressUpdate();
      }
    } catch (err) {
      console.error('Failed to update module:', err);
    }
  };

  const allCompleted = modules.length > 0 && modules.every((m) => m.isCompleted);

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center sticky top-0">
          <div>
            <h2 className="text-xl font-bold text-white capitalize">{languageId} Modules</h2>
            <p className="text-xs text-slate-400">Complete all modules to unlock the final quiz!</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition text-lg w-8 h-8 rounded-lg hover:bg-slate-800 flex items-center justify-center cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-3">
          {loading ? (
            <p className="text-center text-slate-400 py-6">Loading modules...</p>
          ) : modules.length > 0 ? (
            modules.map((module, i) => (
              <div
                key={module.id || module._id || i}
                onClick={() => toggleModuleCompletion(module.id || module._id, module.isCompleted)}
                className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition ${
                  module.isCompleted
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <p className="font-semibold text-white text-sm">
                    Module {module.order || i + 1}: {module.title}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">{module.description || 'Click to toggle completion'}</p>
                </div>
                <span className="text-xl">{module.isCompleted ? '✅' : '⭕'}</span>
              </div>
            ))
          ) : (
            <p className="text-center text-slate-400 py-6">No modules found for this track.</p>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex justify-between items-center">
          <span className="text-xs text-slate-400">
            {modules.filter((m) => m.isCompleted).length} / {modules.length} Completed
          </span>
          {allCompleted && (
            <button
              onClick={() => {
                onClose();
                onNavigate(`/quiz/${languageId}`);
              }}
              className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-lg transition cursor-pointer"
            >
              Take Quiz Now 🚀
            </button>
          )}
        </div>
      </div>
    </div>
  );
}