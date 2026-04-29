# Prepare Release

Ejecuta el flujo completo de release: develop → main → tag → GitHub Release → sync develop.

## Pasos

1. Confirmar la versión con el usuario (semver: MAJOR.MINOR.PATCH)
2. Crear PR de `develop` → `main` con título "Release vX.Y.Z"
3. **Esperar confirmación del usuario**
4. Mergear PR a `main`
5. Actualizar `CHANGELOG.md` con la nueva versión y fecha
6. Actualizar `"version"` en `package.json`
7. Commit en `main`: `chore: release vX.Y.Z`
8. Crear tag: `git tag vX.Y.Z && git push origin vX.Y.Z`
9. Crear GitHub Release: `gh release create vX.Y.Z --title "vX.Y.Z" --notes "Ver [CHANGELOG.md](...) para el detalle de cambios."` — sin descripción propia, el CHANGELOG es la fuente de verdad
10. Crear PR de `main` → `develop` con título "chore: sync develop con main vX.Y.Z"
11. **Esperar confirmación del usuario**
12. Mergear PR de sync
13. Confirmar al usuario que el release está publicado y develop sincronizado

## Notas

- El CHANGELOG sigue formato Keep a Changelog (Added / Changed / Fixed / Security / Removed)
- El sync final asegura que `develop` tenga el CHANGELOG y version bump actualizados
