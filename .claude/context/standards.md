# Estándares de desarrollo

Reglas que se aplican en cualquier tarea, sin excepción.

---

## Constantes — no duplicar, siempre centralizar y ordenar

Antes de definir cualquier valor constante (string, número, objeto de opciones), buscar si ya existe en `src/lib/constants/`:

- `index.ts` — constantes de dominio (PERIODICIDAD, DIAS_SEMANA, SPAN_TYPES…)
- `cache.ts` — TTLs de caché (REVALIDATE_24H, STALE_WHILE_REVALIDATE_1H)

**Si existe:** importar desde ahí, nunca redefinir inline.

**Si no existe**, seguir este árbol de decisión:

1. ¿Encaja temáticamente en un fichero existente? → añadirla ahí.
2. ¿Es de un tema nuevo que no encaja en ningún fichero actual? → crear `src/lib/constants/nombre-tema.ts` y exportarlo. No mezclar en `index.ts` por comodidad.
3. ¿Es un valor de un solo uso puntual que nunca se reutilizará? → puede ir inline, pero es la excepción, no la norma.

**Nunca** meter constantes de dominios distintos en el mismo fichero solo para no crear uno nuevo. Cada fichero de constants tiene una responsabilidad clara.

Nunca crear una constante nueva sin haber buscado primero si ya hay una equivalente.

---

## TypeScript — sin `any`

- Prohibido usar `any`, implícito o explícito.
- Si el tipo no se conoce, usar `unknown` y hacer narrowing.
- Si el tipo viene de Prisma, usar los tipos generados (`Prisma.EventoGetPayload<…>` etc.).
- Si el tipo viene de Zod, derivarlo del schema (`z.infer<typeof schema>`).
- Si hay presión para usar `any` por una librería externa, usar `unknown` + type assertion justificada con comentario.

---

## Convenciones del proyecto — seguir el patrón existente

Antes de crear un fichero nuevo o añadir lógica a uno existente, revisar cómo está resuelto en un módulo ya terminado (ej: `src/modules/eventos/` o `src/modules/galeria/`) y replicar la estructura:

```
modules/nombre/
  index.ts           ← solo re-exports
  nombre.service.ts  ← lógica + getPublicCached()
  nombre.schema.ts   ← Zod
  nombre.types.ts    ← tipos TypeScript
```

Si no está claro cómo aplicar una convención existente a un caso nuevo, **preguntar al usuario antes de decidir** — no improvisar un patrón propio.

---

## Tests — convenciones obligatorias

- **Ubicación:** `test/` en la raíz, espejando `src/`. Nunca co-located junto al fichero de producción.
- **Nombrado:** `nombre.test.ts` (sin `.spec.`).
- **Mocks:** siempre en fichero separado (`test/mocks/<nombre>.mock.ts`), nunca inline en el `.test.ts`.
- **Idioma:** descripciones de `describe`/`it` en español.
- **Patrón:** AAA — Arrange / Act / Assert, separados por línea en blanco dentro del `it`.
- **Fechas:** `new Date(año, mes - 1, día)` (constructor local) para evitar variaciones de timezone entre entornos.
- **Un concepto por test:** si el título de un `it` necesita "y", probablemente son dos tests.
- **Imports explícitos:** `import { describe, it, expect } from "vitest"` (no globals).

---

## Cuándo preguntar antes de actuar

Preguntar explícitamente al usuario si:

- No existe una convención clara para lo que se va a hacer.
- Hay dos formas igualmente válidas de resolver algo dentro del proyecto.
- El cambio afecta a la estructura de módulos, nombres de ficheros, o contratos de API.
- Se va a introducir una dependencia nueva.

No asumir — una pregunta rápida evita refactors posteriores.
