import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Send, Sparkles, X, Loader2, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import { trackEvent } from "@/lib/track";

type Msg = { role: "user" | "assistant"; content: string };

export default function AdminDocumentChat() {
  const [params, setParams] = useSearchParams();
  const { toast } = useToast();
  const initialIds = useMemo(() => (params.get("ids") || "").split(",").filter(Boolean), []);
  const [docs, setDocs] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>(initialIds);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(initialIds.length === 0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("documents").select("id, title, folder, category, mime_type, tldr, suggested_questions, ai_description").order("title");
      setDocs(data ?? []);
      // If we arrived with ?attachAnalysis=1 and a single id, prefill a starter prompt
      const attach = params.get("attachAnalysis");
      if (attach === "1" && initialIds.length === 1) {
        const d = (data ?? []).find((x: any) => x.id === initialIds[0]);
        if (d?.ai_description) {
          setInput(`Ehhez a képhez (${d.title}) van AI elemzés. Kérlek írj belőle 3 alternatív Instagram posztot.`);
        }
      }
    })();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, streaming]);

  const selectedDocs = useMemo(() => docs.filter((d) => selectedIds.includes(d.id)), [docs, selectedIds]);
  const suggested = useMemo(() => {
    const all: string[] = [];
    for (const d of selectedDocs) {
      if (Array.isArray(d.suggested_questions)) all.push(...d.suggested_questions);
    }
    return Array.from(new Set(all)).slice(0, 6);
  }, [selectedDocs]);

  const toggle = (id: string) => setSelectedIds((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);

  const [sources, setSources] = useState<any[]>([]);

  const send = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || streaming) return;
    if (selectedIds.length === 0) {
      toast({ title: "Válassz legalább egy doksit", variant: "destructive" });
      setPickerOpen(true);
      return;
    }
    setInput("");
    const history = [...messages];
    setMessages([...history, { role: "user", content: msg }, { role: "assistant", content: "" }]);
    setStreaming(true);
    setSources([]);
    try {
      // V2: prepend semantic search context
      let semanticHints = "";
      try {
        const { data: sem } = await supabase.functions.invoke("doc-semantic-search", { body: { query: msg, top_k: 5 } });
        if (sem?.results?.length) {
          setSources(sem.results);
          semanticHints = "\n\nReleváns snippet-ek (idézhető források):\n" + sem.results.map((r: any, i: number) => `[${i + 1}] ${r.document?.title ?? ""}: ${(r.snippet ?? "").slice(0, 300)}`).join("\n");
        }
      } catch (e) { console.warn("semantic search skip", e); }

      const augmentedMsg = msg + semanticHints;
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-with-documents`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.access_token}` },
        body: JSON.stringify({ documentIds: selectedIds, message: augmentedMsg, history }),
      });
      if (!res.ok || !res.body) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || `HTTP ${res.status}`);
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let assistant = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          const data = line.slice(5).trim();
          if (data === "[DONE]") continue;
          try {
            const json = JSON.parse(data);
            const delta = json?.choices?.[0]?.delta?.content;
            if (delta) {
              assistant += delta;
              setMessages((m) => {
                const next = [...m];
                next[next.length - 1] = { role: "assistant", content: assistant };
                return next;
              });
            }
          } catch {}
        }
      }
    } catch (e: any) {
      toast({ title: "Hiba", description: e?.message ?? String(e), variant: "destructive" });
      setMessages((m) => m.slice(0, -1));
    } finally {
      setStreaming(false);
    }
  };

  return (
    <div className="flex flex-col admin-fullh-safe">
      <header className="border-b border-nf-border px-3 md:px-6 py-3 flex items-center gap-2 bg-nf-surface">
        <Button variant="outline" size="sm" asChild className="shrink-0">
          <Link to="/admin/documents"><ArrowLeft className="h-4 w-4" /> <span className="hidden sm:inline">Vissza</span></Link>
        </Button>
        <div className="min-w-0 flex-1">
          <h1 className="font-bold text-sm md:text-base flex items-center gap-2"><MessageSquare className="h-4 w-4 text-electric-300" /> Chat a doksikkal</h1>
          <p className="text-[10px] md:text-xs text-nf-text-muted truncate">{selectedDocs.length} doksi kontextusban</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setPickerOpen(true)}>+ Doksik</Button>
      </header>

      {/* Selected chips */}
      {selectedDocs.length > 0 && (
        <div className="px-3 md:px-6 py-2 border-b border-nf-border bg-nf-surface-alt/30 flex gap-1.5 overflow-x-auto">
          {selectedDocs.map((d) => (
            <span key={d.id} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-electric-300/10 border border-electric-300/40 text-xs text-electric-300 shrink-0">
              {d.title}
              <button onClick={() => toggle(d.id)} aria-label="Eltávolítás"><X className="h-3 w-3" /></button>
            </span>
          ))}
        </div>
      )}

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 md:p-6 space-y-3">
        {messages.length === 0 && (
          <div className="max-w-2xl mx-auto text-center py-8 space-y-4">
            <div className="inline-flex p-3 rounded-full bg-electric-300/10 border border-electric-300/40">
              <Sparkles className="h-6 w-6 text-electric-300" />
            </div>
            <h2 className="text-lg font-bold">Kérdezz a kiválasztott doksikról</h2>
            <p className="text-sm text-nf-text-muted">Az AI kizárólag a kontextusba húzott dokumentumokból válaszol, és minden állítás után megjelöli a forrást.</p>
            {suggested.length > 0 && (
              <div className="flex flex-wrap gap-1.5 justify-center pt-2">
                {suggested.map((q, i) => (
                  <button key={i} onClick={() => send(q)} className="px-3 py-1.5 rounded-full bg-nf-surface border border-nf-border text-xs text-white/85 hover:border-electric-300/60 hover:text-electric-300">
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${m.role === "user" ? "bg-electric-300 text-black" : "bg-nf-surface border border-nf-border text-white"}`}>
              {m.role === "assistant" ? (
                <div className="prose prose-sm prose-invert max-w-none prose-p:my-1 prose-headings:my-2">
                  <ReactMarkdown>{m.content || "…"}</ReactMarkdown>
                </div>
              ) : (
                <p className="whitespace-pre-wrap">{m.content}</p>
              )}
            </div>
          </div>
        ))}
        {streaming && messages[messages.length - 1]?.content === "" && (
          <div className="flex justify-start"><div className="bg-nf-surface border border-nf-border rounded-2xl px-4 py-2.5"><Loader2 className="h-4 w-4 animate-spin text-electric-300" /></div></div>
        )}
      </div>

      {/* Sources from semantic search */}
      {sources.length > 0 && (
        <div className="border-t border-nf-border px-3 md:px-6 py-2 bg-nf-surface-alt/30 flex gap-1.5 overflow-x-auto">
          <span className="text-[10px] uppercase text-nf-text-muted shrink-0 self-center">Források:</span>
          {sources.map((s, i) => (
            <Link key={i} to={`/admin/documents/${s.document_id}`} className="shrink-0 px-2 py-1 rounded bg-electric-300/10 border border-electric-300/30 text-[10px] text-electric-300 hover:bg-electric-300/20" title={s.snippet}>
              [{i + 1}] {s.document?.title ?? "?"}
            </Link>
          ))}
        </div>
      )}
      {/* Input */}
      <div className="border-t border-nf-border p-3 bg-nf-surface">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), send())}
            placeholder={selectedIds.length === 0 ? "Előbb válassz doksikat…" : "Kérdezz a doksikról…"} disabled={streaming} />
          <Button variant="neon" onClick={() => send()} disabled={streaming || !input.trim()}>
            {streaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Picker */}
      {pickerOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" onClick={() => setPickerOpen(false)} />
          <div className="fixed inset-x-3 top-[10vh] bottom-[10vh] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[600px] z-50 bg-nf-surface border border-nf-border rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            <div className="p-4 border-b border-nf-border flex items-center justify-between">
              <h3 className="font-bold">Doksik a chathez ({selectedIds.length})</h3>
              <button onClick={() => setPickerOpen(false)} aria-label="Bezárás"><X className="h-4 w-4" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {docs.map((d) => (
                <label key={d.id} className="flex items-start gap-2 p-2 rounded-lg hover:bg-nf-surface-alt cursor-pointer">
                  <input type="checkbox" checked={selectedIds.includes(d.id)} onChange={() => toggle(d.id)} className="mt-1 accent-electric-300" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate">{d.title}</div>
                    <div className="text-[10px] text-nf-text-muted truncate">{d.folder ?? "—"} · {d.category}</div>
                  </div>
                </label>
              ))}
            </div>
            <div className="p-3 border-t border-nf-border flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedIds([])}>Mind töröl</Button>
              <Button variant="neon" onClick={() => setPickerOpen(false)}>Kész</Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
