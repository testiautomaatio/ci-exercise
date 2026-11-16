import { expect, test } from 'vitest';

const BASE = 'http://localhost:3000';

test.describe('endpoints not requiring authentication', () => {

    test('GET /', async () => {
        const root = await fetch(BASE + '/');
        expect(root.status).toBe(200);
    });

    test('GET /health', async () => {
        const root = await fetch(BASE + '/health');
        expect(root.status).toBe(200);
    });
});

test.describe('endpoints requiring authentication', () => {
    const passwords = {
        xkcd: 'correct horse battery staple',
        spaceballs: '12345'
    };
    const tokens = {
        xkcd: '',
        spaceballs: ''
    };

    test.beforeAll(async () => {
        tokens.xkcd = (await login('xkcd', passwords.xkcd))[1].token;
        tokens.spaceballs = (await login('spaceballs', passwords.spaceballs))[1].token;
    });

    test('POST /workouts creates a workout for the authenticated user', async () => {
        const [status, workout] = await post('/workouts', tokens.xkcd, { name: 'Morning run', durationMinutes: 30 });
        expect(status).toBe(201);
        expect(workout).toEqual({
            id: expect.any(String),
            username: 'xkcd',
            name: 'Morning run',
            durationMinutes: 30
        });
    });

    test('POST /workouts returns 400 for invalid workout data', async () => {
        const [status1] = await post('/workouts', tokens.xkcd, { name: '', durationMinutes: 30 });
        expect(status1).toBe(400);

        const [status3] = await post('/workouts', tokens.xkcd, { foo: 'bar' });
        expect(status3).toBe(400);

        const [status4] = await post('/workouts', tokens.xkcd, { durationMinutes: 30 });
        expect(status4).toBe(400);
    });

    test('GET /workouts returns only the workouts of the authenticated user', async () => {
        const [status1] = await post('/workouts', tokens.xkcd, { name: 'XKCD', durationMinutes: 30 });
        const [status2] = await post('/workouts', tokens.spaceballs, { name: 'Spaceball', durationMinutes: 31 });

        expect(status1).toBe(201);
        expect(status2).toBe(201);

        const [, xkcdWorkouts] = await get('/workouts', tokens.xkcd);
        expect(xkcdWorkouts.length).toBeGreaterThan(0);
        expect(xkcdWorkouts.every((w: any) => w.username === 'xkcd')).toBe(true);

        const [, spaceballsWorkouts] = await get('/workouts', tokens.spaceballs);
        expect(spaceballsWorkouts.length).toBeGreaterThan(0);
        expect(spaceballsWorkouts.every((w: any) => w.username === 'spaceballs')).toBe(true);
    });

    test('GET /workouts/:id returns 404 for a workout that does not belong to the authenticated user', async () => {
        const [, workout] = await post('/workouts', tokens.xkcd, { name: 'XKCD', durationMinutes: 30 });
        const [status] = await get(`/workouts/${workout.id}`, tokens.spaceballs);
        expect(status).toBe(404);
    });

    test('GET /workouts/:id returns 404 for a workout that does not exist', async () => {
        const [status] = await get(`/workouts/nonexistent`, tokens.xkcd);
        expect(status).toBe(404);
    });
});


async function login(username: string, password: string): Promise<[number, any]> {
    const response = await fetch(BASE + '/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });
    return [response.status, await response.json()];
}

async function get(path: string, token: string): Promise<[number, any]> {
    const response = await fetch(BASE + path, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return [response.status, await response.json()];
}

async function post(path: string, token: string, body: any): Promise<[number, any]> {
    const response = await fetch(BASE + path, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });

    return [response.status, await response.json()];
}
