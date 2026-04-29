# Decisiones técnicas

Registro de decisiones importantes tomadas y su razonamiento.

## Caché en 3 capas

**Decisión:** Implementar caché en Layer 1 (Cache-Control), Layer 2 (ISR) y Layer 3 (unstable_cache).

**Por qué:** Reducir hits a Supabase DB. Datos públicos cambian raramente (solo cuando un admin edita).

**Cómo funciona:**

- Layer 1: Vercel Edge CDN cachea respuestas de `/api/public/*` 24h
- Layer 2: Páginas públicas pre-generadas con ISR, se regeneran cada 24h
- Layer 3: `unstable_cache` en servicios evita queries a DB incluso entre requests del mismo servidor

**TTL:** 24h. Se invalida inmediatamente con `revalidateTag` cuando un admin guarda cambios.

---

## export const revalidate debe ser literal

**Decisión:** Usar `export const revalidate = 86400` (número literal), nunca una variable importada.

**Por qué:** Next.js analiza estáticamente estos exports en build time. Con Turbopack, una variable importada como `REVALIDATE_24H` no se evalúa y el build falla con "Invalid segment configuration export".

**Correcto:** `export const revalidate = 86400`  
**Incorrecto:** `export const revalidate = REVALIDATE_24H`

La constante `REVALIDATE_24H` sí funciona en `unstable_cache` y headers (son valores de runtime).

---

## Supabase sin anon key en el cliente

**Decisión:** Eliminar `NEXT_PUBLIC_SUPABASE_ANON_KEY` y `NEXT_PUBLIC_SUPABASE_URL`.

**Por qué:** Alerta de seguridad de Supabase. Con la anon key en el browser, cualquiera podía subir/borrar archivos en Storage directamente, saltándose la UI.

**Resultado:** Solo existe `supabaseAdmin` (service_role, server-only). Uploads van por `/api/admin/upload`.

---

## RLS en Supabase sin afectar Prisma

**Decisión:** Habilitar RLS en todas las tablas públicas sin añadir políticas.

**Por qué:** Bloquea acceso via PostgREST API (cliente browser). Prisma conecta como superuser de PostgreSQL y bypassa RLS automáticamente, por lo que la app sigue funcionando.

---

## revalidateTag en lugar de revalidatePath para invalidar caché

**Decisión:** Usar `revalidateTag(tag, {})` en todas las rutas admin, nunca `revalidatePath`.

**Por qué:** `revalidatePath` solo limpia la caché de una ruta específica (la URL del endpoint API). No toca los entries de `unstable_cache` que usan las páginas ISR. `revalidateTag` limpia por tag todos los entries del Data Cache, incluyendo los del servidor ISR.

**Correcto:** `revalidateTag("galeria", {})`  
**Incorrecto:** `revalidatePath("/api/public/galeria")`

El segundo argumento `{}` es requerido por Next.js 16 (firma: `revalidateTag(tag: string, profile: CacheLifeConfig)`).

---

## Eventos recurrentes: mensual vs mensual_relativo

**Decisión:** Dos valores de periodicidad distintos para patrones mensuales.

- `mensual` — se repite el mismo día del mes (ej: siempre el 15)
- `mensual_relativo` — se repite el Nth día de la semana del mes (ej: 1er Domingo), con soporte para "último" (-1)

**Por qué:** Un solo valor `mensual` no puede expresar ambos patrones sin ambigüedad. Separar evita lógica condicional en el cálculo y hace la intención explícita en BD.

**Campos DB:** `semanaDelMes Int?` (1/2/3/4/-1) y `diaSemanaRelativo Int?` (0=Dom…6=Sáb, índice JS). Ambos son `null` cuando `periodicidad !== mensual_relativo`.

**Lógica de cálculo:** `src/lib/event-utils.ts` → función `agregarPeriodo`, case `mensual_relativo`. El "último" se calcula como `primerOcurrencia + Math.floor((diasEnMes - primerOcurrencia) / 7) * 7`.

---

## Fetch de galería en servidor (no cliente)

**Decisión:** Mover el fetch de imágenes de `useEffect` en cliente a `page.tsx` en servidor.

**Por qué:** El componente cliente mostraba skeleton en cada navegación aunque los datos estuvieran cacheados. Con fetch en servidor, los datos van embebidos en el HTML del ISR — sin skeleton, sin fetch adicional.

**Archivo:** `src/app/[lang]/(public)/galeria/page.tsx` pasa `imagenes` como prop a `<Gallery>`.
