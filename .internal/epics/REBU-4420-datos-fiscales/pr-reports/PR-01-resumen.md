# PR #1 — Bootstrap docs y plan de automatización ([QAUTO-495](https://rebu.atlassian.net/browse/QAUTO-495))

**Branch:** `claude/QAUTO-495-bootstrap-docs`
**Base:** `dev`
**Estado:** PR pendiente de crear (rama pusheada)
**Reviewer principal:** SM del equipo técnico

---

## ✅ Qué se hizo

Se creó toda la documentación base de la épica REBU-4420 / QAUTO-494 — **9 archivos markdown nuevos, 0 archivos `.ts` modificados**.

| # | Archivo | Líneas | Propósito |
|---|---|---|---|
| 1 | [docs/README.md](../../../README.md) | 71 | Índice navegable de la documentación |
| 2 | [docs/epics/REBU-4420-datos-fiscales/README.md](../README.md) | 114 | Análisis técnico de la épica + 19 issues hijas + riesgos + plan de 10 PRs |
| 3 | [docs/epics/REBU-4420-datos-fiscales/critical-flows.md](../critical-flows.md) | 115 | Flujos P0/P1/P2 priorizados con tags asignados |
| 4 | [docs/epics/REBU-4420-datos-fiscales/coverage-matrix.md](../coverage-matrix.md) | 59 | Tabla historia Jira ↔ archivo `.spec.ts` planeado ↔ PR |
| 5 | [docs/conventions/anatomia-de-un-test.md](../../../conventions/anatomia-de-un-test.md) | 254 | Guía pedagógica del flujo `Test → Fixture → APIHelper → Builder → API Service → Logger` con ejemplo end-to-end |
| 6 | [docs/conventions/naming-conventions.md](../../../conventions/naming-conventions.md) | 185 | Convenciones para archivos, clases, funciones, branches, commits, tags y nombres de tests |
| 7 | [docs/conventions/test-tagging.md](../../../conventions/test-tagging.md) | 140 | Sistema de tags por 5 ejes (tipo, prioridad, módulo, sub-flujo, estado) |
| 8 | [docs/conventions/builder-pattern.md](../../../conventions/builder-pattern.md) | 181 | Cuándo crear un builder, estructura, reglas inmutables, ejemplos |
| 9 | [docs/prompts/01-implementar-epica-rebu-4420.md](../../../prompts/01-implementar-epica-rebu-4420.md) | 192 | Prompt maestro reutilizable para agentes que implementen la épica |

**Total:** 1.311 líneas markdown.

### Decisiones de cobertura documentadas

- **19 issues hijas de REBU-4420** identificadas vía JQL (`parent = REBU-4420`): 17 Historias + 1 Mejora ([REBU-4439](https://rebu.atlassian.net/browse/REBU-4439)) + 1 Error ([REBU-4538](https://rebu.atlassian.net/browse/REBU-4538)).
- **23 spec files planeados** distribuidos entre PR #7, #8, #9 y #10. Detalle en [coverage-matrix.md](../coverage-matrix.md).
- **REBU-4538** (bug abierto en BE) se marca como **🔴 bloqueante de PR #7** — si no se fixea, los specs de edición de Otros Empleadores se quedan en `test.fixme`.
- **REBU-4438** (cambio de modelo BD para CEFAFA/BM) se asume aplicado en el ambiente de prueba antes de PR #10.

---

## ⚠️ TODOs pendientes

Esta PR es solo documentación — no hay `// TODO` en código. Sí hay supuestos que requieren validación antes de iniciar las PRs subsecuentes:

| # | Decisión asumida | Donde se asume | Quién valida |
|---|---|---|---|
| 1 | Recálculo on-the-fly vs. cache para el consolidado anual | [README.md §riesgos](../README.md) | BE — antes de PR #9 |
| 2 | Carga F14 acepta `.xlsx` (no `.xls` ni `.csv`) | [critical-flows.md §3](../critical-flows.md) | Product — antes de PR #8 |
| 3 | Auto-vinculación prioriza DUI sobre NIT cuando ambos hacen match | [coverage-matrix.md §REBU-4436](../coverage-matrix.md) | BE — antes de PR #8 |
| 4 | El motor ISR anual usa una tabla de tramos **distinta** a la del ISR mensual | [README.md §distinción crítica](../README.md) | Contador — obligatorio antes de mergear PR #10 |
| 5 | Tag `@regulatory` implica project `regulatory` con `retries: 0` | [test-tagging.md](../../../conventions/test-tagging.md) | Tech lead QA — confirma en PR #2 |

---

## 🧪 Cómo validar manualmente

1. **Lectura:** navegar `docs/` desde [docs/README.md](../../../README.md) y verificar que todos los enlaces relativos resuelven:
   ```bash
   cd docs
   # En Windows, abrir docs/README.md en VSCode y clickear cada link.
   # En *nix: find . -name "*.md" -exec grep -l "broken-link" {} \;
   ```
2. **Lint markdown** (si está configurado): no se ejecutó porque no hay `markdownlint` en el repo. Revisión visual recomendada.
3. **No-regresión:** confirmar que ningún test existente se ve afectado:
   ```bash
   git diff dev...HEAD --stat | grep -E '\.(ts|json|js)$'
   # Debe devolver vacío.
   ```
4. **Cobertura de las 17 Historias:** abrir [coverage-matrix.md](../coverage-matrix.md) y verificar que cada Historia tiene PR asignado.

### Tests automáticos

No aplica — esta PR no introduce ni modifica tests.

---

## 🔗 Dependencias

- **Bloquea:** PRs #2 a #10 (todas referencian estos docs).
- **Bloqueada por:** ninguna.
- **Dependencias externas:** ninguna.

---

## 📊 Métricas

- **Archivos creados:** 9 (+ este reporte)
- **Líneas markdown agregadas:** ~1.380 (1.311 docs + reporte)
- **Archivos `.ts` modificados:** 0
- **Tests añadidos:** 0
- **TODOs sin resolver en código:** 0
- **Decisiones pendientes documentadas:** 5
