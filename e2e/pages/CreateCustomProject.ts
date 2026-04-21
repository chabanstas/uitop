import { Page } from '@playwright/test';
import AbstractPage from './AbstractPage';
import { waitForResponse } from './AbstractComponent';
import { Component } from './Component';
import assert from 'assert';

export class CreateCustomProject extends AbstractPage {
  constructor(page: Page) {
    super(page, '/projects/new');
  }

  get createProjectButton() {
    return new Component(this.page, 'input[value="Create Project"]');
  }

  get cancelButton() {
    return new Component(this.page, 'a[href="/projects"]');
  }

  get jurisdictionDropdown() {
    return new Component(
      this.page,
      '[class="mt-1"][data-controller="tom-select"]'
    );
  }

  get nameInput() {
    return new Component(this.page, '[id="project_name"]');
  }

  get addressSearch() {
    return new Component(this.page, '[class="relative w-full"]');
  }

  get unitApartmentNumberInput() {
    return new Component(this.page, '[name="unit_number"]');
  }

  async selectJurisdiction(value: string) {
    const input = new Component(this.jurisdictionDropdown.locator, 'input');
    const item = new Component(
      this.jurisdictionDropdown.locator,
      '[class="item"]'
    );
    const list = new Component(
      this.jurisdictionDropdown.locator,
      '[role="listbox"]'
    );
    await input.click();
    await input.type(value);
    await list.toContainText(value);
    await list.filter({ hasText: value }).locator.click();
    await item.hasText(value);
    await list.locator.waitFor({ state: 'hidden' });
    await list.isNotVisible();
  }

  async searchAddress(value: string) {
    const input = new Component(this.addressSearch.locator, 'input');
    await input.click();
    await input.type(value);
  }

  async selectAddress(value: string) {
    const dropdownItem = new Component(
      this.addressSearch.locator,
      '[class*="address-suggestion"]'
    );
    const input = new Component(this.addressSearch.locator, 'input');
    await dropdownItem.filter({ hasText: value }).locator.click();
    await input.hasValue(value);
  }

  async createProject() {
    return waitForResponse(this.page, () => this.createProjectButton.click(), {
      url: '/projects',
    }).then((response) => {
      assert(response, 'No response received after creating project');
      assert(
        response.headers()['location'],
        'No location header in create project response'
      );
      const location = response.headers()['location'];
      return location.split('/').pop() ?? location;
    });
  }
}
