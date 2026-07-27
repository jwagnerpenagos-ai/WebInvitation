# Invitación XV · María Fernanda

Invitación web estática, responsive y lista para desplegar en Vercel. No necesita framework ni proceso de compilación.

## Ejecutar localmente

Desde esta carpeta:

```bash
python -m http.server 4173
```

Abre `http://localhost:4173`.

## Personalizar datos

Edita `src/config.js` para cambiar:

- nombre de la quinceañera;
- fecha y hora;
- fecha límite de confirmación;
- enlace de Google Maps;
- número de WhatsApp;
- máximo de asistentes seleccionable en la confirmación.

El número de WhatsApp debe ir con indicativo de país, sin `+`, espacios ni guiones. El valor actual (`573000000000`) es de ejemplo.

```js
rsvp: {
  phone: '573000000000',
  maxGuests: 6,
},
```

## Portada cerrada

Al cargar la web, el contenido de la invitación permanece oculto. La portada solo muestra el emblema de los quince años y el botón **Abrir invitación**. Al abrirla:

- se revela el contenido;
- comienza la música cuando el navegador lo permite;
- se habilitan las animaciones de entrada.

## Confirmación y cupos

La invitación ya no utiliza nombres ni cupos personalizados en la URL.

Al tocar **Confirmar asistencia**, se abre un formulario que solicita:

- nombre de quien confirma;
- si asistirá o no;
- número total de asistentes;
- mensaje adicional opcional.

Al continuar, se abre WhatsApp con el mensaje organizado y listo para enviar. Este flujo no necesita base de datos.

## Desplegar en Vercel

1. Sube esta carpeta a un repositorio de GitHub.
2. Importa el repositorio en Vercel.
3. Selecciona **Framework Preset: Other**.
4. Deja vacíos Build Command y Output Directory.
5. Despliega.

También puedes ejecutar `vercel --prod` desde esta carpeta.

## Estructura

```text
assets/          Imágenes, marco y música optimizados
src/config.js    Datos editables de la invitación
src/main.js      Apertura, confirmación, música y contador
src/styles.css   Diseño responsive y animaciones
index.html       Estructura semántica de la página
vercel.json      Caché y cabeceras de seguridad
```

## Pruebas recomendadas antes de enviar

- Chrome Android y Safari iPhone.
- 390 × 844, 430 × 932, 768 × 1024 y 1440 × 900.
- Confirmar que el número de WhatsApp sea el definitivo.
- Confirmar mapa, hora, fecha y texto de vestimenta.
- Verificar la canción y su volumen.
