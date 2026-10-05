import test from 'node:test';
import assert from 'node:assert/strict';
import { fetchPublicVenues, parsePublicVenues } from '../src/lib/publicVenues.ts';

const venue = (id, name, extra = {}) => ({ id, name, is_paused: false, address: 'Budapest, Példa utca 1.', ...extra });

test('the public preview excludes the five seeded fictional venues', () => {
  const names = ['Bistro', 'Romkocsma', 'Restaurant', 'Bar', 'Club'];
  const rows = names.map((name, i) => venue(`demo-${i}`, `Come Get It ${name}`));
  rows.push(venue('listed', 'Példa kávézó'));
  assert.deepEqual(parsePublicVenues(rows).map(row => row.id), ['listed']);
});

test('paused, unknown-state, malformed and duplicate records never create cards', () => {
  const rows = [null, {}, venue('paused', 'Paused', { is_paused: true }),
    venue('unknown', 'Unknown', { is_paused: null }), venue('missing-name', ''),
    venue('listed', 'Példa'), venue('listed', 'Duplicate')];
  assert.deepEqual(parsePublicVenues(rows).map(row => row.name), ['Példa']);
});

test('a venue stays listed without a usable image or address', () => {
  const [row] = parsePublicVenues([venue('listed', 'Példa', {
    address: null, hero_image_url: 'javascript:alert(1)', image_url: 'not a URL',
  })]);
  assert.equal(row.address, null);
  assert.equal(row.imageUrl, null);
});

test('malformed API payload is an error, while a real empty list stays empty', () => {
  assert.throws(() => parsePublicVenues({ error: 'unavailable' }));
  assert.deepEqual(parsePublicVenues([]), []);
});

test('the preview request is anonymous and HTTP failures remain retryable errors', async () => {
  const originalFetch = globalThis.fetch;
  try {
    globalThis.fetch = async (url, init) => {
      assert.match(url, /\/functions\/v1\/get-public-venues\?/);
      assert.equal(init.credentials, 'omit');
      assert.deepEqual(init.headers, { Accept: 'application/json' });
      return new Response(JSON.stringify([venue('listed', 'Példa')]), { status: 200 });
    };
    assert.equal((await fetchPublicVenues()).length, 1);
    globalThis.fetch = async () => new Response('Unavailable', { status: 503 });
    await assert.rejects(fetchPublicVenues(), /503/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('query cancellation aborts the actual HTTP request', async () => {
  const originalFetch = globalThis.fetch;
  const controller = new AbortController();
  try {
    globalThis.fetch = async (_url, { signal }) => new Promise((_resolve, reject) => {
      signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')), { once: true });
    });
    const request = fetchPublicVenues(controller.signal);
    controller.abort();
    await assert.rejects(request, { name: 'AbortError' });
  } finally {
    globalThis.fetch = originalFetch;
  }
});
