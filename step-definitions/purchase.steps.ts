import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../src/support/world';
import { InventoryPage } from '../src/pages/InventoryPage';
import { CartPage } from '../src/pages/CartPage';
import { CheckoutInfoPage } from '../src/pages/CheckoutInfoPage';
import { CheckoutOverviewPage } from '../src/pages/CheckoutOverviewPage';
import { CheckoutCompletePage } from '../src/pages/CheckoutCompletePage';
import { CHECKOUT_DATA } from '../src/fixtures/testData';

When('the user adds the Bolt T-Shirt and the Red T-Shirt to the cart', async function (this: CustomWorld) {
  const inventoryPage = new InventoryPage(this.page);
  await inventoryPage.addBoltTShirt();
  await inventoryPage.addRedTShirt();
});

When('the user proceeds to checkout', async function (this: CustomWorld) {
  const cartPage = new CartPage(this.page);
  await cartPage.clickCheckout();
});

When('the user fills in the shipping information', async function (this: CustomWorld) {
  const checkoutInfoPage = new CheckoutInfoPage(this.page);
  await checkoutInfoPage.fillForm(CHECKOUT_DATA);
  await checkoutInfoPage.clickContinue();
});

When('the order total matches item total plus tax', async function (this: CustomWorld) {
  const overviewPage = new CheckoutOverviewPage(this.page);
  const result = await overviewPage.validateOrderTotal();
  expect(result.valid, result.details).toBe(true);
});

When('the user confirms the order', async function (this: CustomWorld) {
  const overviewPage = new CheckoutOverviewPage(this.page);
  await overviewPage.clickFinish();
});

Then('the order confirmation message {string} is displayed', async function (this: CustomWorld, expectedMessage: string) {
  const completePage = new CheckoutCompletePage(this.page);
  const header = await completePage.getConfirmationHeader();
  expect(header).toBe(expectedMessage);
});
