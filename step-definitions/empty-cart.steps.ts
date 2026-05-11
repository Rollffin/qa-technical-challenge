import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../src/support/world';
import { CartPage } from '../src/pages/CartPage';
import { CheckoutInfoPage } from '../src/pages/CheckoutInfoPage';
import { CheckoutOverviewPage } from '../src/pages/CheckoutOverviewPage';
import { CheckoutCompletePage } from '../src/pages/CheckoutCompletePage';
import { CHECKOUT_DATA } from '../src/fixtures/testData';

Given('el carrito no contiene productos', async function (this: CustomWorld) {
  const cartPage = new CartPage(this.page);
  const count = await cartPage.getBadgeCount();
  expect(count, 'El carrito debería estar vacío antes de iniciar este escenario').toBe(0);
});

When('el usuario intenta completar el proceso de checkout', async function (this: CustomWorld) {
  const cartPage = new CartPage(this.page);
  await cartPage.clickCheckout();

  const checkoutInfoPage = new CheckoutInfoPage(this.page);
  await checkoutInfoPage.fillForm(CHECKOUT_DATA);
  await checkoutInfoPage.clickContinue();

  const overviewPage = new CheckoutOverviewPage(this.page);
  await overviewPage.clickFinish();
});

Then('la confirmación del pedido no debería mostrarse', async function (this: CustomWorld) {
  const completePage = new CheckoutCompletePage(this.page);
  const isVisible = await completePage.isVisible();
  expect(
    isVisible,
    'BUG: La confirmación de orden apareció tras un checkout con carrito vacío — el sistema debería impedirlo'
  ).toBe(false);
});
