# Invitación XV Años · María Fernanda

Invitación web de una sola página (HTML/CSS/JS puro, sin frameworks) para
los XV años de María Fernanda. Estilo romántico floral en tonos lila, rosa,
vinotinto y dorado. Flujo: portada con el marco floral y el letrero
dorado "Mis 15 años" apareciendo animados juntos (sin video) → botón de
flecha sutil, que además arranca la música de fondo → contenido continuo de
scroll (no hay paneles ocultos ni menús de íconos: solo hay botón donde
hay una acción real que tomar — ver el mapa o mandar el RSVP por
WhatsApp; el resto de la información se muestra directo). La sección de
RSVP usa un fondo rojo/vinotinto de contraste en vez de los tonos pastel
del resto, como pidió la cliente. Totalmente responsive de verdad: en
mobile es edge-to-edge (el caso principal, un link abierto desde
WhatsApp), y en tablet/desktop cada sección sigue ocupando el ancho real
de la pantalla (fondo y esquinas florales incluidos) — no se encoge a una
tarjeta angosta de ancho de celular flotando con espacio vacío alrededor;
solo el bloque de texto se limita a un ancho cómodo de lectura.

## Pendiente por definir

- **Número de WhatsApp del RSVP**: en `index.html`, el botón `#rsvp-button`
  (sección "Confirma tu asistencia") usa el número de ejemplo
  `573000000000`. Reemplázalo por el número real en el `href` (formato
  `https://wa.me/<código país + número, sin +, sin espacios>`). Nota: no es
  posible que el mensaje se envíe automáticamente al tocar el botón — esa
  confirmación final ("enviar") siempre la da WhatsApp, no la página; el
  texto bajo el botón ya lo aclara para que no se sienta como un paso extra.

## Cómo personalizar

- **Fecha y hora del evento**: variable `EVENT_DATE` en `js/main.js`.
- **Lugar / mapa**: la URL del iframe y del botón "Ver en Google Maps"
  están en la sección `#ubicacion` en `index.html`.
- **Colores**: variables al inicio de `css/style.css` (`--wine`, `--gold`,
  `--lilac-dark`, `--pink`, etc.).
- **Código de vestimenta**: sección con `.dresscode-text` en `index.html`.
- **Mariposas de colores**: `assets/butterfly-a.webp` / `butterfly-b.webp`
  (dos mariposas recortadas del set que entregó la cliente) recoloreadas
  con `filter: hue-rotate(...)` vía las clases `.hue-pink` / `.hue-lilac`
  / `.hue-gold` en `css/style.css`. Para más variantes de color, agrega
  una clase `.hue-*` nueva en vez de otro archivo de imagen.
- **Destellos**: cuántos aparecen y dónde se controla en `scatterSparkles()`
  en `js/main.js`.
- **Fondo, marco y letrero de la portada**: `assets/portada-bg.webp`
  (fondo/acuarela) llena la pantalla de fondo; `assets/marco-letrero.webp`
  (marco + flores + mariposas, transparente) y `assets/letrero-15.webp`
  ("Mis 15 años") se muestran **completos, sin recortar** encima,
  centrados. Se probó que el marco también llenara toda la pantalla
  (recortando los bordes) y en un celular real se veía descentrado/cortado
  — por eso ahora se ve entero aunque quede un poco más chico, en vez de
  a pantalla completa pero con riesgo de cortarse. Para cambiar el marco,
  reemplaza `marco-letrero.webp` por el archivo nuevo — si viene con
  fondo blanco cuadriculado en vez de transparente de verdad, revisa la
  nota técnica en `CLAUDE.md` (es un problema de exportación, tiene
  arreglo). `assets/decoracion-mariposa.webp` y
  `luces.webp` siguen usándose en el RSVP; `flores-esquina-1/2.webp` y
  `conjunto-mariposas.webp` en el hero.
- **Acentos sueltos de la portada**: dos ramitas (`assets/intro-leaf-1/
  2.webp`) en las esquinas y cuatro mariposas individuales
  (`assets/intro-bfly-1..4.webp`) alrededor del marco, para que se sienta
  más lleno sin volver a depender de una imagen grande recortada. Salen
  de `source-canva/Elementos.png`, la hoja de piezas sueltas que dejó la
  cliente — ahí hay más piezas (otra ramita, un ramo de rosas ya
  recortado en `assets/intro-rosebouquet.webp` pero sin usar) por si se
  quiere agregar más adelante.
