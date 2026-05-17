# SPEC: PERF-001 — Mejora de rendimiento (Speed Insights Vercel)

## Qué se pide

Corregir métricas críticas de rendimiento en producción detectadas en Vercel Speed Insights:
- TTFB desktop P75: 13.2s (umbral bueno: <0.8s) — causado por cold start de Prisma en serverless
- INP desktop P75: 26,456ms — causado por fetchConfig() en useEffect del Hero
- FCP/LCP elevados — causados por video con preload="auto" e imagen hero sin priority
- CLS mobile P75: 0.54 — causado por <img> sin dimensiones en múltiples componentes

---

## Contexto de Notion (tareas Done relacionadas)

No aplica — la tarea viene directamente del análisis de Speed Insights, sin tarea previa en Notion.

---

## Contexto de código

- `src/components/sections/hero.tsx` — componente "use client" que llama `fetchConfig()` en `useEffect`. Usa `useConfigStore` para obtener `config.videoHero`. El video tiene `preload="auto"`. La imagen fallback usa `<img>` nativo sin dimensiones ni priority. El `page.tsx` no le pasa config como prop — la interfaz `HeroProps` solo acepta `{ lang, dict }`.

- `src/stores/config-store.ts` — store Zustand que expone `fetchConfig()`, el cual llama `GET /api/public/config`. Incluye guard `if (get().fetched) return` para evitar re-fetches.

- `src/modules/config/config.service.ts` — `configService.getPublicCached()` usa `unstable_cache` con tag `"config"` y TTL 24h. Método síncrono desde el servidor, sin HTTP.

- `src/app/[lang]/(public)/page.tsx` — Server Component con `export const revalidate = 86400`. Actualmente llama `eventoService.getUpcoming(5)` para los JSON-LD pero no llama `configService.getPublicCached()` ni pasa config al Hero. Los datos de eventos se usan para JSON-LD pero `UpcomingEvents` los ignora y hace su propio fetch en cliente.

- `src/components/sections/gallery.tsx` — "use client", también llama `fetchConfig()` para obtener `config?.instagram`. Las imágenes de galería usan `<img>` con `loading="lazy"` pero sin width/height.

- `src/components/sections/about-us.tsx` — 4 `<img>` con URLs de Supabase Storage, todos `loading="lazy"`, sin dimensiones explícitas.

- `src/components/sections/leader-card.tsx` — 1 `<img>` sin dimensiones.

- `src/components/sections/testimonios-section.tsx` — fetch de testimonios en `useEffect` (cliente). Las thumbnails usan `<img>` sin dimensiones.

- `src/components/sections/upcoming-events.tsx` — fetch de eventos en `useEffect` (cliente). `page.tsx` ya hace `eventoService.getUpcoming(5)` para JSON-LD pero no pasa los datos al componente. Imágenes de eventos usan `<img>` sin dimensiones.

- `src/components/sections/beliefs.tsx:417` — `<img>` con `loading="lazy"` sin dimensiones.

- `src/components/sections/schedule.tsx:259` — `<img>` con `loading="lazy"` sin dimensiones.

---

## Archivos a tocar

### Bloque 1 — Connection pooling (TTFB)

| Archivo | Cambio |
|---------|--------|
| `.env` / Vercel env vars | Agregar `DATABASE_URL` con URL de Prisma Accelerate (ver Decisión requerida) |
| `prisma/schema.prisma` | Agregar `previewFeatures = ["accelerate"]` si se elige Prisma Accelerate |
| `package.json` | Agregar `@prisma/extension-accelerate` si se elige Prisma Accelerate |
| `src/lib/prisma.ts` | Aplicar extensión Accelerate al cliente Prisma si se elige esa opción |

### Bloque 2 — Hero server-driven (INP)

| Archivo | Cambio |
|---------|--------|
| `src/components/sections/hero.tsx` | Ampliar `HeroProps` para aceptar `videoHero: string \| null`. Eliminar `useConfigStore` y el `useEffect` de fetchConfig. Usar el prop directamente en lugar de `config?.videoHero`. Mantener el `useEffect` del evento `canplaythrough`. |
| `src/app/[lang]/(public)/page.tsx` | Llamar `configService.getPublicCached()` en el `Promise.all`. Pasar `videoHero` al Hero como prop. |

### Bloque 3 — Video preload (FCP/LCP)

| Archivo | Cambio |
|---------|--------|
| `src/components/sections/hero.tsx` | Cambiar `preload="auto"` → `preload="none"` en el elemento `<video>`. |

### Bloque 4 — Hero fallback con Image priority (LCP)

| Archivo | Cambio |
|---------|--------|
| `src/components/sections/hero.tsx` | Reemplazar `<img src="/hero/hero_bg.png">` por `<Image>` de Next.js con `priority`, `fill`, y `sizes` apropiado. El wrapper `<div>` ya tiene `absolute inset-0`, compatible con `fill`. |

### Bloque 5 — <img> sin dimensiones (CLS mobile)

