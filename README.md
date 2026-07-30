# Invitación XV · María Fernanda

Invitación de pantalla completa organizada por escenas. No utiliza scroll de página ni scroll interno en las escenas.

## Ejecutar localmente

Los módulos ES necesitan un servidor local:

```bash
python -m http.server 8080
```

Después abre `http://localhost:8080`.

## Configuración

Los datos editables están en `src/config.js`:

- fecha y hora;
- lugar y enlace de Google Maps;
- fecha límite de confirmación;
- teléfono de WhatsApp;
- cantidad máxima de asistentes.

El teléfono debe escribirse en formato internacional, sin `+`, espacios ni guiones.

## Estructura

```text
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

En escritorio, el lienzo conserva una proporción 16:10 para no deformar la composición. En móvil ocupa `100dvh` y redistribuye cada escena de forma independiente.
