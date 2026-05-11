# QA Technical Challenge — E2E Automation Suite

Automated end-to-end test suite for [saucedemo.com](https://www.saucedemo.com) built with **Playwright** and **Cucumber (Gherkin)** using the **Page Object Model** pattern.

---

## Prerequisites

- Node.js >= 18
- npm >= 9

---

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/Rollffin/qa-technical-challenge.git
cd qa-technical-challenge
```

### 2. Install dependencies

```bash
npm install
```

### 3. Download the browser

```bash
npx playwright install chromium
```

### 4. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in the credentials:

```
STANDARD_USER=standard_user
STANDARD_PASSWORD=secret_sauce
LOCKED_USER=locked_out_user
LOCKED_PASSWORD=secret_sauce
```

> The `.env` file is gitignored and will never be committed.

---

## Running the suite

**Headless (default):**

```bash
npm test
```

**Headed (browser visible — useful for debugging):**

```bash
npm run test:headed
```

**With HTML report:**

The HTML report is generated automatically at `reports/report.html` after every run. Open it in any browser to see a detailed breakdown of all scenarios and steps.

---

## Expected results

| Scenario | Expected outcome |
|---|---|
| Login — valid credentials | PASS |
| Login — locked account | PASS |
| Login — invalid credentials | PASS |
| Purchase — complete flow with two products | PASS |
| Empty cart — checkout attempt | **FAIL** (intentional) |

The empty cart scenario **intentionally fails** to document a bug in saucedemo.com: the application allows completing a purchase with an empty cart and shows the order confirmation page, which should not be possible.

---

## Suite architecture

```
qa-technical-challenge/
│
├── features/                    # Gherkin scenarios (WHAT to test)
│   ├── login.feature
│   ├── purchase.feature
│   └── empty-cart.feature
│
├── step-definitions/            # Step implementations (bridge between Gherkin and POM)
│   ├── shared.steps.ts          # Steps reused across multiple features
│   ├── login.steps.ts
│   ├── purchase.steps.ts
│   └── empty-cart.steps.ts
│
├── src/
│   ├── pages/                   # Page Object Model (HOW to interact with the UI)
│   │   ├── BasePage.ts          # Base class with shared navigation helpers
│   │   ├── LoginPage.ts
│   │   ├── InventoryPage.ts
│   │   ├── CartPage.ts
│   │   ├── CheckoutInfoPage.ts
│   │   ├── CheckoutOverviewPage.ts
│   │   └── CheckoutCompletePage.ts
│   │
│   ├── support/
│   │   ├── world.ts             # CustomWorld — holds browser, context, and page per scenario
│   │   └── hooks.ts             # Before/After hooks — browser lifecycle management
│   │
│   └── fixtures/
│       └── testData.ts          # Test data constants (users, checkout data)
│
├── reports/                     # HTML report output (gitignored)
├── cucumber.js                  # Cucumber runner configuration
├── tsconfig.json
└── .env.example                 # Environment variable template
```

### Layer responsibilities

| Layer | Responsibility |
|---|---|
| **features/** | Describe behavior in plain language (Gherkin). No code logic. |
| **step-definitions/** | Connect Gherkin steps to page object actions. Contain assertions (`expect`). No DOM selectors. |
| **src/pages/** | Encapsulate all DOM selectors and UI interactions. No assertions. |
| **src/support/** | Manage browser lifecycle and shared context via `CustomWorld`. |
| **src/fixtures/** | Provide test data from environment variables and constants. |

---

## Adding a new scenario

Follow this order strictly — each layer depends on the one above it.

### Step 1 — Create or extend the Page Object

If the scenario interacts with a page that already has a Page Object, add the new method there. If it's a new page, create a new class in `src/pages/`.

```typescript
// src/pages/ExamplePage.ts
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ExamplePage extends BasePage {
  private readonly submitButton = this.page.locator('#submit');

  constructor(page: Page) {
    super(page);
  }

  async clickSubmit(): Promise<void> {
    await this.submitButton.click();
  }

  async getConfirmationText(): Promise<string> {
    return this.page.locator('.confirmation').innerText();
  }
}
```

**Rules for Page Objects:**
- Locators are always `private readonly`
- Methods are `async` and return `Promise<void>` or a value
- No assertions inside page objects — only actions and getters

### Step 2 — Write the Gherkin scenario

Add the scenario to the relevant `.feature` file, or create a new one in `features/`.

```gherkin
# features/example.feature
Feature: Example Feature

  Scenario: User submits the form successfully
    Given the user is logged in with valid credentials
    When the user submits the example form
    Then the confirmation message "Success!" is displayed
```

**Rules for feature files:**
- Use `Given` for preconditions, `When` for actions, `Then` for assertions
- If a step already exists in `step-definitions/shared.steps.ts`, reuse it exactly as written
- Keep step text descriptive and business-focused — avoid technical details

### Step 3 — Implement the step definitions

Create a new file in `step-definitions/` or add to an existing one if the domain matches. Import the relevant Page Object and `CustomWorld`.

```typescript
// step-definitions/example.steps.ts
import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../src/support/world';
import { ExamplePage } from '../src/pages/ExamplePage';

When('the user submits the example form', async function (this: CustomWorld) {
  const examplePage = new ExamplePage(this.page);
  await examplePage.clickSubmit();
});

Then('the confirmation message {string} is displayed', async function (this: CustomWorld, expected: string) {
  const examplePage = new ExamplePage(this.page);
  const text = await examplePage.getConfirmationText();
  expect(text).toBe(expected);
});
```

**Rules for step definitions:**
- Never use `page.locator()` directly — always go through the Page Object
- Assertions (`expect`) belong here, not in the Page Object
- If a step will be used by more than one feature file, add it to `shared.steps.ts`

### Verify

```bash
npm test
```
