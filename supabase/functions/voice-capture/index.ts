// @ts-nocheck
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const STRUCT_SYSTEM = `Magyar nyelvű hangjegyzetet kapsz egy vendéglátó hűségprogram alapítójától.
Sorold be az alábbi kategóriák egyikébe és add vissza JSON-ben:
- "task": általános teendő/checklist elem
- "lead_note": egy partnerről/vendéglátóhelyről szóló jegyzet
- "content_idea": social media / kommunikációs ötlet
- "focus": mai top fókusz teendő

Válasz CSAK JSON:
{
  "intent": "task" | "lead_note" | "content_idea" | "focus",
  "title": "string (max 80 karakter, magyar)",
  "body": "string (a teljes strukturált jegyzet, magyar)",
  "tags": ["string", ...]
}`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
    if (!isAdmin) return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: corsHeaders });

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

    const body = await req.json();
    let transcript: string = body.transcript ?? "";

    // STT step if audio provided
    if (!transcript && body.audio_base64) {
      const mime: string = body.mime_type || "audio/webm";
      const extMap: Record<string, string> = { "audio/webm": "webm", "audio/mp4": "m4a", "audio/mpeg": "mp3", "audio/wav": "wav" };
      const ext = extMap[mime.split(";")[0]] ?? "webm";
      const bin = Uint8Array.from(atob(body.audio_base64), c => c.charCodeAt(0));
      const blob = new Blob([bin], { type: mime });

      const fd = new FormData();
      fd.append("model", "openai/gpt-4o-mini-transcribe");
      fd.append("file", blob, `recording.${ext}`);
      // language hint: hungarian
      fd.append("language", "hu");

      const sttResp = await fetch("https://ai.gateway.lovable.dev/v1/audio/transcriptions", {
        method: "POST",
        headers: { Authorization: `Bearer ${LOVABLE_API_KEY}` },
        body: fd,
      });
      if (!sttResp.ok) {
        const t = await sttResp.text();
        throw new Error(`STT ${sttResp.status}: ${t}`);
      }
      const sttJson = await sttResp.json();
      transcript = sttJson.text ?? "";
    }

    if (!transcript.trim()) {
      return new Response(JSON.stringify({ error: "Üres átirat — próbáld újra hangosabban." }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Structuring step
    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Lovable-API-Key": LOVABLE_API_KEY },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: STRUCT_SYSTEM },
          { role: "user", content: transcript },
        ],
        response_format: { type: "json_object" },
      }),
    });
    if (!aiResp.ok) throw new Error(`AI ${aiResp.status}: ${await aiResp.text()}`);
    const aiJson = await aiResp.json();
    const structured = JSON.parse(aiJson.choices?.[0]?.message?.content ?? "{}");

    const { data: saved, error } = await supabase
      .from("voice_notes")
      .insert({
        user_id: user.id,
        transcript,
        structured,
        intent: structured.intent ?? null,
        status: "pending",
      })
      .select()
      .single();
    if (error) throw error;

    return new Response(JSON.stringify({ ok: true, note: saved }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("voice-capture error", e);
    return new Response(JSON.stringify({ ok: false, error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
