import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Send, Sparkles, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";

type Msg = { role: "user" | "assistant"; content: string };

const STORAGE_KEY = "cgi-admin-ai-chat-v1";
const FUNCTIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-ai-chat`;

const QUICK = [
  "Kit keressek meg ma? Adj prioritást a follow-up dátumok alapján.",
  "Írj egy IG DM-et egy budapesti specialty kávézónak (Come Get It bemutatás, founding partner ajánlat).",
  "Adj 4 hetes marketing tervet a vendéglátóhely-toborzáshoz.",
  "Melyik doksit küldjem először egy érdeklődő bárnak?",
  "Írj egy IG posztot, ami vendéglátóhelyeket toboroz partnernek.",
];

export default function AdminAI() {
  const [messages, setMessages] = useState<Msg[]>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { return []; }
  });
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages)); }, [messages]);
  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [messages, streaming]);
  useEffect(() => { inputRef.current?.focus(); }, []);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || streaming) return;
    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setStreaming(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Nincs bejelentkezett user");

      const res = await fetch(FUNCTIONS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ messages: next.map((m) => ({ role: m.role, content: m.content })) }),
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(`AI hiba: ${res.status} ${t.slice(0, 200)}`);
      }
      if (!res.body) throw new Error("Nincs stream válasz");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";
      setMessages([...next, { role: "assistant", content: "" }]);
      let buf = "";
      while (true) {
        const { done, value } = await reader.read();
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
              assistantText += delta;
              setMessages((prev) => {
                const copy = [...prev];
                copy[copy.length - 1] = { role: "assistant", content: assistantText };
                return copy;
              });
            }
          } catch {}
        }
      }
    } catch (e: any) {
      toast({ title: "Hiba", description: e?.message ?? String(e), variant: "destructive" });
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setStreaming(false);
      inputRef.current?.focus();
    }
  };

  const clear = () => { if (confirm("Törlöd a beszélgetést?")) { setMessages([]); localStorage.removeItem(STORAGE_KEY); } };

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] md:h-screen">
      <header className="border-b border-nf-border px-4 md:px-6 py-3 md:py-4 flex justify-between items-center gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Sparkles className="h-5 w-5 text-electric-300 shrink-0" />
          <div className="min-w-0">
            <h1 className="font-bold text-sm md:text-base">AI asszisztens</h1>
            <p className="text-[10px] md:text-xs text-nf-text-muted truncate">Lát mindent: partnereket, naplót, doksikat, naptárt.</p>
          </div>
        </div>
        {messages.length > 0 && <Button variant="outline" size="sm" onClick={clear} className="shrink-0"><Trash2 className="h-4 w-4" /> <span className="hidden sm:inline">Új</span></Button>}
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">

        {messages.length === 0 && (
          <div className="max-w-2xl mx-auto space-y-4 pt-8">
            <div className="text-center text-nf-text-muted">Próbáld ezeket:</div>
            <div className="grid gap-2">
              {QUICK.map((q) => (
                <button key={q} onClick={() => send(q)} className="text-left p-3 rounded-lg bg-nf-surface border border-nf-border hover:border-electric-300/50 transition-colors text-sm">{q}</button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <Card className={`max-w-3xl p-4 ${m.role === "user" ? "bg-electric-300/10 border-electric-300/30" : ""}`}>
              <div className="text-xs text-nf-text-muted mb-1">{m.role === "user" ? "Te" : "Asszisztens"}</div>
              <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown>{m.content || (streaming && i === messages.length - 1 ? "…" : "")}</ReactMarkdown>
              </div>
            </Card>
          </div>
        ))}
      </div>

      <div className="border-t border-nf-border p-3 md:p-4">
        <div className="max-w-4xl mx-auto flex gap-2">

          <Textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Kérdezz vagy adj feladatot…"
            rows={2}
            className="resize-none bg-nf-surface-alt border-nf-border"
            disabled={streaming}
          />
          <Button variant="neon" onClick={() => send()} disabled={streaming || !input.trim()}><Send className="h-4 w-4" /></Button>
        </div>
      </div>
    </div>
  );
}
