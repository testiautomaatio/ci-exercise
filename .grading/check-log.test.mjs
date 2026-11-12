import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const script = fileURLToPath(new URL('./check-log.mts', import.meta.url));
const config = JSON.parse(readFileSync(new URL('./config.json', import.meta.url), 'utf8'));

test('grading checks recognize matching startup and response lines', (t) => {
  const dir = mkdtempSync(join(tmpdir(), 'workout-grading-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  mkdirSync(join(dir, 'app'));
  const appLog = join(dir, 'app', 'app.log');

  for (const check of config.tests) {
    const startup = check.name === 'Application started';
    const args = startup ? [] : check.run.split(' ').slice(2);
    const [method, path, status] = args;
    const line = startup
      ? 'Workout API listening on http://localhost:3000'
      : `--> ${method} ${path.replace(':id', 'example-id')}?query=1 ${status} 1ms`;
    writeFileSync(appLog, `${line}\n`);
    const run = () => startup
      ? spawnSync('bash', ['-c', check.run], { cwd: dir, encoding: 'utf8' })
      : spawnSync(process.execPath, [script, ...args], { cwd: dir, encoding: 'utf8' });
    const result = run();
    assert.equal(result.status, 0, `${check.name}: ${result.stderr}`);
    assert.match(result.stdout, startup ? /listening/ : /Great!/);
    writeFileSync(appLog, '');
    const missing = run();
    assert.equal(missing.status, 1, check.name);
    if (!startup) assert.match(missing.stderr, /does not show/);
  }
});

test('matching distinguishes methods, paths, statuses, and completed requests', (t) => {
  const dir = mkdtempSync(join(tmpdir(), 'workout-grading-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  mkdirSync(join(dir, 'app'));
  const logFile = join(dir, 'app', 'app.log');
  writeFileSync(logFile, [
    '<-- GET /workouts',
    '--> GET /workouts 401 1ms',
    '--> GET /workouts/id/extra 200 1ms',
    '--> POST /workouts/id 200 1ms',
  ].join('\n'));

  const check = (...args) => spawnSync(process.execPath, [script, ...args], { cwd: dir, encoding: 'utf8' });
  const wrongStatus = check('GET', '/workouts', '200');
  assert.equal(wrongStatus.status, 1);
  assert.match(wrongStatus.stderr, /none returned HTTP 200.*401/);
  const missingEndpoint = check('GET', '/workouts/:id', '200');
  assert.equal(missingEndpoint.status, 1);
  assert.match(missingEndpoint.stderr, /does not show a completed GET request/);
  assert.equal(check('POST', '/workouts/:id', '200').status, 0);
});

test('missing logs and invalid arguments report errors', (t) => {
  const dir = mkdtempSync(join(tmpdir(), 'workout-grading-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const missing = spawnSync(process.execPath, [script, 'GET', '/workouts', '200'], { cwd: dir, encoding: 'utf8' });
  assert.equal(missing.status, 1);
  assert.match(missing.stderr, /Could not read app\/app\.log/);
  const invalid = spawnSync(process.execPath, [script, 'GET', '/workouts', 'abc'], { encoding: 'utf8' });
  assert.equal(invalid.status, 2);
  assert.match(invalid.stderr, /Usage:/);
});
