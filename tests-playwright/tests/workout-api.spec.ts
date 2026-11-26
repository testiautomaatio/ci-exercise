import { test, expect, APIRequestContext, request } from '@playwright/test';

const users = {
    xkcd: { username: `xkcd`, password: `correct horse battery staple` },
    spaceballs: { username: `spaceballs`, password: `12345` }
};

type User = typeof users.xkcd;

type Workout = {
    id?: string;
    username?: string;
    name: string;
    durationMinutes: number;
};

test.describe('public endpoints', () => {
    test('/', async ({ request }) => {
        const resp = await request.get(`/`);
        expect(resp.ok()).toBe(true);
    });

    test('/health', async ({ request }) => {
        const resp = await request.get(`/health`);
        expect(resp.ok()).toBe(true);
    });
});

test.describe('/auth/login', () => {
    test('login with valid credentials returns a token', async ({ request }) => {
        const resp = await request.post(`/auth/login`, { data: users.xkcd });

        expect(resp.ok()).toBe(true);
        expect(await resp.json()).toHaveProperty('token');
    });

    test('login with invalid credentials returns 401', async ({ request }) => {
        const resp = await request.post(`/auth/login`, { data: { ...users.xkcd, password: `wrong password` } });

        expect(resp.status()).toBe(401);
    });

    test('login with non-existent user returns 401', async ({ request }) => {
        const resp = await request.post(`/auth/login`, { data: { username: `nonexistent`, password: `doesntmatter` } });

        expect(resp.status()).toBe(401);
    });

    test('login with missing fields returns 400', async ({ request }) => {
        const resp = await request.post(`/auth/login`, { data: { username: users.xkcd.username } });
        expect(resp.status()).toBe(400);
    });

    test('login with invalid JSON returns 400', async ({ request }) => {
        const resp = await request.post(`/auth/login`, { data: "} invalid json {" });
        expect(resp.status()).toBe(400);
    });
});

