# Estado del Proyecto — Iglesia Biblica Terres de l'Ebre

## Stack Tecnologico

| Capa | Tecnologia |
|------|-----------|
| Framework | **Next.js 16.1.6** (App Router) |
| Lenguaje | **TypeScript 5** |
| Estilos | **Tailwind CSS v4** + shadcn/ui (new-york) |
| Base de datos | **PostgreSQL** (Supabase) via **Prisma ORM 5.22** |
| Autenticacion | **JWT** (`jose`) + cookies HTTP |
| Formularios | `react-hook-form` + `zod` |
| Estado global | `zustand` |
| Iconos | `lucide-react` |
| Drag & Drop | `@dnd-kit` |

---

## Arquitectura Modular

El proyecto sigue una arquitectura modular con separacion clara de responsabilidades:

### Estructura de Carpetas

```
src/
├── app/                          # Solo routing y UI
│   ├── (public)/                 # Sitio publico
│   ├── (admin)/admin/            # Panel de administracion
│   └── api/                      # API routes (delgadas)
│
├── modules/                      # Logica de negocio por dominio
│   ├── auth/                     # Autenticacion y middleware
│   │   ├── auth.middleware.ts    # withAuth, withAdmin
│   │   ├── auth.schema.ts        # Zod schemas
│   │   └── index.ts
│   ├── eventos/
│   │   ├── evento.schema.ts      # Zod schemas (create, update)
│   │   ├── evento.service.ts     # Business logic (CRUD)
│   │   ├── evento.types.ts       # Types derivados de Prisma
│   │   └── index.ts
│   ├── galeria/
│   ├── horarios/
│   ├── testimonios/
│   └── config/
│
├── shared/                       # Utilidades transversales
│   ├── api/
│   │   ├── api-client.ts         # Cliente fetch tipado (frontend)
│   │   ├── api-response.ts       # Helpers: success(), error(), etc
│   │   ├── api-error.ts          # Clases de error tipadas
│   │   └── index.ts
│   └── types/
│       └── index.ts              # Tipos compartidos
│
├── components/                   # Componentes UI
├── hooks/                        # Custom hooks
├── stores/                       # Zustand stores
└── lib/                          # Utilidades legacy
```

### Patron de API Routes

Las rutas API siguen un patron simplificado:

```typescript
// Antes (codigo duplicado)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = schema.parse(body)
    const result = await prisma.model.create({ data })
    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    if (error instanceof ZodError) { ... }
    return NextResponse.json({ error }, { status: 500 })
  }
}

// Ahora (limpio y protegido)
export const POST = withAuth(async (request: NextRequest) => {
  try {
    const body = await request.json()
    const data = createSchema.parse(body)
    const result = await service.create(data)
    return created(result)
  } catch (error) {
    return handleError(error)
  }
})
```

### Beneficios

| Aspecto | Mejora |
|---------|--------|
| **Seguridad** | Todas las rutas admin protegidas con `withAuth` |
| **Tipos** | Un archivo `.types.ts` por modulo, derivado de Prisma |
| **Logica** | Servicios reutilizables, testables sin HTTP |
| **Errores** | Manejo centralizado con `handleError()` |
| **API Client** | Cliente tipado para frontend |

---

## Funcionalidades Implementadas

### Sitio Publico (`/`)
- **Home page** con: Hero, NextService, Community, CTA
- **Pagina `/horarios`** — horarios de cultos
- **Pagina `/galeria`** — galeria fotografica con masonry
- **Pagina `/creencias`** — declaracion de fe
- **Pagina `/contacto`** — formulario e info de contacto
- **SEO completo**: metadata, OpenGraph, sitemap, robots, manifest

### Panel Admin (`/admin`)
- **Autenticacion JWT** con middleware `withAuth`
- **Dashboard** con estadisticas en tiempo real
- **CRUD Eventos** completo con periodicidad
- **CRUD Galeria** con organizador avanzado (drag & drop, bulk update)
- **CRUD Horarios** completo
- **CRUD Testimonios** completo
- **Configuracion del sitio** desde panel

### API Routes (`/api`)

| Endpoint | Metodos | Protegido |
|----------|---------|-----------|
| `/api/auth/login` | POST | No |
| `/api/auth/logout` | POST | No |
| `/api/auth/me` | GET | No |
| `/api/admin/eventos` | GET, POST | Si |
| `/api/admin/eventos/[id]` | PATCH, DELETE | Si |
| `/api/admin/galeria` | GET, POST | Si |
| `/api/admin/galeria/[id]` | PATCH, DELETE | Si |
| `/api/admin/galeria/bulk` | POST, PUT | Si |
| `/api/admin/horarios` | GET, POST | Si |
| `/api/admin/horarios/[id]` | PATCH, DELETE | Si |
| `/api/admin/testimonios` | GET, POST | Si |
| `/api/admin/testimonios/[id]` | GET, PUT, DELETE | Si |
| `/api/admin/config` | GET, PATCH | Si |
| `/api/admin/stats` | GET | Si |
| `/api/public/*` | GET | No |

---

## Base de Datos (Prisma)

Modelos en `schema.prisma`:
- `User` (auth, roles ADMIN/EDITOR)
- `ConfigSitio` (configuracion general)
- `Imagen` (galeria con spans: normal/tall/wide)
- `Evento` (con periodicidad: semanal/quincenal/mensual/anual)
- `Horario` (dia, hora, icono Lucide, orden)
- `Testimonio` (videos de testimonios)

---

## Estado Actual

### Listo para produccion
- Arquitectura modular implementada
- Autenticacion JWT con middleware
- API protegida con `withAuth`
- CRUD completo para todos los recursos
- Organizador de galeria con drag & drop
- SEO completo

### Pendientes
- Migrar componentes para usar `api` client tipado
- Tests unitarios para servicios
- Eliminar archivos legacy (`mock-data.ts`, `supabase.ts`)
