# Builder pattern

Los **builders** son funciones standalone en `src/builders/` que encapsulan setup repetitivo. Su existencia es la razón por la que un spec nuevo puede caber en 30 líneas en lugar de 300.

Referencia canónica: [`src/builders/payroll-scenario.ts`](../../src/builders/payroll-scenario.ts) — el builder que encapsula 11 pasos de setup (crear planilla, política, 8 catálogos, persona, 3 PATCHes, payroll entry, `payrollDetailId`).

---

## 🎯 Cuándo crear un builder

Crealo cuando se cumplan **al menos 2** de estas condiciones:

1. ✅ El setup se **repite en ≥ 3 specs** (o se va a repetir, según el plan de tests).
2. ✅ El setup tiene **> 5 pasos** (HTTP calls + transformaciones).
3. ✅ Los specs que lo usan necesitan **los mismos IDs de salida** (`personId`, `payrollEntryId`, etc.).
4. ✅ Hay **lógica de resolución no trivial** que distrae del caso bajo prueba (ej. resolver 8 catálogos antes de poder crear una persona).

Si solo 1 condición se cumple, probablemente alcance una **helper function inline** en el mismo spec.

---

## 🚫 Cuándo NO crear un builder

- ❌ Setup de 2-3 pasos triviales. Más simple inline.
- ❌ El "setup" en realidad tiene aserciones intercaladas — eso es un test, no un builder.
- ❌ Solo lo va a usar un spec ahora y no hay evidencia de que se vaya a reusar.
- ❌ El setup tiene mucha lógica condicional (`if isPensioned then... else...`) que sería más legible inline.

---

## 🧩 Estructura de un builder

```typescript
// src/builders/annual-fiscal-data-scenario.ts

import { APIHelper } from '../api/APIHelper';
import { Logger } from '../utils/Logger';
import { TestDataGenerator } from '../utils/TestDataGenerator';

/**
 * Tipo de salario: empleado (sueldo fijo) o SP (Servicios Profesionales).
 */
export interface ColaboradorParaFiscalDataOptions {
    tipo: 'empleado' | 'servicios-profesionales';
    salary?: number;            // Default 1000
    dateOfJoining?: string;     // Default '2024-01-01T06:00:00.000Z'
    // ... otros opts
}

export interface ColaboradorParaFiscalDataResult {
    companyId: number;
    personId: string;
    firstName: string;
    lastName: string;
    dui: string;
    year: number;
}

/**
 * Crea un colaborador empleado o SP listo para recibir registros
 * de Datos Fiscales (Otros Empleadores, Planillas Externas, etc.).
 *
 * Tracking: QAUTO-498 (PR #4 de la épica REBU-4420)
 */
export async function createColaboradorParaFiscalData(
    api: APIHelper,
    opts: ColaboradorParaFiscalDataOptions,
): Promise<ColaboradorParaFiscalDataResult> {
    const companyId = api.getCompanyId();
    if (!companyId) throw new Error('No companyId disponible — APIHelper no autenticado');

    Logger.step(`Builder: creando colaborador ${opts.tipo}`);

    // ... HTTP calls aquí, validando con .ok() y throw en cada paso ...

    Logger.success(`Builder: colaborador ${opts.tipo} listo ✅`);
    return { companyId, personId, firstName, lastName, dui, year: new Date().getFullYear() };
}
```

---

## ⚖️ Reglas inmutables del builder

