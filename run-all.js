const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const rootDir = __dirname;
const ragDir = path.join(rootDir, 'rag-service');
const serverDir = path.join(rootDir, 'server');
const clientDir = path.join(rootDir, 'client');

// Locate Python venv
let pythonCmd = 'python';
const venvPython1 = path.join(rootDir, '..', '.venv', 'Scripts', 'python.exe');
const venvPython2 = path.join(rootDir, '.venv', 'Scripts', 'python.exe');
if (fs.existsSync(venvPython1)) {
  pythonCmd = venvPython1;
} else if (fs.existsSync(venvPython2)) {
  pythonCmd = venvPython2;
}

console.log('====================================================');
console.log('       🚀 STARTING CODEPATH ALL-IN-ONE SYSTEM       ');
console.log('====================================================');
console.log(`[Config] Root Directory:   ${rootDir}`);
console.log(`[Config] Python Executable: ${pythonCmd}`);

const children = [];

function startProcess(name, cmd, args, cwd, colorPrefix) {
  console.log(`\n▶ Starting [${name}]...`);
  const child = spawn(cmd, args, {
    cwd,
    stdio: 'pipe',
    shell: true,
    env: { ...process.env, FORCE_COLOR: '1' }
  });

  child.stdout.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    lines.forEach(line => {
      if (line.trim()) console.log(`${colorPrefix}[${name}] \x1b[0m${line}`);
    });
  });

  child.stderr.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    lines.forEach(line => {
      if (line.trim()) console.log(`${colorPrefix}[${name} Error] \x1b[0m${line}`);
    });
  });

  child.on('close', (code) => {
    console.log(`\x1b[31m[${name}] process exited with code ${code}\x1b[0m`);
  });

  children.push({ name, child });
  return child;
}

// 1. Start RAG AI Service (Flask :5001)
startProcess('RAG-AI-Service', pythonCmd, ['app.py'], ragDir, '\x1b[35m');

// 2. Start Backend Server (Express :4000)
startProcess('Backend-Server', 'node', ['src/index.js'], serverDir, '\x1b[36m');

// 3. Start Frontend Client (Vite :5173)
startProcess('Frontend-Client', 'npm', ['run', 'dev', '--', '--host'], clientDir, '\x1b[32m');

// Check when ready and open browser
let opened = false;
async function checkReadyAndOpen() {
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 1000));
    try {
      const res = await fetch('http://localhost:5173/');
      if (res.ok && !opened) {
        opened = true;
        console.log('\n====================================================');
        console.log('  ✨ ALL SERVICES ARE LIVE & READY!                  ');
        console.log('  🌐 Frontend:  http://localhost:5173               ');
        console.log('  ⚡ Backend:   http://localhost:4000/api/health     ');
        console.log('  🤖 AI RAG:    http://localhost:5001/health         ');
        console.log('====================================================\n');
        
        // Open browser on Windows
        try {
          execSync('start http://localhost:5173');
        } catch (e) {}
        break;
      }
    } catch (e) {
      // not ready yet
    }
  }
}

checkReadyAndOpen();

function cleanup() {
  console.log('\n🛑 Shutting down all CodePath services...');
  children.forEach(({ name, child }) => {
    try {
      if (process.platform === 'win32') {
        execSync(`taskkill /pid ${child.pid} /T /F`, { stdio: 'ignore' });
      } else {
        child.kill();
      }
    } catch (e) {}
  });
  console.log('✅ All services stopped.');
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
