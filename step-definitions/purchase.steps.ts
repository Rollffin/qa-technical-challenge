import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../src/support/world';
import { InventoryPage } from '../src/pages/InventoryPage';
import { CartPage } from '../src/pages/CartPage';

const EXPECTED_CART_ITEMS = 2;
import { CheckoutInfoPage } from '../src/pages/CheckoutInfoPage';
import { CheckoutOverviewPage } from '../src/pages/CheckoutOverviewPage';
import { CheckoutCompletePage } from '../src/pages/CheckoutCompletePage';
import { CHECKOUT_DATA } from '../src/fixtures/testData';

When('el usuario agrega el Bolt T-Shirt y el Red T-Shirt al carrito', async function (this: CustomWorld) {
  const inventoryPage = new InventoryPage(this.page);
  await inventoryPage.addBoltTShirt();
  await inventoryPage.addRedTShirt();

  const cartPage = new CartPage(this.page);
  const count = await cartPage.getBadgeCount();
  expect(count, `Se esperaban ${EXPECTED_CART_ITEMS} productos en el carrito pero se encontraron ${count}`).toBe(EXPECTED_CART_ITEMS);
});

When('el usuario procede al checkout', async function (this: CustomWorld) {
  const cartPage = new CartPage(this.page);
  await cartPage.clickCheckout();
});

When('el usuario completa los datos de envío', async function (this: CustomWorld) {
  const checkoutInfoPage = new CheckoutInfoPage(this.page);
  await checkoutInfoPage.fillForm(CHECKOUT_DATA);
  await checkoutInfoPage.clickContinue();
});

When('el total del pedido coincide con el subtotal más el impuesto', async function (this: CustomWorld) {
  const overviewPage = new CheckoutOverviewPage(this.page);
  const result = await overviewPage.validateOrderTotal();
  expect(result.valid, result.details).toBe(true);
});

When('el usuario confirma el pedido', async function (this: CustomWorld) {
  const overviewPage = new CheckoutOverviewPage(this.page);
  await overviewPage.clickFinish();
});

Then('se muestra el mensaje de confirmación {string}', async function (this: CustomWorld, expectedMessage: string) {
  const completePage = new CheckoutCompletePage(this.page);
  const header = await completePage.getConfirmationHeader();
  expect(header).toBe(expectedMessage);
});
