# Invitación XV · María Fernanda

Invitación web por escenas, optimizada para celular y computador y desplegada en Vercel.

## Flujo

1. Sobre animado
2. Mensaje de apertura
3. Portada de María Fernanda y sus 15 años
4. Fecha y horarios
5. Lugar
6. Información
7. Confirmación

La confirmación registra nombre, asistencia, adultos, niños y mensaje en Supabase. Después abre WhatsApp con el texto listo.

## Datos del evento

Los datos editables están centralizados en `src/config.js`:

```js
schedule: {
  ceremony: '4:00 p. m.',
  reception: '5:00 p. m.',
},
```

El teléfono debe ir en formato internacional, sin `+`, espacios ni guiones.

## Confirmaciones

- Endpoint público: `POST /api/rsvp`
- Panel privado: `/admin`
- Base de datos: tabla `public.rsvp_confirmations`
- Instalación: consulta `SUPABASE_SETUP.md`

Las variables privadas se configuran únicamente en Vercel:

```text
SUPABASE_URL
SUPABASE_SECRET_KEY
ADMIN_PASSWORD
```

La llave secreta nunca debe agregarse a `src/config.js` ni al repositorio.

## Estructura

```text
admin/                     Panel privado y exportación CSV
api/                       Funciones de Vercel
assets/enchanted/          Recursos visuales y audio
server/                    Utilidades privadas de Supabase
supabase/schema.sql        Creación de la tabla
src/config.js              Datos del evento
src/modules/               Lógica del cliente
src/styles/                Estilos separados por responsabilidad
SUPABASE_SETUP.md          Guía de configuración
index.html                 Invitación
vercel.json                Configuración de despliegue
```

## Ejecución local

Para revisar solo la interfaz estática:

```bash
python -m http.server 8000
```

Para probar también `/api/rsvp` y `/api/admin`, configura `.env.local` y usa:

```bash
vercel dev
```
