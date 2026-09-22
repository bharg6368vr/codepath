import React, { useState } from 'react';

export default function InteractiveVisualAnimator({ languageId, moduleTitle }) {
  const [animType, setAnimType] = useState('variables'); // 'variables' | 'pointers' | 'loops' | 'stack'
  
  // Variables State
  const [vars, setVars] = useState([
    { name: 'score', type: 'int', val: '100', address: '0x7FFC01' },
    { name: 'playerName', type: 'String', val: '"Alex"', address: '0x7FFC08' },
    { name: 'isLevelPassed', type: 'boolean', val: 'true', address: '0x7FFC10' }
  ]);
  const [newVarName, setNewVarName] = useState('');
  const [newVarVal, setNewVarVal] = useState('');

  // Loop Step State
  const [loopStep, setLoopStep] = useState(0);
  const maxSteps = 4;
  const loopItems = ['🍎 Apple', '🍌 Banana', '🍒 Cherry', '🍇 Grape'];

  // Pointers State
  const [pointedTarget, setPointedTarget] = useState(0);
  const memorySlots = [
    { address: '0x1000', label: 'x', value: '42' },
    { address: '0x1004', label: 'y', value: '88' },
    { address: '0x1008', label: 'z', value: '150' }
  ];

  // Call Stack State
  const [callStack, setCallStack] = useState(['main()', 'fetchUserData()']);

  const addVariable = (e) => {
    e.preventDefault();
    if (!newVarName || !newVarVal) return;
    const randomHex = '0x7FF' + Math.floor(Math.random() * 899 + 100).toString(16).toUpperCase();
    setVars((prev) => [...prev, { name: newVarName, type: 'auto', val: newVarVal, address: randomHex }]);
    setNewVarName('');
    setNewVarVal('');
  };

  const stepLoop = () => {
    setLoopStep((prev) => (prev + 1) % (maxSteps + 1));
  };

  const pushStack = () => {
    const fnNames = ['calculateGrade()', 'sendNotification()', 'saveToDatabase()', 'validateToken()'];
    const nextFn = fnNames[callStack.length % fnNames.length];
    if (callStack.length < 5) {
      setCallStack((prev) => [...prev, nextFn]);
    }
  };

  const popStack = () => {
    if (callStack.length > 1) {
      setCallStack((prev) => prev.slice(0, prev.length - 1));
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl my-6 animate-fade-in-up">
      {/* Header & Modes */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-2.5 py-0.5 rounded-full font-bold uppercase">
              ✨ Interactive Simulation
            </span>
          </div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            Visual Code & Memory Animator
          </h3>
          <p className="text-xs text-slate-400">See exactly what happens inside computer memory & CPU when your code runs!</p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setAnimType('variables')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              animType === 'variables' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            📦 Memory & Variables
          </button>
          <button
            onClick={() => setAnimType('loops')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              animType === 'loops' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            🔁 Loop Step-by-Step
          </button>
          <button
            onClick={() => setAnimType('pointers')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              animType === 'pointers' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            🎯 Pointers & Addresses
          </button>
          <button
            onClick={() => setAnimType('stack')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              animType === 'stack' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            🥞 Call Stack
          </button>
        </div>
      </div>

      {/* --- ANIMATION 1: VARIABLES & RAM BLOCKS --- */}
      {animType === 'variables' && (
        <div className="space-y-6">
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <p className="text-xs font-mono text-emerald-400 mb-2"># Live RAM Memory Grid (Simulated Computer Memory)</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {vars.map((v, i) => (
                <div
                  key={i}
                  className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-4 shadow-lg shadow-emerald-500/5 hover:border-emerald-400 transition-transform hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-1 mb-2">
                    <span className="font-mono text-cyan-400">{v.address}</span>
                    <span className="bg-slate-800 px-2 py-0.5 rounded text-[10px] uppercase font-bold text-slate-300">
                      {v.type}
                    </span>
                  </div>
                  <div className="text-center py-2">
                    <div className="text-xs text-slate-400 font-mono">variable: <strong className="text-white">{v.name}</strong></div>
                    <div className="text-xl font-bold font-mono text-emerald-300 mt-1">{v.val}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add variable input */}
          <form onSubmit={addVariable} className="flex flex-wrap items-center gap-3 bg-slate-950/40 p-4 rounded-2xl border border-slate-800">
            <span className="text-xs text-slate-300 font-medium">Add a variable to RAM:</span>
            <input
              type="text"
              placeholder="Name (e.g. userAge)"
              value={newVarName}
              onChange={(e) => setNewVarName(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
            />
            <input
              type="text"
              placeholder="Value (e.g. 21)"
              value={newVarVal}
              onChange={(e) => setNewVarVal(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
            />
            <button type="submit" className="btn-primary py-1.5 px-4 text-xs font-bold">
              Allocate in RAM 🚀
            </button>
          </form>
        </div>
      )}

      {/* --- ANIMATION 2: LOOP STEP-BY-STEP --- */}
      {animType === 'loops' && (
        <div className="space-y-6">
          <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <p className="text-xs font-mono text-slate-400">
                <span className="text-purple-400 font-bold">for</span> (int i = 0; i &lt; items.length; i++) {'{'}
              </p>
              <p className="text-xs font-mono pl-4 text-emerald-400">
                print(items[i]);
              </p>
              <p className="text-xs font-mono text-slate-400">{'}'}</p>

              <div className="pt-2 flex items-center gap-3">
                <button onClick={stepLoop} className="btn-primary py-1.5 px-4 text-xs font-bold flex items-center gap-2">
                  <span>Step Loop Iteration ⏭️</span>
                </button>
                <button onClick={() => setLoopStep(0)} className="btn-secondary py-1.5 px-3 text-xs">
                  Reset 🔄
                </button>
              </div>
            </div>

            {/* Loop Visual State */}
            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 min-w-[260px] text-center space-y-3">
              <div className="text-xs text-slate-400 font-bold">CURRENT CPU LOOP STATE</div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-xs text-slate-400">Loop Counter (i):</span>
                <span className="text-xl font-mono font-bold text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-xl border border-cyan-500/30">
                  {loopStep}
                </span>
              </div>
              <div className="text-xs">
                {loopStep < maxSteps ? (
                  <span className="text-emerald-400 font-semibold">
                    Condition (i &lt; 4): <span className="underline">TRUE</span> ✅ (Loop Continues)
                  </span>
                ) : (
                  <span className="text-red-400 font-semibold">
                    Condition (4 &lt; 4): <span className="underline">FALSE</span> 🛑 (Loop Finished!)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Array Items Highlight */}
          <div className="grid grid-cols-4 gap-3">
            {loopItems.map((item, index) => {
              const isCurrent = loopStep === index;
              const isPast = loopStep > index;
              return (
                <div
                  key={index}
                  className={`p-4 rounded-2xl text-center border transition-all ${
                    isCurrent
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 scale-105 shadow-lg shadow-emerald-500/20'
                      : isPast
                      ? 'bg-slate-900/40 border-slate-800 text-slate-500'
                      : 'bg-slate-900 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="text-[10px] font-mono text-slate-400 mb-1">Index [{index}]</div>
                  <div className="text-sm font-bold">{item}</div>
                  {isCurrent && (
                    <div className="text-[10px] font-bold text-emerald-400 mt-2 animate-bounce">
                      👆 Active Item
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --- ANIMATION 3: POINTERS & ADDRESS ARROWS --- */}
      {animType === 'pointers' && (
        <div className="space-y-6">
          <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-xs font-mono text-emerald-400">
                  int* ptr = &amp;{memorySlots[pointedTarget].label}; // ptr stores address {memorySlots[pointedTarget].address}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Dereferencing (*ptr) gives you the exact value <strong className="text-emerald-300">{memorySlots[pointedTarget].value}</strong>!
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Point ptr to:</span>
                {memorySlots.map((slot, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPointedTarget(idx)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                      pointedTarget === idx
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    &amp;{slot.label} ({slot.address})
                  </button>
                ))}
              </div>
            </div>

            {/* Pointer Arrow Visualization */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
              {memorySlots.map((slot, idx) => {
                const isPointed = pointedTarget === idx;
                return (
                  <div
                    key={idx}
                    className={`p-5 rounded-2xl border transition-all relative ${
                      isPointed
                        ? 'bg-cyan-500/15 border-cyan-400 shadow-xl shadow-cyan-500/15 scale-105'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    {isPointed && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-400 text-slate-950 text-[10px] font-extrabold px-3 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                        🎯 ptr points here
                      </div>
                    )}
                    <div className="text-xs font-mono text-slate-400 mb-1 flex justify-between">
                      <span>Address:</span>
                      <span className="text-cyan-400 font-bold">{slot.address}</span>
                    </div>
                    <div className="text-center py-2">
                      <div className="text-xs text-slate-400 font-mono">Variable: <strong className="text-white text-sm">{slot.label}</strong></div>
                      <div className="text-2xl font-bold font-mono text-emerald-300 mt-1">{slot.value}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* --- ANIMATION 4: CALL STACK --- */}
      {animType === 'stack' && (
        <div className="space-y-6">
          <div className="bg-slate-950/70 p-5 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-white">Call Stack Execution (LIFO - Last In, First Out)</h4>
              <p className="text-xs text-slate-400 mt-1">When a function is called, it gets pushed onto the stack. When it returns, it pops off!</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={pushStack} className="btn-primary py-1.5 px-4 text-xs font-bold">
                Call Function (Push) ➕
              </button>
              <button onClick={popStack} className="btn-secondary py-1.5 px-4 text-xs font-bold">
                Return (Pop) ➖
              </button>
            </div>
          </div>

          <div className="max-w-md mx-auto space-y-2 bg-slate-950 p-4 rounded-3xl border border-slate-800">
            <div className="text-center text-[11px] text-slate-500 font-mono uppercase pb-1">Top of Stack (Currently Executing) ⬇️</div>
            {callStack.slice().reverse().map((fn, idx) => {
              const isTop = idx === 0;
              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl text-center font-mono text-xs font-bold transition-all ${
                    isTop
                      ? 'bg-purple-500/20 border border-purple-500/40 text-purple-200 shadow-lg shadow-purple-500/10 scale-102 animate-pulse'
                      : 'bg-slate-900 border border-slate-800 text-slate-400'
                  }`}
                >
                  <span>⚡ {fn}</span> {isTop && <span className="text-[10px] bg-purple-500/30 px-2 py-0.5 rounded-full ml-2">ACTIVE</span>}
                </div>
              );
            })}
            <div className="text-center text-[11px] text-slate-500 font-mono uppercase pt-1">Stack Base (Memory Foundation) ⬆️</div>
          </div>
        </div>
      )}
    </div>
  );
}
