import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')!;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const partner_id: string | undefined = body.partner_id;
    const sequence_id: string | undefined = body.sequence_id;
    const base_subject: string | undefined = body.base_subject;
    const base_body: string | undefined = body.base_body;

    if (!partner_id) throw new Error('partner_id required');

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

    const { data: partner, error: pErr } = await supabase
      .from('partners')
      .select('id, company_name, category, city, contact_name, instagram_handle, google_rating, google_reviews_count, research_dossier, notes')
      .eq('id', partner_id)
      .maybeSingle();
    if (pErr) throw pErr;
    if (!partner) throw new Error('partner not found');

    let originalSubject = base_subject ?? '';
    let originalBody = base_body ?? '';

    if ((!originalSubject || !originalBody) && sequence_id) {
      const { data: seq } = await supabase
        .from('outreach_sequences')
        .select('steps, name')
        .eq('id', sequence_id)
        .maybeSingle();
      const firstStep: any = Array.isArray((seq as any)?.steps) ? (seq as any).steps[0] : null;
      originalSubject = originalSubject || firstStep?.subject || firstStep?.title || `Együttműködés: ${partner.company_name}`;
      originalBody = originalBody || firstStep?.body || firstStep?.template || '';
    }

    if (!originalBody) {
      originalBody = `Szia${partner.contact_name ? ' ' + partner.contact_name.split(' ')[0] : ''}!\n\nA Come Get It csapatából írok — egy új loyalty és reward platformot építünk, ami remek illeszkedne a(z) ${partner.company_name} profiljához.\n\nMikor érnél rá egy 15 perces hívásra a jövő héten?\n\nÜdv,\nBence`;
      originalSubject = originalSubject || `Együttműködés: Come Get It × ${partner.company_name}`;
    }

    const dossierPreview = typeof partner.research_dossier === 'string'
      ? partner.research_dossier.slice(0, 800)
      : partner.research_dossier ? JSON.stringify(partner.research_dossier).slice(0, 800) : null;

    const prompt = `Te a Come Get It csapat outreach copywritere vagy. Személyre szabd az alábbi email-t MAGYARUL, tegező, baráti, energikus, rövid mondatokkal (max 120 szó body). Használj 1-2 konkrét részletet a partner adataiból (kategória, város, IG, review szám, dossier). Ne légy mesterkélt, ne köszöngess feleslegesen.

PARTNER:
- Cég: ${partner.company_name}
- Kategória: ${partner.category ?? '—'}
- Város: ${partner.city ?? '—'}
- Kapcsolattartó: ${partner.contact_name ?? '—'}
- Instagram: ${partner.instagram_handle ?? '—'}
- Google: ${partner.google_rating ?? '—'} (${partner.google_reviews_count ?? 0} review)
- Notes: ${partner.notes ?? '—'}
- Research dossier: ${dossierPreview ?? '—'}

EREDETI SEQUENCE EMAIL:
Subject: ${originalSubject}
Body:
${originalBody}

Válaszolj CSAK ezzel a JSON objektummal, semmi más:
{"subject": "…", "body": "…"}`;

    const aiRes = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'Csak érvényes JSON objektumot adj vissza, semmi mást.' },
          { role: 'user', content: prompt },
        ],
      }),
    });

    if (!aiRes.ok) {
      const t = await aiRes.text();
      if (aiRes.status === 429) throw new Error('Rate limit — próbáld pár perc múlva.');
      if (aiRes.status === 402) throw new Error('Lovable AI kredit elfogyott.');
      throw new Error(`AI gateway: ${aiRes.status} ${t}`);
    }
    const aiJson = await aiRes.json();
    const raw: string = aiJson?.choices?.[0]?.message?.content ?? '{}';
    const cleaned = raw.replace(/```json\s*/g, '').replace(/```/g, '').trim();
    let out: { subject?: string; body?: string } = {};
    try { out = JSON.parse(cleaned); } catch {
      const m = cleaned.match(/\{[\s\S]*\}/);
      if (m) { try { out = JSON.parse(m[0]); } catch {} }
    }

    return new Response(JSON.stringify({
      subject: out.subject || originalSubject,
      body: out.body || originalBody,
      original: { subject: originalSubject, body: originalBody },
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e) {
    console.error('outreach-personalize error', e);
    return new Response(JSON.stringify({ error: String((e as Error)?.message ?? e) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
