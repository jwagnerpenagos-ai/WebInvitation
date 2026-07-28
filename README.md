# Invitación XV · María Fernanda

Invitación web estática, responsive y lista para desplegar en Vercel. Usa HTML semántico, CSS modular y JavaScript nativo mediante ES Modules; no requiere framework ni proceso de compilación.

## Ejecutar localmente

Desde la raíz del proyecto:

```bash
python -m http.server 4173
```

Abre `http://localhost:4173`.

> No abras `index.html` directamente con doble clic. Los módulos de JavaScript deben ejecutarse desde un servidor local.

## Configuración principal

Los datos editables están centralizados en `src/config.js`:

- nombre de la quinceañera;
- fecha, hora y zona horaria;
- fecha límite de confirmación;
- enlace de Google Maps;
- número de WhatsApp;
- máximo de asistentes seleccionable.

El número de WhatsApp debe ir en formato internacional, sin `+`, espacios ni guiones:

```js
rsvp: {
  phone: '573000000000',
  maxGuests: 6,
},
```

La fecha visible de la tarjeta y de la barra superior se genera desde `eventDate`; no es necesario editarla en varios lugares del HTML.

## Confirmación de asistencia

Al pulsar **Confirmar asistencia**, se abre un formulario que solicita:

- nombre de quien confirma;
- asistencia o inasistencia;
- número total de asistentes;
- mensaje adicional opcional.

El formulario prepara el mensaje y continúa en WhatsApp. No utiliza base de datos.

## Código de vestimenta

Solo está reservado el tono cereza usado en el vestido de María Fernanda. El color de referencia se encuentra en:

```css
.reserved-color__swatch {
  background: #a33159;
}
```

## Estructura

```text
assets/
  Imágenes y música realmente utilizadas por la invitación.

src/
  config.js                 Datos editables del evento.
  main.js                   Inicialización de la aplicación.
  modules/
    content.js              Textos y fecha generados desde la configuración.
    countdown.js            Cuenta regresiva.
    dom.js                  Utilidades pequeñas del DOM.
    intro.js                Apertura de la portada y música.
    navigation.js           Scroll y estado del dock flotante.
    reveal.js               Animaciones al entrar en pantalla.
    rsvp.js                 Formulario y mensaje de WhatsApp.
  styles/
    base.css                Variables, reset y componentes compartidos.
    intro.css               Portada cerrada.
    sections.css            Secciones y componentes principales.
    responsive.css          Adaptaciones para tablet y celular.
    motion.css              Animaciones y reduced motion.

index.html                  Estructura semántica.
vercel.json                 Caché y cabeceras de seguridad.
```

## Desplegar en Vercel

1. Sube esta carpeta a un repositorio de GitHub.
2. Importa el repositorio en Vercel.
3. Selecciona **Framework Preset: Other**.
4. Deja vacíos **Build Command** y **Output Directory**.
5. Despliega.

También puedes ejecutar `vercel --prod` desde la raíz.

## Pruebas antes de enviar

- Chrome Android y Safari iPhone.
- 390 × 844, 430 × 932, 768 × 1024 y 1440 × 900.
- Número definitivo de WhatsApp.
- Ubicación, fecha, hora y límite de confirmación.
- Reproducción y volumen de la canción.
