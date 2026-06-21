import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Send, Sparkles, Plus, Trash2, MessageSquare, Menu, X, Copy, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";
import VoiceRecorderButton from "@/components/admin/VoiceRecorderButton";
import { cn } from "@/lib/utils";

type Msg = { id?: string; role: "user" | "assistant"; content: string };
type Thread = { id: string; title: string; updated_at: string };

const FUNCTIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-ai-chat`;

const QUICK = [
  "Kit keressek meg ma? Adj prioritást a follow-up dátumok alapján.",
  "Írj egy IG DM-et egy budapesti specialty kávézónak (founding partner ajánlat).",
  "Adj 4 hetes marketing tervet a vendéglátóhely-toborzáshoz.",
  "Írj egy IG posztot, ami vendéglátóhelyeket toboroz partnernek.",
];

export default function AdminAI() {
  const { threadId } = useParams<{ threadId?: string }>();
  const nav = useNavigate();
  const { toast } = useToast();

  const [threads, setThreads] = useState<Thread[]>([]);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [critique, setCritique] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loadingMsgs, setLoadingMsgs] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load threads list
  const loadThreads = async () => {
    const { data, error } = await supabase
      .from("ai_conversations")
      .select("id, title, updated_at")
      .order("updated_at", { ascending: false });
    if (error) { console.error(error); return; }
    setThreads(data ?? []);
  };

  useEffect(() => { loadThreads(); }, []);

  // Load messages when thread changes
  useEffect(() => {
    if (!threadId) { setMessages([]); return; }
    setLoadingMsgs(true);
    (async () => {
      const { data, error } = await supabase
        .from("ai_messages")
        .select("id, role, message")
        .eq("conversation_id", threadId)
        .order("created_at", { ascending: true });
      if (error) {
        toast({ title: "Hiba", description: error.message, variant: "destructive" });
        setLoadingMsgs(false);
        return;
      }
      const msgs: Msg[] = (data ?? []).map((r: any) => ({
        id: r.id,
        role: r.role,
        content: r.message?.content ?? "",
      }));
      setMessages(msgs);
      setLoadingMsgs(false);
    })();
  }, [threadId]);

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [messages, streaming]);
  useEffect(() => { inputRef.current?.focus(); }, [threadId]);
  useEffect(() => { setSidebarOpen(false); }, [threadId]);

  const newThread = async (firstMessage?: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast({ title: "Nincs bejelentkezve", variant: "destructive" }); return null; }
    const title = firstMessage ? firstMessage.slice(0, 60) : "Új beszélgetés";
    const { data, error } = await supabase
      .from("ai_conversations")
      .insert({ user_id: user.id, title })
      .select("id, title, updated_at")
      .single();
    if (error || !data) { toast({ title: "Hiba", description: error?.message, variant: "destructive" }); return null; }
    setThreads((prev) => [data, ...prev]);
    return data.id as string;
  };

  const createAndGo = async () => {
    const id = await newThread();
    if (id) nav(`/admin/ai/${id}`);
  };

  const deleteThread = async (id: string) => {
    if (!confirm("Törlöd ezt a beszélgetést?")) return;
    await supabase.from("ai_messages").delete().eq("conversation_id", id);
    const { error } = await supabase.from("ai_conversations").delete().eq("id", id);
    if (error) { toast({ title: "Hiba", description: error.message, variant: "destructive" }); return; }
    setThreads((prev) => prev.filter((t) => t.id !== id));
    if (threadId === id) nav("/admin/ai");
  };

  const renameThread = async (id: string, currentTitle: string) => {
    const next = prompt("Új cím:", currentTitle);
    if (!next || next === currentTitle) return;
    const { error } = await supabase.from("ai_conversations").update({ title: next }).eq("id", id);
    if (error) { toast({ title: "Hiba", description: error.message, variant: "destructive" }); return; }
    setThreads((prev) => prev.map((t) => (t.id === id ? { ...t, title: next } : t)));
  };

  const send = async (text?: string, asCritique?: boolean) => {
    const content = (text ?? input).trim();
    if (!content || streaming) return;

    let activeId = threadId;
    if (!activeId) {
      const id = await newThread(content);
      if (!id) return;
      activeId = id;
      nav(`/admin/ai/${id}`, { replace: true });
      // also rename based on first msg
    } else {
      // If first message of an existing empty thread, update title
      if (messages.length === 0) {
        await supabase.from("ai_conversations").update({ title: content.slice(0, 60) }).eq("id", activeId);
        setThreads((prev) => prev.map((t) => (t.id === activeId ? { ...t, title: content.slice(0, 60) } : t)));
      }
    }

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
        body: JSON.stringify({
          conversationId: activeId,
          critique: asCritique ?? critique,
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      if (!res.ok) {
        const t = await res.text();
        let pretty = t;
        try { const j = JSON.parse(t); pretty = j?.body ? (JSON.parse(j.body)?.message ?? j.body) : (j?.error ?? t); } catch {}
        throw new Error(`AI hiba (${res.status}): ${String(pretty).slice(0, 240)}`);
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
      loadThreads();
    } catch (e: any) {
      toast({ title: "Hiba", description: e?.message ?? String(e), variant: "destructive" });
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setStreaming(false);
      inputRef.current?.focus();
    }
  };

  const copyMsg = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast({ title: "Másolva" });
  };

  const regenerate = async () => {
    // Re-send last user message with critique on
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUser) return;
    // Remove last assistant message from UI + DB
    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.role === "assistant" && lastMsg.id) {
      await supabase.from("ai_messages").delete().eq("id", lastMsg.id);
    }
    setMessages((prev) => prev.filter((_, i) => !(i === prev.length - 1 && prev[i].role === "assistant")));
    // Re-send
    await send(lastUser.content, true);
  };

  const Sidebar = (
    <aside className="w-72 shrink-0 border-r border-nf-border bg-nf-surface h-full flex flex-col">
      <div className="p-3 border-b border-nf-border flex items-center justify-between">
        <span className="text-xs uppercase tracking-widest text-nf-text-muted">Beszélgetések</span>
        <button onClick={() => setSidebarOpen(false)} className="md:hidden text-nf-text-muted hover:text-white p-1">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="p-3">
        <Button variant="neon" size="sm" onClick={createAndGo} className="w-full">
          <Plus className="h-4 w-4" /> Új beszélgetés
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto px-2 pb-3 space-y-1">
        {threads.length === 0 && <div className="text-xs text-nf-text-muted px-2 py-4">Még nincs beszélgetés.</div>}
        {threads.map((t) => (
          <div
            key={t.id}
            className={cn(
              "group flex items-center gap-1 rounded-lg px-2 py-2 text-sm transition-colors cursor-pointer",
              threadId === t.id ? "bg-electric-300/15 text-electric-300" : "text-nf-text-muted hover:bg-nf-surface-alt hover:text-white"
            )}
            onClick={() => nav(`/admin/ai/${t.id}`)}
          >
            <MessageSquare className="h-3.5 w-3.5 shrink-0" />
            <span className="flex-1 truncate" onDoubleClick={(e) => { e.stopPropagation(); renameThread(t.id, t.title); }}>
              {t.title || "(névtelen)"}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); deleteThread(t.id); }}
              className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400"
              aria-label="Törlés"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </aside>
  );

  return (
    <div className="flex admin-fullh-safe bg-nf-bg text-white">
      {/* Desktop sidebar */}
      <div className="hidden md:flex">{Sidebar}</div>

      {/* Mobile drawer */}
      {sidebarOpen && (
        <>
          <div className="md:hidden fixed inset-0 z-40 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="md:hidden fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] shadow-2xl">{Sidebar}</div>
        </>
      )}

      {/* Main chat area */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="border-b border-nf-border px-3 md:px-6 py-3 flex items-center gap-2">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 -ml-2 text-white" aria-label="Beszélgetések">
            <Menu className="h-5 w-5" />
          </button>
          <Sparkles className="h-5 w-5 text-electric-300 shrink-0" />
          <div className="min-w-0 flex-1">
            <h1 className="font-bold text-sm md:text-base truncate">
              {threadId ? threads.find((t) => t.id === threadId)?.title || "Beszélgetés" : "AI asszisztens"}
            </h1>
            <p className="text-[10px] md:text-xs text-nf-text-muted truncate">Lát: partnerek, doksik, naptár. Threadek mentve.</p>
          </div>
          <label className="flex items-center gap-2 text-xs text-nf-text-muted cursor-pointer">
            <Switch checked={critique} onCheckedChange={setCritique} />
            <span className="hidden sm:inline">Önellenőrző</span>
            <span className="sm:hidden">v1+v2</span>
          </label>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {loadingMsgs && <div className="text-center text-nf-text-muted">Betöltés…</div>}

          {!loadingMsgs && messages.length === 0 && (
            <div className="max-w-2xl mx-auto space-y-4 pt-8">
              <div className="text-center text-nf-text-muted text-sm">
                {critique ? "🎯 Önellenőrző mód: minden szöveg v1 + pontszám + v2 formában." : "Próbáld ezeket:"}
              </div>
              <div className="grid gap-2">
                {QUICK.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="text-left p-3 rounded-lg bg-nf-surface border border-nf-border hover:border-electric-300/50 transition-colors text-sm"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={m.id ?? i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <Card className={`max-w-3xl p-4 ${m.role === "user" ? "bg-electric-300/10 border-electric-300/30" : ""}`}>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="text-xs text-nf-text-muted">{m.role === "user" ? "Te" : "Asszisztens"}</div>
                  {m.role === "assistant" && m.content && (
                    <div className="flex gap-1">
                      <button onClick={() => copyMsg(m.content)} className="text-nf-text-muted hover:text-electric-300 p-1" title="Másol">
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                      {i === messages.length - 1 && !streaming && (
                        <button onClick={regenerate} className="text-nf-text-muted hover:text-electric-300 p-1" title="Még jobb verzió">
                          <RefreshCw className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown>{m.content || (streaming && i === messages.length - 1 ? "…" : "")}</ReactMarkdown>
                </div>
              </Card>
            </div>
          ))}
        </div>

        <div className="border-t border-nf-border p-3 md:p-4">
          <div className="max-w-4xl mx-auto flex gap-2 items-end">
            <VoiceRecorderButton
              onTranscript={(t) => setInput((prev) => (prev ? `${prev} ${t}` : t))}
              onInterim={(t) => setInput(t)}
            />
            <Textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder={critique ? "Kérj egy szöveget (pitch, DM, email, poszt)…" : "Kérdezz, adj feladatot, vagy diktálj…"}
              rows={2}
              className="resize-none bg-nf-surface-alt border-nf-border"
              disabled={streaming}
            />
            <Button variant="neon" onClick={() => send()} disabled={streaming || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
