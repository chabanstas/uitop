import AbstractComponent, { Scope, waitForResponse } from './AbstractComponent';
import { Component } from './Component';

export default class NavBar extends AbstractComponent {
  // TODO: replace with the actual selector for the hamburger/toggle button visible on mobile
  private readonly mobileToggleSelector = '[data-target="navbar"]';

  constructor(context: Scope) {
    super(context, '[id="navbar"]');
  }

  async open() {
    const toggle = new Component(this.page, this.mobileToggleSelector);
    if (await toggle.locator.isVisible()) {
      await toggle.click();
    }
  }

  async logOut() {
    await this.open();
    await waitForResponse(
      this.page,
      () =>
        new Component(
          this.locator,
          '[action="/users/sign_out"] button'
        ).click(),
      {
        url: '/users/sign_out',
      }
    );
  }

  get projectsAnchor() {
    return new Component(this.locator, 'a[href="/projects"]');
  }
}
