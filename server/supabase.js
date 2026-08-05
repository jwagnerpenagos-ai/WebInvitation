const TABLE_NAME = 'rsvp_confirmations';

export function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, '');
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('Faltan SUPABASE_URL o SUPABASE_SECRET_KEY en las variables de entorno.');
  }

  return { url, key };
}

export function getSupabaseHeaders(key, extra = {}) {
  const headers = {
    apikey: key,
    'Content-Type': 'application/json',
    ...extra,
  };

  // Las llaves legacy service_role son JWT; las nuevas sb_secret_* no lo son.
  if (!key.startsWith('sb_secret_')) {
    headers.Authorization = `Bearer ${key}`;
  }

  return headers;
}

export function getConfirmationsUrl(baseUrl, query = '') {
  const suffix = query ? `?${query}` : '';
  return `${baseUrl}/rest/v1/${TABLE_NAME}${suffix}`;
}

export async function readSupabaseError(response) {
  const body = await response.text();

  try {
    const parsed = JSON.parse(body);
    return parsed.message || parsed.error || body;
  } catch {
    return body || `Supabase respondió con ${response.status}`;
  }
}
