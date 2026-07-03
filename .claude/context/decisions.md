# Decisiones técnicas

Registro de decisiones importantes tomadas y su razonamiento.

## Deploy manual: rebuild vía CLI (no rollback) — cuidado con el proyecto de Vercel

**Decisión:** `.github/workflows/deploy-version.yml` (comando `/deploy vX.Y.Z` en un
issue) reconstruye el tag con `vercel build` + `vercel deploy --prebuilt --prod`
dentro del propio Action, inyectando `JWT_SECRET`, `DATABASE_URL`, `SUPABASE_URL` y
`SUPABASE_SERVICE_ROLE_KEY` (marcadas **Sensitive** en Vercel, así que `vercel pull`
nunca las entrega) a mano en `.vercel/.env.production.local` desde secrets de GitHub
duplicados.

**Historial de este diagnóstico (para no repetir la confusión):** el proyecto vinculado
al principio (`VERCEL_PROJECT_ID`) era `iglesia_terres_d_lebre` — un proyecto de Vercel
distinto y equivocado (mismo team, distinto id), probablemente huérfano de una fase
anterior del proyecto. Un deploy real ahí compiló bien pero devolvía 500 en producción
con "JWT_SECRET env var is required", lo que en su momento se interpretó como que las
variables Sensitive nunca llegan al runtime de un deploy vía CLI/prebuilt (se llegó a
implementar y descartar un enfoque alternativo de `vercel rollback` por esta razón).
**Esa conclusión era incorrecta**: al corregir `VERCEL_PROJECT_ID` al proyecto real
(`terres_lebre`), el mismo rebuild vía CLI funcionó de punta a punta, con las
Sensitive disponibles en runtime con normalidad. El proyecto viejo simplemente no
tenía esas env vars de runtime completas — no era una limitación de la plataforma.

**Verificar antes de tocar este workflow:** confirmar con `vercel link` (elige
"terres_lebre", no "iglesia_terres_d_lebre" — aparecen "2 matches across teams") y
comparar `.vercel/repo.json` contra los secrets `VERCEL_ORG_ID`/`VERCEL_PROJECT_ID` si
algo vuelve a fallar con errores de "Project not found" o env vars faltantes en
runtime.

## Release automatizado por labels, no por parseo de título

**Decisión:** El workflow `.github/workflows/release.yml` decide el bump de versión
(patch/minor/major) leyendo una label `release-type/*` en el PR `develop → main`, no
parseando el título del PR.

**Por qué:** Una label es una señal estructurada y explícita (el usuario la elige a
propósito), mientras que parsear el título es frágil y ambiguo. El único paso manual
real del release es añadir esa label y confirmar el merge; todo lo demás (versión,
changelog, tag, GitHub Release, PR de sync) es automático a partir de ahí.

**Notas de release:** Se generan con la API de GitHub (`releases/generate-notes`), que
recorre los merge commits entre tags — SÍ recoge los PRs individuales de `develop`
(fix/feat/etc.), no solo el PR grande de release, porque esos merge commits quedan
como ancestros en el historial de `main`. Se verificó con una llamada real a la API
antes de asumirlo.

**Exclusión de ruido:** Las propias labels `release-type/patch|minor|major` se usan
también como criterio de exclusión en `.github/release.yml`, así el PR de release no
aparece listado como una entrada más del changelog. Evita crear una label extra solo
para eso.

**Categorización:** Requiere que los PRs de feature/fix lleven una label de tipo
(`feat`, `fix`, `refactor`, `docs`, `chore`, `style`, `test`, `db`, `security`, `perf`)
que coincide 1:1 con la convención de commits ya existente en `workflow.md`.

## Caché en 3 capas

**Decisión:** Implementar caché en Layer 1 (Cache-Control), Layer 2 (ISR) y Layer 3 (unstable_cache).

**Por qué:** Reducir hits a Supabase DB. Datos públicos cambian raramente (solo cuando un admin edita).

**Cómo funciona:**

- Layer 1: Vercel Edge CDN cachea respuestas de `/api/public/*` 24h
- Layer 2: Páginas públicas pre-generadas con ISR, se regeneran cada 24h
- Layer 3: `unstable_cache` en servicios evita queries a DB incluso entre requests del mismo servidor

**TTL:** 24h. Se invalida inmediatamente con `revalidateTag` cuando un admin guarda cambios.

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

## revalidateTag en lugar de revalidatePath para invalidar caché

**Decisión:** Usar `revalidateTag(tag, {})` en todas las rutas admin, nunca `revalidatePath`.

**Por qué:** `revalidatePath` solo limpia la caché de una ruta específica (la URL del endpoint API). No toca los entries de `unstable_cache` que usan las páginas ISR. `revalidateTag` limpia por tag todos los entries del Data Cache, incluyendo los del servidor ISR.

**Correcto:** `revalidateTag("galeria", {})`  
**Incorrecto:** `revalidatePath("/api/public/galeria")`

El segundo argumento `{}` es requerido por Next.js 16 (firma: `revalidateTag(tag: string, profile: CacheLifeConfig)`).

---

## Eventos recurrentes: mensual vs mensual_relativo

**Decisión:** Dos valores de periodicidad distintos para patrones mensuales.

- `mensual` — se repite el mismo día del mes (ej: siempre el 15)
- `mensual_relativo` — se repite el Nth día de la semana del mes (ej: 1er Domingo), con soporte para "último" (-1)

**Por qué:** Un solo valor `mensual` no puede expresar ambos patrones sin ambigüedad. Separar evita lógica condicional en el cálculo y hace la intención explícita en BD.

