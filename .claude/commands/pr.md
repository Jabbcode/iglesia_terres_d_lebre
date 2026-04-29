# Crear Pull Request

Crea una PR para el branch actual siguiendo el workflow del proyecto.

## Pasos

1. Verificar que no hay cambios sin commitear (`git status`)
2. Identificar el branch actual y su base (`git log --oneline -5`)
3. Crear la PR hacia `main` con título y descripción apropiados
4. Mostrar la URL de la PR al usuario
5. **Esperar confirmación explícita del usuario antes de mergear**

## Formato del título

Usar el tipo del branch como prefijo:
- `feat/` → `feat: descripción`
- `fix/` → `fix: descripción`  
- `perf/` → `perf: descripción`
- `refactor/` → `refactor: descripción`

## Recordatorio

Nunca mergear sin que el usuario diga explícitamente que está bien.
