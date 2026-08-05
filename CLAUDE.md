# CLAUDE.md

## Project

Invitación digital de XV años para María Fernanda. HTML, CSS y JavaScript sin framework ni build. Vercel sirve los archivos estáticos y ejecuta dos funciones Node en `/api`.

## Architecture

- `index.html`: invitación y formulario RSVP.
- `src/config.js`: única fuente de verdad para datos del evento y límites del formulario.
- `src/modules/rsvp.js`: valida el formulario, guarda mediante `POST /api/rsvp` y después abre WhatsApp.
- `api/rsvp.js`: valida la entrada y crea una fila en Supabase.
- `api/admin.js`: devuelve las filas únicamente cuando recibe `Authorization: Bearer <ADMIN_PASSWORD>`.
- `server/supabase.js`: construcción de URL, cabeceras y manejo de errores de la Data REST API.
- `admin/`: panel privado, estadísticas y exportación CSV.
- `supabase/schema.sql`: tabla protegida con RLS y sin acceso público.

## Environment variables

- `SUPABASE_URL`
- `SUPABASE_SECRET_KEY` (o legacy `SUPABASE_SERVICE_ROLE_KEY`)
- `ADMIN_PASSWORD`

Nunca expongas estas variables en archivos del cliente.

## Local development

La interfaz puede verse con `python -m http.server 8000`. Para ejecutar las funciones usa `vercel dev` con `.env.local`.
