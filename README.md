# Invitación XV · María Fernanda

Invitación web estática organizada por escenas, optimizada para celular y computador y lista para desplegar en Vercel.

## Flujo

1. Sobre animado
2. Mensaje de apertura
3. Portada de María Fernanda y sus 15 años
4. Fecha y horarios
5. Lugar
6. Información: vestimenta y lluvia de sobres
7. Confirmación por WhatsApp

La navegación principal se concentra en cuatro accesos persistentes: **Fecha**, **Lugar**, **Información** y **Confirmar**. Las escenas iniciales se recorren con gesto horizontal, flechas o teclado.

## Configuración

Los datos que normalmente cambian están centralizados en `src/config.js`:

```js
schedule: {
  ceremony: '4:00 p. m.',
  reception: '5:00 p. m.',
},
```

Antes de desplegar, reemplaza el teléfono de ejemplo:

```js
phone: '573000000000',
```

Debe ir en formato internacional, sin `+`, espacios ni guiones.

## Estructura

```text
assets/enchanted/          Recursos visuales y audio
src/config.js              Datos del evento
src/main.js                Inicialización
src/modules/               Audio, contenido, contador, sobre, navegación y RSVP
src/styles/                Estilos separados por responsabilidad
index.html                 Estructura semántica de las escenas
vercel.json                Configuración de despliegue
```

## Ejecución local

El proyecto usa módulos ES, por lo que debe abrirse mediante un servidor local:

```bash
python -m http.server 8000
```

Después abre `http://localhost:8000`.
