# PR #2 — Tags como constantes + projects smoke/regulatory ([QAUTO-496](https://rebu.atlassian.net/browse/QAUTO-496))

**Branch:** `claude/QAUTO-496-tags-config`
**Base:** `dev`
**Estado:** PR pendiente de crear (rama pusheada)
**Reviewer principal:** Diana Campos

---

## ✅ Qué se hizo

### Archivos nuevos (1)
- [`src/utils/test-tags.ts`](../../../../src/utils/test-tags.ts) — **82 líneas**.
  - Exporta `TAGS` como objeto plano con `as const` (22 constantes agrupadas por los 5 ejes documentados en [test-tagging.md](../../../conventions/test-tagging.md)).
  - Exporta el tipo `TestTag = (typeof TAGS)[keyof typeof TAGS]` — unión literal de los 22 valores.
  - JSDoc con ejemplo de uso desde un spec.

### Archivos modificados (2)
- [`playwright.config.ts`](../../../../playwright.config.ts) — **+30 / -0**.
  - Project `smoke` (`grep: /@smoke/`, retries default, `dependencies: ['setup']`).
  - Project `regulatory` (`grep: /@regulatory/`, **`retries: 0`** con comentario explicando por qué).
  - Ambos heredan viewport `1220×820` y `Desktop Chrome` device.
- [`package.json`](../../../../package.json) — **+2 / -0**.
  - Script `test:smoke` → `playwright test --project=smoke`.
  - Script `test:regulatory` → `playwright test --project=regulatory`.

---

## ⚠️ TODOs pendientes

Ninguno marcado en código. Sí hay una observación:

| # | Observación | Impacto |
|---|---|---|
| 1 | Al correr `npx playwright test --project=smoke --list`, aparecen **3 tests preexistentes** ya marcados con `@smoke` en `tests/collaborators/add-collaborator.spec.ts` (2) y `tests/home.spec.ts` (1). | Comportamiento esperado del filtro, **no es un bug**. Esos tests entrarán automáticamente al pipeline de smoke. Si Diana prefiere que el project `smoke` solo cubra `@datos-fiscales`, se puede agregar un `grep` más específico — pero ningún ticket lo pide. |

---

## 🧪 Cómo validar manualmente

Comandos verificados localmente — todos pasan:

```bash
# 1. Smoke project: lista 3 tests preexistentes con @smoke (+ setup)
npx playwright test --project=smoke --list
#   → Total: 4 tests in 3 files

# 2. Regulatory project: 0 tests (esperado — aún no hay @regulatory)
npx playwright test --project=regulatory --list
#   → Total: 1 test in 1 file (solo setup)

# 3. No-regresión: chromium sigue listando 435 tests
npx playwright test --project=chromium --list
#   → Total: 435 tests in 390 files

# 4. Lint estricto sobre archivos nuevos (0 warnings permitidos)
npx eslint src/utils/test-tags.ts --max-warnings 0
#   → EXIT: 0

# 5. TypeScript compila sin errores
npx tsc --noEmit
#   → EXIT: 0

# 6. Scripts de npm funcionan (no se ejecutan, solo verificar que existen)
npm run | grep -E "test:(smoke|regulatory)"
```

### Lint del repo completo
- `npm run lint` reporta ~110.000 warnings preexistentes — **todos son `prettier/prettier — Delete ␍`** (CRLF de Windows en archivos que ya estaban en el repo). **No introduzco ningún warning nuevo.**
- Validación específica con `npx eslint src/utils/test-tags.ts --max-warnings 0` → exit 0.

---

## 🔗 Dependencias

- **Bloquea:** PR #7 a #10 (los tests usan `TAGS.X` y los projects `smoke`/`regulatory`).
- **Bloqueada por:** PR #1 (convenciones de tagging ya documentadas en [test-tagging.md](../../../conventions/test-tagging.md)).
- **Dependencias externas:** ninguna.

---

## 📊 Métricas

- **Archivos creados:** 1 (+ este reporte)
- **Archivos modificados:** 2 (`playwright.config.ts`, `package.json`)
- **Líneas TypeScript agregadas:** 82 (`test-tags.ts`)
- **Líneas config agregadas:** 30 (`playwright.config.ts`) + 2 (`package.json`)
- **Tests añadidos:** 0
- **TODOs sin resolver:** 0
- **Tags exportados:** 22 (cubre los 5 ejes de `test-tagging.md`)

---

## ✅ Checklist de criterios de aceptación del ticket

- ✅ `npx playwright test --project=smoke --list` no falla por configuración.
- ✅ `npx playwright test --project=regulatory --list` no falla por configuración.
- ✅ Los tests existentes siguen corriendo con `--project=chromium` exactamente igual (435 tests detectados, mismo conteo que antes).
- ✅ ESLint pasa sin warnings nuevos (en archivos modificados/creados).
- ✅ `test-tags.ts` exporta `TAGS` con `as const` y un tipo `TestTag`.
- ✅ `retries: 0` está explícito en el project `regulatory` con un comentario de 4 líneas explicando por qué.
