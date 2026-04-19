import { APIResponse, expect } from '@playwright/test';

export type ApiBody = {
  responseCode: number;
  message: string;
};

export async function assertApiResponse(
  response: APIResponse,
  expectedCode: number,
  expectedMessage?: string
): Promise<void> {
  expect(response.status()).toBe(200);

  const body: ApiBody = await response.json();
  expect(body.responseCode).toBe(expectedCode);
  if (expectedMessage) {
    expect(body.message).toBe(expectedMessage);
  }
}
