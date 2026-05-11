import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../src/support/world';
import { LoginPage } from '../src/pages/LoginPage';
import { InventoryPage } from '../src/pages/InventoryPage';
import { USERS } from '../src/fixtures/testData';

Given('the user is on the login page', async function (this: CustomWorld) {
  const loginPage = new LoginPage(this.page);
  await loginPage.goto();
});

When('the user logs in with valid credentials', async function (this: CustomWorld) {
  const loginPage = new LoginPage(this.page);
  await loginPage.login(USERS.standard.username, USERS.standard.password);
});

When('the user logs in with locked account credentials', async function (this: CustomWorld) {
  const loginPage = new LoginPage(this.page);
  await loginPage.login(USERS.locked.username, USERS.locked.password);
});

When('the user logs in with invalid credentials', async function (this: CustomWorld) {
  const loginPage = new LoginPage(this.page);
  await loginPage.login(USERS.invalid.username, USERS.invalid.password);
});

Then('the user is redirected to the products page', async function (this: CustomWorld) {
  const inventoryPage = new InventoryPage(this.page);
  const title = await inventoryPage.getTitle();
  expect(title).toBe('Products');
});

Then('an error message containing {string} is displayed', async function (this: CustomWorld, expectedText: string) {
  const loginPage = new LoginPage(this.page);
  const errorMessage = await loginPage.getErrorMessage();
  expect(errorMessage).toContain(expectedText);
});

Then('the user remains on the login page', async function (this: CustomWorld) {
  await expect(this.page).toHaveURL(/saucedemo\.com\/?$/);
});
