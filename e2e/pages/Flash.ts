import AbstractComponent, { Scope } from './AbstractComponent';

export default class Flash extends AbstractComponent {
  constructor(context: Scope) {
    super(context, '[id="flash"]');
  }

  async verifyText(text: string) {
    await this.expect(this.locator).toContainText(text);
  }
}
