import { test } from '@playwright/test';
import { generateValidUser, ValidUser } from '../../fixtures/apiUsers';
import { assertApiResponse } from '../../utils/apiHelpers';

const BASE_URL = 'https://automationexercise.com/api';

test.describe('POST /createAccount', () => {
  let user: ValidUser;

  test.beforeEach(() => {
    user = generateValidUser();
  });

  test.afterEach(async ({ request }) => {
    await request
      .delete(`${BASE_URL}/deleteAccount`, {
        form: {
          email: user.email,
          password: user.password,
        },
      })
      .catch(() => {
        throw new Error(
          `Failed to delete test user with email ${user.email}. Manual cleanup may be required.`
        );
      });
  });

  test('Test Case 1: Register User', async ({ request }) => {
    await request
      .post(`${BASE_URL}/createAccount`, {
        form: { ...user },
      })
      .then(async (response) => {
        await assertApiResponse(response, 201, 'User created!');
      });

    await request
      .post(`${BASE_URL}/verifyLogin`, {
        form: {
          email: user.email,
          password: user.password,
        },
      })
      .then(async (response) => {
        await assertApiResponse(response, 200, 'User exists!');
      });

    await request
      .delete(`${BASE_URL}/deleteAccount`, {
        form: {
          email: user.email,
          password: user.password,
        },
      })
      .then(async (response) => {
        await assertApiResponse(response, 200, 'Account deleted!');
      });

    await request
      .get(`${BASE_URL}/getUserDetailByEmail`, {
        params: {
          email: user.email,
        },
      })
      .then(async (response) => {
        await assertApiResponse(
          response,
          404,
          'Account not found with this email, try another email!'
        );
      });
  });

  test('Login User without email and password', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/createAccount`, {
      form: {
        name: user.name,
      },
    });
    await assertApiResponse(response, 400);
  });
});
