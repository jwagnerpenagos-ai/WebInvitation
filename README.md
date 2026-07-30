# Invitación XV · María Fernanda

Invitación digital estática, responsive y lista para desplegar en Vercel. La experiencia funciona como una secuencia de escenas a pantalla completa: el marco y las decoraciones permanecen fijos y solo cambia el contenido central.

## Experiencia

1. Sobre sellado con la rosa de vitral.
2. Apertura animada con sonido mágico.
3. Portada con vitral iluminado.
4. Fecha y cuenta regresiva.
5. Ubicación y acceso a Google Maps.
6. Código de vestimenta.
7. Lluvia de sobres y mensaje.
8. Confirmación por WhatsApp con cantidad de asistentes.

La navegación admite botones, indicadores inferiores, teclado, rueda del mouse y gesto horizontal en celular.

## Ejecutar localmente

El proyecto no necesita instalación ni compilación. Como usa módulos de JavaScript, conviene abrirlo mediante un servidor local:

```bash
python -m http.server 5500
```

Luego visita `http://localhost:5500`.

También se puede usar la extensión **Live Server** de VS Code.

## Configuración

Los datos editables están centralizados en `src/config.js`:

```js
export const invitationConfig = Object.freeze({
  celebrant: 'María Fernanda',
  eventDate: '2026-10-03T18:00:00-05:00',
  eventTimeZone: 'America/Bogota',
  eventTimeLabel: '6:00 p. m.',
  rsvpDeadline: '20 de septiembre de 2026',
  venue: {
    name: 'Centro Recreacional Comfaboy',
    city: 'Duitama · Boyacá',
    mapsUrl: '...',
  },
  rsvp: {
    phone: '573000000000',
    maxGuests: 6,
  },
});
```

Antes de publicar, reemplaza `phone` por el número real en formato internacional, sin `+`, espacios ni guiones.

## Estructura

```text
assets/enchanted/
├── audio/
├── backgrounds/
├── decor/
├── envelope/
├── frames/
├── ornaments/
└── stained-glass/

src/
├── config.js
├── main.js
├── modules/
│   ├── audio.js
│   ├── content.js
│   ├── countdown.js
│   ├── dom.js
│   ├── envelope.js
│   ├── rsvp.js
│   └── slider.js
└── styles/
    ├── tokens.css
    ├── base.css
    ├── envelope.css
    ├── stage.css
    ├── scenes.css
    ├── dialog.css
    ├── responsive.css
    └── motion.css
```

## Decisiones técnicas

- No hay scroll de página: cada escena vive dentro de un escenario de `100dvh`.
- Si una pantalla es muy baja, solo el contenido de la escena puede desplazarse internamente.
- Los marcos móvil y escritorio son composiciones independientes; no se estira el mismo archivo.
- La música comienza después de tocar el sello para cumplir las restricciones de reproducción automática.
- Las animaciones respetan `prefers-reduced-motion`.
- La confirmación no requiere base de datos: crea un mensaje y continúa en WhatsApp.
- Las escenas inactivas usan `hidden`, `aria-hidden` e `inert` para evitar navegación accidental con teclado.

## Despliegue en Vercel

Sube el repositorio y crea un proyecto nuevo en Vercel. No selecciones framework ni comando de build; el directorio de salida es la raíz del proyecto.
