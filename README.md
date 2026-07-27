# Invitación XV · María Fernanda

Invitación web estática, responsive y lista para desplegar en Vercel. No necesita framework ni proceso de compilación.

## Ejecutar localmente

Desde esta carpeta:

```bash
python -m http.server 4173
```

Abre `http://localhost:4173`.

## Personalizar datos

Edita únicamente `src/config.js` para cambiar:

- nombre de la quinceañera;
- fecha y hora;
- fecha límite de confirmación;
- enlace de Google Maps;
- número y mensaje de WhatsApp.

El número de WhatsApp debe ir con indicativo de país, sin `+`, espacios ni guiones. El valor actual (`573000000000`) es de ejemplo.

## Invitaciones personalizadas

La página admite nombre y número de cupos por URL:

```text
/?invitado=Familia%20Gómez&cupos=4
```

El nombre aparece en la portada y el mensaje de confirmación se genera con esos datos. Los parámetros disponibles son:

- `invitado`: nombre de la persona o familia;
- `cupos`: número entero entre 1 y 20.

## Desplegar en Vercel

1. Sube esta carpeta a un repositorio de GitHub.
2. Importa el repositorio en Vercel.
3. Selecciona **Framework Preset: Other**.
4. Deja vacíos Build Command y Output Directory.
5. Despliega.

También puedes ejecutar `vercel --prod` desde esta carpeta.

## Estructura

```text
assets/          Imágenes y música optimizadas
src/config.js    Datos editables de la invitación
src/main.js      Interacciones, personalización, música y contador
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
