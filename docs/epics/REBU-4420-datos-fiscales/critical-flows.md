# Critical Flows — REBU-4420 Datos Fiscales del Año

Priorización de flujos a cubrir, agrupada por **impacto si rompe** y **probabilidad de regresión**.

| Prioridad | Significado | Tag | Retries | Cuándo se ejecuta |
|---|---|---|---|---|
| **P0** | Bloquea pago de planillas o reporte regulatorio. No puede salir a producción si falla. | `@smoke` + `@critical` (y `@regulatory` si aplica ISR) | 0 si `@regulatory`, default si no | En cada PR + nightly |
| **P1** | Funcionalidad principal sin alternativa manual aceptable. | `@regression` | default | Nightly + pre-release |
| **P2** | Nice to have, edge cases, UX. Tolerable un día roto. | `@regression` o sin tag de prioridad | default | Nightly |

---

## P0 — Críticos (regulatorios o que bloquean pago)

### 1. Recálculo de Renta — motor ISR anual (junio y diciembre)
Es el corazón de la épica y el área con mayor riesgo regulatorio.
- **Casos firmados por contador:** cada escenario parametrizado tiene `aprobadoPor: 'Contador X'`.
- **Tag:** `@regulatory @critical @datos-fiscales`
- **Tests:** `tests/Payroll-Datos-Fiscales-Anuales/recalculo-renta/motor-isr/*.spec.ts` (PR #10)
- **Por qué P0:** un error en el cálculo se traduce en multa fiscal o pago indebido al colaborador.

### 2. CRUD Otros Empleadores — happy path
Sin esta operación, los recálculos quedan incompletos.
- **Tag:** `@smoke @critical @datos-fiscales`
- **Tests:** `tests/Payroll-Datos-Fiscales-Anuales/otros-empleadores/crud-otros-empleadores-api.spec.ts` — caso "Crear con todos los campos" (PR #7)
- **Por qué P0:** entrada principal de datos para el motor ISR.

### 3. Carga de Anexo F14 — happy path
Es el método masivo de poblar Planillas Externas. Sin él, el cliente cargaría a mano.
- **Tag:** `@smoke @critical @datos-fiscales`
- **Tests:** `tests/Payroll-Datos-Fiscales-Anuales/planillas-externas/carga-anexo-f14-happy-path.spec.ts` (PR #8)
- **Por qué P0:** flujo masivo, bloquea onboarding de empresas grandes.

### 4. Permisos de acceso a la sección
Sin permisos correctos, un usuario sin rol podría ver/editar data fiscal.
- **Tag:** `@smoke @critical @permisos @datos-fiscales`
- **Tests:** `tests/Payroll-Datos-Fiscales-Anuales/otros-empleadores/permisos-solo-ver.spec.ts` (PR #7)
- **Por qué P0:** filtrado de información sensible.

---

## P1 — Importantes (sin alternativa manual aceptable)

### 5. Auto-vinculación de F14 por DUI
- **Tag:** `@regression @datos-fiscales`
- **Test:** `auto-vinculacion-por-dui.spec.ts` (PR #8)

### 6. Auto-vinculación por NIT (fallback)
- **Tag:** `@regression @datos-fiscales`
- **Test:** `auto-vinculacion-por-nit.spec.ts` (PR #8)

### 7. Editar / eliminar registro de Otros Empleadores
- **Tag:** `@regression @datos-fiscales`
- **Test:** parte de `crud-otros-empleadores-api.spec.ts` (PR #7)

### 8. Vinculación manual (override de auto-vinculación)
- **Tag:** `@regression @datos-fiscales`
- **Test:** `vinculacion-manual.spec.ts` (PR #8)

### 9. Ver detalle del mes cargado (drill-down de Planillas Externas)
- **Tag:** `@regression @datos-fiscales`
- **Test:** `ver-detalle-mes.spec.ts` (PR #8)

### 10. Drill-down por colaborador en Recálculo de Renta
- **Tag:** `@regression @datos-fiscales`
- **Test:** `drill-down-por-colaborador.spec.ts` (PR #9)

### 11. Migración desde Ajustes Fiscales (legacy)
- **Tag:** `@regression @datos-fiscales @migracion`
- **Test:** `migracion-ajustes-fiscales.spec.ts` (PR #7)

### 12. Eliminar mes completo de Planillas Externas
- **Tag:** `@regression @datos-fiscales`
- **Test:** `eliminar-mes.spec.ts` (PR #8)

---

## P2 — Edge cases y UX

### 13. Carga de F14 con estructura inválida (validaciones)
- **Tag:** `@regression @validacion @datos-fiscales`
- **Test:** `carga-anexo-f14-validaciones.spec.ts` (PR #8)

### 14. Auto-vinculación sin match (queda como pendiente de vincular manual)
- **Tag:** `@regression @datos-fiscales`
- **Test:** `auto-vinculacion-sin-match.spec.ts` (PR #8)

### 15. Descargas (consolidado y drill-down)
- **Tag:** `@regression @descargas @datos-fiscales`
- **Tests:** `descargar-consolidado-y-drill.spec.ts` (PR #9), `descargar-detalle.spec.ts` (PR #8)

### 16. Crear OE solo con campos requeridos
- **Tag:** `@regression @datos-fiscales`
- **Test:** parte de `crud-otros-empleadores-api.spec.ts` (PR #7)

### 17. Rechazo de ingresos negativos / SP (validaciones de negocio)
- **Tag:** `@regression @validacion @datos-fiscales`
- **Test:** parte de `crud-otros-empleadores-api.spec.ts` (PR #7)

### 18. Múltiples filas del F14 con mismo colaborador en mismo mes
- **Tag:** `@regression @edge-case @datos-fiscales`
- **Test:** caso dentro de `carga-anexo-f14-validaciones.spec.ts` (PR #8)

### 19. DUI compartido entre Empleado y SP del mismo colaborador
- **Tag:** `@regression @edge-case @datos-fiscales`
- **Test:** caso dentro de `auto-vinculacion-por-dui.spec.ts` (PR #8)

---

## Lo que NO se prueba aquí (de momento)

- **Performance > 10k filas en F14:** no se asserta tiempo. Hay que validar manualmente en stage.
- **Concurrencia (2 admins editando el mismo registro):** fuera de scope inicial; depende de cómo BE maneje optimistic locking.
- **Migración de data productiva real:** se prueba con datos sintéticos; la migración real la hace BE con scripts.
- **Cálculo de CEFAFA y Bienestar Magisterial:** depende de REBU-4438 estar aplicado en BD. Si no, los specs respectivos deben quedar como `test.fixme` con referencia al ticket.
