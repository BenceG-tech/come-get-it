import { createClient } from "npm:@supabase/supabase-js@2";
import * as XLSX from "npm:xlsx@0.18.5";
import { buildHeaderMap, mapRow, splitDuplicates, type ExistingLead, type MappedLead } from "./mapping.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Oszlop-felismerés, sor-leképezés és duplikátumszűrés: ./mapping.ts
// (név, cím, kerület, telefon, e-mail, web, Instagram, Facebook, rating, reviews, Maps URL, place id,
//  kategória, leírás, nyitvatartás, fotó; ami nem fér oszlopba → contacts_blob jsonb).

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

    const headers = Object.keys(rows[0]);
    const { map: headerMap, unmapped } = buildHeaderMap(headers);
    if (!Object.values(headerMap).includes("company_name")) {
      return new Response(JSON.stringify({ error: "Nem találtam a hely nevét tartalmazó oszlopot (pl. név / name / title / cégnév)." }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const mapped = rows.map((r) => mapRow(r, headerMap, unmapped)).filter((r): r is MappedLead => !!r);

    // Duplikátumszűrés a meglévő partnerek ellen (google_place_id, különben normalizált név + cím) és a fájlon belül.
    const existing: ExistingLead[] = [];
    for (let from = 0; from < 20000; from += 1000) {
      const { data, error } = await admin.from("partners").select("company_name, address, city, google_place_id, apify_place_id").range(from, from + 999);
      if (error) throw error;
      existing.push(...((data ?? []) as ExistingLead[]));
      if (!data || data.length < 1000) break;
    }
    const { fresh, dups } = splitDuplicates(mapped, existing);
    const duplicates = dups.length;
    const toInsert = fresh.map((r) => ({ ...r, created_by: userId }));

    if (dryRun) {
      return new Response(JSON.stringify({
        total_rows: rows.length, mappable: mapped.length, duplicates, to_import: toInsert.length,
        sample: toInsert.slice(0, 5), header_map: headerMap, unmapped_columns: unmapped,
        duplicate_sample: dups.slice(0, 10),
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
