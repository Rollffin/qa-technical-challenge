import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutCompletePage extends BasePage {
  private readonly confirmationHeader = this.page.locator('h2');

  constructor(page: Page) {
    super(page);
  }

  async getConfirmationHeader(): Promise<string> {
    return this.confirmationHeader.innerText();
  }

  async isVisible(): Promise<boolean> {
    return this.confirmationHeader.isVisible();
  }
}
