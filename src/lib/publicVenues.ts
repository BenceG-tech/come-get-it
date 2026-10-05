// This is the existing public venue API, separate from the marketing site's backend.
// It requires no credentials; never pass the website session or a service-role key.
export const PUBLIC_VENUES_URL = 'https://nrxfiblssxwzeziomlvc.supabase.co/functions/v1/get-public-venues?limit=100';

export interface PublicVenuePreview {
  id: string;
  name: string;
  address: string | null;
  imageUrl: string | null;
}

// These five fixtures are explicitly seeded as demo rows by venue-hub migration
// 20260707164250_b8de7b27-353f-4f67-bdc1-e9d61146e335.sql. The public API currently
// has no publication/demo flag. Do not present these fictional addresses as venues.
const SEEDED_DEMO_NAMES = new Set([
  'Come Get It Bistro',
  'Come Get It Romkocsma',
  'Come Get It Restaurant',
  'Come Get It Bar',
  'Come Get It Club',
]);

function textValue(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function imageUrl(value: unknown): string | null {
  const url = textValue(value);
  if (!url) return null;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' ? parsed.href : null;
  } catch {
    return null;
  }
}

export function parsePublicVenues(payload: unknown): PublicVenuePreview[] {
  if (!Array.isArray(payload)) throw new Error('Invalid public venue response');
  const seen = new Set<string>();
  return payload.flatMap((row): PublicVenuePreview[] => {
    if (!row || typeof row !== 'object' || row.is_paused !== false) return [];
    const id = textValue(row.id);
    const name = textValue(row.name);
    if (!id || !name || seen.has(id) || SEEDED_DEMO_NAMES.has(name)) return [];
    seen.add(id);
    return [{
      id,
      name,
      address: textValue(row.formatted_address) ?? textValue(row.address),
      imageUrl: imageUrl(row.hero_image_url) ?? imageUrl(row.image_url),
    }];
  });
}

export async function fetchPublicVenues(signal?: AbortSignal): Promise<PublicVenuePreview[]> {
  const controller = new AbortController();
  const onAbort = () => controller.abort();
  if (signal?.aborted) controller.abort();
  else signal?.addEventListener('abort', onAbort, { once: true });
  const timeout = setTimeout(() => controller.abort(), 8_000);
  try {
    const response = await fetch(PUBLIC_VENUES_URL, {
      signal: controller.signal,
      credentials: 'omit',
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) throw new Error(`Public venues unavailable (${response.status})`);
    return parsePublicVenues(await response.json());
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener('abort', onAbort);
  }
}
