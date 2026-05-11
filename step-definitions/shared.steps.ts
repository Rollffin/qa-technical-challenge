import { Given, When } from '@cucumber/cucumber';
import { CustomWorld } from '../src/support/world';
import { LoginPage } from '../src/pages/LoginPage';
import { CartPage } from '../src/pages/CartPage';
import { USERS } from '../src/fixtures/testData';

Given('the user is logged in with valid credentials', async function (this: CustomWorld) {
  const loginPage = new LoginPage(this.page);
  await loginPage.goto();
  await loginPage.login(USERS.standard.username, USERS.standard.password);
});

When('the user navigates to the cart', async function (this: CustomWorld) {
  const cartPage = new CartPage(this.page);
  await cartPage.navigateToCart();
});
