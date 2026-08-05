import {
  getConfirmationsUrl,
  getSupabaseConfig,
  getSupabaseHeaders,
  readSupabaseError,
} from '../server/supabase.js';

const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store, private',
};

export async function GET(request) {
  if (!isAuthorized(request)) {
    return Response.json(
      { ok: false, error: 'Contraseña incorrecta.' },
      { status: 401, headers: JSON_HEADERS },
    );
  }

  try {
    const { url, key } = getSupabaseConfig();
    const query = new URLSearchParams({
      select: 'id,name,attending,adults,children,note,created_at',
      order: 'created_at.desc',
      limit: '1000',
    }).toString();

    const response = await fetch(getConfirmationsUrl(url, query), {
      headers: getSupabaseHeaders(key),
    });

    if (!response.ok) {
      throw new Error(await readSupabaseError(response));
    }

    const confirmations = await response.json();
    return Response.json(
      { ok: true, confirmations },
      { status: 200, headers: JSON_HEADERS },
    );
  } catch (error) {
    console.error('No fue posible consultar las confirmaciones:', error);
    return Response.json(
      { ok: false, error: 'No pudimos consultar las confirmaciones.' },
      { status: 500, headers: JSON_HEADERS },
    );
  }
}

function isAuthorized(request) {
  const configuredPassword = process.env.ADMIN_PASSWORD;
  if (!configuredPassword) return false;

  const authorization = request.headers.get('authorization') || '';
  const receivedPassword = authorization.startsWith('Bearer ')
    ? authorization.slice(7)
    : '';

  return constantTimeEqual(receivedPassword, configuredPassword);
}

function constantTimeEqual(left, right) {
  const maximumLength = Math.max(left.length, right.length);
  let difference = left.length ^ right.length;

  for (let index = 0; index < maximumLength; index += 1) {
    difference |= (left.charCodeAt(index) || 0) ^ (right.charCodeAt(index) || 0);
  }

  return difference === 0;
}
