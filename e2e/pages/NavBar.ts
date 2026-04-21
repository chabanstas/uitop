import AbstractComponent, { Scope, waitForResponse } from './AbstractComponent';
import { Component } from './Component';

export default class NavBar extends AbstractComponent {
  constructor(context: Scope) {
    super(context, '[id="navbar"]');
  }

  async logOut() {
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
