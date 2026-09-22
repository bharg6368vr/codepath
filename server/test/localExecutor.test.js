const test = require('node:test');
const assert = require('node:assert/strict');
const { resolveCommand } = require('../src/services/localExecutor');

test('resolves Python to python on Windows', () => {
  assert.equal(resolveCommand('python', { platform: 'win32' }), 'python');
});

test('resolves GCC to gcc on Windows', () => {
  assert.equal(resolveCommand('gcc', { platform: 'win32' }), 'gcc');
});