**Campos DB:** `semanaDelMes Int?` (1/2/3/4/-1) y `diaSemanaRelativo Int?` (0=Dom…6=Sáb, índice JS). Ambos son `null` cuando `periodicidad !== mensual_relativo`.

**Lógica de cálculo:** `src/lib/event-utils.ts` → función `agregarPeriodo`, case `mensual_relativo`. El "último" se calcula como `primerOcurrencia + Math.floor((diasEnMes - primerOcurrencia) / 7) * 7`.

---

## JWT_SECRET obligatorio en producción

**Decisión:** `src/lib/auth.ts` lanza error en startup si `JWT_SECRET` no está definido en `NODE_ENV === "production"`. En desarrollo usa un string placeholder explícito.

**Por qué:** El código original tenía `|| "fallback-secret-change-me"` que silenciosamente usaba un secreto débil en producción si la variable no estaba configurada.

**Correcto:** Lanzar `Error("JWT_SECRET env var is required in production")` en el módulo al cargarse.

---

## Rate limiting en login: separar check de registro

**Decisión:** `src/lib/rate-limit.ts` expone `isRateLimited` (solo lee) y `recordFailure` (incrementa). El endpoint de login solo llama a `recordFailure` cuando las credenciales son incorrectas.

**Por qué:** Si el contador se incrementara en cada intento (incluyendo los exitosos), un usuario que falla 4 veces y luego acierta quedaría bloqueado igualmente. Solo los fallos cuentan.

**Limitación:** El store es in-memory (`Map`), por lo que el rate limit es por instancia de servidor, no global. Aceptable para un sitio de baja carga; si se escala se reemplazaría por Redis.

---

## Estructura de tests: carpeta `test/` separada

**Decisión:** Los tests viven en `test/` en la raíz, espejando la estructura de `src/`. Los mocks reutilizables van en `test/mocks/`, nunca inline dentro del `.test.ts`.

**Por qué:** Mantiene `src/` limpio (solo código de producción) y facilita ver qué está testado. Los mocks en ficheros separados son reutilizables entre suites y mantienen los tests legibles.

**Framework:** Vitest (resolución nativa del alias `@/` via `resolve.tsconfigPaths`, ESM + TypeScript out-of-the-box, sin configuración extra).

**Convenciones:** AAA pattern, descripciones en español, `new Date(año, mes-1, día)` para fechas sin dependencia de timezone.

---

## Fetch de galería en servidor (no cliente)

**Decisión:** Mover el fetch de imágenes de `useEffect` en cliente a `page.tsx` en servidor.

**Por qué:** El componente cliente mostraba skeleton en cada navegación aunque los datos estuvieran cacheados. Con fetch en servidor, los datos van embebidos en el HTML del ISR — sin skeleton, sin fetch adicional.

**Archivo:** `src/app/[lang]/(public)/galeria/page.tsx` pasa `imagenes` como prop a `<Gallery>`.

---

## Galería pública: límite fijo + orden por fecha de subida

**Decisión:** La galería pública muestra siempre las últimas 20 imágenes ordenadas por `createdAt DESC`. No hay paginación.

**Por qué:** Si el usuario puede cargar más fotos infinitamente, pierde el incentivo de ir a Instagram. El objetivo es que las 20 fotos más recientes actúen de showcase, y el botón de Instagram sea el CTA para ver más. Las imágenes antiguas desaparecen automáticamente cuando se suben nuevas.

**Implementación:** `imagenService.getPublicCached(20)` con `orderBy: { createdAt: "desc" }`.

---

## `activo` en galería como filtro de exclusión

**Decisión:** El campo `activo` de `Imagen` es un filtro de exclusión, no de activación. Las imágenes se crean con `activo: true` por defecto y el admin lo desactiva para ocultarlas.

**Por qué:** Cambia el flujo de trabajo — subir ya implica publicar. Ocultar es la acción excepcional. Semánticamente el toggle se llama "Visible", no "Activa".

---

## Gestión de usuarios: `SELECT_PUBLIC` + `withAdmin`

**Decisión:** El módulo `usuarios` expone solo `{ id, name, email, role, createdAt }` (`SELECT_PUBLIC`). La contraseña nunca viaja fuera del servicio. Las rutas `/api/admin/usuarios/*` usan `withAdmin` (403 si no es ADMIN).

**Por qué:** Protección en tres capas — API (withAdmin → 403), Sidebar (enlace oculto para EDITOR), Page (redirect a `/admin` si `role !== "ADMIN"`). El `SELECT_PUBLIC` es la garantía de que un bug en la API no pueda exponer el hash de contraseña.

**Nota:** La auto-eliminación está bloqueada explícitamente: el endpoint compara el `id` del recurso con el `userId` de la sesión y devuelve `badRequest` si coinciden.

---

## JSON-LD centralizado en `src/lib/json-ld.ts`

**Decisión:** Helpers `organizationSchema`, `localBusinessSchema` y `eventSchema` centralizados en `src/lib/json-ld.ts`. Se inyectan como `<script type="application/ld+json">` en los Server Components de página (no en layouts).

**Por qué:** Inyectar en el layout global produciría JSON-LD duplicado en todas las páginas. Inyectar por página permite adaptar el tipo de schema al contenido (Organization en home, Church en contacto, Event para cada evento próximo).

**Datos:** Usan `siteConfig` (dirección, teléfono, redes) y `IGLESIA_NAME`/`SITE_URL` de `src/lib/constant.ts`.
