import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function render(tpl: string, vars: Record<string,string>) {
  return tpl.replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? `{{${k}}}`);
}

function mdToHtml(md: string) {
  // Minimal: paragraphs + bold + line breaks + lists
  const blocks = md.split(/\n\n+/).map(b => {
    if (/^- /m.test(b)) {
      const items = b.split(/\n/).filter(l => l.startsWith("- ")).map(l => `<li>${l.slice(2)}</li>`).join("");
      return `<ul>${items}</ul>`;
    }
    return `<p>${b.replace(/\n/g,"<br/>")}</p>`;
  }).join("");
  return blocks.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
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
    const body = await req.json();
    const { partner_ids, template_id, subject_override, body_override } = body;

    if (!Array.isArray(partner_ids) || partner_ids.length === 0) return new Response(JSON.stringify({ error: "partner_ids required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    let template: any = null;
    if (template_id) {
      const { data } = await admin.from("email_templates").select("*").eq("id", template_id).single();
      template = data;
    }
    const subject = subject_override ?? template?.subject;
    const bodyMd = body_override ?? template?.body_md;
    if (!subject || !bodyMd) return new Response(JSON.stringify({ error: "Missing subject or body" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const RESEND = Deno.env.get("RESEND_API_KEY");
    if (!RESEND) return new Response(JSON.stringify({ error: "RESEND_API_KEY missing" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { data: partners } = await admin.from("partners").select("*").in("id", partner_ids);
    const sent: any[] = []; const failed: any[] = [];
    for (const p of partners ?? []) {
      if (!p.email) { failed.push({ id: p.id, reason: "no_email" }); continue; }
      const vars = {
        contact_name: p.contact_name || "Üdv",
        company_name: p.company_name || "",
        city: p.city || "",
      };
      const personalizedSubject = render(subject, vars);
      const personalizedBody = render(bodyMd, vars);
      const html = mdToHtml(personalizedBody);

      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Authorization": `Bearer ${RESEND}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "Come Get It <hello@come-get-it.app>",
          to: [p.email],
          subject: personalizedSubject,
          html,
          reply_to: "hello@come-get-it.app",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { failed.push({ id: p.id, reason: data?.message || `HTTP ${res.status}` }); continue; }

      await admin.from("partner_emails").insert({
        partner_id: p.id, template_id: template_id ?? null, to_email: p.email,
        subject: personalizedSubject, body_html: html, status: "sent",
        resend_id: data.id, sent_by: userId,
      });
      await admin.from("partner_interactions").insert({
        partner_id: p.id, type: "email_sent", summary: personalizedSubject, created_by: userId,
      } as any);
      sent.push({ id: p.id, resend_id: data.id });
    }

    return new Response(JSON.stringify({ ok: true, sent, failed }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: String((e as Error).message) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
