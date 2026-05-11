import { BeforeAll, Before, After } from '@cucumber/cucumber';
import { chromium } from '@playwright/test';
import * as dotenv from 'dotenv';
import { CustomWorld } from './world';

dotenv.config();

BeforeAll(() => {
  const required = ['STANDARD_USER', 'STANDARD_PASSWORD', 'LOCKED_USER', 'LOCKED_PASSWORD'];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}.\nCopy .env.example to .env and fill in the values.`
    );
  }
});

Before(async function (this: CustomWorld) {
  this.browser = await chromium.launch({ headless: process.env.HEADLESS !== 'false' });
  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();
});

After(async function (this: CustomWorld) {
  await this.page?.close();
  await this.context?.close();
  await this.browser?.close();
});
