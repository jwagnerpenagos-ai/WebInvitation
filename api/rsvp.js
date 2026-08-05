import {
  getConfirmationsUrl,
  getSupabaseConfig,
  getSupabaseHeaders,
  readSupabaseError,
} from '../server/supabase.js';

const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
};

export async function POST(request) {
  try {
    const payload = validatePayload(await request.json());
    const { url, key } = getSupabaseConfig();

    const response = await fetch(getConfirmationsUrl(url), {
      method: 'POST',
      headers: getSupabaseHeaders(key, { Prefer: 'return=minimal' }),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(await readSupabaseError(response));
    }

    return Response.json({ ok: true }, { status: 201, headers: JSON_HEADERS });
  } catch (error) {
    const isValidationError = error instanceof ValidationError;
    console.error('No fue posible guardar la confirmación:', error);

    return Response.json(
      {
        ok: false,
        error: isValidationError
          ? error.message
          : 'No pudimos guardar la confirmación. Intenta nuevamente.',
      },
      { status: isValidationError ? 400 : 500, headers: JSON_HEADERS },
    );
  }
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: JSON_HEADERS });
}

function validatePayload(input) {
  const name = cleanText(input?.name, 80);
  const attendance = input?.attendance === 'no' ? 'no' : 'yes';
  const note = cleanText(input?.note, 180, { required: false });
  let adults = toSafeCount(input?.adults);
  let children = toSafeCount(input?.children);

  if (name.length < 2) {
    throw new ValidationError('Escribe el nombre de quien confirma.');
  }

  if (attendance === 'no') {
    adults = 0;
    children = 0;
  } else if (adults + children < 1) {
    throw new ValidationError('Indica al menos una persona entre adultos y niños.');
  }

  return {
    name,
    attending: attendance === 'yes',
    adults,
    children,
    note: note || null,
  };
}

function cleanText(value, maximum, { required = true } = {}) {
  if (typeof value !== 'string') return required ? '' : '';
  return value.replace(/\s+/g, ' ').trim().slice(0, maximum);
}

function toSafeCount(value) {
  const count = Number.parseInt(value, 10);
  if (!Number.isInteger(count)) return 0;
  return Math.min(50, Math.max(0, count));
}

class ValidationError extends Error {}
