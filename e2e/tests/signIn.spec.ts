import { test, expect } from '@playwright/test';
import { Home } from '../pages/Home';
import { de, faker } from '@faker-js/faker';
import Flash from 'e2e/pages/Flash';
import { users } from 'fixtures/fixtures';

test.describe('Sign In', () => {
  // test.describe.configure({ mode: 'serial' });
  const email = process.env.TEST_USER_EMAIL || '';
  const password = process.env.TEST_USER_PASSWORD || '';

  test('Sign in with valid credentials', async ({ page }) => {
    await new Home(page).visit().then(async (homePage) => {
      await homePage.logIn();
      await homePage.logInModal.within(async (modal) => {
        await modal.emailInput.type(email);
        await modal.passwordInput.type(password);
        await modal.logIn();
      });
      await homePage.verifyGreetingText(users.bacos.firstName);
      await homePage.navBar.logOut();
    });
  });

  test('Sign in with incorrect password', async ({ page }) => {
    const password = faker.internet.password();

    await new Home(page).visit().then(async (homePage) => {
      await homePage.logIn();
      await homePage.logInModal.within(async (modal) => {
        await modal.isVisible();
        await modal.emailInput.type(email);
        await modal.passwordInput.type(password);
        await modal.logInButton.click();
        await new Flash(page).verifyText('Invalid Email or password.');
      });
    });
  });

  test('Sign in with non-existent email', async ({ page }) => {
    const email = faker.internet.email();

    await new Home(page).visit().then(async (homePage) => {
      await homePage.logIn();
      await homePage.logInModal.within(async (modal) => {
        await modal.isVisible();
        await modal.emailInput.type(email);
        await modal.passwordInput.type(password);
        await modal.logInButton.click();
        await new Flash(page).verifyText('Invalid Email or password.');
      });
    });
  });

  test('Sign in with valid email but empty password', async ({ page }) => {
    const email = faker.internet.email();

    await new Home(page).visit().then(async (homePage) => {
      await homePage.logIn();
      await homePage.logInModal.within(async (modal) => {
        await modal.isVisible();
        await modal.emailInput.type(email);
        await modal.passwordInput.isEmpty();
        await modal.logInButton.click();
        await new Flash(page).verifyText('Invalid Email or password.');
      });
    });
  });
});
