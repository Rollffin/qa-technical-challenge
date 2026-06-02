# PR #6 — Fixtures de datos y placeholders F14 ([QAUTO-500](https://rebu.atlassian.net/browse/QAUTO-500))

**Branch:** `claude/QAUTO-500-fixtures-data`
**Base:** `dev`
**Estado:** PR pendiente de crear (rama pusheada)
**Reviewer principal:** Diana Campos

> Esta PR es **independiente de PR #5** — ambas se ramificaron desde `dev` directamente y no comparten archivos.

---

## ✅ Qué se hizo

### Archivos TS de fixtures (4)

| Archivo | Líneas | Responsabilidad |
|---|---|---|
| [`colaboradores-test.ts`](../../../../src/fixtures/data/colaboradores-test.ts) | 75 | 5 perfiles típicos de Empleado (básico, salario bajo/alto, ingreso mid-year, ingreso reciente). Cada caso tiene `nombre`, `payload`, `expected`. |
| [`otros-empleadores-test.ts`](../../../../src/fixtures/data/otros-empleadores-test.ts) | 170 | `CASOS_VALIDOS` (5) + `CASOS_INVALIDOS` (5) para CRUD de OE. Payloads son funciones `(personId, year) => body` para inyección del personId en runtime. |
| [`planillas-externas-test.ts`](../../../../src/fixtures/data/planillas-externas-test.ts) | 100 | `CASOS_CARGA_F14` (3) + `CASOS_VINCULACION` (4 estrategias: por-dui / por-nit / sin-match / multiple-match). |
| [`casos-isr-regulatorio.ts`](../../../../src/fixtures/data/casos-isr-regulatorio.ts) | 200 | ⚠️ **Tablas oficiales ISR DGII** (Recálculo Junio + Diciembre) + 8 casos parametrizados (4 por tabla). Helper `calcularISR()` para referencia. |

### Anexos F14 (README + 3 placeholders)

| Archivo | Tipo |
|---|---|
| `anexos-f14/README.md` | Documentación de cómo generar los `.xlsx` reales (no se commitean). |
| `anexos-f14/f14-valido-mayo-2026.xlsx.placeholder` | Placeholder — happy path. |
| `anexos-f14/f14-estructura-invalida.xlsx.placeholder` | Placeholder — caso negativo de estructura. |
| `anexos-f14/f14-duplicado-colaborador.xlsx.placeholder` | Placeholder — caso negativo de DUI duplicado. |

---

## 🧩 Diseño

### Forma de los fixtures

Cada caso usa `as const` para que TypeScript trate los valores como literales:

```typescript
export const COLABORADORES_TEST = {
  empleadoBasico: { nombre: '...', payload: { salary: 1500, ... }, expected: { ... } },
  ...
} as const;

export type ColaboradorFixtureKey = keyof typeof COLABORADORES_TEST;
```

Los specs consumen así:

```typescript
import { COLABORADORES_TEST } from '../../../src/fixtures/data/colaboradores-test';
const colab = await createColaboradorParaFiscalData(api, COLABORADORES_TEST.empleadoBasico.payload);
expect(colab.grossSalary ?? salaryFromDb).toBe(COLABORADORES_TEST.empleadoBasico.expected.grossSalary);
```

### `payload` como función (`otros-empleadores-test.ts`)

Los payloads de OE necesitan el `personId` del colaborador creado por el builder — que solo existe en runtime. Por eso son **funciones** `(personId: string, year: number) => CreateOtroEmpleadorPayload`:

```typescript
const colab = await createColaboradorParaFiscalData(api);
const payload = CASOS_VALIDOS.todosLosCampos.payload(colab.personId, 2026);
await api.annualFiscalData.createOtroEmpleador(colab.companyId, payload);
```

### `casos-isr-regulatorio.ts` — header con guard

El archivo abre con un banner ASCII visible en cualquier editor que indica:

```
⚠️  ARCHIVO REGULATORIO — REQUIERE VALIDACIÓN DE CONTADOR CERTIFICADO
🚨 NO USAR EN TESTS @regulatory HASTA TENER FIRMA
```

