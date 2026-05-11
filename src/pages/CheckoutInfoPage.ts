import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

type CheckoutData = {
  firstName: string;
  lastName: string;
  zipCode: string;
};

export class CheckoutInfoPage extends BasePage {
  private readonly firstNameInput = this.page.locator('#first-name');
  private readonly lastNameInput = this.page.locator('#last-name');
  private readonly postalCodeInput = this.page.locator('#postal-code');
  private readonly continueButton = this.page.locator('#continue');

  constructor(page: Page) {
    super(page);
  }

  async fillForm(data: CheckoutData): Promise<void> {
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.postalCodeInput.fill(data.zipCode);
  }

  async clickContinue(): Promise<void> {
    await this.continueButton.click();
  }
}
