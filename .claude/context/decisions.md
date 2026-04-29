# Decisiones técnicas

Registro de decisiones importantes tomadas y su razonamiento.

## Caché en 3 capas

**Decisión:** Implementar caché en Layer 1 (Cache-Control), Layer 2 (ISR) y Layer 3 (unstable_cache).

**Por qué:** Reducir hits a Supabase DB. Datos públicos cambian raramente (solo cuando un admin edita).

**Cómo funciona:**
- Layer 1: Vercel Edge CDN cachea respuestas de `/api/public/*` 24h
- Layer 2: Páginas públicas pre-generadas con ISR, se regeneran cada 24h
- Layer 3: `unstable_cache` en servicios evita queries a DB incluso entre requests del mismo servidor

**TTL:** 24h. Se invalida inmediatamente con `revalidatePath` cuando un admin guarda cambios.

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

## Fetch de galería en servidor (no cliente)

**Decisión:** Mover el fetch de imágenes de `useEffect` en cliente a `page.tsx` en servidor.

**Por qué:** El componente cliente mostraba skeleton en cada navegación aunque los datos estuvieran cacheados. Con fetch en servidor, los datos van embebidos en el HTML del ISR — sin skeleton, sin fetch adicional.

**Archivo:** `src/app/[lang]/(public)/galeria/page.tsx` pasa `imagenes` como prop a `<Gallery>`.
