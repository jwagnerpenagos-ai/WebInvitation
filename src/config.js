export const invitationConfig = Object.freeze({
  celebrant: 'María Fernanda',
  // La cuenta regresiva termina al inicio de la eucaristía.
  eventDate: '2026-10-03T16:00:00-05:00',
  eventTimeZone: 'America/Bogota',
  schedule: Object.freeze({
    ceremony: '4:00 p. m.',
    reception: '5:00 p. m.',
  }),
  rsvpDeadline: '20 de septiembre de 2026',
  venue: Object.freeze({
    name: 'Centro Recreacional Comfaboy',
    city: 'Duitama · Boyacá',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Comfaboy+Centro+Recreacional+Duitama+Boyaca+Colombia',
    mapsEmbedUrl:
      'https://www.google.com/maps?q=Centro+Recreacional+Comfaboy+Duitama+Boyaca+Colombia&output=embed',
  }),
  rsvp: Object.freeze({
    // Formato internacional, sin “+”, espacios ni guiones.
    phone: '573000000000',
    // Límites del selector; no representan cupos personalizados por invitación.
    maxAdults: 10,
    maxChildren: 10,
  }),
});
