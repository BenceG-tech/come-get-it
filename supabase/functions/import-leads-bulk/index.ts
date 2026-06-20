import { createClient } from "npm:@supabase/supabase-js@2";
import * as XLSX from "npm:xlsx@0.18.5";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Field aliases — Hungarian + English column names accepted
const FIELD_MAP: Record<string, string[]> = {
  company_name: ["company_name","cegnev","cég","cégnév","name","title","hely","helység","place","business"],
  city: ["city","varos","város","település","telepules"],
  address: ["address","cim","cím","utca","street"],
  contact_name: ["contact_name","kapcsolat","kapcsolattartó","contact","person"],
  email: ["email","e-mail","mail"],
  phone: ["phone","telefon","tel","mobil"],
  instagram: ["instagram","ig","insta"],
  website: ["website","web","url","honlap"],
  category: ["category","kategoria","kategória","típus","type"],
  rating: ["rating","értékelés","ertekeles","score","stars"],
  rating_count: ["rating_count","reviews","értékelések","review_count"],
  lat: ["lat","latitude","szélesség"],
  lng: ["lng","lon","longitude","hosszúság"],
  google_place_id: ["place_id","google_place_id","placeid"],
  notes: ["notes","jegyzet","megjegyzes","megjegyzés","description","leiras","leírás"],
};

function normalizeHeader(h: string) {
  return h?.toString().toLowerCase().trim().replace(/[\s_-]+/g," ").replace(/[áàâ]/g,"a").replace(/[éè]/g,"e").replace(/[íì]/g,"i").replace(/[óòöőô]/g,"o").replace(/[úùüűû]/g,"u");
}

function mapRow(row: Record<string, any>, headerMap: Record<string,string>) {
  const out: Record<string, any> = { type: "venue", status: "lead", source: "import" };
  for (const [orig, normalized] of Object.entries(headerMap)) {
    for (const [field, aliases] of Object.entries(FIELD_MAP)) {
      if (aliases.some(a => normalizeHeader(a) === normalized)) {
        const val = row[orig];
        if (val !== null && val !== undefined && val !== "") {
          out[field] = ["rating","lat","lng"].includes(field) ? Number(val) : ["rating_count"].includes(field) ? parseInt(String(val)) : String(val).trim();
        }
        break;
      }
    }
  }
  return out;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const supa = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: authHeader } } });
    const { data: claims } = await supa.auth.getClaims(authHeader.replace("Bearer ",""));
    if (!claims?.claims?.sub) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const userId = claims.claims.sub;

    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const dryRun = formData.get("dry_run") === "true";
    if (!file) return new Response(JSON.stringify({ error: "Missing file" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf, { type: "array" });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<Record<string, any>>(ws, { defval: "" });

    if (rows.length === 0) return new Response(JSON.stringify({ error: "Empty file" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const firstRow = rows[0];
    const headerMap: Record<string,string> = {};
    for (const key of Object.keys(firstRow)) headerMap[key] = normalizeHeader(key);

    const mapped = rows.map(r => mapRow(r, headerMap)).filter(r => r.company_name);

    // dedup against existing
    const names = [...new Set(mapped.map(r => r.company_name.toLowerCase()))];
    const { data: existing } = await admin.from("partners").select("company_name, city, google_place_id").in("company_name", mapped.map(r => r.company_name));
    const existingSet = new Set((existing ?? []).map(e => `${(e.company_name ?? "").toLowerCase()}|${(e.city ?? "").toLowerCase()}`));
    const placeSet = new Set((existing ?? []).map(e => e.google_place_id).filter(Boolean));

    const toInsert: any[] = [];
    let duplicates = 0;
    for (const r of mapped) {
      const key = `${r.company_name.toLowerCase()}|${(r.city ?? "").toLowerCase()}`;
      if (existingSet.has(key) || (r.google_place_id && placeSet.has(r.google_place_id))) { duplicates++; continue; }
      toInsert.push({ ...r, created_by: userId });
    }

    if (dryRun) {
      return new Response(JSON.stringify({
        total_rows: rows.length, mappable: mapped.length, duplicates, to_import: toInsert.length,
        sample: toInsert.slice(0, 5), header_map: headerMap,
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { data: job } = await admin.from("lead_import_jobs").insert({
      source: "csv_xlsx", filename: file.name, status: "processing", total_rows: rows.length, created_by: userId,
    }).select().single();

    let imported = 0;
    const errors: any[] = [];
    const BATCH = 200;
    for (let i = 0; i < toInsert.length; i += BATCH) {
      const chunk = toInsert.slice(i, i + BATCH);
      const { error, count } = await admin.from("partners").insert(chunk, { count: "exact" });
      if (error) errors.push({ batch: i, message: error.message });
      else imported += count ?? chunk.length;
    }

    await admin.from("lead_import_jobs").update({
      status: errors.length ? "completed_with_errors" : "completed",
      imported_rows: imported, duplicate_rows: duplicates, error_rows: rows.length - mapped.length,
      errors, completed_at: new Date().toISOString(),
    }).eq("id", job!.id);

    return new Response(JSON.stringify({ ok: true, job_id: job!.id, imported, duplicates, errors }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: String((e as Error).message) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
