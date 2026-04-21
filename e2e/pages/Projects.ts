import { Page } from '@playwright/test';
import AbstractPage from './AbstractPage';
import { Component } from './Component';

export class Projects extends AbstractPage {
  constructor(page: Page) {
    super(page, '/projects/');
  }

  get createCustomProjectButton() {
    return new Component(this.page, 'a[href="/projects/new"]');
  }

  get nameLabel() {
    return new Component(this.page, '[class*="flex items-center"] h1');
  }

  get headerStatusLabel() {
    return new Component(
      this.page,
      '[class="flex items-center mt-2"] span'
    ).nth(0);
  }

  get referenceLabel() {
    return new Component(
      this.page,
      '[class="flex items-center mt-2"] span'
    ).nth(1);
  }
}
