// A megkeresési csomag mentése a leadhez — migráció nélkül:
//  • szövegek + ajánlat → partners.contacts_blob.outreach_csomag (meglévő jsonb oszlop)
//  • képek / videó → admin-docs storage + lead_mockups sor (meglévő tábla, admin RLS)
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { mergeCsomagIntoBlob, type MediaRef, type OutreachCsomag } from "@/lib/outreach-csomag";

export async function saveCsomag(partnerId: string, csomag: OutreachCsomag): Promise<void> {
  // Friss contacts_blob, hogy közben érkezett más kulcsokat ne írjunk felül.
  const { data, error: readErr } = await supabase.from("partners").select("contacts_blob").eq("id", partnerId).maybeSingle();
  if (readErr) throw readErr;
  const next = mergeCsomagIntoBlob(data?.contacts_blob, csomag);
  const { error } = await supabase
    .from("partners")
    .update({ contacts_blob: next as unknown as Json })
    .eq("id", partnerId);
  if (error) throw error;
}

export type MediaKind = "feed" | "story" | "video";

export async function uploadCsomagMedia(
  partnerId: string,
  kind: MediaKind,
  blob: Blob,
  ext: string,
  mime: string,
): Promise<MediaRef> {
  const path = `lead-mockups/${partnerId}/csomag-${kind}-${Date.now()}.${ext}`;
  const { error: upErr } = await supabase.storage.from("admin-docs").upload(path, blob, { contentType: mime, upsert: false });
  if (upErr) throw upErr;
  const { data: signed, error: signErr } = await supabase.storage.from("admin-docs").createSignedUrl(path, 60 * 60 * 24 * 365);
  if (signErr || !signed?.signedUrl) throw signErr ?? new Error("Nem sikerült aláírt URL-t kérni");
  const { data: auth } = await supabase.auth.getUser();
  const { data: row, error } = await supabase
    .from("lead_mockups")
    .insert({
      partner_id: partnerId,
      user_id: auth.user?.id ?? null,
      image_url: signed.signedUrl,
      storage_path: path,
      prompt: "Megkeresési csomag (böngészős canvas)",
      variant: `csomag_${kind}`,
      model: "canvas",
    })
    .select("id")
    .single();
  if (error) throw error;
  return { url: signed.signedUrl, path, mockup_id: row?.id ?? null, created_at: new Date().toISOString(), mime };
}
