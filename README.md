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

## Ajustes de la versión final V9

- La leyenda ocupa más espacio útil y mantiene una lectura cómoda en celular.
- La portada usa una composición editorial distinta para móvil y escritorio: nombre y aniversario como foco, vitral como contrapunto.
- La fecha se presenta como un calendario protagonista acompañado por un itinerario de eucaristía y recepción.
- El contador queda integrado como cierre de la escena de fecha.
- La sección de información incluye vestimenta, una invitación a disfrutar y una referencia discreta y opcional a los sobres.
- `src/styles/final.css` concentra el último sistema de composición sin mezclarlo con la lógica de componentes.
