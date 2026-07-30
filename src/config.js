export const invitationConfig = Object.freeze({
  celebrant: 'María Fernanda',
  introMessage: [
    'Hay momentos inolvidables que se atesoran en el corazón para siempre,',
    'y lo que los hace realmente especiales son las personas que amas y que',
    'forman parte fundamental de tu vida. Por esta razón, quiero que compartas',
    'conmigo este maravilloso día, en el que termina una linda etapa e inicia',
    'un camino lleno de sueños e ilusiones.',
  ].join(' '),
  eventDate: '2026-10-03T18:00:00-05:00',
  eventTimeZone: 'America/Bogota',
  eventTimeLabel: '6:00 p. m.',
  rsvpDeadline: '20 de septiembre de 2026',
  venue: {
    name: 'Centro Recreacional Comfaboy',
    city: 'Duitama · Boyacá',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Comfaboy+Centro+Recreacional+Duitama+Boyaca+Colombia',
  },
  rsvp: {
    // Formato internacional, sin “+”, espacios ni guiones.
    phone: '573000000000',
    maxGuests: 6,
  },
});
