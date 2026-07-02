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

Las PRs de feature/fix deben llevar la label correspondiente (`feat`, `fix`, `refactor`,
`docs`, `chore`, `style`, `test`, `db`, `security`, `perf`) para que aparezcan bien
categorizadas en las notas de release. Las labels `release-type/*` se excluyen
automáticamente del changelog generado (evita que el propio PR de release aparezca
como ruido).

## Hotfixes (bug urgente en producción)

```
git checkout -b fix/nombre main   ← branch desde main directamente
→ commits
→ PR hacia main
→ esperar confirmación
→ mergear
→ PR de sync: main → develop
→ esperar confirmación
→ mergear
```

## Versionado semántico

- `MAJOR.MINOR.PATCH` — ej: `1.2.3`
- **PATCH** (`1.0.1`): fixes, cambios menores sin nueva funcionalidad
- **MINOR** (`1.1.0`): nueva funcionalidad compatible con lo anterior
- **MAJOR** (`2.0.0`): cambios que rompen compatibilidad o rediseño importante

## Convención de branches

| Prefijo     | Uso                           | Base                        |
| ----------- | ----------------------------- | --------------------------- |
| `feat/`     | Nueva funcionalidad           | `develop`                   |
| `fix/`      | Corrección de bug             | `develop` o `main` (hotfix) |
| `perf/`     | Mejora de rendimiento         | `develop`                   |
| `refactor/` | Refactor sin cambio funcional | `develop`                   |
| `chore/`    | Configuración, dependencias   | `develop`                   |
| `security/` | Cambios de seguridad          | `develop`                   |

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
