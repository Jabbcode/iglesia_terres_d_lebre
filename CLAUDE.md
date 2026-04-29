# Iglesia Terres de l'Ebre — Claude Code

## Proyecto

Sitio web de iglesia cristiana con panel de administración. Desplegado en Vercel, base de datos PostgreSQL via Supabase (acceso solo por Prisma con service_role).

**URL producción:** https://iglesiabiblicaterresdelebre.es  
**Repo:** https://github.com/Jabbcode/iglesia_terres_d_lebre

## Stack

- **Framework:** Next.js 16 App Router + Turbopack
- **Lenguaje:** TypeScript
- **ORM:** Prisma (conecta como superuser, bypassa RLS)
- **Storage:** Supabase Storage (uploads solo desde servidor via service_role)
- **Deploy:** Vercel (CDN Edge Network)
- **i18n:** es / ca / en (`src/lib/i18n/`)

## Workflow con Git

**Siempre seguir este flujo:**
1. Crear branch desde `main` con nombre `tipo/descripcion`
2. Commit con mensaje descriptivo
3. Crear PR y **esperar confirmación del usuario antes de mergear**
4. Mergear solo cuando el usuario diga explícitamente que está bien

**Nunca** pushear directamente a `main` salvo hotfixes urgentes de build.

**Convención de branches:**
- `feat/nombre` — nueva funcionalidad
- `fix/nombre` — corrección de bug
- `perf/nombre` — mejora de rendimiento
- `refactor/nombre` — refactor sin cambio funcional
- `chore/nombre` — cambios de configuración/dependencias

## Arquitectura

```
src/
  app/
    [lang]/(public)/     ← páginas públicas (ISR, revalidate = 86400)
    admin/               ← panel admin (dinámico, protegido por JWT)
    api/
      public/            ← API pública (usa publicSuccess con Cache-Control)
      admin/             ← API admin (protegida con withAuth middleware)
  modules/               ← lógica de negocio por dominio
    config/
    galeria/
    horarios/
    eventos/
    testimonios/
  shared/api/            ← helpers de respuesta HTTP
  lib/
    constants/cache.ts   ← REVALIDATE_24H, STALE_WHILE_REVALIDATE_1H
```

## Reglas técnicas importantes

### Caché (3 capas activas)
- **Layer 1:** `publicSuccess()` en rutas `/api/public/*` → `Cache-Control: s-maxage=86400`
- **Layer 2:** `export const revalidate = 86400` en páginas públicas
- **Layer 3:** `unstable_cache` en métodos `getPublicCached()` de servicios

### Gotchas críticos
- `export const revalidate` **debe ser un literal numérico** (`= 86400`), nunca una variable importada. Next.js necesita analizarlo estáticamente y falla en build con variables.
- `REVALIDATE_24H` de `@/lib/constants/cache` **sí funciona** en `unstable_cache` y headers (son valores de runtime).
- Las páginas públicas usan `generateStaticParams` + `revalidate` para ISR — no son dinámicas.

### Seguridad
- **No hay** `NEXT_PUBLIC_SUPABASE_*` variables — la anon key no se expone al cliente.
- Uploads van siempre a `/api/admin/upload` (JWT verificado), nunca desde el browser directo.
- Supabase tiene RLS habilitado en todas las tablas públicas.

### Rutas públicas de API
Usar `publicSuccess()` (no `success()`) para el return principal:
```ts
import { publicSuccess, success, handleError } from "@/shared/api"
// publicSuccess → añade Cache-Control 24h
// success       → sin cache (usar solo para fallbacks como locale inválido)
```

### Mutaciones admin
Después de cualquier write a DB en rutas admin, llamar `revalidatePath` sobre la ruta pública afectada para limpiar el caché inmediatamente.

## Variables de entorno clave

| Variable | Dónde | Uso |
|---|---|---|
| `SUPABASE_URL` | Server only | URL de Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Uploads y admin DB |
| `DATABASE_URL` | Server only | Prisma connection |
| `JWT_SECRET` | Server only | Auth tokens |

## Comandos útiles

```bash
npm run dev          # desarrollo local
npm run build        # build de producción
npx tsc --noEmit     # verificar tipos sin compilar
gh pr list           # ver PRs abiertos
```
