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
        tokens.xkcd = await login('xkcd', passwords.xkcd);
        tokens.spaceballs = await login('spaceballs', passwords.spaceballs);
    });

    test('GET /workouts returns only the workouts of the authenticated user', async () => {
        const xkcdWorkouts = await get('/workouts', tokens.xkcd);
        expect(xkcdWorkouts.every((w: any) => w.username === 'xkcd')).toBe(true);

        const spaceballsWorkouts = await get('/workouts', tokens.spaceballs);
        expect(spaceballsWorkouts.every((w: any) => w.username === 'spaceballs')).toBe(true);
    });
});


async function login(username: string, password: string): Promise<string> {
    const response = await fetch(BASE + '/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });
    if (!response.ok) {
        throw new Error(`Login failed with status ${response.status}`);
    }
    return (await response.json()).token;
}

async function get(path: string, token: string): Promise<any> {
    const response = await fetch(BASE + path, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error(`GET failed with status ${response.status}`);
    }
    return response.json();
}
