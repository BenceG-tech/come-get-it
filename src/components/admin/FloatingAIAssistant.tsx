import { useEffect, useRef, useState } from "react";
import { Sparkles, X, Send, Paperclip, RefreshCw, Copy, Maximize2 } from "lucide-react";
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

type Msg = { role: "user" | "assistant"; content: string };

const FUNCTIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-ai-chat`;

export default function FloatingAIAssistant() {
  const { isAdmin } = useIsAdmin();
  const { isOpen, open, close, toggle, attachments, removeAttachment, clearAttachments, pendingPrompt, setPendingPrompt } = useAIAssistant();
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [critique, setCritique] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, streaming]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  // If a pending prompt comes in via context (e.g. "use these N docs"), prefill
  useEffect(() => {
    if (pendingPrompt && isOpen) {
      setInput(pendingPrompt);
      setPendingPrompt(null);
    }
  }, [pendingPrompt, isOpen, setPendingPrompt]);

  const ensureConversation = async (firstMessage: string): Promise<string | null> => {
    if (conversationId) return conversationId;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data, error } = await supabase
      .from("ai_conversations")
      .insert({ user_id: user.id, title: firstMessage.slice(0, 60) })
      .select("id")
      .single();
    if (error || !data) return null;
    setConversationId(data.id);
    return data.id;
  };

  const newChat = () => {
    setConversationId(null);
    setMessages([]);
    setInput("");
    clearAttachments();
  };

  const send = async () => {
    const text = input.trim();
    if (!text || streaming) return;
    const cid = await ensureConversation(text);
    const next: Msg[] = [...messages, { role: "user", content: text }];
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
          conversationId: cid,
          critique,
          attachedDocIds: attachments.filter((a) => a.kind === "doc").map((a) => a.id),
          messages: next.map((m) => ({ role: m.role, content: m.content })),
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
      const reader = res.body!.getReader();
      const dec = new TextDecoder();
      let acc = "";
      setMessages([...next, { role: "assistant", content: "" }]);
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
              setMessages((p) => {
                const copy = [...p];
                copy[copy.length - 1] = { role: "assistant", content: acc };
                return copy;
              });
            }
          } catch {}
        }
      }
    } catch (e: any) {
      toast({ title: "Hiba", description: e?.message ?? String(e), variant: "destructive" });
      setMessages((p) => p.slice(0, -1));
    } finally {
      setStreaming(false);
      inputRef.current?.focus();
    }
  };

  if (!isAdmin) return null;

  return (
    <>
      {/* Floating launcher */}
      {!isOpen && (
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

      {/* Panel */}
      {isOpen && (
        <div
          className={cn(
            "fixed z-50 bg-nf-surface border border-nf-border shadow-2xl flex flex-col",
            "inset-0 md:inset-auto md:bottom-5 md:right-5 md:w-[420px] md:h-[640px] md:rounded-2xl",
          )}
        >
          <header className="flex items-center gap-2 px-4 py-3 border-b border-nf-border">
            <Sparkles className="h-4 w-4 text-electric-300 shrink-0" />
            <span className="font-bold text-sm flex-1">AI asszisztens</span>
            <label className="flex items-center gap-1.5 text-[11px] text-nf-text-muted">
              <Switch checked={critique} onCheckedChange={setCritique} />
              v1+v2
            </label>
            <button onClick={newChat} className="text-nf-text-muted hover:text-electric-300 p-1" title="Új beszélgetés">
              <RefreshCw className="h-4 w-4" />
            </button>
            <Link to="/admin/ai" onClick={close} className="text-nf-text-muted hover:text-electric-300 p-1" title="Teljes nézet">
              <Maximize2 className="h-4 w-4" />
            </Link>
            <button onClick={close} className="text-nf-text-muted hover:text-white p-1" title="Bezár">
              <X className="h-4 w-4" />
            </button>
          </header>

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
              <div className="text-center text-nf-text-muted text-xs pt-8 space-y-3">
                <p>{critique ? "🎯 Önellenőrző: v1 + pontszám + v2" : "Kérdezz vagy adj feladatot."}</p>
                <p className="text-[11px]">Tipp: jelölj ki doksikat a Dokumentumok oldalon, és kattints „AI-val dolgozz velük"-re.</p>
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
            <Button variant="neon" size="icon" onClick={send} disabled={streaming || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
