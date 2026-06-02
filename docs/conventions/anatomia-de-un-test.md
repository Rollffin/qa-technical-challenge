# Anatomía de un test

Esta guía explica **cómo se compone un test** en este repo y **por qué** está estructurado así. Pensada para alguien que ya sabe Playwright pero recién llega al proyecto.

---

## 🧱 Las 5 capas

Un test en este repo se apoya en 5 piezas, en orden de invocación:

```
┌──────────────────────────────────────────────────────────────┐
│  1. Test (.spec.ts)                                          │ ← lo que se ejecuta
│     usa fixture `api`, llama builder, asserta el resultado   │
└──────┬───────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────┐
│  2. Fixture custom `api` (src/fixtures/api-fixtures.ts)      │ ← inyecta el helper ya autenticado
│     crea APIHelper, init(), authenticate(), dispose()        │
└──────┬───────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────┐
│  3. Builder (src/builders/*.ts)                              │ ← encapsula setup repetitivo
│     llama servicios del APIHelper en secuencia               │
└──────┬───────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────┐
│  4. APIHelper (src/api/APIHelper.ts) + Servicios             │ ← Facade que orquesta todo
│     auth, people, payroll, vacationPolicy, catalogs,         │
│     incidence, (annualFiscalData en PR #3)                   │
└──────┬───────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────────────────┐
│  5. Logger (src/utils/Logger.ts)                             │ ← visibilidad
│     .step / .info / .success / .error                        │
└──────────────────────────────────────────────────────────────┘
```

---

## 1. El test (`*.spec.ts`)

Importa **siempre** `test` y `expect` desde nuestro fixture, **no** desde `@playwright/test` directo:

```typescript
import { test, expect } from '../../../src/fixtures/api-fixtures';
import { Logger } from '../../../src/utils/Logger';
```

> Si importas desde `@playwright/test` directo, **no recibes el fixture `api`** ya autenticado y tendrías que armar el cliente HTTP a mano.

### Estructura `describe → test` con tags

```typescript
test.describe(
    'QAUTO-501 — CRUD Otros Empleadores | API | REBU-4425/4426/4427',
    { tag: ['@api', '@datos-fiscales', '@regression'] },
    () => {
        test(
            'QAUTO-501 — Crear registro de Otros Empleadores con todos los campos (happy path)',
            { tag: ['@api', '@smoke', '@critical', '@datos-fiscales'] },
            async ({ api }) => {
                // ... AAA aquí
            },
        );
    },
);
```

- El `describe` agrupa por **caso de uso / historia**.
- Cada `test()` cubre **un escenario** y tiene su propio set de tags (más específicos que los del describe).
- El **nombre del test** sigue el patrón `'QAUTO-XXX — descripción'` (ver [naming-conventions](naming-conventions.md)).

### Patrón AAA dentro del test

```typescript
async ({ api }) => {
    // ─── ARRANGE ──────────────────────────────────────────────────────
    Logger.step('Setup: creando colaborador y planilla del mes anterior');
    const scenario = await createColaboradorParaFiscalData(api, {
        tipo: 'empleado',
        salary: 1200,
    });

    // ─── ACT ──────────────────────────────────────────────────────────
    Logger.step('Acción: agregando ingreso de Otros Empleadores');
    const createRes = await api.annualFiscalData.createOtroEmpleador(
        scenario.companyId,
        {
            personId: scenario.personId,
            ingresosGravables: 5000,
            year: 2026,
        },
    );

    // ─── ASSERT ───────────────────────────────────────────────────────
    expect(createRes.ok()).toBeTruthy();
    const created = await createRes.json();
    expect(created.ingresosGravables).toBeCloseTo(5000, 2);
    Logger.success(`Registro creado — ID: ${created.id} ✅`);
},
```

**Separadores `// ─── X ───`** son cosméticos pero ayudan a leer specs largos. Mantenerlos consistentes.

---

## 2. La fixture `api`

`src/fixtures/api-fixtures.ts` extiende el `test` de Playwright con un objeto `api: APIHelper` que llega **ya autenticado**.

```typescript
export const test = base.extend<ApiFixtures>({
    api: async ({}, use) => {
        const apiHelper = new APIHelper();
        await apiHelper.init();
        await apiHelper.authenticate();
        await use(apiHelper);
        await apiHelper.dispose();
    },
});
```

Implicaciones:

- **No haces login en cada test.** Ya está hecho.
- `api.getCompanyId()` ya devuelve un número válido.
- Al terminar el test, `dispose()` cierra los contextos HTTP. No queda nada colgado.

---

## 3. El builder (opcional pero recomendado)

Si tu test repite > 5 pasos de setup que ya viven en otro spec, **extrae un builder** en `src/builders/`. Ver [builder-pattern.md](builder-pattern.md) para detalles.

Ejemplo: `createPayrollScenario(api, opts)` hace 11 pasos (crear planilla, política, resolver 8 catálogos, crear persona, 3 PATCHes, crear payroll entry, obtener `payrollDetailId`). Devuelve todos los IDs útiles.

**Regla:** el builder **no asserta**. Solo arma y devuelve IDs. Las aserciones viven en el spec.

---

## 4. El `APIHelper` y los servicios

