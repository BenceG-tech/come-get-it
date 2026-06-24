// Apify — poll a run's status. If SUCCEEDED, optionally fetch + import dataset into partners.
// Body: { run_id: uuid (our row) }  OR  { apify_run_id, actor_id, dataset_id }  OR  { dataset_id_only } for one-shot import of an existing dataset URL/id.
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const APIFY = "https://api.apify.com/v2";

function pickField(o: any, keys: string[]) {
  for (const k of keys) {
    const v = o?.[k];
    if (v !== undefined && v !== null && v !== "") return v;
  }
  return null;
}

function firstNonEmpty(arr: any): string | null {
  if (!arr) return null;
  if (typeof arr === "string") return arr;
  if (Array.isArray(arr)) {
    for (const x of arr) {
      const s = (typeof x === "string" ? x : x?.url ?? x?.value ?? "").toString().trim();
      if (s) return s;
    }
  }
  return null;
}

function extractIgHandle(item: any): string | null {
  const candidates = [item.instagrams, item.contacts?.instagrams, item.instagram, item.socialLinks?.instagram];
  for (const c of candidates) {
    const url = firstNonEmpty(c);
    if (url) {
      const m = String(url).match(/instagram\.com\/([A-Za-z0-9_.]+)/);
      if (m) return m[1].replace(/\/$/, "");
      if (/^[A-Za-z0-9_.]+$/.test(url)) return url;
    }
  }
  if (Array.isArray(item.additionalInfo?.Profiles)) {
    const ig = item.additionalInfo.Profiles.find((s: any) => String(s).toLowerCase().includes("instagram"));
    if (ig) {
      const m = String(ig).match(/instagram\.com\/([A-Za-z0-9_.]+)/);
      if (m) return m[1];
    }
  }
  return null;
}

function cleanWebsite(item: any): string | null {
  const lists = [item.websites, item.website, item.url];
  for (const l of lists) {
    if (Array.isArray(l)) {
      const w = l.find((u: any) => {
        const s = String(typeof u === "string" ? u : u?.url ?? "");
        return s && !/facebook\.com|instagram\.com|google\.com|maps\./i.test(s);
      });
      if (w) return typeof w === "string" ? w : w.url;
    } else if (typeof l === "string") {
      if (!/facebook\.com|instagram\.com|google\.com|maps\./i.test(l)) return l;
    }
  }
  return null;
}

function cleanEmail(item: any): string | null {
  const list = item.emails ?? item.contacts?.emails ?? item.email;
  if (Array.isArray(list)) {
    const valid = list.find((e: any) => /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(String(e)));
    return valid ?? null;
  }
  if (typeof list === "string") {
    const first = list.split(/[,;]/)[0].trim();
    return /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(first) ? first : null;
  }
  return null;
}

