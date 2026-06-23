import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Mic, Square, Loader2, X, Check, Type } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { trackEvent } from "@/lib/track";

type Structured = { intent?: string; title?: string; body?: string; tags?: string[] };

export type VoiceCaptureTriggerProps = {
  recording: boolean;
  processing: boolean;
  toggleRecording: () => void;
  openText: () => void;
};

export function VoiceCaptureFAB({ renderTrigger }: { renderTrigger?: (p: VoiceCaptureTriggerProps) => React.ReactNode } = {}) {
  const { user } = useAuth();
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [textMode, setTextMode] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [open, setOpen] = useState(false);
  const [noteId, setNoteId] = useState<string | null>(null);
  const [transcript, setTranscript] = useState("");
  const [structured, setStructured] = useState<Structured>({});
  const [intent, setIntent] = useState<string>("task");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const recRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
  }, []);

  const blobToBase64 = (blob: Blob) => new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve((r.result as string).split(",")[1]);
    r.onerror = reject;
    r.readAsDataURL(blob);
  });

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mime = ["audio/webm", "audio/mp4"].find((t) => MediaRecorder.isTypeSupported(t));
      if (!mime) {
        stream.getTracks().forEach((t) => t.stop());
        toast.error("Ez a böngésző nem támogatott hangformátumot rögzít");
        setTextMode(true); setOpen(true); return;
      }
      const rec = new MediaRecorder(stream, { mimeType: mime });
      chunksRef.current = [];
      rec.ondataavailable = (e) => e.data.size > 0 && chunksRef.current.push(e.data);
      rec.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: rec.mimeType });
        if (blob.size < 1024) { toast.error("Üres felvétel — próbáld újra"); return; }
        await processAudio(blob);
      };
      rec.start();
      recRef.current = rec;
      setRecording(true);
      timeoutRef.current = window.setTimeout(() => stopRecording(), 60000);
    } catch {
      toast.error("Mikrofon nem elérhető");
      setTextMode(true); setOpen(true);
    }
  };

  const stopRecording = () => {
    if (timeoutRef.current) { window.clearTimeout(timeoutRef.current); timeoutRef.current = null; }
    if (recRef.current && recRef.current.state !== "inactive") recRef.current.stop();
    setRecording(false);
  };

  const processAudio = async (blob: Blob) => {
    setProcessing(true);
    try {
      const b64 = await blobToBase64(blob);
      const { data, error } = await supabase.functions.invoke("voice-capture", {
        body: { audio_base64: b64, mime_type: blob.type },
      });
      if (error || !data?.note) throw new Error(error?.message ?? data?.error ?? "Hiba");
      openModal(data.note);
    } catch (e: any) {
      toast.error("Hiba: " + (e?.message ?? e));
    } finally { setProcessing(false); }
  };

  const processText = async () => {
    if (!textInput.trim()) return;
    setProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke("voice-capture", {
        body: { transcript: textInput },
      });
      if (error || !data?.note) throw new Error(error?.message ?? data?.error ?? "Hiba");
      openModal(data.note);
      setTextInput("");
    } catch (e: any) {
      toast.error("Hiba: " + (e?.message ?? e));
    } finally { setProcessing(false); }
  };

  const openModal = (note: any) => {
    setNoteId(note.id);
    setTranscript(note.transcript ?? "");
    const s = note.structured ?? {};
    setStructured(s);
    setIntent(s.intent ?? "task");
    setTitle(s.title ?? "");
    setBody(s.body ?? note.transcript ?? "");
    setOpen(true);
  };

  const apply = async () => {
    if (!user || !noteId) return;
    try {
      let target_table: string | null = null;
      let target_id: string | null = null;
      if (intent === "task") {
        const { data } = await supabase.from("checklist_items").insert({
          title, description: body, status: "open", priority: "medium", category: "voice",
        }).select().single();
        target_table = "checklist_items"; target_id = data?.id ?? null;
      } else if (intent === "content_idea") {
        const { data } = await supabase.from("saved_content_snippets").insert({
          format_key: "idea", format_label: "Hangjegyzet ötlet",
          text: `${title}\n\n${body}`, brief: title, tags: structured.tags ?? [], created_by: user.id,
        }).select().single();
        target_table = "saved_content_snippets"; target_id = data?.id ?? null;
      } else if (intent === "focus") {
        const today = new Date().toISOString().slice(0, 10);
        const { data: existing } = await supabase.from("daily_focus").select("*").eq("user_id", user.id).eq("focus_date", today).maybeSingle();
        const prev = ((existing?.top_priorities as any) ?? []) as Array<{text:string;done:boolean}>;
        const next = [...prev, { text: title || body.slice(0, 80), done: false }].slice(0, 3);
        if (existing) {
          await supabase.from("daily_focus").update({ top_priorities: next }).eq("id", existing.id);
          target_id = existing.id;
        } else {
          const { data } = await supabase.from("daily_focus").insert({ user_id: user.id, focus_date: today, top_priorities: next }).select().single();
          target_id = data?.id ?? null;
        }
        target_table = "daily_focus";
      } else if (intent === "lead_note") {
        // No partner_id yet — keep as content snippet for later linking
        const { data } = await supabase.from("saved_content_snippets").insert({
          format_key: "lead_note", format_label: "Lead jegyzet (hang)",
          text: `${title}\n\n${body}`, brief: title, tags: ["lead", ...(structured.tags ?? [])], created_by: user.id,
        }).select().single();
        target_table = "saved_content_snippets"; target_id = data?.id ?? null;
      }
      await supabase.from("voice_notes").update({
        status: "applied", intent, target_table, target_id,
        structured: { ...structured, title, body, intent } as any,
      }).eq("id", noteId);
      await trackEvent("voice_note_created", { entity_type: target_table ?? "voice_note", entity_id: target_id ?? noteId });
      toast.success("Mentve");
      setOpen(false); reset();
    } catch (e: any) {
      toast.error("Mentés hiba: " + (e?.message ?? e));
    }
  };

  const dismiss = async () => {
    if (noteId) await supabase.from("voice_notes").update({ status: "dismissed" }).eq("id", noteId);
    setOpen(false); reset();
  };
  const reset = () => { setNoteId(null); setTranscript(""); setStructured({}); setTitle(""); setBody(""); setIntent("task"); setTextMode(false); };

  return (
    <>
      <div className="fixed bottom-20 right-4 z-40 flex flex-col gap-2 items-end">
        <button
          onClick={() => { setTextMode(true); setOpen(true); }}
          className="bg-nf-surface border border-nf-border text-nf-text-muted hover:text-white h-10 w-10 rounded-full flex items-center justify-center shadow-lg"
          title="Szöveges jegyzet"
          aria-label="Szöveges jegyzet"
        >
          <Type className="h-4 w-4" />
        </button>
        <button
          onClick={recording ? stopRecording : startRecording}
          disabled={processing}
          className={`h-14 w-14 rounded-full flex items-center justify-center shadow-xl transition-all ${
            recording ? "bg-red-500 animate-pulse" : "bg-electric-300 hover:bg-electric-400 text-black"
          }`}
          title={recording ? "Felvétel leállítása" : "Hangjegyzet rögzítése"}
          aria-label="Hangjegyzet"
        >
          {processing ? <Loader2 className="h-6 w-6 animate-spin text-black" /> :
           recording ? <Square className="h-5 w-5 text-white" /> :
           <Mic className="h-6 w-6" />}
        </button>
      </div>

      <Dialog open={open} onOpenChange={(o) => { if (!o) { setOpen(false); reset(); } }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{noteId ? "Hangjegyzet rendszerezése" : "Szöveges jegyzet"}</DialogTitle>
          </DialogHeader>

          {!noteId && textMode && (
            <div className="space-y-3">
              <Textarea value={textInput} onChange={(e) => setTextInput(e.target.value)} rows={5} placeholder="Írd ide a jegyzeted..." />
              <Button onClick={processText} disabled={processing || !textInput.trim()} className="w-full" variant="neon">
                {processing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Feldolgozás
              </Button>
            </div>
          )}

          {noteId && (
            <div className="space-y-3">
              {transcript && (
                <div>
                  <div className="text-xs text-nf-text-muted mb-1">Átirat</div>
                  <div className="text-sm bg-nf-surface-alt p-2 rounded max-h-24 overflow-auto">{transcript}</div>
                </div>
              )}
              <div>
                <div className="text-xs text-nf-text-muted mb-1">Típus</div>
                <Select value={intent} onValueChange={setIntent}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="task">Teendő (checklist)</SelectItem>
                    <SelectItem value="content_idea">Content ötlet</SelectItem>
                    <SelectItem value="focus">Mai fókusz</SelectItem>
                    <SelectItem value="lead_note">Lead/partner jegyzet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <div className="text-xs text-nf-text-muted mb-1">Cím</div>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div>
                <div className="text-xs text-nf-text-muted mb-1">Részletek</div>
                <Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} />
              </div>
              <div className="flex gap-2">
                <Button onClick={dismiss} variant="ghost" className="flex-1"><X className="h-4 w-4 mr-1" /> Elvetés</Button>
                <Button onClick={apply} variant="neon" className="flex-1"><Check className="h-4 w-4 mr-1" /> Mentés</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
