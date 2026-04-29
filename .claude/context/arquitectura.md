# Arquitectura del proyecto

## Stack

- **Framework:** Next.js 16 App Router + Turbopack
- **Lenguaje:** TypeScript
- **ORM:** Prisma (conecta como superuser, bypassa RLS de Supabase)
- **Storage:** Supabase Storage (uploads solo desde servidor via service_role)
- **Deploy:** Vercel (CDN Edge Network)
- **i18n:** es / ca / en (`src/lib/i18n/`)

## Estructura de carpetas

```
src/
  app/
    [lang]/(public)/     ← páginas públicas (ISR)
    admin/               ← panel admin (dinámico, protegido por JWT)
    api/
      public/            ← API pública (Cache-Control via publicSuccess)
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
    prisma.ts
    supabase.ts          ← solo supabaseAdmin (service_role), sin cliente browser
```

## Módulos

Cada módulo en `src/modules/` sigue la misma estructura:
```
modules/nombre/
  index.ts           ← exports públicos
  nombre.service.ts  ← lógica de negocio + métodos getPublicCached()
  nombre.schema.ts   ← validación Zod
  nombre.types.ts    ← tipos TypeScript
```

## Autenticación

- JWT almacenado en cookie httpOnly
- Middleware `withAuth` protege todas las rutas `/api/admin/*`
- Login en `/api/auth/login`, logout en `/api/auth/logout`

## Uploads

Solo desde servidor. Flujo:
```
Browser → POST /api/admin/upload (JWT verificado) → Supabase Storage (service_role)
```
Nunca desde el browser directamente a Supabase.
