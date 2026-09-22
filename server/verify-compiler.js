const http = require('http');

const tests = [
  { language: 'python', code: 'print(2+3)', stdin: '' },
  { language: 'java', code: 'public class Main { public static void main(String[] args) { System.out.println(42); } }', stdin: '' },
  { language: 'c', code: '#include <stdio.h>\nint main(){printf("hi\\n");return 0;}', stdin: '' },
  { language: 'cpp', code: '#include <iostream>\nint main(){std::cout << "ok" << std::endl; return 0;}', stdin: '' },
];

function post(body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = http.request({ hostname: 'localhost', port: 4000, path: '/api/compiler/run', method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) } }, (res) => {
      let raw = '';
      res.on('data', (chunk) => raw += chunk);
      res.on('end', () => resolve(JSON.parse(raw)));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

(async () => {
  for (const test of tests) {
    const result = await post(test);
    console.log(`[${test.language}] stdout=${JSON.stringify(result.stdout)} stderr=${JSON.stringify(result.stderr)}`);
  }
})();
