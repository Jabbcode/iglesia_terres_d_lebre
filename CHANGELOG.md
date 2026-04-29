# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
