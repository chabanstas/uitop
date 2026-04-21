import { Page } from '@playwright/test';

export async function loginViaApi(
  page: Page,
  email = process.env.TEST_USER_EMAIL || '',
  password = process.env.TEST_USER_PASSWORD || ''
): Promise<void> {
  const signInPage = await page.request.get('/users/sign_in');
  const html = await signInPage.text();
  const tokenMatch = html.match(/name="authenticity_token"\s+value="([^"]+)"/);
  if (!tokenMatch)
    throw new Error('Could not extract authenticity_token from sign-in page');

  await page.request.post('/users/sign_in', {
    form: {
      authenticity_token: tokenMatch[1],
      'user[email]': email,
      'user[password]': password,
      commit: 'Log in',
    },
  });
}
