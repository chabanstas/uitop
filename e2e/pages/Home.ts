import { Page } from '@playwright/test';
import AbstractPage from './AbstractPage';
import Modal from './Modal';
import { Scope, waitForResponse } from './AbstractComponent';
import { Component } from './Component';

// TODO: bad locator, change for date-testid
export class LogInAndSignUpModal extends Modal {
  constructor(context: Scope, selector?: string) {
    super(context, selector);
  }

  get createAccountButton() {
    return this.locator.getByRole('button', { name: 'Create account' });
  }

  get firstNameInput() {
    return new Component(this.locator, '[id="user_first_name"]');
  }

  get lastNameInput() {
    return new Component(this.locator, '[id="user_last_name"]');
  }

  get emailInput() {
    return new Component(this.locator, '[id="user_email"]');
  }

  get phoneInput() {
    return new Component(this.locator, '[id="user_phone"]');
  }

  get passwordInput() {
    return new Component(this.locator, '[id="user_password"]');
  }

  get passwordConfirmationInput() {
    return new Component(this.locator, '[id="user_password_confirmation"]');
  }

  get termsOfServiceCheckbox() {
    return new Component(
      this.locator,
      '[id="tos"][name="user[terms_of_service]"]'
    );
  }

  get userTimeZoneSelect() {
    return new Component(this.locator, '[id="user_time_zone"]');
  }
}

export class SignUpModal extends LogInAndSignUpModal {
  get signUpButton() {
    return new Component(this.locator, '[type="submit"][value="Sign up"]');
  }
}

export class LogInModal extends LogInAndSignUpModal {
  get logInButton() {
    return new Component(this.locator, '[type="submit"][value="Log in"]');
  }

  async logIn() {
    await waitForResponse(this.page, () => this.logInButton.click(), {
      url: '/users/sign_in',
    });
  }
}

export class Home extends AbstractPage {
  logInModal = new LogInModal(this.page, '[data-login-target="loginModal"]');
  constructor(page: Page) {
    super(page, '/');
  }

  get mobileMenuToggle() {
    return new Component(
      this.page,
      'button[data-action="click->mobile-menu#toggle"]'
    );
  }

  get signUpButton() {
    return new Component(this.page, '[id="open-signup-modal-button"]');
  }

  get logInButton() {
    return new Component(this.page, '[id="open-login-modal-button"]');
  }

  async logIn() {
    if (await this.mobileMenuToggle.locator.isVisible()) {
      await this.mobileMenuToggle.click();
    }
    await this.logInButton.click();
  }

  async verifyGreetingText(firstName: string) {
    await new Component(
      this.page,
      'span[class*=text-transparent]'
    ).toContainText(`Hi there ${firstName}!`);
  }
}
