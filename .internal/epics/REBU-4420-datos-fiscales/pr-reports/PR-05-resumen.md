# PR #5 — Page Objects de Datos Fiscales del Año ([QAUTO-499](https://rebu.atlassian.net/browse/QAUTO-499))

**Branch:** `claude/QAUTO-499-page-objects`
**Base:** `dev`
**Estado:** PR pendiente de crear (rama pusheada)
**Reviewer principal:** Diana Campos

---

## ✅ Qué se hizo

### Archivos nuevos (11) — `src/pages/payroll/datos-fiscales/`

| Page Object | Responsabilidad | Cobertura |
|---|---|---|
| [DatosFiscalesPage.ts](../../../../src/pages/payroll/datos-fiscales/DatosFiscalesPage.ts) | Contenedor con las 3 tabs + selector de año | REBU-4423 |
| [OtrosEmpleadoresTabPage.ts](../../../../src/pages/payroll/datos-fiscales/OtrosEmpleadoresTabPage.ts) | CRUD + búsqueda + paginación de Otros Empleadores | REBU-4425/4426/4427 |
| [PlanillasExternasTabPage.ts](../../../../src/pages/payroll/datos-fiscales/PlanillasExternasTabPage.ts) | Listado de meses + cargar F14 + abrir detalle | REBU-4432/4434/4437 |
| [DetalleMesF14Page.ts](../../../../src/pages/payroll/datos-fiscales/DetalleMesF14Page.ts) | Detalle de filas del F14 + vincular/desvincular + descargar | REBU-4435/4436 |
| [RecalculoRentaTabPage.ts](../../../../src/pages/payroll/datos-fiscales/RecalculoRentaTabPage.ts) | Consolidado anual + búsqueda + paginación + descargar | REBU-4441/4463 |
| [DrillDownColaboradorPage.ts](../../../../src/pages/payroll/datos-fiscales/DrillDownColaboradorPage.ts) | Desglose de las 3 fuentes + cálculo ISR + descargar | REBU-4462/4463 |

### Componentes (modales) — `src/pages/payroll/datos-fiscales/components/`

| Modal | Usado por | Cobertura |
|---|---|---|
| [AgregarRegistroModal.ts](../../../../src/pages/payroll/datos-fiscales/components/AgregarRegistroModal.ts) | OtrosEmpleadoresTabPage → click "Agregar" | REBU-4426 |
| [EditarRegistroModal.ts](../../../../src/pages/payroll/datos-fiscales/components/EditarRegistroModal.ts) | OtrosEmpleadoresTabPage → click "Editar" en fila | REBU-4427 |
| [CargarAnexoF14Modal.ts](../../../../src/pages/payroll/datos-fiscales/components/CargarAnexoF14Modal.ts) | PlanillasExternasTabPage → click "Cargar F14" (multipart) | REBU-4434 |
| [DescargarModal.ts](../../../../src/pages/payroll/datos-fiscales/components/DescargarModal.ts) | Modal genérico — Recálculo consolidado + drill-down + F14 detalle | REBU-4463/4435 |
| [EliminarConfirmModal.ts](../../../../src/pages/payroll/datos-fiscales/components/EliminarConfirmModal.ts) | Modal genérico — eliminar OE + eliminar mes F14 | REBU-4427/4437 |

### Archivos modificados (2)

- [`src/pages/LeftBarPage.ts`](../../../../src/pages/LeftBarPage.ts) — añadido `datosFiscalesLink` (locator) + `goToDatosFiscales()` (acción). Cubre REBU-4423.
- [`src/index.ts`](../../../../src/index.ts) — añadidos exports de los 6 Page Objects principales.

---

## 🧩 Diseño

### Convención de locators (en orden de prioridad)

1. **`getByRole`** — preferido para botones, tabs, dialogs, headings, radios.
2. **`getByLabel`** — para inputs de texto, número, fechas, selectores.
3. **`getByTestId`** — fallback si no hay role/label adecuado (no se usó en este PR; los componentes que existen exponen role/label sanos).
4. **`getByText`** — último recurso (usado solo para mensajes de empty state).

