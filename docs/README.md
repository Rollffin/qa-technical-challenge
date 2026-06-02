# Documentación — `rebu-automated-test-suite`

Repositorio de tests automatizados E2E + API del producto **Rebu HR / Payroll**, escritos en **Playwright + TypeScript strict**.

Esta carpeta `docs/` reúne todo lo que **no es código de tests**: convenciones del equipo, análisis de épicas en curso, plan de cobertura y prompts maestros para automatización con agentes.

---

## 📚 Índice

### Convenciones del equipo (`conventions/`)

Reglas que aplican a **todo el repo**. Si vas a escribir un test o un Page Object, empieza por aquí.

- [Anatomía de un test](conventions/anatomia-de-un-test.md) — guía pedagógica de cómo se compone un test (`Test → Fixture → APIHelper → Builder → API Service → Logger`) con un ejemplo completo.
- [Naming conventions](conventions/naming-conventions.md) — cómo nombrar archivos, clases, funciones, branches, commits y tests.
- [Test tagging](conventions/test-tagging.md) — sistema de tags (`@smoke`, `@regression`, `@regulatory`, etc.) y cómo elegir el correcto.
- [Builder pattern](conventions/builder-pattern.md) — cuándo y cómo crear un builder en `src/builders/` para encapsular setup repetitivo.

### Épicas en curso (`epics/`)

Análisis técnico de épicas grandes que abarcan múltiples PRs. Sirven como **fuente de contexto** para entender el "por qué" detrás de los tests.

- [REBU-4420 — Datos Fiscales del Año](epics/REBU-4420-datos-fiscales/README.md)
  - [Critical flows](epics/REBU-4420-datos-fiscales/critical-flows.md) — flujos P0/P1/P2 que la épica debe cubrir.
  - [Coverage matrix](epics/REBU-4420-datos-fiscales/coverage-matrix.md) — tabla historia Jira → archivo `.spec.ts` planeado.
  - [PR reports](epics/REBU-4420-datos-fiscales/pr-reports/) — resumen técnico de cada PR ya mergeada.

### Prompts maestros (`prompts/`)

Instrucciones reutilizables para agentes (Claude Code, Cursor, etc.) que implementan una épica completa de forma incremental.

- [Implementar épica REBU-4420](prompts/01-implementar-epica-rebu-4420.md) — proceso, reglas, guardrails y workflow Jira/Git para las 10 PRs de la épica.

---

## 🧭 ¿Por dónde empezar?

| Si vas a… | Lee primero |
|---|---|
| Escribir un test nuevo | [anatomia-de-un-test.md](conventions/anatomia-de-un-test.md) |
| Crear un Page Object | [naming-conventions.md](conventions/naming-conventions.md) + revisar `src/pages/BasePage.ts` |
| Agregar un endpoint nuevo | revisar `src/api/APIHelper.ts` y un servicio existente (ej. `PayrollAPIService.ts`) |
| Encapsular setup repetido | [builder-pattern.md](conventions/builder-pattern.md) + `src/builders/payroll-scenario.ts` |
| Etiquetar un test | [test-tagging.md](conventions/test-tagging.md) |
| Trabajar en la épica de Datos Fiscales | [REBU-4420-datos-fiscales/README.md](epics/REBU-4420-datos-fiscales/README.md) |

---

## 🛠️ Stack técnico de referencia

- **Test runner:** Playwright
- **Lenguaje:** TypeScript (`strict: true`)
- **Patrón API:** Facade/Factory — todas las llamadas pasan por `APIHelper` (`src/api/APIHelper.ts`)
- **Patrón UI:** Page Object Model que hereda de `BasePage` (`src/pages/BasePage.ts`)
- **Fixtures Playwright:** custom fixture `api` en `src/fixtures/api-fixtures.ts`
- **Logger:** `src/utils/Logger.ts` (`Logger.step`, `.info`, `.success`, `.error`, `.failure`)
- **Generador de datos:** `src/utils/TestDataGenerator.ts` (DUI, NIT, fechas, faker en español)
- **Auth:** project `setup` en `tests/auth.setup.ts` guarda `storageState` en `playwright/.auth/user.json`

## 🌐 3 dominios HTTP (importante)

`APIHelper` orquesta 3 base URLs distintas — no las mezcles:

| Dominio | Variable env | Servicios | Auth |
|---|---|---|---|
| Portal administrativo | `config.baseURL` | `payroll`, `incidence` (parcial) | Cookies (`storageState`) |
| Microservicio payroll | `config.apiBaseURL` | `auth`, `people`, `vacationPolicy`, `incidence` (parcial) | Bearer token |
| Catálogos | `config.catalogsBaseURL` | `catalogs` | Bearer token |

Detalle completo en `src/api/APIHelper.ts` (comentario del header).
