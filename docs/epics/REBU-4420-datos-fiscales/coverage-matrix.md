# Coverage Matrix — REBU-4420

Mapeo **historia Jira ↔ archivo `.spec.ts` planeado ↔ PR**. Sirve para responder rápido:
- *¿Esta historia tiene tests?*
- *¿Dónde busco el test si quiero entender un comportamiento?*

> **Estado de los archivos:** todos los archivos listados **están planeados**, no creados. Esta tabla se actualiza a medida que las PRs van mergeando.
> Leyenda: 🟢 = mergeado · 🟡 = en PR abierta · ⚪ = pendiente · 🔴 = bloqueado

---

## Cobertura de las 17 Historias

| Key | Historia | PR | Archivo(s) `.spec.ts` planeado(s) | Tipo | Tags principales | Estado |
|---|---|---|---|---|---|---|
| [REBU-4423](https://rebu.atlassian.net/browse/REBU-4423) | Crear sección "Datos Fiscales del Año" en menú | #5 | Validado por navegación en otros specs (no spec dedicado) | UI | `@datos-fiscales @navegacion` | ⚪ |
| [REBU-4424](https://rebu.atlassian.net/browse/REBU-4424) | Configurar permisos de acceso a la sección | #7 | `tests/Payroll-Datos-Fiscales-Anuales/otros-empleadores/permisos-solo-ver.spec.ts` | API + UI | `@critical @permisos @datos-fiscales` | ⚪ |
| [REBU-4425](https://rebu.atlassian.net/browse/REBU-4425) | Ver listado de registros de Otros Empleadores | #7 | `tests/Payroll-Datos-Fiscales-Anuales/otros-empleadores/crud-otros-empleadores-api.spec.ts` | API | `@datos-fiscales @smoke` | ⚪ |
| [REBU-4426](https://rebu.atlassian.net/browse/REBU-4426) | Agregar registro de Otros Empleadores | #7 | `tests/Payroll-Datos-Fiscales-Anuales/otros-empleadores/crud-otros-empleadores-api.spec.ts` + `crud-otros-empleadores-ui.spec.ts` | API + UI | `@smoke @critical @datos-fiscales` | ⚪ |
| [REBU-4427](https://rebu.atlassian.net/browse/REBU-4427) | Editar y eliminar registro de Otros Empleadores | #7 | `tests/Payroll-Datos-Fiscales-Anuales/otros-empleadores/crud-otros-empleadores-api.spec.ts` | API | `@regression @datos-fiscales` | ⚪ |
| [REBU-4430](https://rebu.atlassian.net/browse/REBU-4430) | Remover Ajustes Fiscales del perfil del colaborador | #7 | `tests/Payroll-Datos-Fiscales-Anuales/otros-empleadores/migracion-ajustes-fiscales.spec.ts` | API | `@regression @migracion @datos-fiscales` | ⚪ |
| [REBU-4432](https://rebu.atlassian.net/browse/REBU-4432) | Ver listado cargado en Planillas Externas a Rebu | #8 | `tests/Payroll-Datos-Fiscales-Anuales/planillas-externas/ver-detalle-mes.spec.ts` | API + UI | `@regression @datos-fiscales` | ⚪ |
| [REBU-4434](https://rebu.atlassian.net/browse/REBU-4434) | Cargar anexo F14 en Planillas Externas | #8 | `tests/Payroll-Datos-Fiscales-Anuales/planillas-externas/carga-anexo-f14-happy-path.spec.ts` + `carga-anexo-f14-validaciones.spec.ts` | API + UI | `@smoke @critical @datos-fiscales` | ⚪ |
| [REBU-4435](https://rebu.atlassian.net/browse/REBU-4435) | Ver detalle de un mes cargado en Planillas Externas | #8 | `tests/Payroll-Datos-Fiscales-Anuales/planillas-externas/ver-detalle-mes.spec.ts` | API + UI | `@regression @datos-fiscales` | ⚪ |
| [REBU-4436](https://rebu.atlassian.net/browse/REBU-4436) | Vincular y desvincular filas del F14 | #8 | `auto-vinculacion-por-dui.spec.ts` + `auto-vinculacion-por-nit.spec.ts` + `auto-vinculacion-sin-match.spec.ts` + `vinculacion-manual.spec.ts` | API + UI | `@regression @datos-fiscales` | ⚪ |
| [REBU-4437](https://rebu.atlassian.net/browse/REBU-4437) | Eliminar mes completo de Planillas Externas | #8 | `tests/Payroll-Datos-Fiscales-Anuales/planillas-externas/eliminar-mes.spec.ts` | API | `@regression @datos-fiscales` | ⚪ |
| [REBU-4438](https://rebu.atlassian.net/browse/REBU-4438) | Agregar campos CEFAFA y Bienestar Magisterial a BD | — | Sin spec dedicado (cambio de modelo). Validado indirectamente por specs de PR #10. | DB | n/a | ⚪ |
| [REBU-4441](https://rebu.atlassian.net/browse/REBU-4441) | Ver consolidado anual de Recálculo de Renta | #9 | `tests/Payroll-Datos-Fiscales-Anuales/recalculo-renta/consolidado-anual.spec.ts` | API + UI | `@regression @datos-fiscales` | ⚪ |
| [REBU-4462](https://rebu.atlassian.net/browse/REBU-4462) | Ver drill-down por colaborador | #9 | `tests/Payroll-Datos-Fiscales-Anuales/recalculo-renta/drill-down-por-colaborador.spec.ts` | API + UI | `@regression @datos-fiscales` | ⚪ |
| [REBU-4463](https://rebu.atlassian.net/browse/REBU-4463) | Descargar consolidado y drill-down | #9 | `tests/Payroll-Datos-Fiscales-Anuales/recalculo-renta/descargar-consolidado-y-drill.spec.ts` | UI | `@regression @descargas @datos-fiscales` | ⚪ |
| [REBU-4521](https://rebu.atlassian.net/browse/REBU-4521) | Incorporar Planillas Externas al cálculo de Ingresos Gravables | #10 | `tests/Payroll-Datos-Fiscales-Anuales/recalculo-renta/motor-isr/motor-isr-junio-con-externas.spec.ts` + `motor-isr-junio-tres-fuentes.spec.ts` + `motor-isr-diciembre-tres-fuentes.spec.ts` + `motor-isr-tabla-tramos.spec.ts` (parametrizado) + más | API | `@regulatory @critical @datos-fiscales` | ⚪ |
| [REBU-4528](https://rebu.atlassian.net/browse/REBU-4528) | Retirar columnas legacy de `PeopleImportedTax` | — | Sin spec dedicado (tech debt de schema). Validado indirectamente. | DB | n/a | ⚪ |

---

## Issues no-historia (Mejora y Error)

| Key | Tipo | Resumen | Cubierta en | Estado |
|---|---|---|---|---|
| [REBU-4439](https://rebu.atlassian.net/browse/REBU-4439) | Mejora | Remover Planillas Externas a Rebu del perfil del colaborador | Validación negativa en `migracion-ajustes-fiscales.spec.ts` (PR #7) | ⚪ |
| [REBU-4538](https://rebu.atlassian.net/browse/REBU-4538) | Error (BE) | `PATCH Otros Empleadores rechaza request por validación prematura de Id` | Si está abierto al arrancar PR #7, marcar los specs afectados como `test.fixme` referenciando este bug | 🔴 (pendiente fix BE) |

---

## Resumen por PR

| PR | Tickets cubiertos | # specs `.spec.ts` planeados |
|---|---|---|
| PR #1 — Bootstrap docs | n/a | 0 |
| PR #2 — Tags + config | n/a | 0 |
| PR #3 — `AnnualFiscalDataAPIService` | n/a (infraestructura) | 0 |
| PR #4 — Builders | n/a (infraestructura) | 0 |
| PR #5 — Page Objects | REBU-4423 | 0 (sin specs dedicados; valida por navegación) |
| PR #6 — Fixtures de datos | n/a | 0 |
| PR #7 — Tests Otros Empleadores | REBU-4424, 4425, 4426, 4427, 4430, 4439 | 4 |
| PR #8 — Tests Planillas Externas | REBU-4432, 4434, 4435, 4436, 4437 | 9 |
| PR #9 — Tests Recálculo de Renta UI | REBU-4441, 4462, 4463 | 3 |
| PR #10 — Tests Motor ISR | REBU-4521 (+ valida 4438) | 7 |
| **Total** | **17 historias + 1 mejora + 1 bug** | **23 spec files** |
