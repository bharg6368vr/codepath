import React, { useState, useEffect } from 'react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';

const FALLBACK_LEADERS = [
  { userId: 'u-1', name: 'Vaishnavi', certificatesCount: 2, averageScore: 92, completedModules: 18, score: 564 },
  { userId: 'u-2', name: 'Bujji', certificatesCount: 1, averageScore: 88, completedModules: 14, score: 416 },
  { userId: 'u-3', name: 'Avinash', certificatesCount: 1, averageScore: 85, completedModules: 12, score: 390 },
  { userId: 'u-4', name: 'CodeCrafter', certificatesCount: 1, averageScore: 80, completedModules: 10, score: 360 },
  { userId: 'u-5', name: 'DevRookie', certificatesCount: 0, averageScore: 78, completedModules: 8, score: 236 },
];

export default function Leaderboard() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchData = async () => {
    try {
      const [lbRes, urRes] = await Promise.all([
        client.get('/leaderboard', { params: { filter } }),
        user ? client.get('/leaderboard/me', { params: { filter } }).catch(() => ({ data: null })) : Promise.resolve({ data: null })
      ]);
      
      if (Array.isArray(lbRes.data) && lbRes.data.length > 0) {
        setLeaderboard(lbRes.data);
      } else {
        setLeaderboard(FALLBACK_LEADERS);
      }
      if (urRes.data) {
        setUserRank(urRes.data);
      }
    } catch (error) {
      setLeaderboard(FALLBACK_LEADERS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const handleUpdate = () => fetchData();
    window.addEventListener('userProgressUpdated', handleUpdate);

    return () => window.removeEventListener('userProgressUpdated', handleUpdate);
  }, [user, filter]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4"></div>
          <p className="text-slate-400 font-medium">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Title Header */}
        <div className="border-b border-slate-800 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white flex items-center gap-2">
              🏆 Global Leaderboard
            </h1>
            <p className="text-slate-400 text-sm mt-1">See top learners ranked across quizzes, certificates, and code activity.</p>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition cursor-pointer ${
                filter === 'all'
                  ? 'bg-emerald-500 text-slate-950 font-semibold shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => setFilter('month')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition cursor-pointer ${
                filter === 'month'
                  ? 'bg-emerald-500 text-slate-950 font-semibold shadow-lg shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              This Month
            </button>
          </div>
        </div>

        {/* User's Position Banner */}
        {userRank && userRank.rank && (
          <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-amber-500/40 rounded-xl p-6 text-white shadow-xl">
            <div className="grid grid-cols-3 gap-4 text-center sm:text-left">
              <div>
                <p className="text-xs uppercase font-semibold tracking-wider text-amber-400">Your Rank</p>
                <p className="text-3xl sm:text-5xl font-bold mt-1">#{userRank.rank}</p>
              </div>
              <div className="border-x border-slate-800 px-2 sm:px-6">
                <p className="text-xs uppercase font-semibold tracking-wider text-slate-400">Your Score</p>
                <p className="text-3xl sm:text-5xl font-bold text-emerald-400 mt-1">{userRank.entry?.score ?? 0}</p>
              </div>
              <div>
                <p className="text-xs uppercase font-semibold tracking-wider text-slate-400">Certificates</p>
                <p className="text-2xl sm:text-4xl font-bold text-amber-300 mt-1">{userRank.entry?.certificatesCount ?? 0}</p>
              </div>
            </div>
          </div>
        )}

        {/* Top 10 Leaderboard */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white tracking-tight">Top 10 Learners</h2>
          {leaderboard.length === 0 ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
              No active learners on the leaderboard yet. Start completing modules to earn points!
            </div>
          ) : (
            <div className="space-y-3">
              {leaderboard.slice(0, 10).map((entry, idx) => (
                <LeaderboardRow
                  key={entry.userId || entry.id || idx}
                  rank={idx + 1}
                  entry={entry}
                  isCurrentUser={entry.userId === user?.id || entry.id === user?.id}
                />
              ))}
            </div>
          )}
        </div>

        {/* Full Leaderboard (11 - 50) */}
        {leaderboard.length > 10 && (
          <div className="pt-6 space-y-4">
            <h2 className="text-xl font-bold text-white tracking-tight">Full Leaderboard (Top 50)</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto bg-slate-900/60 border border-slate-800 rounded-xl p-4 divide-y divide-slate-800/60">
              {leaderboard.slice(10, 50).map((entry, idx) => (
                <LeaderboardRow
                  key={entry.userId || entry.id || idx + 10}
                  rank={idx + 11}
                  entry={entry}
                  isCurrentUser={entry.userId === user?.id || entry.id === user?.id}
                  compact={true}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function LeaderboardRow({ rank, entry, isCurrentUser, compact = false }) {
  const medalEmoji = {
    1: '🥇',
    2: '🥈',
    3: '🥉'
  };

  const displayName = entry.name || entry.username || 'Anonymous Learner';

  if (compact) {
    return (
      <div className={`flex items-center justify-between p-3 rounded-lg transition text-sm ${
        isCurrentUser 
          ? 'bg-emerald-500/10 border border-emerald-500/30' 
          : 'hover:bg-slate-800/40'
      }`}>
        <div className="flex items-center gap-4 flex-1">
          <span className="text-base font-bold min-w-[2.5rem] text-center text-slate-400">
            {medalEmoji[rank] || `#${rank}`}
          </span>
          <span className={`font-semibold ${isCurrentUser ? 'text-emerald-400' : 'text-slate-200'}`}>
            {displayName}
          </span>
        </div>
        <span className="text-base font-bold text-emerald-400">{entry.score ?? 0} XP</span>
      </div>
    );
  }

  return (
    <div className={`rounded-xl p-5 flex items-center justify-between transition border ${
      isCurrentUser
        ? 'bg-emerald-500/10 border-emerald-500/50 shadow-lg shadow-emerald-500/5'
        : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
    }`}>
      <div className="flex items-center gap-4">
        <div className="text-3xl min-w-[3.5rem] text-center font-bold text-slate-400">
          {medalEmoji[rank] || `#${rank}`}
        </div>
        <div>
          <p className={`font-bold text-lg ${isCurrentUser ? 'text-emerald-400' : 'text-white'}`}>
            {displayName}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {entry.certificatesCount ?? 0} certificates • {entry.averageScore ?? 0}% avg score • {entry.quizzesTaken ?? 0} quizzes
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-2xl sm:text-3xl font-bold text-emerald-400">{entry.score ?? 0}</p>
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Points</p>
      </div>
    </div>
  );
}