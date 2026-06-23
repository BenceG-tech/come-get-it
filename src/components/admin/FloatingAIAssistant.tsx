import { useEffect, useRef, useState } from "react";
import { Sparkles, X, Send, Paperclip, Plus, Copy, Maximize2, MessageSquare, Trash2, BookmarkPlus, History } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAIAssistant } from "@/contexts/AIAssistantContext";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import ReactMarkdown from "react-markdown";
import VoiceRecorderButton from "./VoiceRecorderButton";
import { cn } from "@/lib/utils";
import { celebrate } from "@/lib/confetti";
import { loadThreads, saveThreads, newThreadId, deriveTitle, type Thread, type ThreadMsg } from "@/lib/ai-threads";

const FUNCTIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-ai-chat`;
const SAVE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-ai-save-conversation`;

const SUGGESTIONS = [
  "Mit posztoljak ma a Come Get It Instagramján?",
  "Írj egy IG DM-et egy budapesti specialty kávézónak.",
  "Foglald össze a heti haladást.",
  "Kit hívjak ma vissza?",
];

export default function FloatingAIAssistant({ hideLauncher = false }: { hideLauncher?: boolean } = {}) {
  const { isAdmin } = useIsAdmin();
  const { isOpen, open, close, attachments, removeAttachment, clearAttachments, pendingPrompt, setPendingPrompt } = useAIAssistant();

  // Thread state (localStorage)
  const [threads, setThreadsState] = useState<Thread[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [saving, setSaving] = useState(false);
  const [critique, setCritique] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  // Bootstrapping: load threads on first open
  useEffect(() => {
    if (typeof window === "undefined") return;
    const loaded = loadThreads();
    setThreadsState(loaded);
    if (loaded.length > 0) setActiveId(loaded[0].id);
  }, []);

  const active = threads.find((t) => t.id === activeId) ?? null;
  const messages: ThreadMsg[] = active?.messages ?? [];

  const persist = (next: Thread[]) => {
    setThreadsState(next);
    saveThreads(next);
  };

  const upsertActive = (updater: (t: Thread) => Thread) => {
    setThreadsState((prev) => {
      let id = activeId;
      let nextList: Thread[];
      const idx = prev.findIndex((t) => t.id === id);
      if (idx === -1) {
        // create new
        const fresh: Thread = updater({ id: newThreadId(), title: "Új beszélgetés", updatedAt: Date.now(), messages: [], conversationId: null });
        nextList = [fresh, ...prev];
        id = fresh.id;
        setActiveId(id);
      } else {
        const updated = updater(prev[idx]);
        nextList = [updated, ...prev.filter((_, i) => i !== idx)];
      }
      saveThreads(nextList);
      return nextList;
    });
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, streaming]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen, activeId]);

  useEffect(() => {
    if (pendingPrompt && isOpen) {
      setInput(pendingPrompt);
      setPendingPrompt(null);
    }
  }, [pendingPrompt, isOpen, setPendingPrompt]);

  const ensureServerConversation = async (firstMessage: string): Promise<string | null> => {
    if (active?.conversationId) return active.conversationId;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data } = await supabase
      .from("ai_conversations")
      .insert({ user_id: user.id, title: firstMessage.slice(0, 60) })
      .select("id")
      .single();
    return data?.id ?? null;
  };

  const newChat = () => {
    const fresh: Thread = { id: newThreadId(), title: "Új beszélgetés", updatedAt: Date.now(), messages: [], conversationId: null };
    const next = [fresh, ...threads];
    persist(next);
    setActiveId(fresh.id);
    setInput("");
    clearAttachments();
    setShowHistory(false);
  };

  const deleteThread = (id: string) => {
    const next = threads.filter((t) => t.id !== id);
    persist(next);
    if (activeId === id) setActiveId(next[0]?.id ?? null);
  };

  const send = async (overrideText?: string) => {
    const text = (overrideText ?? input).trim();
    if (!text || streaming) return;

    const cid = await ensureServerConversation(text);
    const userMsg: ThreadMsg = { role: "user", content: text };

    upsertActive((t) => ({
      ...t,
      conversationId: t.conversationId ?? cid,
      messages: [...t.messages, userMsg],
      title: t.messages.length === 0 ? deriveTitle([...t.messages, userMsg]) : t.title,
      updatedAt: Date.now(),
    }));
    setInput("");
    setStreaming(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Nincs bejelentkezett user");

      const currentMessages = [...(active?.messages ?? []), userMsg];
      const res = await fetch(FUNCTIONS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({
          conversationId: cid,
          critique,
          attachedDocIds: attachments.filter((a) => a.kind === "doc").map((a) => a.id),
          messages: currentMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      if (!res.ok) {
        const t = await res.text();
        let pretty = t;
        try {
          const j = JSON.parse(t);
          pretty = j?.body ? JSON.parse(j.body)?.message ?? j.body : j?.error ?? t;
        } catch {}
        throw new Error(`AI hiba (${res.status}): ${String(pretty).slice(0, 200)}`);
      }

      // optimistic empty assistant message
      upsertActive((t) => ({ ...t, messages: [...t.messages, { role: "assistant", content: "" }], updatedAt: Date.now() }));

      const reader = res.body!.getReader();
      const dec = new TextDecoder();
      let acc = "";
      let buf = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          const data = line.slice(5).trim();
          if (data === "[DONE]") continue;
          try {
            const j = JSON.parse(data);
            const delta = j?.choices?.[0]?.delta?.content;
            if (delta) {
              acc += delta;
              upsertActive((t) => {
                const msgs = [...t.messages];
                msgs[msgs.length - 1] = { role: "assistant", content: acc };
                return { ...t, messages: msgs, updatedAt: Date.now() };
              });
            }
          } catch {}
        }
      }
    } catch (e: any) {
      toast({ title: "Hiba", description: e?.message ?? String(e), variant: "destructive" });
      upsertActive((t) => ({ ...t, messages: t.messages.slice(0, -1) }));
    } finally {
      setStreaming(false);
      inputRef.current?.focus();
    }
  };

  const saveAsDoc = async () => {
    if (!active || active.messages.length === 0 || saving) return;
    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Nincs bejelentkezett user");
      const res = await fetch(SAVE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ title: active.title, messages: active.messages.map((m) => ({ role: m.role, content: m.content })) }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j?.error ?? "Mentés sikertelen");
      celebrate("small");
      toast({
        title: "📄 Doksiként mentve",
        description: j.title,
      });
    } catch (e: any) {
      toast({ title: "Hiba", description: e?.message ?? String(e), variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (!isAdmin) return null;

  return (
    <>
      {!hideLauncher && !isOpen && (
        <button
          onClick={open}
          aria-label="AI asszisztens megnyitása"
          className="fixed bottom-5 right-5 z-50 rounded-full bg-electric-300 text-black p-4 shadow-[0_0_24px_rgba(0,212,255,0.6)] hover:scale-105 transition-transform"
        >
          <Sparkles className="h-5 w-5" />
          {attachments.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full min-w-5 h-5 flex items-center justify-center px-1">
              {attachments.length}
            </span>
          )}
        </button>
      )}

      {isOpen && (
        <div
          className={cn(
            "fixed z-50 bg-nf-surface border border-nf-border shadow-2xl flex flex-col",
            "inset-0 md:inset-auto md:bottom-5 md:right-5 md:w-[460px] md:h-[680px] md:rounded-2xl",
          )}
        >
          <header className="flex items-center gap-2 px-3 py-2.5 border-b border-nf-border">
            <Sparkles className="h-4 w-4 text-electric-300 shrink-0" />
            <span className="font-bold text-sm flex-1 truncate" title={active?.title}>{active?.title ?? "AI asszisztens"}</span>
            <label className="flex items-center gap-1.5 text-[11px] text-nf-text-muted">
              <Switch checked={critique} onCheckedChange={setCritique} />
              v1+v2
            </label>
            <button onClick={() => setShowHistory((v) => !v)} className={cn("p-1.5 rounded-md hover:bg-nf-surface-alt", showHistory && "bg-nf-surface-alt text-electric-300")} title="Beszélgetések">
              <History className="h-4 w-4" />
            </button>
            <button onClick={newChat} className="p-1.5 rounded-md hover:bg-nf-surface-alt" title="Új beszélgetés">
              <Plus className="h-4 w-4" />
            </button>
            <button
              onClick={saveAsDoc}
              disabled={!active || active.messages.length === 0 || saving}
              className="p-1.5 rounded-md hover:bg-nf-surface-alt disabled:opacity-30"
              title="Mentés doksiként"
            >
              <BookmarkPlus className="h-4 w-4" />
            </button>
            <Link to="/admin/ai" onClick={close} className="p-1.5 rounded-md hover:bg-nf-surface-alt" title="Teljes nézet">
              <Maximize2 className="h-4 w-4" />
            </Link>
            <button onClick={close} className="p-1.5 rounded-md hover:bg-nf-surface-alt" title="Bezár">
              <X className="h-4 w-4" />
            </button>
          </header>

          {/* History drawer */}
          {showHistory && (
            <div className="border-b border-nf-border bg-nf-surface-alt/40 max-h-48 overflow-y-auto">
              {threads.length === 0 ? (
                <div className="p-3 text-xs text-nf-text-muted text-center">Még nincs mentett beszélgetés.</div>
              ) : (
                <ul className="divide-y divide-nf-border">
                  {threads.map((t) => (
                    <li key={t.id} className={cn("flex items-center gap-2 px-3 py-2 hover:bg-nf-surface-alt", t.id === activeId && "bg-electric-300/10")}>
                      <button
                        onClick={() => { setActiveId(t.id); setShowHistory(false); }}
                        className="flex-1 text-left min-w-0"
                      >
                        <div className="text-xs font-medium truncate">{t.title}</div>
                        <div className="text-[10px] text-nf-text-muted">{new Date(t.updatedAt).toLocaleString("hu-HU")} · {t.messages.length} üzenet</div>
                      </button>
                      <button
                        onClick={() => deleteThread(t.id)}
                        className="text-nf-text-muted hover:text-red-400 p-1"
                        title="Törlés"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {attachments.length > 0 && (
            <div className="px-3 py-2 border-b border-nf-border bg-nf-surface-alt/40 flex flex-wrap gap-1.5">
              <span className="text-[11px] text-nf-text-muted self-center">
                <Paperclip className="h-3 w-3 inline mr-1" />
                {attachments.length} csatolt:
              </span>
              {attachments.map((a) => (
                <span key={a.id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] bg-electric-300/10 text-electric-300 border border-electric-300/30">
                  {a.title.slice(0, 24)}
                  <button onClick={() => removeAttachment(a.id)} className="hover:text-red-400">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-nf-text-muted text-xs pt-6 space-y-4">
                <p>{critique ? "🎯 Önellenőrző: v1 + pontszám + v2" : "Kérdezz vagy adj feladatot."}</p>
                <div className="flex flex-col gap-1.5 max-w-xs mx-auto">
                  <div className="text-[10px] uppercase tracking-wider text-nf-text-muted">Gyors kezdés</div>
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="text-left px-3 py-2 rounded-lg bg-nf-surface-alt hover:bg-electric-300/10 hover:text-electric-300 border border-nf-border text-xs transition-colors"
                    >
                      <MessageSquare className="h-3 w-3 inline mr-1.5 opacity-60" />
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={cn(
                    "max-w-[90%] p-2.5 rounded-lg text-sm",
                    m.role === "user"
                      ? "bg-electric-300/10 border border-electric-300/30 text-white"
                      : "bg-nf-surface-alt border border-nf-border",
                  )}
                >
                  <div className="prose prose-invert prose-sm max-w-none [&_p]:my-1 [&_table]:text-xs">
                    <ReactMarkdown>{m.content || (streaming && i === messages.length - 1 ? "…" : "")}</ReactMarkdown>
                  </div>
                  {m.role === "assistant" && m.content && (
                    <button
                      onClick={() => { navigator.clipboard.writeText(m.content); toast({ title: "Másolva" }); }}
                      className="mt-1 text-[10px] text-nf-text-muted hover:text-electric-300 inline-flex items-center gap-1"
                    >
                      <Copy className="h-3 w-3" /> Másol
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-nf-border p-2 flex items-end gap-1.5">
            <VoiceRecorderButton
              onTranscript={(t) => setInput((prev) => (prev ? `${prev} ${t}` : t))}
              onInterim={(t) => setInput(t)}
            />
            <Textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Üzenet vagy diktálj…"
              rows={1}
              className="resize-none bg-nf-surface-alt border-nf-border min-h-9 text-sm"
              disabled={streaming}
            />
            <Button variant="neon" size="icon" onClick={() => send()} disabled={streaming || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
