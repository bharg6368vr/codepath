import React, { useState } from 'react';
import { getVideoForModule, VIDEO_VOICE_MODES } from '../data/videoLessons';

export default function VideoLessonPlayer({ languageId, moduleOrder, moduleTitle }) {
  const [voiceMode, setVoiceMode] = useState('kannada');
  const videoData = getVideoForModule(languageId, moduleOrder, voiceMode);

  const embedUrl = `https://www.youtube.com/embed/${videoData.videoId}?start=${videoData.start}&rel=0&modestbranding=1&enablejsapi=1`;
  const directYoutubeUrl = `https://www.youtube.com/watch?v=${videoData.videoId}${videoData.start > 0 ? `&t=${videoData.start}s` : ''}`;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl my-6 animate-fade-in-up">
      {/* Video Player Header & Accent / Style Switcher */}
      <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{videoData.icon}</span>
          <div>
            <div className="flex items-center flex-wrap gap-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Visual Video Lesson: {videoData.title}
              </h3>
              <span className="text-[11px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                ⚡ {videoData.duration} Microlesson
              </span>
              <a
                href={directYoutubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] bg-red-500/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/30 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 transition cursor-pointer"
                title="Watch on YouTube"
              >
                <span>▶️</span>
                <span>YouTube ↗</span>
              </a>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Instructor / Track: <span className="text-emerald-400 font-medium">{videoData.instructor}</span>
            </p>
          </div>
        </div>

        {/* Accent / Style Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-900 p-1 rounded-2xl border border-slate-800 self-start sm:self-auto">
          {VIDEO_VOICE_MODES.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setVoiceMode(mode.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                voiceMode === mode.id
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span>{mode.shortLabel || mode.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Kannada Mode Callout Banner */}
      {voiceMode === 'kannada' && (
        <div className="bg-gradient-to-r from-amber-500/15 via-red-500/10 to-amber-500/15 border-b border-amber-500/30 px-5 py-2 flex items-center justify-between text-xs text-amber-200">
          <div className="flex items-center gap-2">
            <span>🟡🔴</span>
            <span className="font-semibold">ಕನ್ನಡದಲ್ಲಿ ಕಲಿಯಿರಿ: 10–20 ನಿಮಿಷಗಳ ಬೈಟ್-ಸೈಜ್ಡ್ ಮೈಕ್ರೋಲೆಸನ್ (Kannada Microlesson Mode Active)</span>
          </div>
          <span className="hidden sm:inline-block text-[11px] bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/30 font-bold">
            MicroDegree & Kaliyona
          </span>
        </div>
      )}

      {/* 16:9 Responsive Video Container */}
      <div className="relative w-full pb-[56.25%] bg-black">
        <iframe
          key={`${languageId}-${moduleOrder}-${voiceMode}-${videoData.videoId}`}
          src={embedUrl}
          title={videoData.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full border-0"
        />
      </div>

      {/* Video Quick Takeaway Notes */}
      <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-950 flex flex-col sm:flex-row items-start justify-between gap-4 border-t border-slate-800">
        <div className="flex items-start gap-3">
          <span className="text-2xl mt-0.5">💡</span>
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Visual Concept Summary (Easy & Direct)
            </p>
            <p className="text-sm text-slate-200 leading-relaxed">
              {videoData.summary}
            </p>
            <p className="text-xs text-slate-400 pt-1">
              ✨ <em>Tip: Switch between "🟡🔴 ಕನ್ನಡ", "🇮🇳 Simple & Friendly", "⚡ Ultra-Visual", and "🌍 Global" at the top anytime!</em>
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
          <div className="text-xs font-mono font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-full">
            ⚡ {videoData.duration} Microlesson
          </div>
          <div className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
            ⏱️ Starts at {Math.floor(videoData.start / 60)}:{(videoData.start % 60).toString().padStart(2, '0')}
          </div>
          <a
            href={directYoutubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-red-400 hover:text-white bg-red-500/10 hover:bg-red-600 border border-red-500/30 px-3 py-1.5 rounded-full flex items-center gap-1.5 transition cursor-pointer"
            title="Open directly on YouTube in a new tab"
          >
            <span>▶️</span>
            <span>Watch on YouTube ↗</span>
          </a>
        </div>
      </div>
    </div>
  );
}
