# Prompt maestro — Épica REBU-4420 / QAUTO-494

> **Cómo usar este prompt:** ábrelo desde la raíz del repo con un agente (Claude Code, Cursor, etc.) y pásalo como instrucción inicial. El agente arrancará preguntándote en qué PR empezar.

---

# CONTEXTO

Vas a trabajar en el repositorio `rebu-automated-test-suite` implementando la épica de Jira **QAUTO-494** "[Payroll] Datos Fiscales del Año - Automatización (REBU-4420)".

La épica está dividida en 10 PRs, cada una con su ticket Jira ya creado:

| PR  | Ticket Jira | Branch                                            |
|-----|-------------|---------------------------------------------------|
| #1  | QAUTO-495   | `claude/QAUTO-495-bootstrap-docs`                 |
| #2  | QAUTO-496   | `claude/QAUTO-496-tags-config`                    |
| #3  | QAUTO-497   | `claude/QAUTO-497-api-service`                    |
| #4  | QAUTO-498   | `claude/QAUTO-498-builders`                       |
| #5  | QAUTO-499   | `claude/QAUTO-499-page-objects`                   |
| #6  | QAUTO-500   | `claude/QAUTO-500-fixtures-data`                  |
| #7  | QAUTO-501   | `claude/QAUTO-501-tests-otros-empleadores`        |
| #8  | QAUTO-502   | `claude/QAUTO-502-tests-planillas-externas`       |
| #9  | QAUTO-503   | `claude/QAUTO-503-tests-recalculo-renta-ui`       |
| #10 | QAUTO-504   | `claude/QAUTO-504-tests-motor-isr`                |

---

# FUENTE DE VERDAD

**La única fuente de verdad de qué hacer en cada PR son los tickets Jira QAUTO-495…QAUTO-504.** Este prompt define el *cómo* (proceso, convenciones, guardrails); el ticket define el *qué* (archivos, endpoints, criterios de aceptación).

Si un ticket queda corto en detalle:
1. Primero relee la descripción completa con `getJiraIssue` (incluye descripción, comentarios, subtasks).
2. Si sigue faltando información, añade comentario al ticket con `addCommentToJiraIssue` listando preguntas específicas.
3. Detente y pídele confirmación al usuario.
4. **NO inferir de versiones anteriores de este prompt.**
5. **Excepción:** convenciones técnicas (naming, ubicación de carpetas, estilo) sí las puedes inferir leyendo el repo existente y los docs en `docs/conventions/`.

---

# REGLAS DE FLUJO

## Antes de empezar cada PR

1. Confirma con el usuario qué PR vas a hacer.
2. Lee la descripción completa del ticket Jira con `getJiraIssue`.
3. Llama `getTransitionsForJiraIssue` para obtener el ID exacto de la transición. Busca case-insensitive el nombre que matchee "En curso" / "In Progress" / "En progreso". En el proyecto QAUTO actualmente es **`id: "31"` → `"En curso"`**.
4. Transiciona el ticket con `transitionJiraIssue` usando el ID obtenido.
5. **Sal del worktree actual si estás en uno y trabaja desde el repo principal:**
   - `cd` al repo principal (fuera del worktree). Si necesitás operar git desde otro working tree usa `git -C <path>`.
   - `git checkout dev && git pull origin dev`
   - Confirma con `git status` y `git branch --show-current` que estás en `dev` actualizado.
   - Crea la branch de la PR: `git checkout -b claude/QAUTO-XXX-descripcion-corta`.
6. **Nunca encadenes branches.** Para cada PR vuelve a `dev`, `git pull`, y crea la nueva branch desde ahí.

## Durante el desarrollo

- Sigue las convenciones del repo:
  - **Indent:** TABS (no espacios).
  - **Idioma:** comentarios y logs en español; código (variables, funciones, clases, archivos) en inglés.
  - **TypeScript strict.** Sin `any` (salvo en payloads de `updatePerson`/`createPerson` — deuda técnica conocida). Sin `@ts-ignore`.
- Cada commit referencia el ticket: `feat(scope): mensaje [QAUTO-XXX]`. Ver [docs/conventions/naming-conventions.md](../conventions/naming-conventions.md).
- Si encuentras un bloqueo (endpoint no confirmado, decisión arquitectónica ambigua, etc.):
  - Marca el bloqueo en código con `// TODO: confirmar con BE - REBU-XXXX` (o el ticket Jira correspondiente).
  - Añade comentario al ticket Jira con `addCommentToJiraIssue` explicando el bloqueo.
  - **Detente y pregunta al usuario** antes de continuar con código que dependa del bloqueo.

## Al terminar cada PR

1. Push a la branch: `git push -u origin claude/QAUTO-XXX-...`.
2. Genera el archivo `docs/epics/REBU-4420-datos-fiscales/pr-reports/PR-XX-resumen.md` (detalle técnico — plantilla más abajo).
3. Comenta en el ticket Jira con `addCommentToJiraIssue` (resumen ejecutivo + link al archivo del reporte).
4. **Pásale al usuario el link de GitHub para crear el PR manualmente.** No crees el PR automáticamente.
5. El PR debe apuntar `base: dev` ← `compare: claude/QAUTO-XXX-...`.
6. **NO transicionar el ticket a "Finalizada".** Eso lo hace el usuario manualmente después del merge.
7. **NO empezar la siguiente PR** hasta que la actual esté mergeada y el ticket cerrado, salvo que el usuario te lo indique explícitamente.

---

# ESTRUCTURA DE ARCHIVOS PERMITIDA

Solo puedes crear/modificar archivos en estas rutas. Si necesitas tocar algo fuera de esta lista, **detente y pregunta**.

