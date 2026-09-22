import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LANGUAGE_VIDEO_COURSES, VIDEO_VOICE_MODES } from '../data/videoLessons';

export default function VideoHub() {
  const [selectedLang, setSelectedLang] = useState('python');
  const [activeModuleOrder, setActiveModuleOrder] = useState('1');
  const [voiceMode, setVoiceMode] = useState('kannada');

  const currentCourse = LANGUAGE_VIDEO_COURSES[selectedLang] || LANGUAGE_VIDEO_COURSES.python;
  const currentSource = currentCourse.sources[voiceMode] || currentCourse.sources.kannada || currentCourse.sources.simple_friendly || Object.values(currentCourse.sources)[0];
  const currentModuleVideo = currentSource.modules?.[activeModuleOrder] || currentSource.modules?.['1'] || {
    videoId: currentSource.mainVideoId,
    start: 0,
    duration: '15 mins',
    title: `${currentCourse.languageName} Overview`,
    summary: currentCourse.overview
  };

  const embedUrl = `https://www.youtube.com/embed/${currentModuleVideo.videoId}?rel=0&modestbranding=1&enablejsapi=1`;
  const directYoutubeUrl = `https://www.youtube.com/watch?v=${currentModuleVideo.videoId}`;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 animate-fade-in-up">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase rounded-full flex items-center gap-1.5">
              <span>⚡</span>
              <span>10–20 Min Microlessons Hub</span>
            </span>
            <span className="px-3 py-1 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold uppercase rounded-full">
              🟡🔴 ಕನ್ನಡ Included
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Visual Programming Microlessons</h1>
          <p className="text-slate-400 text-sm mt-1">
            Bite-sized 10 to 20-minute lessons designed for maximum retention and zero burnout. Learn in Kannada or your preferred accent!
          </p>
        </div>

        {/* Language Selection Tabs */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 self-start md:self-auto">
          {Object.keys(LANGUAGE_VIDEO_COURSES).map((langKey) => {
            const course = LANGUAGE_VIDEO_COURSES[langKey];
            const isSelected = selectedLang === langKey;
            return (
              <button
                key={langKey}
                onClick={() => {
                  setSelectedLang(langKey);
                  setActiveModuleOrder('1');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <span>{course.icon}</span>
                <span>{course.languageName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Microlesson Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-blue-500/10 border border-amber-500/20 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎯</span>
          <div>
            <span className="font-bold text-amber-300">Why Microlessons? </span>
            <span className="text-slate-300">
              Long 1+ hour videos cause mental fatigue. Our 10–20 minute focused chapters help you grasp one core concept, practice it immediately, and retain it permanently.
            </span>
          </div>
        </div>
        <span className="shrink-0 bg-amber-500/20 text-amber-300 px-3 py-1 rounded-xl font-bold border border-amber-500/30">
          ⏱️ 10–20 Mins Only
        </span>
      </div>

      {/* Accent & Style Preference Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
          <span>🎙️</span>
          <span>Choose Explainer Language & Style:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {VIDEO_VOICE_MODES.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setVoiceMode(mode.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                voiceMode === mode.id
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span>{mode.label}</span>
              {mode.badge && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                  voiceMode === mode.id ? 'bg-slate-950/40 text-slate-950' : 'bg-slate-800 text-slate-400'
                }`}>
                  {mode.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Video Player + Chapter Playlist */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
        {/* Left: HD Video Player & Lesson Details */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            {/* Player Title Bar */}
            <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <span>{currentCourse.icon}</span>
                  <span>{currentCourse.languageName}: {currentModuleVideo.title}</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Instructor / Channel: <span className="text-emerald-400 font-semibold">{currentSource.instructor}</span></p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-full flex items-center gap-1">
                  ⚡ {currentModuleVideo.duration || '16 mins'} Dedicated Video
                </span>
                {currentModuleVideo.start > 0 ? (
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                    ⏱️ Starts at {Math.floor(currentModuleVideo.start / 60)}:{(currentModuleVideo.start % 60).toString().padStart(2, '0')}
                  </span>
                ) : (
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                    🎬 Standalone Lesson
                  </span>
                )}
                <a
                  href={directYoutubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-red-400 hover:text-white bg-red-500/10 hover:bg-red-600 border border-red-500/30 px-3 py-1 rounded-full flex items-center gap-1.5 transition cursor-pointer"
                  title="Open video directly on YouTube"
                >
                  <span>▶️</span>
                  <span>Open on YouTube ↗</span>
                </a>
              </div>
            </div>

            {/* Kannada Mode Callout Banner */}
            {voiceMode === 'kannada' && (
              <div className="bg-gradient-to-r from-amber-500/15 via-red-500/10 to-amber-500/15 border-b border-amber-500/30 px-6 py-2.5 flex items-center justify-between text-xs text-amber-200">
                <div className="flex items-center gap-2">
                  <span>🟡🔴</span>
                  <span className="font-semibold">ಕನ್ನಡದಲ್ಲಿ ಕಲಿಯಿರಿ • 15–20 ನಿಮಿಷಗಳ ಪ್ರತ್ಯೇಕ ಮೈಕ್ರೋಲೆಸನ್ (Kannada Dedicated Video Track)</span>
                </div>
                <span className="hidden sm:inline-block text-[11px] bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/30 font-bold">
                  MicroDegree & Kaliyona
                </span>
              </div>
            )}

            {/* 16:9 Responsive Embed */}
            <div className="relative w-full pb-[56.25%] bg-black">
              <iframe
                key={`${selectedLang}-${activeModuleOrder}-${voiceMode}-${currentModuleVideo.videoId}`}
                src={embedUrl}
                title={currentModuleVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full border-0"
              />
            </div>

            {/* Key Takeaways */}
            <div className="p-6 bg-slate-900/90 border-t border-slate-800 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                <span>💡</span>
                <span>Visual Concept Summary</span>
              </h3>
              <p className="text-sm text-slate-200 leading-relaxed">{currentModuleVideo.summary}</p>

              <div className="flex flex-wrap items-center gap-3 pt-3">
                <a
                  href={directYoutubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-red-600 hover:bg-red-500 text-white py-2 px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-lg shadow-red-600/20"
                >
                  <span>▶️ Watch on YouTube.com ↗</span>
                </a>
                <Link
                  to={`/course/${selectedLang}`}
                  className="btn-primary py-2 px-4 text-xs font-bold flex items-center gap-2"
                >
                  <span>💻 Practice in Interactive Course →</span>
                </Link>
                <Link
                  to={`/quiz/${selectedLang}`}
                  className="btn-secondary py-2 px-4 text-xs font-bold flex items-center gap-2"
                >
                  <span>📝 Test Yourself in Quiz</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Module Chapters / Playlist */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span>📚</span>
                <span>{currentCourse.languageName} Microlessons</span>
              </span>
              <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold border border-amber-500/30">
                10 Lessons
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">Every topic has its own unique 15–20 min video. Click any topic to switch videos!</p>
          </div>

          <div className="space-y-2 max-h-[540px] overflow-y-auto pr-1">
            {Object.entries(currentSource.modules || {}).map(([orderKey, mod]) => {
              const isActive = activeModuleOrder === orderKey;
              const mins = Math.floor(mod.start / 60);
              const secs = (mod.start % 60).toString().padStart(2, '0');

              return (
                <button
                  key={orderKey}
                  onClick={() => setActiveModuleOrder(orderKey)}
                  className={`w-full text-left p-3.5 rounded-2xl transition flex items-start justify-between gap-3 cursor-pointer border ${
                    isActive
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-md shadow-emerald-500/10'
                      : 'bg-slate-950/40 border-slate-800/80 text-slate-300 hover:bg-slate-800/60 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                        isActive ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}>
                        #{orderKey}
                      </span>
                      <p className="text-xs font-bold leading-tight">{mod.title}</p>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{mod.summary}</p>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-[10px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                      ⚡ {mod.duration || '16 mins'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {mod.start > 0 ? `⏱️ ${mins}:${secs}` : '🎬 Video Lesson'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
