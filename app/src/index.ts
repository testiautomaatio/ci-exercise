import { randomBytes, randomUUID, scrypt, timingSafeEqual } from 'node:crypto';
import { openSync, writeSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { stripVTControlCharacters } from 'node:util';
import { serve } from '@hono/node-server';
import { Hono, type Context } from 'hono';
import { jwt, sign, type JwtVariables } from 'hono/jwt';
import { logger } from 'hono/logger';

const ghActionsTimeoutSeconds = 300;
const port = 3000;
const sessionLifetimeSeconds = 3600;


type AppEnv = { Variables: JwtVariables };

type WorkoutInput = {
  name: string;
  durationMinutes: number;
};

type Workout = WorkoutInput & { id: string; username: string };

type User = {
  username: string;
  salt: string;
  passwordHash: string;
};

// Load users from users.json file
const users: User[] = JSON.parse(await readFile(new URL('../users.json', import.meta.url), 'utf8'));

// Create a Hono app instance
const app = new Hono<AppEnv>();

// In-memory storage for workouts
const workouts = new Map<string, Workout>();

// Generate a random secret for JWT signing, this makes the JWT secret unique for each server start, which is suitable for testing but not for production.
const jwtSecret = randomBytes(32).toString('hex');

// Write logs to a file, where they can be inspected during autograding
const logFile = openSync(process.env.APP_LOG_PATH ?? new URL('../logs/app.log', import.meta.url), 'a');

// Check if the app is running in GitHub Actions environment
const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';

/** Custom logger to save logs to a file */
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
  const invalidCredentials = { error: 'Invalid credentials' };
  const invalidLogin = { error: 'Invalid login request' };

  let body: unknown;
  try {
    body = await c.req.json();
  } catch (error) {
    if (error instanceof SyntaxError) {
      log(`Syntax error in JSON in login request`);
      return c.json(invalidLogin, 400)
    };
    throw error;
  }

  if (
    !body || typeof body !== 'object' || Array.isArray(body) ||
    !('username' in body) || typeof body.username !== 'string' ||
    !('password' in body) || typeof body.password !== 'string'
  ) {
    log(`Invalid login request body`);
    return c.json(invalidLogin, 400);
  }

  const user = users.find((candidate) => candidate.username === body.username);

  if (!user) {
    log(`Failed login attempt for non-existent user`);
    return c.json(invalidCredentials, 401);
  }

  const hash = await deriveKey(body.password, user.salt);
  if (!timingSafeEqual(hash, Buffer.from(user.passwordHash, 'hex'))) {
    log(`Wrong password attempt for user ${user.username}`);
    return c.json(invalidCredentials, 401);
  }

  log(`User ${user.username} logged in successfully`);
  const token = await sign({ sub: user.username, exp: Math.floor(Date.now() / 1000) + sessionLifetimeSeconds }, jwtSecret, 'HS256');
  return c.json({ token });
});

app.use('*', jwt({ secret: jwtSecret, alg: 'HS256' }));

function authenticatedUsername(c: Context<AppEnv>): string {
  const username = c.get('jwtPayload').sub;
  if (typeof username !== 'string') {
    throw new Error('Authenticated JWT is missing a subject');
  }
  return username;
}

async function readWorkout(c: Context): Promise<WorkoutInput | null> {
  let body: unknown;
  try {
    body = await c.req.json();
  } catch (error) {
    if (error instanceof SyntaxError) {
      log(`Syntax error in JSON in workout request`);
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
    log(`Invalid workout request body`);
    return null;
  }

  return { name: body.name.trim(), durationMinutes: body.durationMinutes };
}

app.get('/workouts', (c) => {
  const username = authenticatedUsername(c);
  return c.json([...workouts.values()].filter((workout) => workout.username === username));
});

app.get('/workouts/:id', (c) => {
  const workout = workouts.get(c.req.param('id'));
  const notFound = { error: 'Workout not found' };

  if (!workout) {
    log(`Workout not found`);
    return c.json(notFound, 404)
  };

  if (workout.username !== authenticatedUsername(c)) {
    log(`User tried to access a workout owned by another user: ${workout.id} owned by ${workout.username}`);
    // use status code 404 to avoid revealing the existence of the workout to unauthorized users
    return c.json(notFound, 404);
  }

  return c.json(workout);
});

app.post('/workouts', async (c) => {
  const data = await readWorkout(c);
  if (!data) {
    return c.json({ error: 'Invalid workout' }, 400)
  };

  const workout = { ...data, id: randomUUID(), username: authenticatedUsername(c) };
  workouts.set(workout.id, workout);
  return c.json(workout, 201);
});

app.put('/workouts/:id', async (c) => {
  const id = c.req.param('id');
  const data = await readWorkout(c);

  if (!data) {
    log(`Invalid workout data for update`);
    return c.json({ error: 'Invalid workout' }, 400);
  }

  const existingWorkout = workouts.get(id);
  if (existingWorkout?.username !== authenticatedUsername(c)) {
    if (existingWorkout) {
      log(`User ${authenticatedUsername(c)} attempted to update workout ${existingWorkout.id} owned by ${existingWorkout.username}`);
    } else {
      log(`Workout not found for update`);
    }
    return c.json({ error: 'Workout not found' }, 404);
  }

  const workout = { ...existingWorkout, ...data };
  workouts.set(id, workout);
  return c.json(workout);
});

app.delete('/workouts/:id', (c) => {
  const id = c.req.param('id');
  const workout = workouts.get(id);
  if (!workout) {
    log(`Workout not found for deletion`);
    return c.json({ error: 'Workout not found' }, 404);
  }
  if (workout?.username !== authenticatedUsername(c)) {
    log(`User attempted to delete workout owned by another user: ${workout.id} owned by ${workout.username}`);
    return c.json({ error: 'Workout not found' }, 404);
  }
  workouts.delete(id);
  return c.body(null, 204);
});

async function main() {
  log(`Running in GitHub Actions: ${isGitHubActions}`);

  log(`Starting Workout API on http://localhost:${port}`);

  // wait for 1 second to make the server more realistic for testing,
  // as servers typically take a moment to start up.
  await sleep(1_000);

  serve({ fetch: app.fetch, port }, () => {
    log(`Workout API listening on http://localhost:${port}`);
  });
}

main();


// when running in github actions, shut down the server after 300 seconds to avoid hanging the workflow
if (isGitHubActions) {
  setTimeout(() => {
    log(`Shutting down server after ${ghActionsTimeoutSeconds} seconds in GitHub Actions`);
    process.exit(0);
  }, ghActionsTimeoutSeconds * 1000);
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
