# Naming conventions

Reglas de naming para **archivos, clases, funciones, branches, commits, tags y nombres de tests**. Si dudás de cómo nombrar algo, leé esto primero.

> **Idioma:**
> - **Comentarios y logs en español.**
> - **Código (variables, funciones, clases, archivos) en inglés.**
> - **Excepción:** nombres de carpetas de tests y nombres legibles de tests pueden ir en español si describen un caso de negocio (ej. `Payroll-Aportes-Patronales/`).

---

## 📁 Archivos

| Tipo | Convención | Ejemplo |
|---|---|---|
| Servicio API | PascalCase + `APIService.ts` | `AnnualFiscalDataAPIService.ts` |
| Page Object | PascalCase + `Page.ts` | `DatosFiscalesPage.ts` |
| Componente reutilizable de Page | PascalCase + `Modal.ts` / `Component.ts` | `AgregarRegistroModal.ts` |
| Builder | kebab-case + `-scenario.ts` | `annual-fiscal-data-scenario.ts` |
| Fixture de datos | kebab-case + `-test.ts` o `.ts` | `otros-empleadores-test.ts` |
| Utility | PascalCase descriptivo | `TestDataGenerator.ts`, `Logger.ts` |
| Test spec | kebab-case + `.spec.ts` | `crud-otros-empleadores-api.spec.ts` |
| Test setup (auth) | kebab-case + `.setup.ts` | `auth.setup.ts` |

**Carpetas de tests:** PascalCase con guiones cuando agrupan un dominio funcional (`Payroll-Aportes-Patronales/`), kebab-case en sub-niveles (`otros-empleadores/`).

---

## 🏛️ Clases y tipos

```typescript
export class AnnualFiscalDataAPIService extends BaseAPIService { ... }  // PascalCase
export interface OtroEmpleadorDTO { ... }                                // PascalCase + DTO sufijo
export interface CreateOtroEmpleadorPayload { ... }                      // PascalCase + Payload sufijo
export type AnnualFiscalDataTab = 'otros-empleadores' | 'planillas-externas' | 'recalculo-renta'; // PascalCase
```

- Sufijo `DTO` para respuestas del backend.
- Sufijo `Payload` para inputs hacia el backend (POST/PATCH bodies).
- Sufijo `Options` o `Result` para inputs/outputs de builders.

---

## 🧠 Funciones y variables

```typescript
async function createOtroEmpleador(...) { ... }       // camelCase, verbo de acción
const annualFiscalDataLink = page.getByRole(...);     // camelCase
const EXPECTED_AFP_CONFIA_PATRONAL = 26.25;           // SCREAMING_SNAKE_CASE para constantes del test
const isPensioned = false;                            // booleans: prefijo is/has/should/can
```

- **Booleans:** `isXxx`, `hasXxx`, `shouldXxx`, `canXxx`.
- **Constantes del caso de prueba** (los valores que parametrizan el test): `SCREAMING_SNAKE_CASE` al tope del archivo, con comentario explicando la fórmula o el supuesto.
- **IDs de catálogos:** `xxxId` (camelCase), no `xxxID` ni `xxx_id`.

---

## 🌿 Branches

**Patrón:** `claude/QAUTO-XXX-descripcion-corta`

| Ejemplos válidos | Ejemplos inválidos |
|---|---|
| `claude/QAUTO-495-bootstrap-docs` | `feat/qauto-495` (sin `claude/`, sin descripción) |
| `claude/QAUTO-501-tests-otros-empleadores` | `QAUTO-501-Tests-OE` (sin prefijo, mayúsculas) |
| `claude/QAUTO-504-tests-motor-isr` | `bugfix/motor-isr` (sin ticket) |

**Reglas:**
- Siempre **parten de `dev` actualizado**. Nunca encadenar branches una sobre otra.
- Prefijo `claude/` por consistencia con el resto del repo (donde agentes Claude colaboran).
- Descripción **kebab-case en inglés**, breve (≤ 5 palabras).

---

## 💬 Commits

**Patrón:** `tipo(scope): mensaje en imperativo [QAUTO-XXX]`

```
feat(annual-fiscal-data): add createOtroEmpleador endpoint [QAUTO-497]
test(otros-empleadores): cover crud happy path [QAUTO-501]
docs(rebu-4420): add coverage matrix [QAUTO-495]
refactor(api-helper): register annualFiscalData service [QAUTO-497]
chore(playwright): add smoke and regulatory projects [QAUTO-496]
fix(builder): handle empty payrolls array in payroll-scenario [QAUTO-XXX]
```

