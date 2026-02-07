# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Dev server at localhost:3000
npm run build     # Production build (Turbopack)
npm run start     # Serve production build
npm run lint      # ESLint (flat config, Next.js core-web-vitals + TypeScript)
npx shadcn@latest add <component>  # Add shadcn/ui components
```

No test runner is configured.

## Architecture

Church website (Spanish, `lang="es"`) with a public-facing site and an admin dashboard, separated via Next.js **route groups**.

### Route Groups

- `src/app/(public)/` — Public pages with `<Navbar />` + `<Footer />` wrapper layout
- `src/app/(admin)/admin/` — Admin panel with sidebar + header shell (`"use client"` layout with `useState` for mobile sidebar toggle)
- `src/app/layout.tsx` — Root layout: fonts (Inter + Playfair Display via `next/font/google`), metadata, `<html>` + `<body>` only. No navigation chrome here.

Route groups are invisible in URLs: `/` serves `(public)/page.tsx`, `/admin` serves `(admin)/admin/page.tsx`.

### Component Organization

- `src/components/ui/` — shadcn/ui primitives (new-york style, Radix UI based)
- `src/components/admin/` — Admin-specific: sidebar, header, stats-card, status-badge
- `src/components/layout/` — Navbar, Footer (public site)
- `src/components/sections/` — Page sections (Hero, Community, Gallery, etc.)
- `src/lib/utils.ts` — `cn()` helper (clsx + tailwind-merge)

### Data Layer

**PostgreSQL + Prisma ORM**. Schema in `prisma/schema.prisma` with models: User, Articulo, Evento, ImagenGaleria, Horario, ContenidoAV, ConfiguracionSitio. Admin CRUD via JWT-protected API routes in `src/app/api/admin/`. Public read-only routes in `src/app/api/public/` (horarios, galeria, eventos, configuracion). Public components fetch from these routes (client) or use Prisma directly (server components). Seed script: `npm run seed`.

## Styling

**Tailwind CSS v4** — no `tailwind.config.js`. All theme configuration lives in `src/app/globals.css` using `@theme inline` and `:root` CSS variables.

Key custom colors available as Tailwind utilities:
- `amber` / `amber-dark` (`#E8913A` / `#D07A2B`) — primary brand color
- `cream` (`#FAF7F2`) — background
- `green-soft` (`#F0F5F0`) — accent/secondary

Fonts: `font-sans` = Inter, `font-serif` = Playfair Display (used for decorative emphasis with `font-serif italic text-amber`).

## shadcn/ui

Config in `components.json`: style `new-york`, RSC enabled, CSS variables, lucide icons. Path aliases: `@/components/ui`, `@/lib`, `@/hooks`.

All UI components use `"use client"` (Radix primitives require it). Server Components are the default for layouts, pages, and non-interactive sections.

## Path Alias

`@/*` maps to `./src/*` (configured in `tsconfig.json`).

## Rules 

- Al mllmento de crear datos nuevos no uses Modales, usa paginas dedicadas para los formularios
- no uses server actions, usa Route handlers
- para manejo de estado global use Zustand
- para formularios usar react-hook-form y zod
- cada vez que haces algo nuevo modifica los ficheros plan dentro de /docs con los nuevos cambios
- llevar un control del estado del repositorio y preguntar si se debe hacer commits con los cambios si la decision es "si" crear los commits correspondientes, si es "no" solo seguir con las tareas. 
- llevar un formato de commits al crearlos
  - si fue un arreglo: [FIX]: describir explicacion de lo que se hizo
  - si fue una nueva feature: [FEAT]: describir que cambios se agregaron nuevo
  - si solo fue algo del tipo estilos: [STYLE]: explicar brevemente que se cambio o agrego
  - si es el caso de testing: [TEST]:  breve descripcion de o de los test nuevos
  - si es un refactor: [REF]: descripcion de la refactorización