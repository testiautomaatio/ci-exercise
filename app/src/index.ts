import { randomBytes, randomUUID, scrypt, timingSafeEqual } from 'node:crypto';
import { openSync, writeSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { stripVTControlCharacters } from 'node:util';
import { serve } from '@hono/node-server';
import { Hono, type Context } from 'hono';
import { jwt, sign } from 'hono/jwt';
import { logger } from 'hono/logger';

type WorkoutInput = {
  name: string;
  durationMinutes: number;
};

type Workout = WorkoutInput & { id: string };

type User = {
  username: string;
  salt: string;
  passwordHash: string;
};

const userData: unknown = JSON.parse(await readFile(new URL('../users.json', import.meta.url), 'utf8'));
if (!Array.isArray(userData) || userData.length === 0 || !userData.every((user: unknown) =>
  user !== null && typeof user === 'object' &&
  'username' in user && typeof user.username === 'string' && user.username.length > 0 &&
  'salt' in user && typeof user.salt === 'string' && /^[0-9a-f]{32}$/.test(user.salt) &&
  'passwordHash' in user && typeof user.passwordHash === 'string' && /^[0-9a-f]{128}$/.test(user.passwordHash)
)) {
  throw new Error('Invalid users.json');
}
const users: User[] = userData;
if (new Set(users.map((user) => user.username)).size !== users.length) {
  throw new Error('Duplicate usernames in users.json');
}

const app = new Hono();
const workouts = new Map<string, Workout>();
const jwtSecret = randomBytes(32).toString('hex');
const logFile = openSync(process.env.APP_LOG_PATH ?? new URL('../app.log', import.meta.url), 'a');

function log(message: string) {
  console.log(message);
  writeSync(logFile, `${stripVTControlCharacters(message)}\n`);
}

app.use('*', logger(log));

function deriveKey(password: string, salt: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, 64, (error, key) => {
      if (error) reject(error);
      else resolve(key);
    });
  });
}

app.get('/', (c) => c.json({ message: 'Welcome to the Workout API' }));

app.get('/health', (c) => c.json({
  status: 'ok',
  check: 'dummy',
  message: 'Dummy health check: no dependencies are checked',
}));

app.post('/auth/login', async (c) => {
  let body: unknown;
  try {
    body = await c.req.json();
  } catch (error) {
    if (error instanceof SyntaxError) return c.json({ error: 'Invalid login request' }, 400);
    throw error;
  }

  if (
    !body || typeof body !== 'object' || Array.isArray(body) ||
    !('username' in body) || typeof body.username !== 'string' ||
    !('password' in body) || typeof body.password !== 'string'
  ) {
    return c.json({ error: 'Invalid login request' }, 400);
  }

  const user = users.find((candidate) => candidate.username === body.username);
  const hashUser = user ?? users[0];
  const hash = await deriveKey(body.password, hashUser.salt);
  if (!timingSafeEqual(hash, Buffer.from(hashUser.passwordHash, 'hex')) || !user) {
    return c.json({ error: 'Invalid credentials' }, 401);
  }

  const token = await sign({ sub: user.username, exp: Math.floor(Date.now() / 1000) + 3600 }, jwtSecret, 'HS256');
  return c.json({ token });
});

app.use('*', jwt({ secret: jwtSecret, alg: 'HS256' }));

async function readWorkout(c: Context): Promise<WorkoutInput | null> {
  let body: unknown;
  try {
    body = await c.req.json();
  } catch (error) {
    if (error instanceof SyntaxError) {
      return null;
    }
    throw error;
  }

  if (
    !body || typeof body !== 'object' || Array.isArray(body) ||
    Object.keys(body).some((key) => !['name', 'durationMinutes'].includes(key)) ||
    !('name' in body) || !('durationMinutes' in body) ||
    typeof body.name !== 'string' || !body.name.trim() ||
    typeof body.durationMinutes !== 'number' ||
    !Number.isInteger(body.durationMinutes) || body.durationMinutes <= 0
  ) {
    return null;
  }

  return { name: body.name.trim(), durationMinutes: body.durationMinutes };
}

app.get('/workouts', (c) => c.json([...workouts.values()]));

app.get('/workouts/:id', (c) => {
  const workout = workouts.get(c.req.param('id'));
  return workout ? c.json(workout) : c.json({ error: 'Workout not found' }, 404);
});

app.post('/workouts', async (c) => {
  const data = await readWorkout(c);
  if (!data) return c.json({ error: 'Invalid workout' }, 400);

  const workout = { id: randomUUID(), ...data };
  workouts.set(workout.id, workout);
  return c.json(workout, 201);
});

app.put('/workouts/:id', async (c) => {
  const id = c.req.param('id');
  if (!workouts.has(id)) return c.json({ error: 'Workout not found' }, 404);

  const data = await readWorkout(c);
  if (!data) return c.json({ error: 'Invalid workout' }, 400);

  const workout = { id, ...data };
  workouts.set(id, workout);
  return c.json(workout);
});

app.delete('/workouts/:id', (c) => {
  if (!workouts.delete(c.req.param('id'))) {
    return c.json({ error: 'Workout not found' }, 404);
  }
  return c.body(null, 204);
});

const port = 3000;
serve({ fetch: app.fetch, port }, () => {
  log(`Workout API listening on http://localhost:${port}`);
});