```
docs/
src/api/AnnualFiscalDataAPIService.ts
src/api/APIHelper.ts                              (solo añadir registro de service)
src/pages/LeftBarPage.ts                          (solo añadir link)
src/pages/payroll/datos-fiscales/
src/builders/annual-fiscal-data-scenario.ts
src/builders/recalculo-renta-scenario.ts
src/fixtures/data/
src/utils/test-tags.ts
src/index.ts                                      (solo añadir exports)
tests/Payroll-Datos-Fiscales-Anuales/
playwright.config.ts                              (solo PR #2)
package.json                                      (solo PR #2)
```

---

# CONVENCIONES DEL REPO (resumen)

- **Framework:** Playwright + TypeScript strict.
- **Patrón API:** Facade `APIHelper` en `src/api/APIHelper.ts`.
- **Patrón UI:** Page Object heredando de `src/pages/BasePage.ts`.
- **Builders:** funciones standalone en `src/builders/` — ver [docs/conventions/builder-pattern.md](../conventions/builder-pattern.md).
- **Fixtures custom:** `src/fixtures/api-fixtures.ts` con fixture `api` (inyecta `APIHelper` ya autenticado).
- **Logger:** `src/utils/Logger.ts` con `Logger.step`, `.info`, `.success`, `.error`, `.failure`.
- **Test data:** `src/utils/TestDataGenerator.ts`.
- **Tags:** `src/utils/test-tags.ts` (lo creas en PR #2).
- **Naming tests:** `'QAUTO-XXX — descripción legible | área | módulo'` — **SIN `TC-XXX`**.
  - Ejemplo: `test.describe('QAUTO-501 — CRUD Otros Empleadores | API | REBU-4425/4426/4427', ...);`
- **3 dominios HTTP** distintos:
  - `config.baseURL` → portal administrativo (cookies / `storageState`).
  - `config.apiBaseURL` → microservicio de payroll (Bearer token).
  - `config.catalogsBaseURL` → catálogos (Bearer token).

Detalle completo en `docs/conventions/`.

---

# REGLAS INMUTABLES

1. NO inventes endpoints HTTP en silencio — marca `// TODO: confirmar con BE - REBU-XXXX` y comenta en el ticket Jira.
2. NO modifiques tests existentes (carpetas `Payroll-Aportes-Patronales`, `Payroll-Descuentos-de-ley`, `Payroll-Provisiones`, `Payroll-Salario-Dias`, `Payroll-Ausencias`, `collaborators`, `regresiones`, `steps-planilla`, `fecha-ingreso-futuro`, `eliminar-planillas`). Están en producción.
3. NO uses `page.waitForTimeout()` salvo último recurso documentado con comentario justificándolo.
4. NO uses selectores frágiles (xpath, `nth-child` profundos, clases CSS aleatorias generadas). Prioriza: `getByRole` > `getByLabel` > `getByTestId` > `getByText`.
5. NO compartas estado entre tests vía variables módulo. Cada test crea sus propios datos.
6. NO uses `as any` salvo en payloads de `updatePerson` / `createPerson` (deuda técnica conocida). NO introduzcas más.
7. NO ejecutes `npm install` ni añadas dependencias sin permiso explícito.
8. NO modifiques `package.json`, `playwright.config.ts`, `tsconfig.json`, `eslint.config.js` salvo si el ticket lo requiere (PR #2).
9. Tests con tag `@regulatory` **NUNCA tienen retries**. Si falla, falla.
10. Comentarios y logs en español; código (variables, funciones, clases) en inglés.
11. NO inferir de versiones anteriores de este prompt cuando el ticket Jira esté incompleto — preguntar.
12. NO crear el PR de GitHub automáticamente. Push + entregar link.
13. NO transicionar el ticket Jira a "Finalizada".

---

# PLANTILLA: `docs/epics/REBU-4420-datos-fiscales/pr-reports/PR-XX-resumen.md`

```markdown
# PR #XX — [Título] ([QAUTO-XXX](https://rebu.atlassian.net/browse/QAUTO-XXX))

**Branch:** `claude/QAUTO-XXX-descripcion`
**Base:** `dev`
**Estado:** PR abierta (pendiente de review) | Mergeada
**Reviewer principal:** SM del equipo técnico

## ✅ Qué se hizo
- Lista concreta de archivos creados/modificados con # de líneas si ayuda.

## ⚠️ TODOs pendientes
- TODOs marcados en código con `// TODO: ...` — listar todos con archivo:línea.
- Decisiones que requieren validación de tech lead / BE / contador.

## 🧪 Cómo validar manualmente
- Comandos para correr los tests nuevos.
- Qué cosas validar antes del merge (revisión visual de docs, lint, etc.).

## 🔗 Dependencias
- Otras PRs que deben mergearse antes/después.
- Endpoints o features de BE que deben estar listos.

## 📊 Métricas
- # de archivos creados.
- # de tests añadidos (si aplica).
- # de TODOs sin resolver.
```

---

# COMPORTAMIENTO ESPERADO

- **Una PR a la vez.**
- **Lee el ticket Jira completo** antes de empezar.
- **Si encuentras ambigüedad, DETENTE y pregunta** en vez de adivinar.
- **Marca TODOs explícitamente** y añádelos como comentarios al ticket Jira.
- **NO ejecutes tests automáticamente** salvo que el usuario lo pida — solo escribe código.
- **Al terminar una PR, sugiere el siguiente paso** ("Listo PR #X. ¿Avanzo a PR #Y o quieres revisar primero?").

---

# INICIO

Pregúntale al usuario:

1. ¿En qué PR quieres que empiece? (default: **PR #1 = QAUTO-495 — Bootstrap docs**)
2. ¿El repo está limpio en una rama `dev` actualizada?

Espera confirmación antes de comenzar.
