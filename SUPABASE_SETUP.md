# Configurar confirmaciones con Supabase

La invitación guarda primero la respuesta y después abre WhatsApp. El panel privado está disponible en `/admin`.

## 1. Crear el proyecto

1. Crea un proyecto en Supabase.
2. Abre **SQL Editor**.
3. Copia y ejecuta todo el contenido de `supabase/schema.sql`.

## 2. Copiar la URL y la llave

En Supabase abre **Connect** o **Settings → API Keys** y copia:

- **Project URL** → `SUPABASE_URL`
- **Secret key** (`sb_secret_...`) → `SUPABASE_SECRET_KEY`

También funciona la llave legacy `service_role`, pero usa la nueva Secret key si está disponible.

Nunca pongas esa llave en `src/config.js`, `index.html` ni en código del navegador.

## 3. Variables en Vercel

En el proyecto de Vercel entra a **Settings → Environment Variables** y crea:

```text
SUPABASE_URL
SUPABASE_SECRET_KEY
ADMIN_PASSWORD
```

`ADMIN_PASSWORD` es la contraseña que usarás para entrar a `/admin`.

Activa las variables para **Production**. Puedes activarlas también para Preview si pruebas ramas.

## 4. Volver a desplegar

Las variables nuevas solo se aplican a despliegues posteriores. Ve a **Deployments**, abre el último despliegue y pulsa **Redeploy**.

## 5. Probar

1. Haz una confirmación desde la invitación.
2. Comprueba que WhatsApp se abra normalmente.
3. Entra a `https://TU-DOMINIO.vercel.app/admin`.
4. Escribe la contraseña de `ADMIN_PASSWORD`.

El panel muestra adultos, niños, total, personas que no asistirán y permite descargar un CSV.

## Desarrollo local

`python -m http.server` sirve la interfaz, pero no ejecuta las funciones `/api`. Para probar Supabase localmente usa Vercel CLI:

```bash
vercel dev
```

Crea un archivo `.env.local` con las mismas tres variables. Ese archivo está ignorado por Git.
