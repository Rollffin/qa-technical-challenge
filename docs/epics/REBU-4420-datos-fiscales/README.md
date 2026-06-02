# Épica REBU-4420 — Datos Fiscales del Año

> **Épica producto:** [REBU-4420](https://rebu.atlassian.net/browse/REBU-4420)
> **Épica automatización:** [QAUTO-494](https://rebu.atlassian.net/browse/QAUTO-494)
> **Estado:** En implementación (10 PRs)
> **Tech lead QA:** Jessica Molina

---

## 🎯 ¿Qué problema resuelve esta épica?

El producto introduce una **nueva sección "Datos Fiscales del Año"** dentro del módulo de Planilla. Esta sección consolida 3 vistas que antes vivían dispersas (o no existían):

1. **Otros Empleadores** — registrar ingresos que un colaborador percibió en otra empresa durante el mismo año fiscal. Reemplaza el viejo flujo de "Ajustes Fiscales" del perfil del colaborador.
2. **Planillas Externas a Rebu** — cargar anexos F14 (formato oficial DGII / ISSS de El Salvador) con la planilla mensual de **otras empresas** donde el colaborador trabajó antes de entrar a Rebu en el año en curso. Se vinculan filas del F14 a colaboradores de Rebu por DUI / NIT.
3. **Recálculo de Renta** — consolidado anual que muestra, para cada colaborador, el ISR proyectado considerando **3 fuentes de ingreso**: ingresos corridos en Rebu + Otros Empleadores + Planillas Externas. Incluye drill-down por persona y descargas.

El motor de cálculo de Recálculo de Renta corre en **junio** y **diciembre** y aplica una tabla de tramos ISR distinta a la del descuento mensual.

---

## 🧩 Estructura de la épica — 19 issues hijas

| Key | Tipo | Resumen | Cubierta en PR |
|---|---|---|---|
| [REBU-4423](https://rebu.atlassian.net/browse/REBU-4423) | Historia | Crear sección "Datos Fiscales del Año" en el menú de Planilla | PR #5 (navegación) |
| [REBU-4424](https://rebu.atlassian.net/browse/REBU-4424) | Historia | Configurar permisos de acceso a la sección | PR #7 (permisos) |
| [REBU-4425](https://rebu.atlassian.net/browse/REBU-4425) | Historia | Ver listado de registros de Otros Empleadores | PR #7 |
| [REBU-4426](https://rebu.atlassian.net/browse/REBU-4426) | Historia | Agregar registro de Otros Empleadores | PR #7 |
| [REBU-4427](https://rebu.atlassian.net/browse/REBU-4427) | Historia | Editar y eliminar registro de Otros Empleadores | PR #7 |
| [REBU-4430](https://rebu.atlassian.net/browse/REBU-4430) | Historia | Remover Ajustes Fiscales del perfil del colaborador | PR #7 (migración) |
| [REBU-4432](https://rebu.atlassian.net/browse/REBU-4432) | Historia | Ver listado cargado en Planillas Externas a Rebu | PR #8 |
| [REBU-4434](https://rebu.atlassian.net/browse/REBU-4434) | Historia | Cargar anexo F14 en Planillas Externas | PR #8 |
| [REBU-4435](https://rebu.atlassian.net/browse/REBU-4435) | Historia | Ver detalle de un mes cargado en Planillas Externas | PR #8 |
| [REBU-4436](https://rebu.atlassian.net/browse/REBU-4436) | Historia | Vincular y desvincular filas del F14 a colaboradores | PR #8 |
| [REBU-4437](https://rebu.atlassian.net/browse/REBU-4437) | Historia | Eliminar mes completo de Planillas Externas | PR #8 |
| [REBU-4438](https://rebu.atlassian.net/browse/REBU-4438) | Historia | Agregar campos CEFAFA y Bienestar Magisterial a BD | Asumido en BD |
| [REBU-4441](https://rebu.atlassian.net/browse/REBU-4441) | Historia | Ver consolidado anual de Recálculo de Renta | PR #9 |
| [REBU-4462](https://rebu.atlassian.net/browse/REBU-4462) | Historia | Ver drill-down por colaborador en Recálculo de Renta | PR #9 |
| [REBU-4463](https://rebu.atlassian.net/browse/REBU-4463) | Historia | Descargar consolidado y drill-down de Recálculo de Renta | PR #9 |
| [REBU-4521](https://rebu.atlassian.net/browse/REBU-4521) | Historia | Incorporar Planillas Externas al cálculo de Ingresos Gravables | PR #10 (motor ISR) |
| [REBU-4528](https://rebu.atlassian.net/browse/REBU-4528) | Historia | Retirar columnas legacy `ChangedBy` y `Status` de `PeopleImportedTax` (tech debt) | Sin spec (cambio BD) |
| [REBU-4439](https://rebu.atlassian.net/browse/REBU-4439) | Mejora | Remover Planillas Externas a Rebu del perfil del colaborador | Validación negativa |
| [REBU-4538](https://rebu.atlassian.net/browse/REBU-4538) | Error | `[BE] PATCH Otros Empleadores rechaza request por validación prematura de Id` | Bloquea PR #7 si no se fixea |

> El detalle de qué historia mapea a qué archivo `.spec.ts` está en [coverage-matrix.md](coverage-matrix.md).

---

## ⚠️ Riesgos críticos identificados

1. **La épica REBU-4420 no tiene descripción en Jira.** Este documento es la fuente de verdad de la intención de la épica.
2. **REBU-4521 (motor ISR) está mal especificada.** Los tests que la cubran (PR #10) **deben tener escenarios firmados por un contador** antes de mergear. Por eso esos tests van con tag `@regulatory` y `retries: 0`.
3. **REBU-4441 (consolidado) tiene decisión arquitectónica pendiente** sobre cálculo on-the-fly vs. cache. Los tests de PR #9 asumen on-the-fly y deben adaptarse si BE decide cache (los tiempos de respuesta cambian).
4. **REBU-4438 (CEFAFA y BM)** es cambio de modelo de datos. Los tests de PR #10 asumen que el cambio **ya está aplicado en la BD del ambiente de prueba** — si no, los recálculos fallan por columnas faltantes.
5. **REBU-4538 es un bug abierto en BE.** Bloquea operaciones de edición en Otros Empleadores. Si no se fixea antes de PR #7, esos tests deben marcarse como `test.fixme` con referencia al bug.

---

## 🕳️ Gaps que se cubren explícitamente con tests

Casos que se descubrieron durante el análisis y que **no** son obvios desde los criterios de aceptación de las historias:

- Validación de **duplicidad colaborador ↔ fila F14 en mismo mes** (más de una fila para el mismo DUI en el mismo período).
- **DUI compartido entre un Empleado y un Servicios Profesionales** del mismo colaborador (caso edge documentado por el equipo de payroll).
- **Auto-vinculación con múltiples coincidencias** (qué hace el sistema si dos personas distintas tienen el mismo NIT mal cargado).
- **Cambios retroactivos post-recálculo** (qué pasa si se modifica un ingreso después de correr el recálculo).
- Manejo de errores en **carga masiva del F14** (> 10k filas, archivos corruptos, estructura inválida).
- **Performance del consolidado** en empresas con > 500 colaboradores (no se asserta tiempo, pero se asserta que la respuesta llega).

---

## 🚨 Distinción crítica vs tests existentes — NO mezclar

| Concepto | Tests existentes | Tests nuevos de esta épica |
|---|---|---|
| **Cálculo** | ISR **mensual** del período (1ra o 2da quincena) | **Recálculo anual** (junio o diciembre) |
| **Fuentes consideradas** | Solo ingresos de Rebu del período | Rebu corrido + Otros Empleadores + Planillas Externas |
| **Tabla de tramos** | Mensual | Anual (distinta) |
| **Carpeta** | `tests/Payroll-Descuentos-de-ley/.../2da Quincena - descuento ISR.../` | `tests/Payroll-Datos-Fiscales-Anuales/recalculo-renta/motor-isr/` |
| **Tag** | `@regression`, `@descuentos-de-ley` | `@regulatory`, `@critical`, `@datos-fiscales` |
| **Retries** | Configurables | **0 — sin excepción** |

Son cálculos **diferentes con tablas diferentes**. Un test del motor ISR anual **no reemplaza** un test del ISR mensual y viceversa.

---

## 🗺️ Plan de 10 PRs

| PR  | Ticket | Branch                                            | Resumen |
|-----|--------|---------------------------------------------------|---------|
| #1  | [QAUTO-495](https://rebu.atlassian.net/browse/QAUTO-495) | `claude/QAUTO-495-bootstrap-docs` | Docs base (esta PR) |
| #2  | [QAUTO-496](https://rebu.atlassian.net/browse/QAUTO-496) | `claude/QAUTO-496-tags-config` | Tags + Playwright projects `smoke`/`regulatory` |
| #3  | [QAUTO-497](https://rebu.atlassian.net/browse/QAUTO-497) | `claude/QAUTO-497-api-service` | `AnnualFiscalDataAPIService` + registrar en `APIHelper` |
| #4  | [QAUTO-498](https://rebu.atlassian.net/browse/QAUTO-498) | `claude/QAUTO-498-builders` | `annual-fiscal-data-scenario` + `recalculo-renta-scenario` |
| #5  | [QAUTO-499](https://rebu.atlassian.net/browse/QAUTO-499) | `claude/QAUTO-499-page-objects` | Page Objects de las 3 tabs + modales |
| #6  | [QAUTO-500](https://rebu.atlassian.net/browse/QAUTO-500) | `claude/QAUTO-500-fixtures-data` | Fixtures de datos y casos ISR regulatorios |
| #7  | [QAUTO-501](https://rebu.atlassian.net/browse/QAUTO-501) | `claude/QAUTO-501-tests-otros-empleadores` | Tests Otros Empleadores (CRUD + permisos + migración) |
| #8  | [QAUTO-502](https://rebu.atlassian.net/browse/QAUTO-502) | `claude/QAUTO-502-tests-planillas-externas` | Tests Planillas Externas (carga F14, vinculación, eliminación) |
| #9  | [QAUTO-503](https://rebu.atlassian.net/browse/QAUTO-503) | `claude/QAUTO-503-tests-recalculo-renta-ui` | Tests UI del consolidado de Recálculo de Renta |
| #10 | [QAUTO-504](https://rebu.atlassian.net/browse/QAUTO-504) | `claude/QAUTO-504-tests-motor-isr` | Tests **regulatorios** del motor ISR anual |

Cada PR parte de `dev` actualizado. **Nunca encadenar branches.**

---

## 📐 Decisiones arquitectónicas asumidas

1. **El service nuevo `AnnualFiscalDataAPIService` golpea el portal administrativo** (`config.baseURL`), siguiendo el patrón de `PayrollAPIService`. La auth es por `storageState` para los endpoints del portal y Bearer token para los del microservicio (si los hay).
2. **Builders devuelven IDs útiles, no aserciones.** Las aserciones viven en los specs.
3. **Page Objects de las 3 tabs heredan de `BasePage`** y exponen métodos por acción, no por locator.
4. **Modales son clases separadas** que se instancian desde la page principal, con `open()`, `close()`, `isOpen()`.
5. **Los archivos `.xlsx` reales del F14 no se versionan binariamente** en PR #6 — solo placeholders. QA genera los archivos posteriormente en su máquina.
6. **El project `regulatory` corre con `retries: 0`**; si un test ahí falla, falla de verdad — no hay reintentos que enmascaren un cálculo regulatorio incorrecto.
