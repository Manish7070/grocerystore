// Runs the real Mongo-backed smoke suite against an isolated ephemeral API port.
const { spawn } = require('node:child_process');
const path = require('node:path');
const mongoose = require('mongoose');
const app = require('../server');

const server = app.listen(0, '127.0.0.1', () => {
  const child = spawn(process.execPath, [path.join(__dirname, 'smoke-test.js')], {
    stdio: 'inherit',
    env: { ...process.env, SMOKE_API_URL: `http://127.0.0.1:${server.address().port}/api` },
  });
  let finished = false;
  const finish = async (code) => {
    if (finished) return;
    finished = true;
    await new Promise((resolve) => server.close(resolve));
    await mongoose.disconnect();
    process.exitCode = code;
  };
  child.on('exit', (code) => { void finish(code ?? 1); });
  child.on('error', (error) => { console.error(error.message); void finish(1); });
});