### Métodos obligatorios en cada Page Object

- **`verifyPageLoaded()`** — assertea el heading principal visible. Usado al inicio de cada spec UI para detectar fallos de navegación temprano.

### Métodos obligatorios en cada modal

- **`isOpen(): Promise<boolean>`** — verificación no-bloqueante (devuelve boolean).
- **`close()`** — cierra el modal con el botón X (sin guardar/confirmar).
- **`cancel()`** — cierra el modal con el botón Cancelar (sin guardar/confirmar).
- **`verifyOpen()`** — assertea que el modal es visible (usado al inicio del flow del modal).

### Composición del DescargarModal

El modal de descarga es **genérico** porque sirve a 3 callers (consolidado, drill-down, detalle F14) pero cada caller envía un subset de los parámetros:

```typescript
type DescargaTipo = 'resumen' | 'detalle';     // solo aplica al consolidado
type DescargaFormato = 'excel' | 'csv';

await modal.configureAndDownload({ tipo: 'resumen', formato: 'excel' }); // consolidado
await modal.configureAndDownload({ formato: 'csv' });                    // drill-down / F14
```

Esto evita 3 modales casi idénticos. La firma deja `tipo` opcional, así el método sirve a los 3 contextos.

---

## ⚠️ TODOs / Limitaciones

**Cero TODOs en código.**

### Notas sobre locators
Los locators están basados en convenciones comunes (`getByRole('button', { name: 'Agregar' })`, `getByLabel('Ingresos gravables')`, etc.) sin haber inspeccionado el UI real. Cuando se implementen los specs en PR #7-#9, **es probable que algunos locators necesiten ajuste** una vez se vea cómo el UI expone los componentes. Esto es esperado y normal en page objects que se escriben antes que los specs.

Si el ajuste resulta extenso, considerar agregar `data-testid` en el frontend (negociar con FE).

---

## 🧪 Cómo validar manualmente

```bash
# 1. TypeScript strict
npx tsc --noEmit
#   → exit 0 ✅

# 2. ESLint estricto sobre el directorio nuevo
npx eslint src/pages/payroll/datos-fiscales/ --max-warnings 0
#   → exit 0 ✅

# 3. Prettier sobre el directorio nuevo
npx prettier --check src/pages/payroll/datos-fiscales/**/*.ts src/pages/payroll/datos-fiscales/*.ts
#   → "All matched files use Prettier code style!" ✅

# 4. No-regresión chromium (tests existentes siguen funcionando)
npx playwright test --project=chromium --list
#   → debe listar los tests existentes sin cambios
```

---

## 🔗 Dependencias

- **Bloquea:** PR #7 (specs UI de Otros Empleadores), PR #9 (specs UI de Recálculo de Renta).
- **Bloqueada por:** PR #2 (tags) ✅, PR #4 (builders) ✅ — ambas mergeadas.

---

## 📊 Métricas

- **Archivos creados:** 11 (6 Page Objects + 5 modales)
- **Archivos modificados:** 2 (`LeftBarPage.ts`, `src/index.ts`)
- **Tests añadidos:** 0 (vienen en PR #7 y PR #9)
- **TODOs en código:** 0
- **Page Objects con `verifyPageLoaded()`:** 6/6 ✅
- **Modales con `isOpen()` y `close()`:** 5/5 ✅

---

## ✅ Checklist de criterios de aceptación

- ✅ Todos los Page Objects heredan de `BasePage`.
- ✅ Locators usan el orden `getByRole` > `getByLabel` > `getByTestId` > `getByText`.
- ✅ Cada método público tiene JSDoc con referencia a la(s) historia(s) REBU cubiertas.
- ✅ Cada Page Object tiene `verifyPageLoaded()` que asserta heading visible.
- ✅ Los 5 modales tienen `close()`, `cancel()`, `isOpen()`, `verifyOpen()`.
- ✅ TypeScript compila (`tsc --noEmit` exit 0).
- ✅ ESLint pasa (`--max-warnings 0` en archivos nuevos).
- ✅ Prettier check pasa.
