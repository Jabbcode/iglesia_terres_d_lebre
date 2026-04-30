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

## Flujo de release

Cuando hay suficientes cambios en `develop` para publicar:

```
1. PR: develop → main  (título: "Release vX.Y.Z")
2. Esperar confirmación
3. Mergear
4. Actualizar CHANGELOG.md y package.json con nueva versión
5. Crear tag: git tag vX.Y.Z && git push origin vX.Y.Z
6. Crear GitHub Release desde el tag
7. Crear PR de `main` → `develop` con título "chore: sync develop con main vX.Y.Z"
8. Esperar confirmación
9. Mergear — develop queda con CHANGELOG y version bump actualizados
```

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
