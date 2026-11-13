import { readFileSync } from 'node:fs';

const [method, path, status] = process.argv.slice(2);
if (!method || !path?.startsWith('/') || !/^[1-5]\d{2}$/.test(status ?? '') || process.argv.length !== 5) {
  console.error('Usage: node .grading/check-log.mts METHOD PATH STATUS');
  process.exit(2);
}

let log: string;
try {
  log = readFileSync('app/app.log', 'utf8');
} catch (error) {
  console.error(`Could not read app/app.log: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}

const expected = path.split('/');
const statuses = new Set<string>();

for (const line of log.split(/\r?\n/)) {
  const response = /^--> (\S+) (\S+) (\d{3})(?:\s|$)/.exec(line);
  if (!response || response[1] !== method) continue;

  const actual = response[2].split('?')[0].split('/');
  if (actual.length === expected.length && expected.every((part, i) =>
    part.startsWith(':') ? actual[i] !== '' : part === actual[i]
  )) {
    statuses.add(response[3]);
  }
}

if (statuses.has(status)) {
  console.log(`Great! The log shows a ${method} request to ${path} returned HTTP ${status}.`);
} else if (statuses.size) {
  console.error(`The log shows ${method} requests to ${path}, but none returned HTTP ${status}. Observed status codes: ${[...statuses].join(', ')}.`);
  process.exitCode = 1;
} else {
  console.error(`The log does not show a completed ${method} request to ${path} returning HTTP ${status}. Check that your tests call this endpoint.`);
  process.exitCode = 1;
}
