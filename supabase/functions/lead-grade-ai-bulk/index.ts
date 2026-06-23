import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')!;

type Lead = {
  id: string;
  company_name: string;
  category: string | null;
  city: string | null;
  ai_score: number | null;
  google_rating: number | null;
  google_reviews_count: number | null;
  instagram_handle: string | null;
  research_dossier: unknown;
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { partner_ids, limit = 20 } = await req.json().catch(() => ({}));
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

    let q = supabase
      .from('partners')
      .select('id, company_name, category, city, ai_score, google_rating, google_reviews_count, instagram_handle, research_dossier')
      .eq('type', 'venue');

    if (Array.isArray(partner_ids) && partner_ids.length > 0) {
      q = q.in('id', partner_ids);
    } else {
      q = q.order('ai_score', { ascending: false, nullsFirst: false }).limit(Number(limit) || 20);
    }

    const { data: leads, error } = await q;
    if (error) throw error;
    if (!leads?.length) {
      return new Response(JSON.stringify({ ok: true, updated: 0 }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const compact = (leads as Lead[]).map((l) => ({
      id: l.id,
      name: l.company_name,
      category: l.category,
      city: l.city,
      ai_score: l.ai_score,
      google_rating: l.google_rating,
      google_reviews: l.google_reviews_count,
      ig: l.instagram_handle,
      dossier_preview: typeof l.research_dossier === 'string'
        ? (l.research_dossier as string).slice(0, 600)
        : l.research_dossier ? JSON.stringify(l.research_dossier).slice(0, 600) : null,
    }));

    const prompt = `Te egy budapesti vendéglátó partnerprogram lead-értékelő AI vagy. Adj mindegyiknek egy betűosztályzatot (A/B/C/D) és 1 mondatos indoklást MAGYARUL.
A = top prioritás (trendi, jó IG, sok review, illik a Come Get It márkához)
B = jó lead, érdemes elérni
C = közepes, alacsony prioritás
D = gyenge match
JSON tömböt válaszolj: [{"id":"uuid","grade":"A","reason":"..."}]. Csak a JSON-t, semmi más.

LEADEK:
${JSON.stringify(compact, null, 2)}`;

    const aiRes = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'Csak érvényes JSON tömböt adj vissza, semmi mást.' },
          { role: 'user', content: prompt },
        ],
      }),
    });

    if (!aiRes.ok) {
      const t = await aiRes.text();
      throw new Error(`AI gateway: ${aiRes.status} ${t}`);
    }
    const aiJson = await aiRes.json();
    const raw: string = aiJson?.choices?.[0]?.message?.content ?? '[]';
    const cleaned = raw.replace(/```json\s*/g, '').replace(/```/g, '').trim();
    let grades: Array<{ id: string; grade: string; reason?: string }> = [];
    try {
      grades = JSON.parse(cleaned);
    } catch {
      const m = cleaned.match(/\[[\s\S]*\]/);
      if (m) grades = JSON.parse(m[0]);
    }

    let updated = 0;
    for (const g of grades) {
      if (!g?.id || !['A', 'B', 'C', 'D'].includes(g.grade)) continue;
      const { error: upErr } = await supabase
        .from('partners')
        .update({
          lead_grade: g.grade,
          lead_grade_source: 'ai',
          lead_grade_computed_at: new Date().toISOString(),
          ai_score_reason: g.reason ?? null,
        })
        .eq('id', g.id);
      if (!upErr) updated++;
    }

    return new Response(JSON.stringify({ ok: true, updated, total: leads.length }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('lead-grade-ai-bulk error', e);
    return new Response(JSON.stringify({ error: String((e as Error)?.message ?? e) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
