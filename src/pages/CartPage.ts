import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  private readonly cartLink = this.page.locator('a.shopping_cart_link');
  private readonly checkoutButton = this.page.locator('#checkout');
  private readonly cartItems = this.page.locator('.cart_item');
  private readonly cartBadge = this.page.locator('.shopping_cart_badge');

  constructor(page: Page) {
    super(page);
  }

  async navigateToCart(): Promise<void> {
    await this.cartLink.click();
  }

  async getItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async getBadgeCount(): Promise<number> {
    const isVisible = await this.cartBadge.isVisible();
    if (!isVisible) return 0;
    const text = await this.cartBadge.innerText();
    return parseInt(text, 10);
  }

  async clickCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
