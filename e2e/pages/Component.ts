import assert from 'assert';
import AbstractComponent from './AbstractComponent';

// TODO: should be divided into input, button, etc with specific methods
export class Component extends AbstractComponent {
  async type(value: string | number | null) {
    assert(value !== null, 'Unexpected value amount');
    await this.isEnabled();
    await this.clear();
    await this.fill(value.toString());
    await this.hasValue(value.toString());
  }

  async hasValue(value: string | number | null) {
    assert(value !== null, 'Unexpected value amount');
    await this.expect(this.locator).toHaveValue(value.toString());
  }

  async isEnabled() {
    await this.expect(this.locator).toBeEnabled();
  }

  async isDisabled() {
    await this.expect(this.locator).toBeDisabled();
  }

  async clear() {
    await this.locator.clear();
  }

  private async fill(value: string) {
    await this.locator.fill(value);
  }

  async click() {
    await this.locator.click();
  }

  async isEmpty() {
    await this.expect(this.locator).toBeEmpty();
  }

  async toContainText(text: string | number | null) {
    assert(text !== null, 'Unexpected null value');
    await this.expect(this.locator).toContainText(text.toString());
  }
}