`APIHelper` es un **Facade**: instancias todos los servicios en su constructor y los expone como propiedades públicas.

```typescript
api.auth          // AuthAPIService            — microservicio
api.people        // PeopleAPIService          — microservicio
api.vacationPolicy // VacationPolicyAPIService — microservicio
api.payroll       // PayrollAPIService         — portal + microservicio
api.catalogs      // CatalogAPIService         — catálogos (tercer dominio)
api.incidence     // IncidenceAPIService       — portal + microservicio
// api.annualFiscalData (se agrega en PR #3 de la épica REBU-4420)
```

Cada servicio hereda de `BaseAPIService` y maneja su propio contexto HTTP. **No mezcles** dominios — ej. no llames un endpoint del portal pasándole el contexto del microservicio.

---

## 5. El `Logger`

`src/utils/Logger.ts` expone:

| Método | Cuándo |
|---|---|
| `Logger.step(msg)` | Inicio de un paso del setup o del acto (genera línea con 🔹) |
| `Logger.info(msg)` | Info útil de diagnóstico (IDs creados, valores leídos) |
| `Logger.success(msg)` | Aserción exitosa importante (genera línea con ✅) |
| `Logger.error(msg, e?)` | Diagnóstico antes de tirar |
| `Logger.failure(msg)` | Aserción fallida importante (genera línea con ❌) |
| `Logger.warn(msg)` | Advertencia (algo raro pero no fatal) |
| `Logger.debug(msg)` | Solo visible si `setLogLevel('DEBUG')` |

**Por qué importa:** los reportes HTML y los videos de Playwright muestran los `console.log` con timestamps. Sin `Logger.step` es muy difícil debuggear un test largo.

---

## 🧩 Todo junto — ejemplo end-to-end

```typescript
// tests/Payroll-Datos-Fiscales-Anuales/otros-empleadores/crud-otros-empleadores-api.spec.ts

import { test, expect } from '../../../src/fixtures/api-fixtures';
import { Logger } from '../../../src/utils/Logger';
import { createColaboradorParaFiscalData } from '../../../src/builders/annual-fiscal-data-scenario';
import { CASOS_VALIDOS } from '../../../src/fixtures/data/otros-empleadores-test';

test.describe(
    'QAUTO-501 — CRUD Otros Empleadores | API | REBU-4425/4426/4427',
    { tag: ['@api', '@datos-fiscales', '@regression'] },
    () => {
        test(
            'QAUTO-501 — Crear OE con todos los campos (happy path)',
            { tag: ['@api', '@smoke', '@critical', '@datos-fiscales'] },
            async ({ api }) => {
                // ─── ARRANGE ─────────────────────────────────────────────
                Logger.step('Setup: creando colaborador empleado');
                const scenario = await createColaboradorParaFiscalData(api, {
                    tipo: 'empleado',
                    salary: 1500,
                });

                // ─── ACT ─────────────────────────────────────────────────
                Logger.step('Acción: POST createOtroEmpleador');
                const payload = CASOS_VALIDOS.todosLosCampos.payload(scenario);
                const createRes = await api.annualFiscalData.createOtroEmpleador(
                    scenario.companyId,
                    payload,
                );

                // ─── ASSERT ──────────────────────────────────────────────
                expect(createRes.ok()).toBeTruthy();
                const created = await createRes.json();
                expect(created.ingresosGravables).toBeCloseTo(payload.ingresosGravables, 2);
                expect(created.impuestosRetenidos).toBeCloseTo(payload.impuestosRetenidos!, 2);

                Logger.success(`OE creado — ID: ${created.id} ✅`);
            },
        );
    },
);
```

Lo que NO ves aquí (pero pasa por debajo):
- Login con Bearer token + cookies (`fixture api`).
- Creación de planilla, política, catálogos, persona, PATCHes (`builder`).
- Composición de payload con datos realistas (`fixtures/data`).

El spec se queda con **lo que cambia** entre tests: el caso, el payload, las aserciones.

---

## 🚫 Anti-patrones — qué NO hacer

- ❌ `import { test } from '@playwright/test'` directo (perdés el fixture `api`).
- ❌ Hardcodear company ID, payroll ID, person ID. **Siempre** crearlos en el test.
- ❌ Compartir estado entre tests vía variables módulo. Cada test es independiente.
- ❌ Usar `page.waitForTimeout(N)`. Si necesitás esperar, usa `expect.poll`, `waitFor`, o el matcher web-first apropiado.
- ❌ Selectores frágiles: xpath, `nth-child` profundos, clases CSS generadas (`css-1abc23`). Prioridad: `getByRole` > `getByLabel` > `getByTestId` > `getByText`.
- ❌ `as any` en el código nuevo. Solo se acepta en los payloads de `updatePerson` y `createPerson` (deuda técnica conocida).
- ❌ Aserciones dentro del builder. El builder arma; el spec asserta.
- ❌ Mezclar dominios HTTP en el mismo contexto del servicio.

---

## 📚 Siguiente lectura

- [naming-conventions.md](naming-conventions.md) — cómo nombrar todo
- [test-tagging.md](test-tagging.md) — qué tag aplicar a cada test
- [builder-pattern.md](builder-pattern.md) — cuándo extraer un builder
