// Executes user-submitted code locally via each language's toolchain.
// This exists so the Coding Workspace works out of the box with no
// external Judge0 service or API key required. If JUDGE0_API_URL is set,
// server/src/services/compilerService.js proxies there instead.
const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const TIMEOUT_MS = 8000;

function resolveCommand(command, { platform = process.platform } = {}) {
  if (platform !== 'win32') return command;
  if (command === 'python3') return 'python';
  if (command === 'gcc') return 'gcc';
  if (command === 'g++') return 'g++';
  if (command === 'javac') return 'javac';
  if (command === 'java') return 'java';
  return command;
}

function run(cmd, args, { cwd, input }) {
  const executable = resolveCommand(cmd);
  return new Promise((resolve) => {
    const start = Date.now();
    const child = spawn(executable, args, { cwd });
    let stdout = '';
    let stderr = '';
    let timedOut = false;

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill('SIGKILL');
    }, TIMEOUT_MS);

    child.stdout.on('data', (d) => { stdout += d.toString(); });
    child.stderr.on('data', (d) => { stderr += d.toString(); });

    child.on('error', (err) => {
      clearTimeout(timer);
      resolve({ stdout, stderr: stderr + err.message, time: Date.now() - start, timedOut: false });
    });

    child.on('close', () => {
      clearTimeout(timer);
      resolve({
        stdout,
        stderr: timedOut ? stderr + '\nProcess timed out.' : stderr,
        time: Date.now() - start,
        timedOut,
      });
    });

    if (input) child.stdin.write(input);
    child.stdin.end();
  });
}

async function execute(language, code, stdin) {
  const workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'codepath-'));
  try {
    switch (language) {
      case 'python': {
        const file = path.join(workDir, 'main.py');
        fs.writeFileSync(file, code);
        return await run('python3', [file], { cwd: workDir, input: stdin });
      }
      case 'c': {
        const src = path.join(workDir, 'main.c');
        const bin = path.join(workDir, 'main.out');
        fs.writeFileSync(src, code);
        const compile = await run('gcc', [src, '-o', bin], { cwd: workDir });
        if (compile.stderr && !fs.existsSync(bin)) return compile;
        return await run(bin, [], { cwd: workDir, input: stdin });
      }
      case 'cpp': {
        const src = path.join(workDir, 'main.cpp');
        const bin = path.join(workDir, 'main.out');
        fs.writeFileSync(src, code);
        const compile = await run('g++', [src, '-o', bin, '-std=c++17'], { cwd: workDir });
        if (compile.stderr && !fs.existsSync(bin)) return compile;
        return await run(bin, [], { cwd: workDir, input: stdin });
      }
      case 'java': {
        // Java requires the public class name to match the file name.
        const className = (code.match(/public\s+class\s+(\w+)/) || [, 'Main'])[1];
        const src = path.join(workDir, `${className}.java`);
        fs.writeFileSync(src, code);
        const compile = await run('javac', [src], { cwd: workDir });
        if (compile.stderr && !fs.existsSync(path.join(workDir, `${className}.class`))) return compile;
        return await run('java', ['-cp', workDir, className], { cwd: workDir, input: stdin });
      }
      default:
        return { stdout: '', stderr: `Unsupported language: ${language}`, time: 0 };
    }
  } finally {
    fs.rmSync(workDir, { recursive: true, force: true });
  }
}

module.exports = { execute, resolveCommand };