- **Música de fondo**: `assets/musica-fondo.mp3` (`<audio id="bg-music" loop>`
  en `index.html`). Arranca en el mismo tap del botón de continuar (ningún
  navegador permite audio con sonido antes de una interacción del
  usuario), y hay un botón circular de silenciar/activar fijo en la
  esquina inferior izquierda una vez se entra a la invitación. Para
  cambiar la canción, reemplaza el archivo y actualiza el `<source>`.
- **Frase de bienvenida**: pendiente — se probó con efecto de máquina de
  escribir automático y se quitó por ahora a pedido de la cliente
  ("la letra la dejaremos para después"). Se puede retomar más adelante.

## Estructura

```
index.html                     Portada + secciones en scroll continuo
css/style.css                   Estilos (paleta, animaciones, scroll-reveal, responsive real)
js/main.js                      Portada, countdown, música, destellos, lluvia de sobres, scroll-reveal
assets/portada-bg.webp          Fondo/acuarela de la portada (pareja de marco-letrero.webp)
assets/marco-letrero.webp       Marco dorado + flores + mariposas de la portada (se anima)
assets/letrero-15.webp          "Mis 15 años" + tiara, se anima junto con el marco y el fondo
assets/portada-fondo.webp       Fondo de una portada anterior, sin usar (se dejó como respaldo)
assets/flores-esquina-1/2.webp  Ramos de flores de esquina (hero, footer)
assets/conjunto-mariposas.webp  Mariposas tenues de fondo (hero)
assets/decoracion-mariposa.webp Mariposa ornamentada, acento único (RSVP)
assets/luces.webp               Brillos dorados (RSVP)
assets/butterfly-a/b.webp       Mariposas sueltas (se recolorean por CSS, hero)
assets/musica-fondo.mp3         Canción de fondo
assets/intro.mp4                Video de portada anterior, sin usar (se dejó como respaldo)
corregir/                       Fondos/referencias que deja la cliente para ajustar la portada
source-canva/                   PNG/MP3 originales de la cliente, alta resolución — excluidos del deploy
netlify.toml                    Configuración de despliegue en Netlify
```

## Despliegue en Vercel (gratis)

El proyecto ya incluye `vercel.json` (mismos headers de seguridad que antes
tenía `netlify.toml`, que ya no se usa y se puede borrar).

**Opción 1 — CLI (más rápida, sin subir a GitHub):**
1. Instala la CLI si no la tienes: `npm i -g vercel`.
2. Desde la carpeta del proyecto: `vercel` (te pide iniciar sesión la
   primera vez). Contesta las preguntas por defecto — no hay build command,
   el directorio raíz es `.`.
3. Para publicar la versión definitiva (dominio "de producción"):
   `vercel --prod`.

**Opción 2 — Conectado a un repositorio Git:**
1. Sube este proyecto a un repositorio (GitHub, GitLab, etc.) — sin
   `reel/`, `fallos/`, `source-video/`, `source-images/`, `source-canva/`
   ni `corregir/` (son archivos de referencia/fuente que no hacen falta
   para que el sitio funcione; agrégalos a un `.gitignore` o simplemente
   no los subas).
2. En [vercel.com](https://vercel.com): "Add New..." → "Project" →
   importa el repositorio.
3. Framework Preset: "Other". Build command: (vacío). Output directory: `.`.
4. Vercel genera un link público y vuelve a desplegar automáticamente en
   cada push.

**Opción 3 — Arrastrar y soltar (sin cuenta de Git):**
1. Entra a [vercel.com/new](https://vercel.com/new) e inicia sesión.
2. Arrastra la carpeta del proyecto (mismas exclusiones que arriba).
3. Vercel genera un link público al instante.

## Probar localmente

Al ser HTML/CSS/JS puro, basta con abrir `index.html` en el navegador,
o servirlo con cualquier servidor estático, por ejemplo:

```
npx serve .
```
