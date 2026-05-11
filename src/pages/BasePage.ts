import { Page } from '@playwright/test';

export abstract class BasePage {
  constructor(protected page: Page) {}

  async goto(url: string): Promise<void> {
    await this.page.goto(url);
  }
}
