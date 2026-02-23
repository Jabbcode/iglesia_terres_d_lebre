# 📊 Estado del Proyecto — Iglesia Bíblica Terres de l'Ebre

## 🏗️ Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework | **Next.js 16.1.6** (App Router) |
| Lenguaje | **TypeScript 5** |
| Estilos | **Tailwind CSS v4** + shadcn/ui (new-york) |
| Base de datos | **PostgreSQL** (Supabase) via **Prisma ORM 5.22** |
| Autenticación | **JWT** (`jose`) + cookies HTTP |
| Formularios | `react-hook-form` + `zod` |
| Estado global | `zustand` |
| Iconos | `lucide-react` |

---

## ✅ Funcionalidades Implementadas

### 🌐 Sitio Público (`/`)
- **Home page** con: Hero, NextService (próximo culto), Community, CTA
- **Página `/horarios`** — horarios de cultos
- **Página `/galeria`** — galería fotográfica
- **Página `/creencias`** — declaración de fe (con sección detallada de creencias)
- **Página `/contacto`** — formulario e info de contacto
- **SEO completo**: metadata, OpenGraph, sitemap, robots, manifest
- Navbar + Footer globales para el sitio público

### 🔐 Panel Admin (`/admin`)
- **Autenticación JWT** completa (login, logout, `/api/auth/me`)
- **Middleware de protección** para rutas `/admin/*` y `/api/admin/*`
- **Dashboard** con estadísticas en tiempo real (imágenes, eventos, horarios, próximos eventos)
- **CRUD Eventos** completo: listado, crear (`/nuevo`), editar (`/[id]`), eliminar
- **CRUD Galería** completo: listado, añadir imagen (`/nueva`), editar (`/[id]`), eliminar, **subida masiva** (`/masiva`)
- **CRUD Horarios** completo: listado, crear (`/nuevo`), editar (`/[id]`), eliminar
- **Configuración del sitio** desde panel (datos generales, redes sociales, contacto, maps)

### 🔌 API Routes (`/api`)
| Endpoint | Métodos |
|----------|---------|
| `/api/auth/login` | POST |
| `/api/auth/logout` | POST |
| `/api/auth/me` | GET |
| `/api/admin/eventos` | GET, POST |
| `/api/admin/eventos/[id]` | PUT, DELETE |
| `/api/admin/galeria` | GET, POST |
| `/api/admin/galeria/[id]` | PUT, DELETE |
| `/api/admin/galeria/bulk` | POST (subida masiva 1-10 imagenes) |
| `/api/admin/horarios` | GET, POST |
| `/api/admin/horarios/[id]` | PUT, DELETE |
| `/api/admin/config` | GET, PUT |
| `/api/admin/stats` | GET |

### 🗄️ Base de Datos (Prisma + Supabase)
Modelos definidos en `schema.prisma`:
- `User` (auth, roles ADMIN/EDITOR)
- `ConfigSitio` (configuración general del sitio)
- `Imagen` (galería con spans: normal/tall/wide)
- `Evento` (nombre, fecha, hora, ubicación, activo)
- `Horario` (día, hora, icono Lucide, orden, activo)

---

## ⚠️ Estado Actual y Pendientes

### 🟡 Puntos a revisar
- **`src/lib/mock-data.ts`** — Existe un archivo de datos mock (_UI-only mode_). Hay que verificar si todas las secciones públicas ya consumen la API/DB o alguna todavía usa este mock.
- **Sin tests** — No hay test runner configurado.
- **Home page simplificada** — La Home solo renderiza 4 secciones; no incluye galería, horarios ni eventos directamente.
- **`countdown.tsx`** — Componente de cuenta atrás al próximo culto existe pero no aparece en la Home.

### 🟢 Lo que está listo para producción
- Autenticación y autorización con JWT ✅
- BD conectada a Supabase (`.env` configurado) ✅
- API completa para admin ✅
- UI pública con SEO ✅
- CRUD completo de Eventos, Galería, Horarios y Configuración ✅

### 🔴 Posibles siguientes pasos
1. **Verificar** que las secciones públicas (`schedule.tsx`, `gallery.tsx`, `upcoming-events.tsx`) consumen datos reales de la BD y no el mock
2. **Añadir** countdown de próximo culto a la Home
3. **Conectar** galería pública a BD
4. ~~**Upload de imágenes**~~ ✅ Implementado via Supabase Storage con subida masiva (hasta 10 imagenes)
5. **Seed de producción** / usuario admin inicial

---

## 📁 Estructura de Carpetas Clave

```
src/
├── app/
│   ├── (public)/         ← Sitio público
│   │   ├── page.tsx      ← Home
│   │   ├── horarios/
│   │   ├── galeria/
│   │   ├── creencias/
│   │   └── contacto/
│   ├── (admin)/admin/    ← Panel de administración
│   │   ├── page.tsx      ← Dashboard
│   │   ├── eventos/
│   │   ├── galeria/      ← incluye /masiva para subida multiple
│   │   ├── horarios/
│   │   ├── configuracion/
│   │   └── login/
│   └── api/
│       ├── auth/
│       └── admin/
├── components/
│   ├── ui/               ← shadcn/ui primitives (16 componentes)
│   ├── admin/            ← Sidebar, Header, StatCard
│   ├── layout/           ← Navbar, Footer
│   └── sections/         ← 11 secciones de la página pública
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   ├── constant.ts
│   ├── format.ts
│   ├── mock-data.ts      ⚠️ Datos mock (verificar uso)
│   └── utils.ts
└── middleware.ts          ← Protección JWT de rutas
```
