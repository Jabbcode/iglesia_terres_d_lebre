# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-04-30

### Added

- Módulo de gestión de usuarios (`src/modules/usuarios/`) — CRUD completo accesible solo para ADMIN
- Panel `/admin/usuarios` con formularios inline para crear, editar y eliminar usuarios, con toggle mostrar/ocultar contraseña
- Control de acceso por rol en tres capas: API (`withAdmin` → 403), Sidebar (enlace oculto para EDITOR), página (redirect si no es ADMIN)
- `withAdmin` middleware en `src/modules/auth/auth.middleware.ts` para rutas de solo ADMIN
- JSON-LD Schema.org: `Organization` + `Event` en la home, `Church` (LocalBusiness) en `/contacto` — helper centralizado en `src/lib/json-ld.ts`
- Aviso en admin galería cuando hay imágenes visibles sin texto alternativo
- Navegación con teclado (← → Escape) en el lightbox de galería pública; alt mostrado como caption
- Sitemap multilingüe con `alternates` hreflang para es / ca / en
- Suite de tests con Vitest (115 tests): `event-utils`, `rate-limit`, `format`, `auth`, `i18n/config`, `api-response`, `schema-helpers`
- Hook `pre-push`: ejecuta tests → TypeScript → build antes de cada push
- Security headers en `next.config.ts`: `X-Frame-Options`, `HSTS`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`

### Changed

- Galería pública ordenada por `createdAt DESC`, limitada a 20 imágenes (las más recientes siempre visibles)
- `activo` en imágenes funciona como filtro de exclusión; las imágenes se crean visibles por defecto
- Alt text requerido al editar imágenes individuales
- Toggle "Oculta/Visible" en galería admin en lugar de "Inactiva/Activa"

### Fixed

- Rate limiter corregido: solo incrementa el contador en intentos de login fallidos, no en los exitosos
- JWT_SECRET lanza error explícito en producción si no está definido (elimina el fallback silencioso)

### Security

- Rate limiting en `/api/auth/login`: bloqueo por IP tras 5 intentos fallidos
- Security headers HTTP en todas las rutas vía `next.config.ts`

## [1.1.0] - 2026-04-29

### Added

- Nueva periodicidad `mensual_relativo`: permite configurar eventos recurrentes como "el 1er Domingo de cada mes" o "el Último Viernes de cada mes"
- Campos `semanaDelMes` e `diaSemanaRelativo` en el modelo `Evento` (Prisma)
- Dropdowns de semana del mes y día de la semana en formularios de creación y edición de eventos
- Nota dinámica en el formulario que muestra la configuración seleccionada en lenguaje natural
- `standards.md` en `.claude/context/` con reglas de código del proyecto

### Changed

- Reemplaza `revalidatePath` por `revalidateTag` en todas las rutas admin para invalidar correctamente el caché ISR de páginas públicas

### Fixed

- `generateStaticParams` duplicado eliminado de páginas hijo (App Router lo hereda del layout)

## [1.0.1] - 2026-04-29

### Added

- Husky hooks: pre-commit (ESLint + Prettier) y pre-push (TypeScript + build)

### Fixed

- `export const revalidate` duplicado en las 6 páginas públicas

## [1.0.0] - 2026-04-29

### Added

- Panel de administración completo (horarios, eventos, galería, testimonios, configuración)
- Soporte i18n en 3 idiomas: español, catalán, inglés
- Galería con lightbox y organización masiva de imágenes
- Sistema de caché en 3 capas: Cache-Control headers (Layer 1), ISR 24h en páginas públicas (Layer 2), `unstable_cache` en queries Prisma (Layer 3)
- Fetch de datos de galería en servidor — elimina skeleton en navegación SPA
- `loading.tsx` en galería para cubrir primer render tras deploy
- Constantes de revalidación centralizadas en `src/lib/constants/cache.ts`
- Endpoint `/api/admin/upload` para uploads server-side con validación de tipo y tamaño
- Toggle mostrar/ocultar contraseña en login
- Configuración estática de contacto y redes sociales con i18n
- CLAUDE.md y estructura `.claude/` para contexto de desarrollo

### Security

- RLS habilitado en todas las tablas públicas de Supabase
- Eliminación de `NEXT_PUBLIC_SUPABASE_ANON_KEY` y `NEXT_PUBLIC_SUPABASE_URL` del cliente
- Uploads movidos a servidor (service_role), sin acceso directo desde browser
- Políticas de Storage: restricción de tipos MIME y tamaño de archivos

### Changed

- `NEXT_PUBLIC_SUPABASE_URL` renombrado a `SUPABASE_URL` (server-only)
- Rutas públicas de API usan `publicSuccess()` con `Cache-Control: s-maxage=86400`
- Servicios exponen métodos `getPublicCached()` con tags para invalidación

### Fixed

- `export const revalidate` cambiado a literal numérico (requerido por Next.js Turbopack)
- `deleteImage` en `supabase.ts` corregido tras eliminar cliente browser
