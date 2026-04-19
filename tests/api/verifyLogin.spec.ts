import { test } from '@playwright/test';
import { assertApiResponse } from 'utils/apiHelpers';
import { faker } from '@faker-js/faker';

const BASE_URL = 'https://automationexercise.com/api';

test.describe('POST /verifyLogin', () => {
  test('Missing email parameter returns 400 Bad request', async ({
    request,
  }) => {
    const response = await request.post(`${BASE_URL}/verifyLogin`, {
      form: {
        password: faker.internet.password(),
      },
    });

    await assertApiResponse(
      response,
      400,
      'Bad request, email or password parameter is missing in POST request.'
    );
  });

  test('DELETE method returns 405 not supported', async ({ request }) => {
    const response = await request.delete(`${BASE_URL}/verifyLogin`);

    await assertApiResponse(
      response,
      405,
      'This request method is not supported.'
    );
  });

  test('Test Case 3: Login User with incorrect email and password', async ({
    request,
  }) => {
    const response = await request.post(`${BASE_URL}/verifyLogin`, {
      form: {
        email: faker.internet.email(),
        // password: faker.internet.password(),
      },
    });

    await assertApiResponse(response, 404, 'User not found!');
  });
});
