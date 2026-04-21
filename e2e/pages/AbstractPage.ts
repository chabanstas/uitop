import { Page as PlaywrightPage, Locator, expect } from '@playwright/test';
import assert from 'assert';
import NavBar from './NavBar';

export default abstract class AbstractPage {
  readonly url: string;
  readonly urlExpression?: RegExp;
  readonly page: PlaywrightPage;
  readonly expect: typeof expect;
  readonly navBar: NavBar;

  constructor(page: PlaywrightPage, url: string) {
    this.page = page;
    this.expect = expect;
    this.url = url;
    this.navBar = new NavBar(this.page);
  }

  async visit(): Promise<this> {
    await this.page.goto(this.url);
    return this;
  }

  async validateUrl(id?: string): Promise<this> {
    const urlToValidate = id ? `${this.url}${id}` : this.url;
    await expect(this.page).toHaveURL(new RegExp(urlToValidate));
    return this;
  }

  matchUrl() {
    assert(this.urlExpression, 'Undefined url expression');
    const currentUrl = this.page.url();
    expect(currentUrl).toMatch(this.urlExpression);
    return this;
  }

  async reload(): Promise<this> {
    await this.page.reload();
    return this;
  }

  async inside(cb: (page: this) => Promise<void>) {
    await cb(this);
    return this;
  }
}
