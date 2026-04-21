import AbstractComponent, { Scope } from './AbstractComponent';

export default class Modal extends AbstractComponent {
  constructor(context: Scope, selector?: string) {
    super(context, selector || '.modal');
  }
}
