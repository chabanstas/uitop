import { Locator, Page, Response, expect } from '@playwright/test';
import assert from 'assert';

export type ResponseWaiterOptions = {
  url: string | RegExp;
  method?: string;
  status?: number;
};

export async function waitForResponse(
  page: Page,
  action: () => Promise<void>,
  options: ResponseWaiterOptions
): Promise<Response> {
  const [response] = await Promise.all([
    page.waitForResponse((res) => {
      const urlMatch =
        typeof options.url === 'string'
          ? res.url().includes(options.url)
          : options.url.test(res.url());
      const methodMatch = options.method
        ? res.request().method() === options.method.toUpperCase()
        : true;
      const statusMatch = options.status
        ? res.status() === options.status
        : true;
      return urlMatch && methodMatch && statusMatch;
    }),
    action(),
  ]);
  return response;
}

// Scope of the component is defined by the Page or Locator passed to the constructor
// page scope means that we're looking for the component on the whole page
// locator scope means that we're looking for the component inside the locator of a parent component
// e.g. tables, modals, etc.
export type Scope = Page | Locator;
export default abstract class AbstractComponent {
  expect = expect;
  public locator: Locator;
  page: Page; // for cases when we need to access the page directly
  operationName?: string;
  variablesValidator?: (variables: unknown) => boolean;

  constructor(
    scope: Scope,
    protected selector: string
  ) {
    this.selector = selector;
    this.locator = scope.locator(this.selector);
    this.page = this.locator.page();
  }

  filter(options: {
    hasText?: string | RegExp;
    hasNotText?: string | RegExp;
    has?: Locator;
    hasNot?: Locator;
  }): this {
    this.locator = this.locator.filter(options);
    return this;
  }

  async hasText(text: string | number | null) {
    assert(text !== null, 'Unexpected null value');
    await this.expect(this.locator).toHaveText(text.toString());
  }

  async contains(text: string | number | null | undefined) {
    assert(text !== null && text !== undefined, 'Unexpected null value');
    await this.expect(this.locator).toContainText(text.toString());
  }

  async hasLength(length: number) {
    await this.expect(this.locator).toHaveCount(length);
  }

  async hasClass(className: string) {
    await this.expect(this.locator).toHaveClass(new RegExp(className));
  }

  async notHaveClass(className: string) {
    await this.expect(this.locator).not.toHaveClass(new RegExp(className));
  }

  async exists() {
    await this.expect(this.locator).toBeAttached();
  }

  async notExist() {
    await this.expect(this.locator).not.toBeAttached();
  }
  async isVisible(options?: { timeout?: number }) {
    await this.expect(this.locator).toBeVisible(options);
  }

  async isNotVisible() {
    await this.expect(this.locator).not.toBeVisible();
  }

  async isEnabled() {
    await this.expect(this.locator).toBeEnabled();
  }

  async isDisabled() {
    await this.expect(this.locator).toBeDisabled();
  }

  async notContain(text: string | null) {
    assert(text, 'Unexpected null value');
    await this.expect(this.locator).not.toContainText(text);
  }
  /**
   * this method is used to limit the scope of the test and give variables less verbose names
   * usually used to limit the scope and give variables less verbose names
   * e.g. instead of interimInvoice.footer.total.hasText('1234')
   * More useful for multiple calls in the same scope
   * @example await interimInvoice.within((footer) => {
   *  await footer.total.hasText('1234');
   *  await footer.patientTotal.hasText('123');
   * });
   */
  async within(cb: (component: this) => Promise<void>) {
    await cb(this);
  }

  nth(nth: number) {
    this.locator = this.locator.nth(nth);
    return this;
  }
}
