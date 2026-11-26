import { test, describe, expect } from 'vitest';

describe('public endpoints', () => {

    test('root returns ok 200 and a json message', async () => {
        const response = await fetch('http://localhost:3000')
        expect(response.ok).toBeTruthy();

        expect(response.headers.get('Content-Type')).toContain('json');
    });

    test('healthcheck returns the health status', async () => {
        const response = await fetch('http://localhost:3000/health');
        expect(response.ok).toBeTruthy();

        const json = await response.json();
        expect(json.status).toBe("ok");
    });
});

describe.skip('authentication with /auth/login', () => {

    test('accepts valid credentials and returns a token', async () => {
        // todo
    });

    test('rejects requests with incorrect credentials', async () => {
        // todo
    });

    test('rejects requests with invalid JSON payload', async () => {
        // todo
    });
});

describe.skip('handling workouts', () => {
    let xkcdToken = '';
    let spaceballsToken = '';

    test.beforeAll(async () => {
        // todo: authenticate and save the token for the next requests
        xkcdToken = 'replace me';
        spaceballsToken = 'replace me';
    });

    test.describe('fetching workouts', () => {
        let xkcdWorkout = null;
        let spaceballsWorkout = null;

        test.beforeAll(async () => {
            // create a workout for both the xkcd and the spaceballs users,
            // save them in variables so they can be used in the tests.
        });

        test('users can fetch a list of their own workouts', async () => {
            // todo
        });

        test('users can fetch their workouts with the workout id', async () => {
            // todo: use the workouts created in the beforeAll hook
        });

        test('user cannot fetch other users workouts', async () => {

        });
    });

    test.describe('creating workouts', () => {

    });

    test.describe('updating workouts', () => {

    });

    test.describe('deleting workouts', () => {

    });


    // todo: add new blocks for all other use cases
});
