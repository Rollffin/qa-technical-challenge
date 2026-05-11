import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  private readonly pageTitle = this.page.locator('[data-test="title"]');
  private readonly addBoltTShirtButton = this.page.locator('#add-to-cart-sauce-labs-bolt-t-shirt');
  // Attribute selector used because the ID contains CSS-special characters (dots and parentheses)
  private readonly addRedTShirtButton = this.page.locator('[id="add-to-cart-test.allthethings()-t-shirt-(red)"]');

  constructor(page: Page) {
    super(page);
  }

  async getTitle(): Promise<string> {
    return this.pageTitle.innerText();
  }

  async addBoltTShirt(): Promise<void> {
    await this.addBoltTShirtButton.click();
  }

  async addRedTShirt(): Promise<void> {
    await this.addRedTShirtButton.click();
  }
}
