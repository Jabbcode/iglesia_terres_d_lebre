# Crear Pull Request

Crea una PR para el branch actual siguiendo el workflow del proyecto.

## Pasos

1. Verificar que no hay cambios sin commitear (`git status`)
2. Identificar el branch actual y su base
3. Determinar el target: si el branch viene de `develop` → PR a `develop`; si viene de `main` (hotfix) → PR a `main`
4. Crear la PR con título y descripción apropiados
5. Mostrar la URL al usuario
6. **Esperar confirmación explícita antes de mergear**

## Formato del título

Usar el tipo del branch como prefijo:
- `feat/` → `feat: descripción`
- `fix/` → `fix: descripción`
- `perf/` → `perf: descripción`
- `refactor/` → `refactor: descripción`
- `security/` → `security: descripción`
