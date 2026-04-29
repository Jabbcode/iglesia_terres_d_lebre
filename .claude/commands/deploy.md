# Deploy a producción

Mergea la PR indicada a `main` y confirma el deploy en Vercel.

## Pasos

1. Verificar que la PR existe y está aprobada por el usuario
2. Mergear con `gh pr merge <número> --merge --delete-branch --admin`
3. Confirmar que el merge fue exitoso (`git log --oneline -3`)
4. Indicar al usuario que Vercel está desplegando

## Importante

- Solo ejecutar cuando el usuario haya confirmado explícitamente
- Si hay múltiples PRs, mergear en orden lógico (dependencias primero)
- Verificar el build en Vercel tras el deploy
