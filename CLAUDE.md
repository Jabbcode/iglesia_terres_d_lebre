# Iglesia Terres de l'Ebre — Claude Code

Sitio web de iglesia cristiana con panel de administración.

**Producción:** https://iglesiabiblicaterresdelebre.es  
**Repo:** https://github.com/Jabbcode/iglesia_terres_d_lebre

## Contexto del proyecto

- @.claude/context/arquitectura.md — stack, estructura de carpetas, módulos
- @.claude/context/workflow.md — flujo Git, branches, PRs, deploy
- @.claude/context/decisions.md — decisiones técnicas tomadas y su razonamiento

## Reglas esenciales

- **Siempre crear PR y esperar confirmación antes de mergear**
- `export const revalidate` necesita literal numérico (`= 86400`), nunca variable importada
- Rutas `/api/public/*` usan `publicSuccess()`, no `success()`
- Uploads solo desde servidor via `/api/admin/upload`
- No hay variables `NEXT_PUBLIC_SUPABASE_*`

## Variables de entorno (server-only)

| Variable | Uso |
|---|---|
| `SUPABASE_URL` | URL de Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Uploads y admin |
| `DATABASE_URL` | Prisma connection |
| `JWT_SECRET` | Auth tokens |
