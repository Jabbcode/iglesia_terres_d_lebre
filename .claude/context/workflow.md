# Workflow de desarrollo

## Ramas principales

| Rama | Propósito |
|---|---|
| `main` | Producción. Solo recibe merges de Prepare Release y hotfixes. |
| `develop` | Integración. Todas las features se mergean aquí primero. |

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
7. Sync: merge main → develop (trae CHANGELOG y version bump)
```

## Hotfixes (bug urgente en producción)

```
git checkout -b fix/nombre main   ← branch desde main directamente
→ commits
→ PR hacia main
→ esperar confirmación
→ mergear
→ sync main → develop
```

## Versionado semántico

- `MAJOR.MINOR.PATCH` — ej: `1.2.3`
- **PATCH** (`1.0.1`): fixes, cambios menores sin nueva funcionalidad
- **MINOR** (`1.1.0`): nueva funcionalidad compatible con lo anterior
- **MAJOR** (`2.0.0`): cambios que rompen compatibilidad o rediseño importante

## Convención de branches

| Prefijo | Uso | Base |
|---|---|---|
| `feat/` | Nueva funcionalidad | `develop` |
| `fix/` | Corrección de bug | `develop` o `main` (hotfix) |
| `perf/` | Mejora de rendimiento | `develop` |
| `refactor/` | Refactor sin cambio funcional | `develop` |
| `chore/` | Configuración, dependencias | `develop` |
| `security/` | Cambios de seguridad | `develop` |

## Comandos frecuentes

```bash
npm run dev          # desarrollo local
npx tsc --noEmit     # verificar tipos
gh pr list           # PRs abiertos
gh release list      # releases publicadas
```

## Comandos disponibles

- `/pr` — crea PR para el branch actual
- `/deploy` — mergea PR tras confirmación
- `/release` — ejecuta el flujo completo de release
