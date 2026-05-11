import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../src/support/world';
import { CartPage } from '../src/pages/CartPage';
import { CheckoutInfoPage } from '../src/pages/CheckoutInfoPage';
import { CheckoutOverviewPage } from '../src/pages/CheckoutOverviewPage';
import { CheckoutCompletePage } from '../src/pages/CheckoutCompletePage';
import { CHECKOUT_DATA } from '../src/fixtures/testData';

Given('the cart contains no items', async function (this: CustomWorld) {
  const cartPage = new CartPage(this.page);
  const count = await cartPage.getBadgeCount();
  expect(count, 'Cart should be empty before starting this scenario').toBe(0);
});

When('the user attempts to complete the checkout process', async function (this: CustomWorld) {
  const cartPage = new CartPage(this.page);
  await cartPage.clickCheckout();

  const checkoutInfoPage = new CheckoutInfoPage(this.page);
  await checkoutInfoPage.fillForm(CHECKOUT_DATA);
  await checkoutInfoPage.clickContinue();

  const overviewPage = new CheckoutOverviewPage(this.page);
  await overviewPage.clickFinish();
});

Then('the order confirmation should not be displayed', async function (this: CustomWorld) {
  const completePage = new CheckoutCompletePage(this.page);
  const isVisible = await completePage.isVisible();
  expect(
    isVisible,
    'BUG: Order confirmation appeared after checkout with empty cart — the system should prevent this'
  ).toBe(false);
});
