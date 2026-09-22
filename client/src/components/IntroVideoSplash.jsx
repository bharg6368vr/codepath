import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// Sci-Fi Sound FX Synthesizer using Web Audio API
// Generates authentic futuristic audio without relying on external MP3 files
class SciFiAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playBootSubBass() {
    if (this.isMuted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(40, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 1.2);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.2, this.ctx.currentTime + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 1.6);
    } catch (_) {}
  }

  playTelemetryBeeps() {
    if (this.isMuted || !this.ctx) return;
    try {
      [0, 0.15, 0.3, 0.5].forEach((delay, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600 + idx * 250, this.ctx.currentTime + delay);
        gain.gain.setValueAtTime(0.08, this.ctx.currentTime + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + delay + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + delay);
        osc.stop(this.ctx.currentTime + delay + 0.09);
      });
    } catch (_) {}
  }

  playImpactRiser() {
    if (this.isMuted || !this.ctx) return;
    try {
      // Powerful futuristic chord blast
      const freqs = [130.81, 164.81, 196.00, 261.63]; // C minor / tech chord
      freqs.forEach((freq) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.ctx.currentTime + 1.0);

        gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 1.9);
      });
    } catch (_) {}
  }

  playWarpOut() {
    if (this.isMuted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(200, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1400, this.ctx.currentTime + 0.6);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.65);
    } catch (_) {}
  }
}