| Prefijo | Cuándo |
|---|---|
| `feat:` | Funcionalidad nueva del repo (servicio, builder, page object, fixture) |
| `test:` | Agregar / modificar archivo `.spec.ts` |
| `docs:` | Solo cambios en `docs/` o README |
| `refactor:` | Cambios en `src/` que no cambian comportamiento |
| `fix:` | Corrección de bug en código de tests o infra |
| `chore:` | Config, scripts, dependencias, lint |

**Reglas:**
- Mensajes consistentes en **inglés o español dentro de un mismo PR** (no mezclar).
- Referenciar el ticket Jira **siempre** con `[QAUTO-XXX]` al final.
- Imperativo presente: `add`, `fix`, `update` — no `added`, `fixing`, `updates`.

---

## 🧪 Nombres de tests

### `test.describe(...)` — agrupador

**Patrón:** `'QAUTO-XXX — Caso de uso | Tipo | REBU-YYYY[/ZZZZ]'`

```typescript
test.describe(
    'QAUTO-501 — CRUD Otros Empleadores | API | REBU-4425/4426/4427',
    { tag: ['@api', '@datos-fiscales', '@regression'] },
    () => { ... },
);
```

- Empezar con `'QAUTO-XXX — '` (en-dash entre el ticket y el caso).
- Caso de uso en **español legible** (lo lee el reporte HTML).
- Después de `|` venían `Tipo` (`API`, `UI`, `API+UI`) y las historias REBU cubiertas.

### `test(...)` — caso individual

**Patrón:** `'QAUTO-XXX — descripción concreta del escenario'`

```typescript
test('QAUTO-501 — Crear OE con todos los campos (happy path)', ...);
test('QAUTO-501 — Rechazar ingresos negativos', ...);
test('QAUTO-501 — Editar registro y verificar persistencia', ...);
```

- **NO incluir TC-XXX.** Esa nomenclatura del test case manager **no se usa en los specs nuevos** de esta épica.
- Cada test responde a la pregunta: *"¿qué estoy probando?"*
- Describe el **resultado esperado** cuando se pueda: `'... debe ser $26.25'`, `'... debe rechazar el request'`.

> **Nota:** algunos tests heredados de PRs anteriores incluyen `TC-XXX` en el nombre. **No reformatearlos**. La convención `sin TC-XXX` aplica a los specs nuevos de esta épica y de aquí en adelante.

---

## 🏷️ Tags

Ver [test-tagging.md](test-tagging.md) — los tags merecen su propia guía.

Resumen: todos los tags **van en lowercase con guion, prefijo `@`**, ej. `@datos-fiscales`, no `@DatosFiscales`.

---

## 📐 Estructura interna del archivo `.spec.ts`

```typescript
// 1. Imports (fixture + utilities + builders + fixtures de datos)
import { test, expect } from '../../../src/fixtures/api-fixtures';
import { Logger } from '../../../src/utils/Logger';
import { TestDataGenerator } from '../../../src/utils/TestDataGenerator';

// 2. JSDoc header con QAUTO-XXX, propósito y fórmula si aplica
/**
 * QAUTO-501
 * Verificar que al crear un OE con todos los campos válidos persiste
 * correctamente y aparece en el listado del año.
 */

// 3. Constantes del caso de prueba (SCREAMING_SNAKE_CASE)
const GROSS_SALARY = 1500;
const INGRESOS_GRAVABLES = 5000;
// ...

// 4. test.describe + test() con separadores AAA
test.describe('QAUTO-XXX — ...', { tag: [...] }, () => {
    test('QAUTO-XXX — ...', { tag: [...] }, async ({ api }) => {
        // ─── ARRANGE ───
        // ─── ACT ───
        // ─── ASSERT ───
    });
});
```

---

## 🎯 Tips de calidad

- Si el nombre del test es **vago** (`'should work'`, `'crud test'`), **rehaz** el nombre. Un nombre vago es señal de un test que prueba demasiado.
- Si el nombre del describe es **idéntico** al del único test que contiene, **borra el describe**. Los wrappers de un solo test añaden ruido.
- Si dos tests tienen **nombres casi idénticos** salvo por un detalle, considera **parametrizar** con `test.describe.parallel` + array de casos.
