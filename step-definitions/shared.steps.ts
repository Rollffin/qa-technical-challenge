import { Given, When } from '@cucumber/cucumber';
import { CustomWorld } from '../src/support/world';
import { LoginPage } from '../src/pages/LoginPage';
import { CartPage } from '../src/pages/CartPage';
import { USERS } from '../src/fixtures/testData';

Given('que el usuario ha iniciado sesión con credenciales válidas', async function (this: CustomWorld) {
  const loginPage = new LoginPage(this.page);
  await loginPage.goto();
  await loginPage.login(USERS.standard.username, USERS.standard.password);
});

When('el usuario navega al carrito', async function (this: CustomWorld) {
  const cartPage = new CartPage(this.page);
  await cartPage.navigateToCart();
});