export default function IntroVideoSplash() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [isWarpingOut, setIsWarpingOut] = useState(false);
  const [stage, setStage] = useState(0); // 0: Boot, 1: Quantum Accelerate, 2: Reveal, 3: Launchpad
  const [progress, setProgress] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [alwaysShowOnStartup, setAlwaysShowOnStartup] = useState(false);
  const [visualMode, setVisualMode] = useState('matrix'); // 'matrix' | 'neon_core' | 'custom_video'
  const [customVideoUrl, setCustomVideoUrl] = useState('');
  const [showVideoInput, setShowVideoInput] = useState(false);

  const canvasRef = useRef(null);
  const animFrameIdRef = useRef(null);
  const audioRef = useRef(null);
  const videoRef = useRef(null);

  const [autoTimer, setAutoTimer] = useState(5);

  // Initialize audio engine
  useEffect(() => {
    audioRef.current = new SciFiAudioEngine();
  }, []);

  // Show intro whenever app opens in a session, with auto-play
  useEffect(() => {
    // Has intro already played during this active browser session?
    const sessionPlayed = sessionStorage.getItem('codepath_session_intro');
    if (!sessionPlayed) {
      setIsVisible(true);
      sessionStorage.setItem('codepath_session_intro', 'true');
    }

    const handleTriggerIntro = () => {
      setIsWarpingOut(false);
      setProgress(0);
      setStage(0);
      setAutoTimer(5);
      setIsVisible(true);
    };

    window.addEventListener('codepath:show-intro', handleTriggerIntro);
    return () => {
      window.removeEventListener('codepath:show-intro', handleTriggerIntro);
    };
  }, []);

  // ESC key listener to skip intro
  useEffect(() => {
    if (!isVisible) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleCloseIntro();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible]);

  // Sound Toggle
  const handleToggleSound = () => {
    if (!audioRef.current) return;
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    audioRef.current.isMuted = !nextState;
    if (nextState) {
      audioRef.current.init();
      audioRef.current.playTelemetryBeeps();
    }
  };

  // Stage Progression Timeline: Plays exciting animation then automatically starts app contents
  useEffect(() => {
    if (!isVisible) return;

    setProgress(0);
    setStage(0);
    setAutoTimer(4);

    // Audio boot
    if (soundEnabled && audioRef.current) {
      audioRef.current.init();
      audioRef.current.playBootSubBass();
    }

    // Stage 1: Acceleration at 1.2s
    const t1 = setTimeout(() => {
      setStage(1);
      if (soundEnabled && audioRef.current) {
        audioRef.current.playTelemetryBeeps();
      }
    }, 1200);

    // Stage 2: Grand Reveal at 2.6s
    const t2 = setTimeout(() => {
      setStage(2);
      if (soundEnabled && audioRef.current) {
        audioRef.current.playImpactRiser();
      }
    }, 2600);

    // Auto-transition into app contents at 4.6s
    const tAuto = setTimeout(() => {
      handleCloseIntro();
    }, 4600);

    // Progress counter
    const startTime = Date.now();
    const duration = 4600;
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);
      const remainingSecs = Math.max(0, Math.ceil((duration - elapsed) / 1000));
      setAutoTimer(remainingSecs);
      if (pct >= 100) {
        clearInterval(interval);
      }
    }, 50);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(tAuto);
      clearInterval(interval);
    };
  }, [isVisible]);

  // Interactive 60FPS Cyber Canvas Motion Video Engine
  useEffect(() => {
    if (!isVisible || visualMode === 'custom_video') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Matrix Code Streams & Vortex Particles
    const glyphs = '01{}[]<>=/\\+-*#_@$&;:~%^|!CODEPATH';
    const particles = Array.from({ length: 90 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * 800 + 100,
      char: glyphs[Math.floor(Math.random() * glyphs.length)],
      speed: Math.random() * 4 + 2,
      color: Math.random() > 0.3 ? '#10b981' : '#06b6d4',
      size: Math.random() * 12 + 10,
    }));

    // Floating Energy Rings
    let angle = 0;

    const render = () => {
      ctx.fillStyle = 'rgba(2, 6, 23, 0.28)'; // Trail persistence for motion blur
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      angle += 0.015;

      // 1. Draw Cyber Grid Horizon (Perspective Grid)
      ctx.save();
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.12)';
      ctx.lineWidth = 1;
      const gridY = centerY + 120;
      for (let x = -width; x < width * 2; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, height);
        ctx.lineTo(centerX + (x - centerX) * 0.15, gridY);
        ctx.stroke();
      }
      for (let y = gridY; y < height; y += 22) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.restore();

      // 2. Quantum Holographic Rings in Center
      ctx.save();
      ctx.translate(centerX, centerY);

      // Outer Ring
      ctx.beginPath();
      ctx.arc(0, 0, 160 + Math.sin(angle * 2) * 8, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.25)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Spinning Segmented Inner Rings
      ctx.save();
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.arc(0, 0, 120, 0, Math.PI * 1.3);
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 15;
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.rotate(-angle * 1.5);
      ctx.beginPath();
      ctx.arc(0, 0, 95, 0, Math.PI * 0.9);
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 18;
      ctx.stroke();
      ctx.restore();

      // Reticle Crosshairs
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.4)';
      ctx.beginPath();
      ctx.moveTo(-180, 0);
      ctx.lineTo(-135, 0);
      ctx.moveTo(135, 0);
      ctx.lineTo(180, 0);
      ctx.moveTo(0, -180);
      ctx.lineTo(0, -135);
      ctx.moveTo(0, 135);
      ctx.lineTo(0, 180);
      ctx.stroke();

      ctx.restore();

      // 3. 3D Flying Code Glyphs (Warp Speed Vortex)
      particles.forEach((p) => {
        p.z -= p.speed * (stage >= 1 ? 2.5 : 1);
        if (p.z <= 10) {
          p.z = 800;
          p.x = Math.random() * width;
          p.y = Math.random() * height;
          p.char = glyphs[Math.floor(Math.random() * glyphs.length)];
        }

        const scale = 300 / p.z;
        const screenX = centerX + (p.x - centerX) * scale;
        const screenY = centerY + (p.y - centerY) * scale;

        if (screenX >= 0 && screenX <= width && screenY >= 0 && screenY <= height) {
          ctx.save();
          ctx.font = `${Math.floor(p.size * scale)}px monospace`;
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = stage >= 2 ? 14 : 6;
          ctx.fillText(p.char, screenX, screenY);
          ctx.restore();
        }
      });

      // 4. Subtle Scanline
      const scanY = (Date.now() / 4) % height;
      ctx.fillStyle = 'rgba(16, 185, 129, 0.04)';
      ctx.fillRect(0, scanY, width, 4);

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [isVisible, visualMode, stage]);

  // Smooth Warp Exit Function
  const handleCloseIntro = () => {
    if (audioRef.current && soundEnabled) {
      audioRef.current.playWarpOut();
    }
    setIsWarpingOut(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsWarpingOut(false);
    }, 700);
  };

  const handleLaunchTarget = (routePath) => {
    handleCloseIntro();
    if (routePath) {
      setTimeout(() => navigate(routePath), 350);
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col justify-between bg-slate-950 overflow-hidden select-none transition-all duration-700 ${
        isWarpingOut ? 'scale-125 opacity-0 blur-xl pointer-events-none' : 'scale-100 opacity-100 blur-0'
      }`}
    >
      {/* Visual Layer 1: Interactive 60FPS Cyber Canvas Motion Video */}
      {visualMode !== 'custom_video' ? (
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
      ) : (
        /* Visual Layer 2: Custom HD Video / Stream Loop */
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
          {customVideoUrl ? (
            <video
              ref={videoRef}
              src={customVideoUrl}
              autoPlay
              loop
              muted={!soundEnabled}
              playsInline
              className="w-full h-full object-cover opacity-60"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-900/80">
              <p className="text-slate-400 text-sm">Please provide a valid video URL below.</p>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-transparent to-slate-950/90" />
        </div>
      )}

      {/* Cyberpunk Vignette & Radial Light Burst */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(2,6,23,0.85)_100%)] pointer-events-none" />

      {/* --- TOP CONTROL BAR --- */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900/90 border border-emerald-500/30 rounded-full px-3.5 py-1.5 backdrop-blur-md shadow-lg shadow-emerald-500/10">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-mono font-bold text-emerald-400 tracking-wider uppercase">
              {stage === 0 && 'BOOTING CORE...'}
              {stage === 1 && 'SYNCHRONIZING NEURAL RUNTIME...'}
              {stage === 2 && 'CODEPATH COMPILER READY'}
              {stage === 3 && 'SYSTEMS OPTIMAL'}
            </span>
          </div>

          {/* Mode Switcher */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-900/80 border border-slate-800 rounded-full p-1 text-[11px] backdrop-blur-md">
            <button
              onClick={() => setVisualMode('matrix')}
              className={`px-3 py-1 rounded-full font-semibold transition cursor-pointer ${
                visualMode === 'matrix' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Cyber Matrix
            </button>
            <button
              onClick={() => {
                setVisualMode('custom_video');
                setShowVideoInput(true);
              }}
              className={`px-3 py-1 rounded-full font-semibold transition cursor-pointer ${
                visualMode === 'custom_video' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Custom Video URL
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Audio Synthesizer Button */}
          <button
            onClick={handleToggleSound}
            title={soundEnabled ? 'Mute Sound FX' : 'Enable Sci-Fi Sound FX'}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border transition cursor-pointer backdrop-blur-md ${
              soundEnabled
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900/80 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            <span>{soundEnabled ? '🔊' : '🔇'}</span>
            <span className="hidden sm:inline">{soundEnabled ? 'Sound ON' : 'Turn Sound ON'}</span>
          </button>

          {/* Skip Intro Button */}
          <button
            onClick={handleCloseIntro}
            className="flex items-center gap-2 px-4 py-1.5 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white text-xs font-bold rounded-full transition cursor-pointer shadow-lg backdrop-blur-md group"
          >
            <span>Skip Intro</span>
            <span className="group-hover:translate-x-0.5 transition-transform">⏩</span>
            <span className="text-[10px] text-slate-400 border border-slate-600 px-1 rounded ml-1">ESC</span>
          </button>
        </div>
      </header>

      {/* Custom Video URL Input Modal (if active) */}
      {showVideoInput && visualMode === 'custom_video' && (
        <div className="relative z-20 mx-auto max-w-lg w-full px-4 -mt-2 animate-fade-in-up">
          <div className="bg-slate-900/95 border border-cyan-500/40 rounded-2xl p-4 shadow-2xl backdrop-blur-xl flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                🎬 Stream Your Custom Intro Video (MP4 / WebM)
              </span>
              <button onClick={() => setShowVideoInput(false)} className="text-xs text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Paste MP4 video link (e.g. https://.../video.mp4)"
                value={customVideoUrl}
                onChange={(e) => setCustomVideoUrl(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              <button
                onClick={() => setShowVideoInput(false)}
                className="px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition"
              >
                Apply
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setCustomVideoUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
                  setShowVideoInput(false);
                }}
                className="text-[10px] text-cyan-300 hover:underline"
              >
                Use Tech Demo Video Preset ⚡
              </button>
              <button
                onClick={() => {
                  setVisualMode('matrix');
                  setShowVideoInput(false);
                }}
                className="text-[10px] text-emerald-400 hover:underline ml-auto"
              >
                Return to Cyber Matrix Mode
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- CENTER HERO CONTENT & LOGO REVEAL --- */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto my-auto">
        {/* Stage 0 & 1: Booting telemetry terminal */}
        {stage < 2 && (
          <div className="space-y-4 animate-fade-in-up">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-3xl shadow-2xl shadow-emerald-500/20 animate-pulse">
              ⚡
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl px-6 py-4 shadow-xl backdrop-blur-md max-w-md mx-auto">
              <p className="text-xs font-mono text-emerald-400 flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                {stage === 0 ? 'INITIALIZING COMPILER ENGINE...' : 'ACCELERATING NEURAL RUNTIME...'}
              </p>
              <div className="w-full bg-slate-950 rounded-full h-2 mt-3 overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-[11px] font-mono text-slate-400 mt-2">{progress}% COMPILED</p>
            </div>
          </div>
        )}

        {/* Stage 2 & 3: Epic CodePath Logo Reveal & Action Launchpad */}
        {stage >= 2 && (
          <div className="space-y-6 animate-fade-in-up">
            {/* Holographic Logo Shield */}
            <div className="relative inline-block">
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/30 via-teal-500/30 to-cyan-500/30 rounded-full blur-2xl animate-glow pointer-events-none" />
              <div className="relative w-28 h-28 mx-auto rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-2 border-emerald-400/80 flex items-center justify-center text-5xl shadow-2xl shadow-emerald-500/40 transform hover:scale-105 transition-transform">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 font-black font-mono">
                  {'</>'}
                </span>
              </div>
            </div>

            {/* Title & Glowing Tagline */}
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold tracking-widest uppercase mb-3">
                <span>✦ NEXT-GEN CODING PLATFORM ✦</span>
              </div>
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white">
                CODE<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">PATH</span>
              </h1>
              <p className="mt-3 text-base sm:text-xl text-slate-300 font-medium max-w-xl mx-auto leading-relaxed drop-shadow">
                Master Coding · Conquer Algorithms · Build the Future
              </p>
            </div>

            {/* Big Enter CTA Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => handleLaunchTarget('/')}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-base sm:text-lg rounded-2xl shadow-2xl shadow-emerald-500/40 hover:shadow-emerald-500/60 transform hover:-translate-y-0.5 transition cursor-pointer flex items-center justify-center gap-3"
              >
                <span>ENTER PLATFORM</span>
                <span className="text-xl">🚀</span>
              </button>

              <button
                onClick={() => handleLaunchTarget('/workspace')}
                className="w-full sm:w-auto px-6 py-4 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-white font-bold text-sm sm:text-base rounded-2xl shadow-xl hover:border-emerald-500/50 transition cursor-pointer flex items-center justify-center gap-2 backdrop-blur-md"
              >
                <span>Launch Code Workspace</span>
                <span>💻</span>
              </button>
            </div>

            {/* Quick Feature Launchers */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
              <button
                onClick={() => handleLaunchTarget('/languages')}
                className="px-3.5 py-1.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/30 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 backdrop-blur-md"
              >
                <span>📚</span>
                <span>Python, Java, C++, C Tracks</span>
              </button>
              <button
                onClick={() => handleLaunchTarget('/arcade')}
                className="px-3.5 py-1.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/30 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 backdrop-blur-md"
              >
                <span>🕹️</span>
                <span>Arcade Mini-Games</span>
              </button>
              <button
                onClick={() => handleLaunchTarget('/videos')}
                className="px-3.5 py-1.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-red-500/30 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 backdrop-blur-md"
              >
                <span>🎬</span>
                <span>Visual Video Hub</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* --- BOTTOM STATUS BAR --- */}
      <footer className="relative z-10 flex flex-col sm:flex-row items-center justify-between px-6 py-3.5 border-t border-slate-800/80 bg-slate-950/60 backdrop-blur-md gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Starting CodePath in <strong className="text-emerald-400">{autoTimer}s</strong>...</span>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400">
          <button
            onClick={handleCloseIntro}
            className="text-slate-300 hover:text-white font-medium transition cursor-pointer flex items-center gap-1 bg-slate-800/80 hover:bg-slate-700 px-3.5 py-1.5 rounded-full"
          >
            <span>Enter App Now</span>
            <span>→</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