Cada `CasoRecalculo` lleva `aprobadoPor: 'PENDIENTE FIRMA'`. Los specs de PR #10 deben mantener `test.fixme` mientras ese campo no contenga el nombre del contador real (criterio bloqueante en QAUTO-504).

### Tablas oficiales (verbatim del ticket QAUTO-500)

`TABLA_RECALCULO_JUNIO` y `TABLA_RECALCULO_DICIEMBRE` se copian textualmente de las tablas oficiales DGII que aportó Jessica en el comentario del ticket (4 tramos cada una, con `taxRate`, `overAmount`, `taxes`, `fixedRate`).

`Number.POSITIVE_INFINITY` se usa para el `highEnd` del tramo 4 — los specs pueden hacer `acumulado >= tramo.lowEnd && acumulado <= tramo.highEnd` sin caso especial.

---

## ⚠️ TODOs / Limitaciones

**0 TODOs en código.** Sí hay 3 ítems que requieren acción humana:

| # | Pendiente | Quién resuelve | Bloquea |
|---|---|---|---|
| 1 | Firma del contador certificado en `casos-isr-regulatorio.ts` (reemplazar `'PENDIENTE FIRMA'` por nombre real). | Contador externo. | PR #10 — tests `@regulatory` quedan `test.fixme` hasta resolver. |
| 2 | Generar los 3 archivos `.xlsx` reales en `anexos-f14/` (manualmente o con script). | QA. | PR #8 — tests de carga F14 fallan por archivo faltante. |
| 3 | Verificar que los tests existentes no consumen ningún archivo de este directorio (no debería; este es un directorio nuevo). | QA. | No bloquea. |

---

## 🧪 Cómo validar manualmente

```bash
# 1. TypeScript strict
npx tsc --noEmit
#   → exit 0 ✅

# 2. ESLint estricto en fixtures nuevos
npx eslint src/fixtures/data/*.ts --max-warnings 0
#   → exit 0 ✅

# 3. Prettier check
npx prettier --check src/fixtures/data/*.ts
#   → "All matched files use Prettier code style!" ✅

# 4. Cada caso es importable individualmente (sin lazy loading)
node -e "Object.keys(require('./src/fixtures/data/colaboradores-test').COLABORADORES_TEST).forEach(console.log)"
#   → debe listar las claves del fixture (empleadoBasico, empleadoSalarioBajo, ...)
```

---

## 🔗 Dependencias

- **Bloquea:** PR #7 (consume `colaboradores-test` + `otros-empleadores-test`), PR #8 (consume `planillas-externas-test` + anexos), PR #9 (consume `colaboradores-test`), PR #10 (consume `casos-isr-regulatorio`).
- **Bloqueada por:** PR #3 ✅ (tipos del service: `CreateOtroEmpleadorPayload`).
- **No depende de PR #5** — ambos branches partieron de `dev` directamente.

---

## 📊 Métricas

- **Archivos creados (TS):** 4
- **Archivos creados (Markdown):** 1 (README de anexos)
- **Placeholders binarios:** 3 (`.xlsx.placeholder`)
- **Líneas TypeScript:** ~545
- **Casos válidos:** 5 (OE) + 5 (colaboradores) + 3 (carga F14) + 4 (vinculación) = 17
- **Casos inválidos:** 5 (OE)
- **Casos regulatorios:** 8 (4 Junio + 4 Diciembre)
- **TODOs en código:** 0

---

## ✅ Checklist de criterios de aceptación

- ✅ Cada caso tiene mínimo `nombre`, `payload`, `expected` (o `expectedStatus` para inválidos).
- ✅ Usa `as const` para que TypeScript trate los valores como literales.
- ✅ `.xlsx` reales NO se generan acá — solo placeholders.
- ✅ Header de `casos-isr-regulatorio.ts` indica claramente "requiere validación regulatoria antes de usar en producción".
- ✅ TypeScript compila sin errores en modo strict.
- ✅ ESLint pasa sin warnings nuevos.
- ✅ Prettier check pasa.
- ✅ Cada caso es importable sin lazy loading (todos están en `export const`).
