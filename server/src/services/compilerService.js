const axios = require('axios');
const localExecutor = require('./localExecutor');

// Judge0 CE language IDs
const JUDGE0_LANGUAGE_IDS = {
  python: 71,
  java: 62,
  cpp: 54,
  c: 50,
};

async function runViaJudge0(language, code, stdin) {
  const base = process.env.JUDGE0_API_URL.replace(/\/$/, '');
  const headers = { 'Content-Type': 'application/json' };
  if (process.env.JUDGE0_API_KEY) {
    headers['X-RapidAPI-Key'] = process.env.JUDGE0_API_KEY;
  }
  const { data } = await axios.post(
    `${base}/submissions?base64_encoded=false&wait=true`,
    {
      source_code: code,
      language_id: JUDGE0_LANGUAGE_IDS[language],
      stdin: stdin || '',
    },
    { headers, timeout: 15000 }
  );
  return {
    stdout: data.stdout || '',
    stderr: data.stderr || data.compile_output || (data.message ?? ''),
    time: data.time ? Math.round(parseFloat(data.time) * 1000) : null,
  };
}

async function runCode(language, code, stdin) {
  if (!JUDGE0_LANGUAGE_IDS[language]) {
    throw Object.assign(new Error('Unsupported language'), { status: 400 });
  }
  if (process.env.JUDGE0_API_URL) {
    return runViaJudge0(language, code, stdin);
  }
  return localExecutor.execute(language, code, stdin);
}

module.exports = { runCode };