function mapGoogleMapsItem(it: any): any {
  return {
    type: "venue",
    status: "lead",
    source: "apify_google_maps",
    company_name: pickField(it, ["title", "name"]) ?? "Ismeretlen",
    address: pickField(it, ["address", "street"]),
    city: pickField(it, ["city"]) ?? "Budapest",
    phone: pickField(it, ["phone", "phoneUnformatted"]),
    email: cleanEmail(it),
    website: cleanWebsite(it),
    instagram_handle: extractIgHandle(it),
    facebook_url: firstNonEmpty(it.facebooks ?? it.contacts?.facebooks ?? it.facebook),
    linkedin_url: firstNonEmpty(it.linkedIns ?? it.contacts?.linkedIns ?? it.linkedin),
    category: pickField(it, ["categoryName", "category"]),
    google_rating: pickField(it, ["totalScore", "rating"]),
    google_reviews_count: pickField(it, ["reviewsCount", "rating_count"]),
    rating: pickField(it, ["totalScore", "rating"]),
    rating_count: pickField(it, ["reviewsCount"]),
    google_maps_url: pickField(it, ["url", "googleMapsUrl"]),
    apify_place_id: pickField(it, ["placeId", "place_id"]),
    google_place_id: pickField(it, ["placeId", "place_id"]),
    latitude: it.location?.lat ?? pickField(it, ["lat", "latitude"]),
    longitude: it.location?.lng ?? pickField(it, ["lng", "longitude"]),
    notes: it.description ?? null,
    contacts_blob: {
      emails: it.emails ?? null,
      phones: it.phones ?? null,
      websites: it.websites ?? null,
      instagrams: it.instagrams ?? null,
      facebooks: it.facebooks ?? null,
      linkedIns: it.linkedIns ?? null,
      twitters: it.twitters ?? null,
    },
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const token = Deno.env.get("APIFY_API_TOKEN");
    if (!token) throw new Error("APIFY_API_TOKEN not configured");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: authHeader } } });
    const { data: claims } = await sb.auth.getClaims(authHeader.replace("Bearer ", ""));
    if (!claims?.claims?.sub) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const userId = claims.claims.sub;
    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const { run_id, apify_run_id, dataset_id, do_import } = await req.json();

    let row: any = null;
    let datasetId = dataset_id as string | undefined;
    let apifyRunId = apify_run_id as string | undefined;

    if (run_id) {
      const { data, error } = await admin.from("apify_runs").select("*").eq("id", run_id).maybeSingle();
      if (error || !data) throw new Error("run not found");
      row = data;
      apifyRunId = data.apify_run_id;
      datasetId = data.dataset_id;
    }

    // Refresh status from Apify if we have an apify_run_id
    let status = row?.status ?? "SUCCEEDED";
    if (apifyRunId) {
      const sr = await fetch(`${APIFY}/actor-runs/${apifyRunId}?token=${token}`);
      const sj = await sr.json();
      status = sj.data?.status ?? status;
      datasetId = datasetId || sj.data?.defaultDatasetId;
      if (row) {
        await admin.from("apify_runs").update({
          status,
          dataset_id: datasetId,
          finished_at: sj.data?.finishedAt ?? null,
          items_count: sj.data?.stats?.outputBodyLen ? null : null, // updated post-import
        }).eq("id", row.id);
      }
    }

    // If not finished, return status and stop here.
    if (status !== "SUCCEEDED" && !do_import) {
      return new Response(JSON.stringify({ ok: true, status, dataset_id: datasetId, run_id: row?.id }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (!datasetId) throw new Error("no dataset_id available");

    // Fetch all items (paged)
    const items: any[] = [];
    let offset = 0;
    const limit = 1000;
    while (true) {
      const r = await fetch(`${APIFY}/datasets/${datasetId}/items?token=${token}&clean=true&format=json&limit=${limit}&offset=${offset}`);
      if (!r.ok) throw new Error(`dataset fetch ${r.status}`);
      const batch = await r.json();
      if (!Array.isArray(batch) || batch.length === 0) break;
      items.push(...batch);
      if (batch.length < limit) break;
      offset += limit;
      if (offset > 10000) break; // safety
    }

    const mapped = items.map(mapGoogleMapsItem).filter((m) => m.company_name && m.company_name !== "Ismeretlen");

    // Dedup against existing partners by (place_id OR name+city)
    const placeIds = mapped.map((m) => m.apify_place_id).filter(Boolean);
    const names = mapped.map((m) => m.company_name);
    const { data: existing } = await admin.from("partners").select("company_name, city, apify_place_id, google_place_id").or(`apify_place_id.in.(${placeIds.map((p) => `"${p}"`).join(",") || '""'}),company_name.in.(${names.map((n) => `"${n.replace(/"/g, "")}"`).join(",")})`);
    const placeSet = new Set((existing ?? []).map((e: any) => e.apify_place_id || e.google_place_id).filter(Boolean));
    const nameCitySet = new Set((existing ?? []).map((e: any) => `${(e.company_name ?? "").toLowerCase()}|${(e.city ?? "").toLowerCase()}`));

    let imported = 0;
    let duplicates = 0;
    const toInsert: any[] = [];
    for (const m of mapped) {
      if (m.apify_place_id && placeSet.has(m.apify_place_id)) { duplicates++; continue; }
      const key = `${m.company_name.toLowerCase()}|${(m.city ?? "").toLowerCase()}`;
      if (nameCitySet.has(key)) { duplicates++; continue; }
      toInsert.push({ ...m, created_by: userId, apify_source_run_id: row?.id ?? null });
    }

    const BATCH = 200;
    for (let i = 0; i < toInsert.length; i += BATCH) {
      const chunk = toInsert.slice(i, i + BATCH);
      const { error, count } = await admin.from("partners").insert(chunk, { count: "exact" });
      if (error) console.error("insert batch err", error);
      else imported += count ?? chunk.length;
    }

    if (row) {
      await admin.from("apify_runs").update({
        status: "SUCCEEDED",
        items_count: items.length,
        imported_count: imported,
        finished_at: new Date().toISOString(),
      }).eq("id", row.id);
    }

    return new Response(JSON.stringify({
      ok: true,
      status: "SUCCEEDED",
      total_items: items.length,
      imported,
      duplicates,
      run_id: row?.id,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: String((e as Error).message) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
