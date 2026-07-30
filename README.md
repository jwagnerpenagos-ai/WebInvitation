# Invitación XV · María Fernanda

Invitación web estática, responsive y organizada por escenas. No requiere proceso de compilación.

## Despliegue

Puede desplegarse directamente en Vercel, Netlify o cualquier servidor estático. El archivo de entrada es `index.html`.

## Configuración

Los datos del evento se administran desde `src/config.js`:

- fecha del evento;
- horarios de eucaristía y recepción;
- ubicación y enlaces de Google Maps;
- fecha límite y teléfono para confirmar por WhatsApp;
- número máximo de asistentes.

## Estructura

- `src/modules`: comportamiento por responsabilidad.
- `src/styles`: estilos separados por componente y responsive.
- `assets/enchanted`: imágenes y audio de la invitación.

## Ajustes de la versión final V8

- La leyenda aparece después de terminar la apertura del sobre.
- El texto de la leyenda aprovecha mejor el espacio móvil y ya no usa comillas decorativas.
- Se añadió un botón móvil discreto para continuar sin depender del gesto de deslizar.
- Se reorganizó la portada para dar protagonismo separado y claro a los 15 años y a María Fernanda.
- El día `03` usa una tipografía numérica limpia para evitar la cola ornamental del número tres.
- La fecha y la cuenta regresiva tienen más respiración vertical en móvil.
- La lluvia de sobres se presenta como un detalle completamente opcional.