| Archivo | Cambio |
|---------|--------|
| `src/components/sections/gallery.tsx` | Reemplazar `<img>` del grid masonry por `<Image>` de Next.js. Las imágenes son de Supabase Storage — verificar que el dominio está en `next.config.ts` en `images.remotePatterns`. El lightbox puede mantener `<img>` o usar `<Image>` con `fill`. |
| `src/components/sections/about-us.tsx` | Reemplazar los 4 `<img>` de Supabase Storage por `<Image>` con dimensiones fijas o `fill` según el contenedor. |
| `src/components/sections/leader-card.tsx` | Reemplazar `<img>` por `<Image>` con dimensiones o `fill`. |
| `src/components/sections/testimonios-section.tsx` | Reemplazar `<img>` de thumbnails por `<Image>` con `aspectRatio` `aspect-video` (16/9) — usar `fill` dentro del contenedor `relative aspect-video`. |
| `src/components/sections/upcoming-events.tsx` | Reemplazar `<img>` de eventos por `<Image>` con `fill` dentro del contenedor `relative aspect-[4/3]`. Verificar dominio `images.unsplash.com` en `next.config.ts`. |
| `src/components/sections/beliefs.tsx` | Reemplazar `<img>` en la creencia por `<Image>` con `fill` dentro del contenedor `aspect-[4/3]`. |
| `src/components/sections/schedule.tsx` | Reemplazar `<img>` del horario por `<Image>` con `fill` dentro del contenedor `aspect-[4/3]`. |

---

## Decisión requerida

**Bloque 1 — Connection pooling: Prisma Accelerate vs PgBouncer en Supabase**

**Opción A — Prisma Accelerate:**
Servicio de Prisma Data Platform. Actúa como proxy con pool de conexiones + caché de queries global (Edge Cache). Requiere cambiar `DATABASE_URL` a una URL de Prisma Accelerate, instalar `@prisma/extension-accelerate`, y aplicar la extensión al cliente Prisma. El caché de Accelerate puede reducir queries a DB incluso más allá del pooling.
Tradeoff: dependencia nueva de pago (plan gratuito con límites), `$extends` en `prisma.ts` puede entrar en conflicto si el cliente ya tiene configuraciones, latencia añadida del proxy externo cuando el caché no aplica.

**Opción B — PgBouncer en Supabase (integrado):**
Supabase ya incluye PgBouncer en el puerto 6543 (transaction mode). Solo requiere cambiar `DATABASE_URL` para apuntar a `db.xxx.supabase.co:6543` con `pgbouncer=true` en el connection string, y añadir `?connection_limit=1` en el string de Prisma para evitar que Prisma abra múltiples conexiones. Sin dependencias nuevas.
Tradeoff: no incluye caché de queries (solo pooling), pero es más simple, sin costes adicionales y sin cambios en el código de Prisma más allá del `.env`.

Recomiendo Opción B (PgBouncer) porque: ya está disponible en el proyecto de Supabase sin coste extra, no introduce nuevas dependencias en `package.json`, el cambio es solo en variables de entorno, y la causa raíz del TTFB es el cold start de conexión TCP — que PgBouncer resuelve manteniendo conexiones precalentadas. Prisma Accelerate es overkill para el problema identificado.

---

## Propuesta

Ejecutar en 5 bloques independientes, en el orden listado (el bloque 1 es el más impactante en TTFB y no depende de los demás):

1. Cambiar `DATABASE_URL` en Vercel para usar el puerto PgBouncer de Supabase (6543) con `pgbouncer=true&connection_limit=1`. Sin cambios en código Prisma.
2. Añadir `configService.getPublicCached()` al `Promise.all` del `page.tsx` y pasar `videoHero` como prop al Hero. Eliminar `useConfigStore` y el primer `useEffect` del Hero. Esto elimina el fetch de cliente que bloquea el hilo principal.
3. Cambiar `preload="auto"` → `preload="none"` en el `<video>` del Hero. Cambio de una línea, impacto inmediato en FCP/LCP.
4. Reemplazar `<img src="/hero/hero_bg.png">` por `<Image priority fill>` de Next.js. Esta imagen es el LCP visible mientras el video carga.
5. Reemplazar los `<img>` restantes por `<Image>` de Next.js en los 7 componentes afectados. Los contenedores ya usan clases Tailwind con aspect ratio definido (`aspect-[4/3]`, `aspect-video`, etc.), por lo que el patrón `fill` es aplicable de forma consistente.

---

## Fuera de scope

- `TestimoniosSection` y `UpcomingEvents` también hacen fetch en cliente (`useEffect`). Moverlos a server-driven requeriría pasar props desde sus respectivos `page.tsx` o layouts, lo que afecta otras páginas (testimonios está en `about` page, eventos en `home`). El `page.tsx` de home ya fetchea eventos para JSON-LD — reutilizar esos datos en `UpcomingEvents` sería una mejora válida pero es una tarea separada con su propio scope. Mencionarlo al cerrar esta tarea.
- `Gallery` también usa `useConfigStore` para obtener el Instagram URL. Moverlo a server-driven es posible pero el impacto en métricas es menor y la página de galería tiene su propio ISR — queda fuera de este SPEC.
- Refactor del config-store ni eliminación de Zustand — puede seguir usándose en otros componentes fuera del Hero.
- Mejoras de animaciones Framer Motion — no identificadas como causa raíz en los datos de Speed Insights.

## Preguntas abiertas

- Confirmar que los dominios de Supabase Storage (`nngrjxgeovdvnawvfrmj.supabase.co`) y `images.unsplash.com` ya están en `images.remotePatterns` de `next.config.ts`, o si hay que añadirlos como parte de este SPEC.
- Para las imágenes de `about-us.tsx`, `leader-card.tsx` y `beliefs.tsx` con URLs fijas de Supabase Storage: ¿se conocen las dimensiones originales de esas imágenes, o se usará el patrón `fill` con contenedor de dimensiones definidas?
