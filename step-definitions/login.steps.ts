import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../src/support/world';
import { LoginPage } from '../src/pages/LoginPage';
import { InventoryPage } from '../src/pages/InventoryPage';
import { USERS } from '../src/fixtures/testData';

Given('que el usuario está en la página de login', async function (this: CustomWorld) {
  const loginPage = new LoginPage(this.page);
  await loginPage.goto();
});

When('el usuario inicia sesión con credenciales válidas', async function (this: CustomWorld) {
  const loginPage = new LoginPage(this.page);
  await loginPage.login(USERS.standard.username, USERS.standard.password);
});

When('el usuario inicia sesión con una cuenta bloqueada', async function (this: CustomWorld) {
  const loginPage = new LoginPage(this.page);
  await loginPage.login(USERS.locked.username, USERS.locked.password);
});

When('el usuario inicia sesión con credenciales inválidas', async function (this: CustomWorld) {
  const loginPage = new LoginPage(this.page);
  await loginPage.login(USERS.invalid.username, USERS.invalid.password);
});

Then('el usuario es redirigido a la página de productos', async function (this: CustomWorld) {
  const inventoryPage = new InventoryPage(this.page);
  const title = await inventoryPage.getTitle();
  expect(title).toBe('Products');
});

Then('se muestra un mensaje de error que contiene {string}', async function (this: CustomWorld, expectedText: string) {
  const loginPage = new LoginPage(this.page);
  const errorMessage = await loginPage.getErrorMessage();
  expect(errorMessage).toContain(expectedText);
});

Then('el usuario permanece en la página de login', async function (this: CustomWorld) {
  await expect(this.page).toHaveURL(/saucedemo\.com\/?$/);
});
