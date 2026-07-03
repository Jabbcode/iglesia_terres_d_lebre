# Workflow de desarrollo

## Ramas principales

| Rama      | Propósito                                                     |
| --------- | ------------------------------------------------------------- |
| `main`    | Producción. Solo recibe merges de Prepare Release y hotfixes. |
| `develop` | Integración. Todas las features se mergean aquí primero.      |

## Flujo normal (features)

```
git checkout -b feat/nombre develop   ← branch desde develop
→ commits
→ PR hacia develop
→ esperar confirmación
→ mergear a develop
```

## Flujo de release (automatizado)

`.github/workflows/release.yml` automatiza todo lo que antes era manual, a partir de labels:

```
1. PR: develop → main  (título libre, ej. "Release" o el que sea)
2. Añadir una label: release-type/patch | release-type/minor | release-type/major
   → release-preview.yml comenta en el PR la versión que se generaría y el changelog
   de vista previa (se actualiza solo si cambias la label o subes más commits)
3. Esperar confirmación
4. Mergear  ← este es el único paso manual real; a partir de aquí todo es automático:
   - calcula la nueva versión según la label
   - genera las notas con la API de GitHub (agrupadas por labels vía .github/release.yml)
   - inserta esas notas en CHANGELOG.md + bump de package.json, commit directo a main
   - crea el tag vX.Y.Z y el GitHub Release
   - abre el PR de sync "chore: sync develop con main vX.Y.Z" (main → develop)
5. Esperar confirmación
6. Mergear el PR de sync — develop queda con CHANGELOG y version bump actualizados
```

**Estructura de CHANGELOG.md:** cada entrada de versión lleva solo sus cambios
categorizados (sin el link de comparación inline). Todos los links "Full Changelog"
se acumulan al final del fichero, en la sección `## Comparaciones completas`, con el
más reciente arriba de esa lista.

**Guard de cambios de código:** si el PR develop→main con label `release-type/*` no
toca `src/`, `prisma/` ni configs de build/runtime (`next.config.ts`, `package.json`,
`package-lock.json`, `tsconfig.json`), no se genera versión ni release — solo un
comentario avisando por qué. Evita versionar cambios de tooling/CI/docs puros
(`.github/`, `.claude/`, etc.).

Las PRs de feature/fix deben llevar la label correspondiente (`feat`, `fix`, `refactor`,
`docs`, `chore`, `style`, `test`, `db`, `security`, `perf`) para que aparezcan bien
categorizadas en las notas de release.

**Exclusión del PR agregador:** el propio PR "Release" (develop→main) solo lleva
`release-type/*` y ninguna label de tipo, así que el workflow lo detecta y lo quita de
las notas (evita que aparezca como ruido). Un hotfix, en cambio, lleva **ambas**
labels a la vez (`release-type/patch` + `fix`, por ejemplo) — como sí tiene label de
tipo, su contenido real se muestra igual, sin quedar tapado por tener también la
label de release.

## Hotfixes (bug urgente en producción)

El prefijo `hotfix/` es la señal que `release.yml` reconoce para disparar la misma
automatización que un release normal, directamente contra `main`:

```
git checkout -b hotfix/nombre main   ← branch desde main directamente, prefijo hotfix/
→ commits
→ PR hacia main
→ añadir label release-type/patch (normalmente)
   → release-preview.yml avisa la versión que se generaría
→ esperar confirmación
→ mergear  ← automático a partir de aquí: versión, CHANGELOG, tag, GitHub Release,
             y PR de sync "chore: sync develop con main vX.Y.Z" (main → develop)
→ esperar confirmación
→ mergear el PR de sync
```

Cualquier otro prefijo de rama (`fix/`, `feat/`, etc.) mergeado a `main` con una
label `release-type/*` **no** dispara el workflow — solo `develop` y `hotfix/*` lo
hacen, como salvaguarda contra un release accidental.

## Versionado semántico

- `MAJOR.MINOR.PATCH` — ej: `1.2.3`
- **PATCH** (`1.0.1`): fixes, cambios menores sin nueva funcionalidad
- **MINOR** (`1.1.0`): nueva funcionalidad compatible con lo anterior
- **MAJOR** (`2.0.0`): cambios que rompen compatibilidad o rediseño importante