test.describe('/workouts', () => {
    // separate contexts for each user for authenticated requests, so that we can test multiple users in parallel
    let xkcd: APIRequestContext;
    let spaceballs: APIRequestContext;

    test.beforeAll(async () => {
        xkcd = await setupUserContext(users.xkcd);
        spaceballs = await setupUserContext(users.spaceballs);
    });

    test.describe('getting workouts', () => {
        let xkcdWorkout: Workout;
        let spaceballsWorkout: Workout;

        test.beforeAll(async () => {
            xkcdWorkout = await createWorkout(xkcd, { name: 'XKCD Workout', durationMinutes: 30 });
            spaceballsWorkout = await createWorkout(spaceballs, { name: 'Spaceballs Workout', durationMinutes: 45 });
        });

        test('users get a list of their own workouts', async () => {
            const resp = await xkcd.get(`/workouts`);

            expect(resp.ok()).toBe(true);

            const workouts = await resp.json();
            expect(workouts).toContainEqual(xkcdWorkout);
            expect(workouts).not.toContainEqual(spaceballsWorkout);
        });

        test('users can access individual workouts by ID', async () => {
            const resp = await xkcd.get(`/workouts/${xkcdWorkout.id}`);
            expect(resp.ok()).toBe(true);

            const workout = await resp.json();
            expect(workout).toEqual(xkcdWorkout);
        });

        test('unauthenticated users get 401', async ({ request }) => {
            const resp = await request.get(`/workouts`);
            expect(resp.status()).toBe(401);
        });

        test('users cannot access other users workouts', async () => {
            const resp = await spaceballs.get(`/workouts/${xkcdWorkout.id}`);
            expect(resp.status()).toBe(404);
        });

        test('users get 404 for non-existent workouts', async () => {
            const resp = await xkcd.get(`/workouts/nonexistent`);
            expect(resp.status()).toBe(404);
        });
    });

    test.describe('creating workouts', () => {
        test('authenticated users can create new workouts', async () => {
            const resp = await xkcd.post(`/workouts`, { data: { name: 'Test Workout', durationMinutes: 30 } });
            expect(resp.ok()).toBe(true);

            expect(await resp.json()).toMatchObject({
                id: expect.any(String),
                name: 'Test Workout',
                durationMinutes: 30,
                username: users.xkcd.username
            });
        });

        test('workouts need a name and durationMinutes', async () => {
            const resp = await xkcd.post(`/workouts`, { data: { name: 'Incomplete Workout' } });
            expect(resp.status()).toBe(400);
        });

        test('unauthenticated users cannot create workouts', async ({ request }) => {
            const resp = await request.post(`/workouts`, { data: { name: 'Test Workout', durationMinutes: 30 } });
            expect(resp.status()).toBe(401);
        });

        test('api handles invalid JSON gracefully', async () => {
            const resp = await xkcd.post(`/workouts`, { data: "} invalid json {" });
            expect(resp.status()).toBe(400);
        });
    });

    test.describe('updating workouts', () => {
        let workout: Workout;

        test.beforeEach(async () => {
            workout = await createWorkout(xkcd, {
                name: 'Workout to update', durationMinutes: 15
            });
        });

        test('users can update their own workouts', async () => {
            const resp = await xkcd.put(`/workouts/${workout.id}`, {
                data: { name: 'Updated name', durationMinutes: 25 }
            });
            expect(resp.ok()).toBe(true);
            expect(await resp.json()).toMatchObject({
                ...workout,
                name: 'Updated name',
                durationMinutes: 25
            });
        });

        test('users cannot update other users workouts', async () => {
            const resp = await spaceballs.put(`/workouts/${workout.id}`, {
                data: { name: 'Hacked name', durationMinutes: 99 }
            });
            expect(resp.status()).toBe(404);
        });

        test('unauthenticated users cannot update workouts', async ({ request }) => {
            const resp = await request.put(`/workouts/${workout.id}`, {
                data: { name: 'Hacked name', durationMinutes: 99 }
            });
            expect(resp.status()).toBe(401);
        });

        test('updates to non-existent workouts return 404', async () => {
            const resp = await xkcd.put(`/workouts/nonexistent`, {
                data: { name: 'Hacked name', durationMinutes: 99 }
            });
            expect(resp.status()).toBe(404);
        });

        test('updates require a name and durationMinutes', async () => {
            const resp = await xkcd.put(`/workouts/${workout.id}`, {
                data: { name: 'Incomplete update' }
            });
            expect(resp.status()).toBe(400);
        });

        test('api handles invalid JSON gracefully', async () => {
            const resp = await xkcd.put(`/workouts/${workout.id}`, { data: "} invalid json {" });
            expect(resp.status()).toBe(400);
        });
    });

    test.describe('deleting workouts', () => {
        let workout: Workout;

        test.beforeEach(async () => {
            workout = await createWorkout(xkcd, {
                name: 'Workout to delete',
                durationMinutes: 15
            });
        });

        test('users can delete their own workouts', async () => {
            const resp = await xkcd.delete(`/workouts/${workout.id}`);
            expect(resp.ok()).toBe(true);

            // verify that the workout is actually deleted
            const getResp = await xkcd.get(`/workouts/${workout.id}`);
            expect(getResp.status()).toBe(404);
        });

        test('users cannot delete other users workouts', async () => {
            const resp = await spaceballs.delete(`/workouts/${workout.id}`);
            expect(resp.status()).toBe(404);
        });

        test('unauthenticated users cannot delete workouts', async ({ request }) => {
            const resp = await request.delete(`/workouts/${workout.id}`);
            expect(resp.status()).toBe(401);
        });

        test('deleting a non-existent workout returns 404', async () => {
            const resp = await xkcd.delete(`/workouts/nonexistent`);
            expect(resp.status()).toBe(404);
        });
    });
});

/**
 * Creates a new APIRequestContext for the given user by logging
 * in and storing the token in the context's headers. This allows
 * us to make authenticated requests as that user without having
 * to set the Authorization header manually for each request.
 */
async function setupUserContext(user: User): Promise<APIRequestContext> {
    // first, create a new context where we can log in and get a token
    const ctx = await request.newContext();
    const resp = await ctx.post('/auth/login', { data: user });

    expect(resp.ok()).toBe(true);
    expect(await resp.json()).toHaveProperty('token');

    // then, create and return a new context with the token in the headers
    return await request.newContext({
        extraHTTPHeaders: {
            'Authorization': `Bearer ${(await resp.json()).token}`
        }
    });
}

/**
 * Creates a new workout for the given user context. This is a helper function
 * to avoid repeating the same code in multiple tests, where workouts are needed.
 */
async function createWorkout(ctx: APIRequestContext, workout: Workout): Promise<Workout> {
    const resp = await ctx.post(`/workouts`, { data: workout });
    expect(resp.ok()).toBe(true);
    return await resp.json();
}
