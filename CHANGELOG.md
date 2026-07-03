# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.8] - 2026-07-03

### FEAT
* [#98](https://github.com/Jabbcode/iglesia_terres_d_lebre/pull/98) no versionar cuando el PR no toca código real
### FIXES
* [#101](https://github.com/Jabbcode/iglesia_terres_d_lebre/pull/101) tarjetas de creencia sin detalle no son botones
### OTROS
* [#97](https://github.com/Jabbcode/iglesia_terres_d_lebre/pull/97) sync develop con main v1.3.7


## [1.3.7] - 2026-07-02

### REFACTOR
* [#95](https://github.com/Jabbcode/iglesia_terres_d_lebre/pull/95) acumular Full Changelog en sección aparte
### OTROS
* [#94](https://github.com/Jabbcode/iglesia_terres_d_lebre/pull/94) sync develop con main v1.3.6


## [1.3.6] - 2026-07-02

### FIXES
* [#92](https://github.com/Jabbcode/iglesia_terres_d_lebre/pull/92) GitHub Release solo enlaza al CHANGELOG
### OTROS
* [#91](https://github.com/Jabbcode/iglesia_terres_d_lebre/pull/91) sync develop con main v1.3.5

## [1.3.5] - 2026-07-02

### FEAT
* [#85](https://github.com/Jabbcode/iglesia_terres_d_lebre/pull/85) preview de release en comentario del PR
### FIXES
* [#87](https://github.com/Jabbcode/iglesia_terres_d_lebre/pull/87) release-preview.yml necesita contents: write
* [#88](https://github.com/Jabbcode/iglesia_terres_d_lebre/pull/88) comentario de release-preview mostraba texto literal
### REFACTOR
* [#89](https://github.com/Jabbcode/iglesia_terres_d_lebre/pull/89) simplificar formato de las notas de release
* [#90](https://github.com/Jabbcode/iglesia_terres_d_lebre/pull/90) bullets del changelog como [#PR](link) titulo
### OTROS
* [#84](https://github.com/Jabbcode/iglesia_terres_d_lebre/pull/84) sync develop con main v1.3.4

## [1.3.4] - 2026-07-02

<!-- Release notes generated using configuration in .github/release.yml at develop -->

## What's Changed
### 🧹 Otros
* chore: sync develop con main v1.3.3 by @Jabbcode in https://github.com/Jabbcode/iglesia_terres_d_lebre/pull/81
* chore: automatizar release develop->main con GitHub Actions by @Jabbcode in https://github.com/Jabbcode/iglesia_terres_d_lebre/pull/82

## [1.3.3] - 2026-07-02

### Added

- `PRODUCT.md` y `DESIGN.md`: contexto de registro, personalidad de marca y sistema visual documentado (impeccable)
- Configuración de live mode (`.impeccable/live/config.json`) para iteración visual en navegador

### Fixed

- Lightbox de galería y modal de vídeo: semántica de diálogo (`role="dialog"`, `aria-modal`), foco inicial, retorno de foco y trampa de teclado; cierre con Escape añadido al modal de vídeo
- Contraste de footer (`text-white/40` → `/60`) y de `--muted-foreground` (`#54606e`), por debajo de WCAG AA
- Mismatch de hidratación en `useIsMobile`/`useMediaQuery` que causaba un salto visible de layout (grid ↔ carrusel) tras cargar en Schedule, Beliefs, Testimonios y Upcoming Events

### Changed

- Reducida la repetición del eyebrow (etiqueta uppercase) a un único kicker por página; el resto de secciones usa el divisor de regla ámbar ya existente en Liderazgo

### Removed

- `newsletter.tsx`: componente sin usar en ninguna página, con formulario no funcional

## [1.3.2] - 2026-05-17

### Changed

- Hero server-driven: config del video baja como prop desde `page.tsx`, eliminando `fetchConfig()` en cliente (mejora INP)
- Video hero: `preload="metadata"` + `poster` + evento `canplay` para arranque más rápido
- Imagen fallback del Hero con `<Image priority fill>` para optimización LCP
- `<Image>` con dimensiones correctas en `about-us`, `testimonios`, `schedule`, `leader-card` para prevenir CLS mobile
- `creenciasBase` extraído a `beliefs.data.ts`
- Texto del logo oculto por debajo de 425px en navbar para evitar overflow en pantallas pequeñas

### Added

- `images.remotePatterns` en `next.config.ts` para Supabase Storage y Unsplash

## [1.3.1] - 2026-05-02

### Fixed

- Scanner probes (`.env`, `config.json`, etc.) ya no causan `FUNCTION_INVOCATION_FAILED` — `dynamicParams = false` en `[lang]` devuelve 404 inmediato sin invocar la función ISR

### Security

- Migración `middleware.ts` → `proxy.ts` (Next.js 16, elimina warning de deprecación)
- Eliminado bloque muerto de protección `/api/admin` en el proxy (el matcher ya excluía rutas `api/`)
- `JWT_SECRET` lanza error en producción si no está definido, consistente con `auth.ts`

## [1.3.0] - 2026-04-30

### Added

- Sidebar colapsable en desktop: ancho `w-64`/`w-16` con transición suave, estado persistido en `localStorage`
- Botón de colapso (`PanelLeftClose`/`PanelLeftOpen`) en el Header del panel admin

### Changed

- Formularios de horarios, eventos y testimonios reestructurados en layout de dos columnas en desktop (`lg:grid-cols-2`), una columna en móvil
- Cabeceras de formularios unificadas: botón amber "Volver" a la izquierda, título alineado a la derecha

### Fixed

- `ImageUpload` y `textarea` en formulario de horarios ya no se bloquean con `pointer-events-none` al eliminar la imagen

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

---

## Comparaciones completas

- [v1.3.7...v1.3.8](https://github.com/Jabbcode/iglesia_terres_d_lebre/compare/v1.3.7...v1.3.8)
- [v1.3.6...v1.3.7](https://github.com/Jabbcode/iglesia_terres_d_lebre/compare/v1.3.6...v1.3.7)
- [v1.3.5...v1.3.6](https://github.com/Jabbcode/iglesia_terres_d_lebre/compare/v1.3.5...v1.3.6)
- [v1.3.4...v1.3.5](https://github.com/Jabbcode/iglesia_terres_d_lebre/compare/v1.3.4...v1.3.5)
- [v1.3.3...v1.3.4](https://github.com/Jabbcode/iglesia_terres_d_lebre/compare/v1.3.3...v1.3.4)
