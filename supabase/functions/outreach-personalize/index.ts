import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';
import { BRAND_CONTEXT, TONE_GUIDES, LENGTH_TARGETS, type TonePreset } from '../_shared/brand-context.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')!;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const partner_id: string | undefined = body.partner_id;
    const sequence_id: string | undefined = body.sequence_id;
    const step_index: number = Number(body.step_index ?? 0);
    const tone: TonePreset = (body.tone as TonePreset) ?? 'founding_pitch';
    const length: 'short' | 'medium' | 'long' = body.length ?? 'medium';
    const base_subject: string | undefined = body.base_subject;
    const base_body: string | undefined = body.base_body;
    const extra_instructions: string | undefined = body.extra_instructions;

    if (!partner_id) throw new Error('partner_id required');

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

    const { data: partner, error: pErr } = await supabase
      .from('partners')
      .select('id, company_name, category, city, contact_name, instagram_handle, google_rating, google_reviews_count, research_dossier, notes, website')
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
      const steps: any[] = Array.isArray((seq as any)?.steps) ? (seq as any).steps : [];
      const firstStep: any = steps[step_index] ?? steps[0] ?? null;
      originalSubject = originalSubject || firstStep?.subject || firstStep?.title || `Founding partner — ${partner.company_name}`;
      originalBody = originalBody || firstStep?.body || firstStep?.template || '';
    }

    const dossierPreview = typeof partner.research_dossier === 'string'
      ? partner.research_dossier.slice(0, 800)
      : partner.research_dossier ? JSON.stringify(partner.research_dossier).slice(0, 800) : null;

    const wordTarget = LENGTH_TARGETS[length] ?? 120;
    const toneGuide = TONE_GUIDES[tone] ?? TONE_GUIDES.founding_pitch;

    const prompt = `${BRAND_CONTEXT}

TONE PRESET: ${tone}
TONE INSTRUCTIONS: ${toneGuide}
TARGET LENGTH: kb. ${wordTarget} szó body.

PARTNER:
- Cég: ${partner.company_name}
- Kategória: ${partner.category ?? '—'}
- Város: ${partner.city ?? '—'}
- Kapcsolattartó: ${partner.contact_name ?? '—'}
- Website: ${partner.website ?? '—'}
- Instagram: ${partner.instagram_handle ?? '—'}
- Google: ${partner.google_rating ?? '—'} (${partner.google_reviews_count ?? 0} review)
- Notes: ${partner.notes ?? '—'}
- Research dossier: ${dossierPreview ?? '—'}

SEQUENCE STARTER (csak inspirációnak, ne másold szó szerint):
Subject: ${originalSubject}
Body:
${originalBody}

${extra_instructions ? `KIEGÉSZÍTŐ INSTRUKCIÓK A FELHASZNÁLÓTÓL:\n${extra_instructions}\n` : ''}

Válaszolj CSAK ezzel a JSON objektummal, semmi más szöveg:
{
  "subject": "fő subject (max 70 char, magyar, konkrét)",
  "preheader": "preview text a postafiókban (max 90 char)",
  "body": "a teljes email body magyarul, üdvözlés + 2-3 rövid bekezdés + CTA + aláírás (Bence)",
  "cta": "1 mondat — pontosan mit kérünk a partnertől",
  "variants": ["alternatív subject 1", "alternatív subject 2"],
  "risks": ["egy mondatos figyelmeztetés a follow-up-hoz", "..."]
}`;

    const aiRes = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'Csak érvényes JSON objektumot adj vissza, semmi mást. Soha ne találj ki userbase-t, videót, vagy launch utáni állapotot.' },
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
    let out: any = {};
    try { out = JSON.parse(cleaned); } catch {
      const m = cleaned.match(/\{[\s\S]*\}/);
      if (m) { try { out = JSON.parse(m[0]); } catch {} }
    }

    return new Response(JSON.stringify({
      subject: out.subject || originalSubject,
      preheader: out.preheader ?? '',
      body: out.body || originalBody,
      cta: out.cta ?? '',
      variants: Array.isArray(out.variants) ? out.variants.slice(0, 4) : [],
      risks: Array.isArray(out.risks) ? out.risks.slice(0, 5) : [],
      original: { subject: originalSubject, body: originalBody },
      tone, length, step_index,
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e) {
    console.error('outreach-personalize error', e);
    return new Response(JSON.stringify({ error: String((e as Error)?.message ?? e) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
