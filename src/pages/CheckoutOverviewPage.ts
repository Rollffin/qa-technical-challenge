import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

type OrderTotalValidation = {
  valid: boolean;
  details: string;
};

export class CheckoutOverviewPage extends BasePage {
  private readonly subtotalLabel = this.page.locator('[data-test="subtotal-label"]');
  private readonly taxLabel = this.page.locator('[data-test="tax-label"]');
  private readonly totalLabel = this.page.locator('[data-test="total-label"]');
  private readonly finishButton = this.page.locator('#finish');

  constructor(page: Page) {
    super(page);
  }

  async validateOrderTotal(): Promise<OrderTotalValidation> {
    const subtotalText = await this.subtotalLabel.innerText();
    const taxText = await this.taxLabel.innerText();
    const totalText = await this.totalLabel.innerText();

    const subtotal = parseFloat(subtotalText.replace(/[^\d.]/g, ''));
    const tax = parseFloat(taxText.replace(/[^\d.]/g, ''));
    const total = parseFloat(totalText.replace(/[^\d.]/g, ''));

    const calculated = Math.round((subtotal + tax) * 100) / 100;
    const valid = calculated === total;

    return {
      valid,
      details: `Item total $${subtotal} + Tax $${tax} = $${calculated}, displayed Total: $${total}`,
    };
  }

  async clickFinish(): Promise<void> {
    await this.finishButton.click();
  }
}
