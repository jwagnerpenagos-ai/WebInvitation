# Invitación XV · María Fernanda

Invitación digital de pantalla completa organizada por escenas. La experiencia no utiliza scroll de página: se navega con los controles inferiores, las flechas del teclado, la rueda del mouse o un gesto horizontal en celular.

## Flujo actual

1. Sobre sellado a pantalla completa.
2. Mensaje inicial con efecto de escritura.
3. Portada de María Fernanda.
4. Menú visual con accesos a cada sección.
5. Fecha y cuenta regresiva.
6. Ubicación y enlace a Google Maps.
7. Código de vestimenta.
8. Lluvia de sobres.
9. Confirmación de asistencia por WhatsApp.

## Ejecutar localmente

Los módulos ES necesitan un servidor local:

```bash
python -m http.server 8080
```

Después abre `http://localhost:8080`.

## Configuración

Los datos editables están centralizados en `src/config.js`:

- mensaje inicial;
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
│   ├── slider.js
│   └── typewriter.js
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

En escritorio, el lienzo conserva una proporción `16:10` para mantener la composición. En móvil ocupa `100dvh` y cada escena tiene una distribución específica para evitar scroll y superposiciones.

## Despliegue

El proyecto incluye `vercel.json`. Puede desplegarse directamente en Vercel como sitio estático, sin comando de build.