| # | Regla | Por qué |
|---|---|---|
| 1 | **NO contiene `expect()`** | Los specs assertan, los builders arman. Mezclar las dos cosas hace tests imposibles de leer y de reusar. |
| 2 | **Lanza `Error` con mensaje útil** si algún paso falla | El stacktrace solo te dice la línea; el mensaje te dice por qué (`'createPayroll falló: 401'`). |
| 3 | **Devuelve objeto tipado con IDs útiles** | El spec necesita poder seguir trabajando. Si devolvés `void`, no servís a nadie. |
| 4 | **Usa `Logger.step` / `.info` / `.success`** | Sin logs es imposible debuggear un builder grande. |
| 5 | **Solo depende del `APIHelper` recibido** | No instancia clientes HTTP, no lee env vars. Función pura. |
| 6 | **Sin estado global / sin variables módulo mutables** | Builders se llaman en paralelo desde múltiples tests. |
| 7 | **Defaults sensatos en `opts`** | El spec pasa solo lo que varía. Para lo que no varía, default en el builder. |
| 8 | **JSDoc con tracking del ticket** | Permite rastrear quién y por qué se creó el builder. |

---

## 🔢 Parámetros

**Patrón:** el primer parámetro siempre es `api: APIHelper`. El segundo es un objeto `opts`. Nada más.

```typescript
// ✅ Bien
createPayrollScenario(api, { salary, dateOfJoining, isPensioned, payrollPeriod });

// ❌ Mal — argumentos posicionales
createPayrollScenario(api, salary, dateOfJoining, isPensioned, '2025-01-01', '2025-01-15');
```

Razones:
- **Legibilidad** en el call site (sabés qué es cada cosa sin saltar a la firma).
- **Extensibilidad**: agregar un opt nuevo no rompe los callers.
- **Defaults**: marcás `?` en `opts` y resolvés default adentro.

---

## 🔁 Componer builders

Builders pueden llamarse entre sí cuando hay setup compartido. Ejemplo planeado para esta épica:

```typescript
// src/builders/recalculo-renta-scenario.ts

export async function createEscenarioRecalculoCompleto(
    api: APIHelper,
    opts: EscenarioRecalculoOptions,
): Promise<EscenarioRecalculoResult> {
    // Reutiliza otro builder como punto de partida
    const colaborador = await createColaboradorParaFiscalData(api, {
        tipo: 'empleado',
        salary: opts.salaryRebu,
    });

    // Agrega encima los registros específicos del escenario
    if (opts.ingresoOtrosEmpleadores) {
        await api.annualFiscalData.createOtroEmpleador(colaborador.companyId, {
            personId: colaborador.personId,
            ingresosGravables: opts.ingresoOtrosEmpleadores,
            year: colaborador.year,
        });
    }

    if (opts.ingresoPlanillasExternas) {
        // ... carga F14 sintético ...
    }

    return {
        ...colaborador,
        expectedAcumulado: calculateExpectedAcumulado(opts),
    };
}
```

> ⚠️ Cuidado con componer demasiado. Si un builder llama a 3 builders que cada uno llama a 2, perdés la trazabilidad. **Mantené el árbol a 2 niveles máximo.**

---

## 📊 Cómo evaluar si vale la pena extraer un builder

Antes de extraer, calculá:

```
ahorro_por_spec = líneas_del_setup_actual - 1 línea (la llamada al builder)
ahorro_total = ahorro_por_spec × cantidad_de_specs_que_lo_usarán
costo_builder = líneas_del_builder + costo_de_mantenimiento
```

Si `ahorro_total > 2 × costo_builder`, vale la pena. Si no, dejá inline.

**Caso real (payroll-scenario):** el setup era ~200 líneas en cada spec, hay ~100 specs. Ahorro: 200 × 100 = 20.000 líneas. Costo: 375 líneas del builder. Vale la pena por mucho.

---

## 🧪 Builders de esta épica (planeados)

| Builder | Archivo | Crea | Usado por |
|---|---|---|---|
| `createColaboradorParaFiscalData` | `src/builders/annual-fiscal-data-scenario.ts` | Empleado o SP listo para fiscal data | PR #7, PR #8 |
| `createEscenarioRecalculoCompleto` | `src/builders/recalculo-renta-scenario.ts` | Colab + planillas Rebu + Otros Emp + Externas | PR #9, PR #10 |

Detalle del API exacto: ver descripción del ticket [QAUTO-498](https://rebu.atlassian.net/browse/QAUTO-498).
