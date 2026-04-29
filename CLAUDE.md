# Iglesia Terres de l'Ebre — Claude Code

Sitio web de iglesia cristiana con panel de administración.

**Producción:** https://iglesiabiblicaterresdelebre.es  
**Repo:** https://github.com/Jabbcode/iglesia_terres_d_lebre

## Contexto del proyecto

- @.claude/context/arquitectura.md — stack, estructura de carpetas, módulos
- @.claude/context/workflow.md — flujo Git, branches, PRs, deploy
- @.claude/context/decisions.md — decisiones técnicas tomadas y su razonamiento
- @.claude/context/standards.md — estándares de código: constantes, TypeScript, convenciones

## Mantenimiento del contexto

Al terminar cualquier implementación significativa, actualizar los ficheros de contexto si aplica:

- **`arquitectura.md`** — si cambia el stack, se añaden módulos, cambia la estructura de carpetas o el flujo de datos
- **`workflow.md`** — si cambian convenciones de branches, proceso de deploy o comandos frecuentes
- **`decisions.md`** — si se toma una decisión técnica no obvia (qué se hizo, por qué, qué alternativas se descartaron)
- **`standards.md`** — si se acuerdan nuevas reglas de código, convenciones o se ajustan las existentes

No documentar cada cambio menor — solo lo que un Claude nuevo necesitaría saber para no repetir errores o entender por qué el código es como es.

## Reglas esenciales

- **Siempre crear PR y esperar confirmación antes de mergear**
- `export const revalidate` necesita literal numérico (`= 86400`), nunca variable importada
- Rutas `/api/public/*` usan `publicSuccess()`, no `success()`
- Uploads solo desde servidor via `/api/admin/upload`
- No hay variables `NEXT_PUBLIC_SUPABASE_*`

## Variables de entorno (server-only)

| Variable                    | Uso               |
| --------------------------- | ----------------- |
| `SUPABASE_URL`              | URL de Supabase   |
| `SUPABASE_SERVICE_ROLE_KEY` | Uploads y admin   |
| `DATABASE_URL`              | Prisma connection |
| `JWT_SECRET`                | Auth tokens       |
