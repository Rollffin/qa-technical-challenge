# QA Technical Challenge — Suite de Automatización E2E

Suite de pruebas end-to-end automatizadas para [saucedemo.com](https://www.saucedemo.com) construida con **Playwright** y **Cucumber (Gherkin)** usando el patrón **Page Object Model**.

---

## Requisitos previos

- Node.js >= 18
- npm >= 9

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/Rollffin/qa-technical-challenge.git
cd qa-technical-challenge
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Descargar el navegador

```bash
npx playwright install chromium
```

### 4. Configurar las variables de entorno

```bash
cp .env.example .env
```

Abrí el archivo `.env` y completá las credenciales:

```
STANDARD_USER=standard_user
STANDARD_PASSWORD=secret_sauce
LOCKED_USER=locked_out_user
LOCKED_PASSWORD=secret_sauce
```

> El archivo `.env` está en el `.gitignore` y nunca será commiteado al repositorio.

---

## Ejecución de la suite

**Modo headless (por defecto):**

```bash
npm test
```

**Modo headed (navegador visible — útil para debugging):**

```bash
npm run test:headed
```

**Reporte HTML:**

El reporte se genera automáticamente en `reports/report.html` después de cada ejecución. Abrilo en cualquier navegador para ver el detalle completo de escenarios y steps.

---

## Resultados esperados

| Escenario | Resultado esperado |
|---|---|
| Login — credenciales válidas | PASS |
| Login — cuenta bloqueada | PASS |
| Login — credenciales inválidas | PASS |
| Compra — flujo completo con dos productos | PASS |
| Carrito vacío — intento de checkout | **FAIL** (intencional) |

El escenario de carrito vacío **falla de forma intencional** para documentar un bug en saucedemo.com: la aplicación permite completar una compra con el carrito vacío y muestra la pantalla de confirmación, lo cual no debería ser posible.

---

## Arquitectura de la suite

```
qa-technical-challenge/
│
├── features/                    # Escenarios Gherkin (QUÉ se prueba)
│   ├── login.feature
│   ├── purchase.feature
│   └── empty-cart.feature
│
├── step-definitions/            # Implementación de los steps (puente entre Gherkin y POM)
│   ├── shared.steps.ts          # Steps reutilizados por múltiples features
│   ├── login.steps.ts
│   ├── purchase.steps.ts
│   └── empty-cart.steps.ts
│
├── src/
│   ├── pages/                   # Page Object Model (CÓMO interactuar con la UI)
│   │   ├── BasePage.ts          # Clase base con helpers de navegación compartidos
│   │   ├── LoginPage.ts
│   │   ├── InventoryPage.ts
│   │   ├── CartPage.ts
│   │   ├── CheckoutInfoPage.ts
│   │   ├── CheckoutOverviewPage.ts
│   │   └── CheckoutCompletePage.ts
│   │
│   ├── support/
│   │   ├── world.ts             # CustomWorld — contiene browser, context y page por escenario
│   │   └── hooks.ts             # Hooks Before/After — gestión del ciclo de vida del navegador
│   │
│   └── fixtures/
│       └── testData.ts          # Constantes de datos de prueba (usuarios, datos de checkout)
│
├── reports/                     # Reporte HTML generado (gitignored)
├── cucumber.js                  # Configuración del runner de Cucumber
├── tsconfig.json
└── .env.example                 # Plantilla de variables de entorno
```

### Responsabilidades de cada capa

| Capa | Responsabilidad |
|---|---|
| **features/** | Describir el comportamiento en lenguaje natural (Gherkin). Sin lógica de código. |
| **step-definitions/** | Conectar los steps de Gherkin con las acciones del POM. Contienen las aserciones (`expect`). Sin selectores del DOM. |
| **src/pages/** | Encapsular todos los selectores del DOM y las interacciones con la UI. Sin aserciones. |
| **src/support/** | Gestionar el ciclo de vida del navegador y el contexto compartido mediante `CustomWorld`. |
| **src/fixtures/** | Proveer datos de prueba desde variables de entorno y constantes. |

---

## Agregar un nuevo escenario

Seguí este orden estrictamente — cada capa depende de la anterior.

### Paso 1 — Crear o extender el Page Object

Si el escenario interactúa con una página que ya tiene un Page Object, agregá el nuevo método ahí. Si es una página nueva, creá una nueva clase en `src/pages/`.

```typescript
// src/pages/EjemploPage.ts
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class EjemploPage extends BasePage {
  private readonly botonEnviar = this.page.locator('#submit');

  constructor(page: Page) {
    super(page);
  }

  async clickEnviar(): Promise<void> {
    await this.botonEnviar.click();
  }

  async getTextoConfirmacion(): Promise<string> {
    return this.page.locator('.confirmation').innerText();
  }
}
```

**Reglas para los Page Objects:**
- Los locators son siempre `private readonly`
- Los métodos son `async` y retornan `Promise<void>` o un valor
- Sin aserciones dentro del Page Object — solo acciones y getters

### Paso 2 — Escribir el escenario Gherkin

Agregá el escenario al `.feature` correspondiente, o creá uno nuevo en `features/`.

```gherkin
# features/ejemplo.feature
Feature: Ejemplo de funcionalidad

  Scenario: El usuario envía el formulario exitosamente
    Given que el usuario ha iniciado sesión con credenciales válidas
    When el usuario envía el formulario de ejemplo
    Then se muestra el mensaje de confirmación "¡Éxito!"
```

**Reglas para los feature files:**
- Usá `Given` para precondiciones, `When` para acciones, `Then` para aserciones
- Si un step ya existe en `step-definitions/shared.steps.ts`, reutilizalo con el texto exacto
- El texto de los steps debe ser descriptivo y orientado al negocio — sin detalles técnicos

### Paso 3 — Implementar los step definitions

Creá un nuevo archivo en `step-definitions/` o agregá al existente si el dominio coincide. Importá el Page Object correspondiente y `CustomWorld`.

```typescript
// step-definitions/ejemplo.steps.ts
import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../src/support/world';
import { EjemploPage } from '../src/pages/EjemploPage';

When('el usuario envía el formulario de ejemplo', async function (this: CustomWorld) {
  const ejemploPage = new EjemploPage(this.page);
  await ejemploPage.clickEnviar();
});

Then('se muestra el mensaje de confirmación {string}', async function (this: CustomWorld, esperado: string) {
  const ejemploPage = new EjemploPage(this.page);
  const texto = await ejemploPage.getTextoConfirmacion();
  expect(texto).toBe(esperado);
});
```

**Reglas para los step definitions:**
- Nunca usar `page.locator()` directamente — siempre a través del Page Object
- Las aserciones (`expect`) van aquí, no en el Page Object
- Si un step será utilizado por más de un feature, agregarlo a `shared.steps.ts`

### Verificar

```bash
npm test
```
