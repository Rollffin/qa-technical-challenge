# PR #3 — AnnualFiscalDataAPIService + integración con APIHelper ([QAUTO-497](https://rebu.atlassian.net/browse/QAUTO-497))

**Branch:** `claude/QAUTO-497-api-service`
**Base:** `dev`
**Estado:** PR pendiente de crear (rama pusheada)
**Reviewer principal:** Diana Campos

---

## ✅ Qué se hizo

### Archivos nuevos (1)
- [`src/api/AnnualFiscalDataAPIService.ts`](../../../../src/api/AnnualFiscalDataAPIService.ts) — **654 líneas**.
  - 14 métodos públicos cubriendo las 3 sub-pestañas (Otros Empleadores · Planillas Externas · Recálculo de Renta).
  - 10 tipos exportados (`CreateOtroEmpleadorPayload`, `OtroEmpleadorDTO`, `ListOtrosEmpleadoresParams`, `MesPlanillaExternaDTO`, `DetalleMesDTO`, `RegistroF14DTO`, `LinkRecordPayload`, `ConsolidadoColaboradorRow`, `ConsolidadoRecalculoDTO`, `ListRecalculoParams`, `DrillDownColaboradorDTO`).
  - 2 enums (`DownloadType { Resumen=0, Detalle=1 }`, `DownloadFormat { Excel=0, Csv=1 }`).
  - Hereda de `BaseAPIService`, usa `config.baseURL` (Portal) y carga `playwright/.auth/user.json` para cookies de sesión (mismo patrón que `PayrollAPIService` portal section).

### Archivos modificados (2)
- [`src/api/APIHelper.ts`](../../../../src/api/APIHelper.ts) — **+5 líneas**, 5 ediciones puntuales:
  1. Import de `AnnualFiscalDataAPIService`.
  2. Field `public readonly annualFiscalData: AnnualFiscalDataAPIService;`.
  3. Instanciación en constructor pasando `portalURL`.
  4. `await this.annualFiscalData.init();` en `init()`.
  5. `await this.annualFiscalData.dispose();` en `dispose()`.
  - El alignment visual del bloque de inicialización existente **se preservó intacto** (sin reformatear lo que no era parte del PR).
- [`src/index.ts`](../../../../src/index.ts) — **+1 línea** (export del service).

---

## 📋 14 métodos públicos implementados

### Otros Empleadores (REBU-4425 / 4426 / 4427)
| Método | Endpoint | Cobertura |
|---|---|---|
| `listOtrosEmpleadores(companyId, params)` | `GET /annual-fiscal-data/other-employers` | REBU-4425 |
| `createOtroEmpleador(companyId, payload)` | `POST /annual-fiscal-data/other-employers` | REBU-4426 |
| `updateOtroEmpleador(companyId, id, payload)` | `PATCH /annual-fiscal-data/other-employers/{id}` | REBU-4427 |
| `deleteOtroEmpleador(companyId, id)` | `DELETE /annual-fiscal-data/other-employers/{id}` | REBU-4427 |

### Planillas Externas (REBU-4432 / 4434 / 4435 / 4436 / 4437)
| Método | Endpoint | Cobertura |
|---|---|---|
| `listMesesPlanillasExternas(companyId, year)` | `GET /external-payrolls/months` | REBU-4432 |
| `uploadAnexoF14(companyId, filePath)` | `POST /external-payrolls/months` (multipart) | REBU-4434 |
| `getDetalleMes(companyId, monthId, search?)` | `GET /external-payrolls/months/{monthId}` | REBU-4435 |
| `deleteMesPlanillaExterna(companyId, monthId)` | `DELETE /external-payrolls/months/{monthId}` | REBU-4437 |
| `downloadDetalleMes(companyId, monthId, format)` | `GET /external-payrolls/months/{monthId}/download` | REBU-4435 |
| `updateVinculacion(companyId, monthId, links[])` | `PATCH /external-payrolls/months/{monthId}/links` | REBU-4436 |

### Recálculo de Renta (REBU-4441 / 4462 / 4463) — API path: `income-recalculation`
| Método | Endpoint | Cobertura |
|---|---|---|
| `getConsolidadoRecalculo(companyId, params)` | `GET /income-recalculation` | REBU-4441 |
| `downloadConsolidadoRecalculo(companyId, year, type, format)` | `GET /income-recalculation/download` | REBU-4463 |
| `getDrillDownColaborador(companyId, personId, year)` | `GET /income-recalculation/persons/{personId}` | REBU-4462 |
| `downloadDrillDownColaborador(companyId, personId, year, format)` | `GET /income-recalculation/persons/{personId}/download` | REBU-4463 |

---

## ⚠️ TODOs pendientes

**Cero TODOs en código.** Ninguna línea con `// TODO: confirmar con BE`. Todos los endpoints están marcados con `// ✅ Confirmado desde Swagger UAT + Portal (2026-05-22)` por Jessica Molina (QA Lead).