## Convención de branches

| Prefijo     | Uso                                    | Base      |
| ----------- | --------------------------------------- | --------- |
| `feat/`     | Nueva funcionalidad                     | `develop` |
| `fix/`      | Corrección de bug                       | `develop` |
| `perf/`     | Mejora de rendimiento                   | `develop` |
| `refactor/` | Refactor sin cambio funcional           | `develop` |
| `chore/`    | Configuración, dependencias             | `develop` |
| `security/` | Cambios de seguridad                    | `develop` |
| `hotfix/`   | Bug urgente en producción               | `main`    |

`hotfix/` es el único prefijo que va directo a `main`. El propio nombre de la rama es
la señal: `release.yml` solo dispara automáticamente para PRs cuyo origen sea
`develop` o `hotfix/*` — cualquier otra rama mergeada a `main` con una label
`release-type/*` no dispara nada, como salvaguarda.

## Deploy manual de una versión (rollback)

`.github/workflows/deploy-version.yml` permite volver a producción a cualquier tag
que ya se haya publicado, sin pasar por la integración Git de Vercel (que solo
reacciona a pushes en `main`, nunca a tags):

```
1. Crear un issue con la plantilla "Deploy Release" — título y body libres,
   el body trae precargado "/deploy vX.Y.Z", solo cambia la versión
   — o comentar ese mismo comando en cualquier issue existente
2. En ambos casos, solo funciona si lo hace el dueño del repo
   (github.repository_owner); dispara solo con crear el issue, sin pasos extra
3. El workflow verifica que el tag existe, resuelve su commit exacto, y busca en
   la API de Vercel el deployment que Vercel ya construyó para ese commit (el que
   se generó la primera vez que ese tag llegó a main por el flujo normal)
4. Si lo encuentra, hace `vercel rollback` sobre ese deployment — NO reconstruye
   nada, solo mueve producción a un build que ya existe
5. Comenta el resultado (URL o error, con link directo al run del Action) y
   cierra el issue si salió bien
```

**Por qué rollback y no rebuild:** se probó primero reconstruir el tag vía
`vercel build` + `vercel deploy --prebuilt` en el propio Action. Falló en dos
capas: `JWT_SECRET`/`DATABASE_URL`/`SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY` están
marcadas **Sensitive** en Vercel, así que ni `vercel pull` las entrega (se pueden
inyectar a mano en el build), ni — esto sí es un límite duro — llegan al **runtime**
de un deployment subido vía CLI/prebuilt. Un deployment construido por la propia
infraestructura de Vercel (vía git push normal) sí tiene las Sensitive conectadas en
build y runtime desde el origen; por eso reutilizar ese deployment con `rollback` es
la única vía que funciona de verdad. Confirmado con un deploy real: compiló bien
pero devolvía 500 en producción con el mismo error de JWT_SECRET, ahora en runtime.

**El campo `about` en el frontmatter de la plantilla de issue es obligatorio** para
que GitHub la registre en el selector de "New issue" — sin él, el archivo existe y
es válido pero no aparece listado. Confirmado quitándolo y volviéndolo a añadir.

Requiere los secrets `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` en el repo
(Settings → Secrets and variables → Actions) — ya no hace falta duplicar
`JWT_SECRET`/`DATABASE_URL`/`SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY` como secrets
de GitHub, porque este workflow ya no compila nada (se pueden borrar esos 4 si no
se usan en otro lado).

## Comandos frecuentes

```bash
npm run dev          # desarrollo local
npx tsc --noEmit     # verificar tipos
npm test             # ejecutar tests (Vitest, una sola vez)
npm run test:watch   # tests en modo watch
npm run test:coverage # report de cobertura en coverage/index.html
gh pr list           # PRs abiertos
gh release list      # releases publicadas
```

## Hooks de git

- **pre-commit**: ESLint + Prettier sobre ficheros staged (lint-staged)
- **pre-push**: `npm test` → `npx tsc --noEmit` → `npm run build` (en ese orden; falla rápido si los tests no pasan)

## Comandos disponibles

- `/pr` — crea PR para el branch actual
- `/deploy` — mergea PR tras confirmación
- `/release` — ejecuta el flujo completo de release
