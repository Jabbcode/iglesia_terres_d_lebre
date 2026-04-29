# Workflow de desarrollo

## Flujo Git obligatorio

1. Crear branch desde `main`: `git checkout -b tipo/descripcion`
2. Desarrollar + commits descriptivos
3. Crear PR con `gh pr create`
4. **Esperar confirmación explícita del usuario antes de mergear**
5. Mergear con `gh pr merge <n> --merge --delete-branch --admin`

**Nunca** pushear directamente a `main` salvo hotfixes urgentes de build.

## Convención de branches

| Prefijo | Uso |
|---|---|
| `feat/` | Nueva funcionalidad |
| `fix/` | Corrección de bug |
| `perf/` | Mejora de rendimiento |
| `refactor/` | Refactor sin cambio funcional |
| `chore/` | Configuración, dependencias |
| `security/` | Cambios de seguridad |

## PRs

- Título: `tipo: descripción corta`
- Body: qué hace, por qué, cómo probar
- Base siempre: `main`
- Usar `/pr` para crear PR del branch actual
- Usar `/deploy` para mergear tras confirmación

## Entornos en Vercel

- **Production:** rama `main` → deploy automático
- Variables de entorno gestionadas en Vercel dashboard

## Comandos frecuentes

```bash
npm run dev          # desarrollo local
npx tsc --noEmit     # verificar tipos
gh pr list           # PRs abiertos
gh pr view <n>       # ver PR específica
```