### Decisiones documentadas en código (no son TODOs, son JSDoc de diseño)
1. **DTOs de respuesta** (`OtroEmpleadorDTO`, `RegistroF14DTO`, `ConsolidadoColaboradorRow`, etc.) declaran **estructura mínima garantizada** + algunos campos `?` adicionales basados en lo que los specs de PR #7-#10 van a leer. Si el backend devuelve un superset, TypeScript no se queja (solo enforce-a los campos declarados).
2. **Multipart upload (`uploadAnexoF14`)**: el método omite el header `Content-Type` para que Playwright arme el boundary automáticamente. MIME se infiere de la extensión del archivo (`.xlsx` → `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`, `.csv` → `text/csv`). Se lee el archivo a buffer (no stream) para tener control explícito del MIME.
3. **Query params PascalCase**: la API espera `Year`, `Search`, `Page`, `PageSize` (no camelCase). Los interfaces TypeScript exponen camelCase a quien consume y el método mapea internamente al call site.
4. **`updateVinculacion`** acepta `LinkRecordPayload[]` (array), no un objeto único — el endpoint procesa N vinculaciones en una sola llamada.

---

## 🧪 Cómo validar manualmente

```bash
# 1. TypeScript strict compila sin errores
npx tsc --noEmit
#   → exit 0 ✅

# 2. Lint estricto sobre el archivo nuevo (0 warnings permitidos)
npx eslint src/api/AnnualFiscalDataAPIService.ts --max-warnings 0
#   → exit 0 ✅

# 3. Prettier check sobre el archivo nuevo
npx prettier --check src/api/AnnualFiscalDataAPIService.ts
#   → All matched files use Prettier code style! ✅

# 4. Ningún test existente se rompe (no se introduce regresión)
npx playwright test --project=chromium --list
#   → debe seguir listando 435 tests (igual que antes de esta PR)

# 5. Verificación de smoke test (1 endpoint contra UAT) — pendiente de PR #7
#    Por ahora no hay specs que ejerciten el service; se valida en PR #7.
```

### No-regresión en APIHelper.ts

```bash
git diff dev -- src/api/APIHelper.ts | grep -E "^[+-]" | grep -v "^[+-][+-][+-]" | wc -l
#   → 5 inserciones, 0 eliminaciones (el alignment visual se preservó)
```

---

## 🔗 Dependencias

- **Bloquea:** PR #4 (builders), PR #7 (tests OE), PR #8 (tests PE), PR #9 (tests RR UI), PR #10 (tests motor ISR) — todos consumen este service.
- **Bloqueada por:** PR #2 ✅ (mergeada).
- **Dependencias externas:**
  - `playwright/.auth/user.json` debe existir en el ambiente (lo genera `auth.setup.ts`).
  - Los endpoints en UAT deben estar disponibles (verificado el 2026-05-22).

---

## 📊 Métricas

- **Archivos creados:** 1 (+ este reporte)
- **Archivos modificados:** 2 (`APIHelper.ts`, `index.ts`)
- **Líneas TypeScript agregadas:** 654 (nuevo service) + 5 (APIHelper) + 1 (index) = **660 líneas**
- **Métodos públicos del service:** 14
- **Tipos/Interfaces exportados:** 11
- **Enums exportados:** 2
- **Tests añadidos:** 0 (vendrán en PRs #7-#10)
- **TODOs en código:** 0
- **Endpoints marcados como confirmados:** 14/14 (100%)

---

## ✅ Checklist de criterios de aceptación

- ✅ El service hereda de `BaseAPIService`.
- ✅ Service usa `config.baseURL` (Portal), NO `config.apiBaseURL` — pasado como `portalURL` desde `APIHelper`.
- ✅ Maneja sesión con cookies — carga `playwright/.auth/user.json` en el constructor y lo asigna a `this.storageState`.
- ✅ TypeScript compila sin errores en modo strict (`npx tsc --noEmit` exit 0).
- ✅ ESLint pasa sin warnings nuevos (archivo nuevo pasa `--max-warnings 0`).
- ✅ Cada método público tiene JSDoc con referencia a la historia REBU-XXXX cubierta.
- ✅ DTOs declarados con campos en inglés:
  - `CreateOtroEmpleadorPayload` (`taxableIncome`, `taxesWithheld`, `dateFrom`, `dateUntil`).
  - `OtroEmpleadorDTO`, `MesPlanillaExternaDTO` (con `{ id, year, month, rowCount }`), `DetalleMesDTO`, `RegistroF14DTO`, `LinkRecordPayload`, `ConsolidadoRecalculoDTO`, `DrillDownColaboradorDTO`.
  - Enums `DownloadType { Resumen=0, Detalle=1 }`, `DownloadFormat { Excel=0, Csv=1 }`.
- ✅ Logs con `Logger.info` / `.success` / `.error` en cada método.
- ✅ `APIHelper.init()` incluye `await this.annualFiscalData.init();`.
- ✅ `APIHelper.dispose()` incluye `await this.annualFiscalData.dispose();`.
- ✅ Cada endpoint marcado con `// ✅ Confirmado desde Swagger UAT + Portal (2026-05-22)` en JSDoc.
- ✅ Ninguna línea con `// TODO: confirmar con BE` (`grep -n "TODO: confirmar con BE" src/api/AnnualFiscalDataAPIService.ts` devuelve vacío).
