# Test tagging

Los tags permiten **correr subconjuntos de tests** sin tener que pensar en paths o globs.

Ejemplo:

```bash
npx playwright test --grep @smoke              # Solo smoke
npx playwright test --grep @regression         # Solo regresión
npx playwright test --grep "@datos-fiscales"   # Toda la épica REBU-4420
npx playwright test --project=regulatory       # Solo regulatorios (con retries: 0)
```

A partir de PR #2 (QAUTO-496), las constantes de tags vivirán en `src/utils/test-tags.ts` para evitar typos.

---

## 🎚️ Categorías de tags

Pensá los tags en **5 ejes independientes**. Un test típico lleva 2-4 tags, uno por eje aplicable.

### Eje 1 — Tipo de test (cómo se ejecuta)

| Tag | Significado |
|---|---|
| `@api` | Test puramente de API (sin abrir browser para acciones del caso) |
| `@ui` | Test que interactúa con la UI a través de un Page Object |
| `@api-ui` | Híbrido: setup vía API, validación vía UI (o viceversa) |

### Eje 2 — Prioridad (cuándo se ejecuta)

| Tag | Significado | Frecuencia |
|---|---|---|
| `@smoke` | Critical path — debe pasar antes de cualquier release | En cada PR + nightly |
| `@critical` | P0: bloquea pago / regulatorio. Subconjunto de `@smoke` o de `@regression`. | En cada PR + nightly |
| `@regression` | Cobertura amplia, se corre completa para release | Nightly + pre-release |
| `@regulatory` | Cálculo regulatorio (ISR, impuestos). **`retries: 0`, sin excepción.** | Pre-release |

### Eje 3 — Módulo / dominio funcional

| Tag | Significado |
|---|---|
| `@planilla` | Módulo de planilla (correr planillas) |
| `@aportes-patronales` | Sub-módulo aportes patronales |
| `@descuentos-de-ley` | ISR, AFP, ISSS (descuentos del colaborador) |
| `@provisiones` | Aguinaldo, vacaciones, indemnización |
| `@salario-dias` | Cálculo de salario y días |
| `@ausencias` | Incidencias y ausencias |
| `@datos-fiscales` | **Épica REBU-4420** — Datos Fiscales del Año |
| `@colaboradores` | Gestión de personas |

### Eje 4 — Sub-flujo o función (opcional)

| Tag | Significado |
|---|---|
| `@permisos` | Validación de roles / autorización |
| `@migracion` | Migración de datos legacy |
| `@descargas` | Validación de descargas (xlsx, pdf) |
| `@validacion` | Validaciones de input (errores esperados, rechazos) |
| `@edge-case` | Caso límite, no es happy path |

### Eje 5 — Estado (cuando aplica)

| Tag | Significado |
|---|---|
| `@flaky` | Test inestable conocido — al frente de la lista para arreglar |
| `@skip-ci` | No correr en CI (ej. depende de archivo que no está en repo) |

---

## ✅ Combinaciones típicas

```typescript
// CRUD happy path de Otros Empleadores
{ tag: ['@api', '@smoke', '@critical', '@datos-fiscales'] }

// Vinculación manual del F14
{ tag: ['@api-ui', '@regression', '@datos-fiscales'] }

// Cálculo regulatorio del motor ISR
{ tag: ['@api', '@regulatory', '@critical', '@datos-fiscales'] }

// UI de descarga del consolidado
{ tag: ['@ui', '@regression', '@descargas', '@datos-fiscales'] }

// Permisos de acceso a la sección
{ tag: ['@api', '@critical', '@permisos', '@datos-fiscales'] }
```

---

## 🚦 Reglas de oro

1. **`@regulatory` ⇒ `retries: 0`.** Sin excepción. Se logra corriendo el test con `--project=regulatory` (configurado en `playwright.config.ts` desde PR #2).
2. **`@smoke` es un subconjunto.** Un test `@smoke` siempre tiene también `@critical` o `@regression`.
3. **`@critical` es sobre impacto, no sobre velocidad.** Un test `@critical` puede ser lento. El que es rápido y "huele" es `@smoke`.
4. **No tag duplicado.** Si describe ya tiene `@regression`, no se lo repitas en cada `test()` adentro — salvo que quieras sobreescribir prioridad.
5. **Tags en kebab-case con prefijo `@`.** Nunca `@DatosFiscales` o `@datos_fiscales`.
6. **No inventes tags nuevos sin checkear con el equipo.** Si necesitás uno, pedilo en `#qa-automation` y agregalo a esta doc en la misma PR.

---

## 🧪 Cómo correr cada subconjunto

```bash
# Todo el repo (con browser)
npx playwright test --project=chromium

# Solo smoke (rápido, debe pasar siempre)
npx playwright test --grep @smoke
# o (desde PR #2)
npm run test:smoke

# Solo regulatorios (sin retries — se desea que falle si falla)
npx playwright test --project=regulatory
# o (desde PR #2)
npm run test:regulatory

# Toda la épica de Datos Fiscales
npx playwright test --grep "@datos-fiscales"

# Tests críticos del módulo de descuentos
npx playwright test --grep "@critical.*@descuentos-de-ley"

# Excluir flaky
npx playwright test --grep-invert "@flaky"
```

---

## 📋 Checklist para revisar tags en un PR

Cuando revisás un PR con tests nuevos, validá:

- [ ] ¿Cada `test()` tiene **al menos un tag de prioridad** (`@smoke`, `@critical`, `@regression`, o `@regulatory`)?
- [ ] ¿Cada `test()` tiene **al menos un tag de módulo** (`@datos-fiscales`, `@planilla`, etc.)?
- [ ] ¿Cada `test()` tiene **al menos un tag de tipo** (`@api`, `@ui`, `@api-ui`)?
- [ ] ¿Los tests `@regulatory` están en el proyecto `regulatory` (`--project=regulatory`) o, al menos, declaran `test.use({ retries: 0 })`?
- [ ] ¿Hay tags duplicados entre describe y test? (no necesariamente malo, pero revísalo)
- [ ] ¿Algún tag nuevo no documentado acá? (entonces, agregarlo o usar uno existente)
