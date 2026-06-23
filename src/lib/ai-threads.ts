/**
 * AI chat thread persistence (localStorage).
 * Egyszerű, per-böngésző tárolás — később DB-be is mehet.
 */
export type ThreadMsg = { role: "user" | "assistant"; content: string };
export type Thread = {
  id: string;
  title: string;
  updatedAt: number;
  messages: ThreadMsg[];
  conversationId?: string | null; // szerver oldali ai_conversations.id, ha van
};

const KEY = "cgi.admin.ai.threads.v1";
const MAX_THREADS = 30;

export function loadThreads(): Thread[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function saveThreads(threads: Thread[]) {
  if (typeof window === "undefined") return;
  const trimmed = [...threads]
    .sort((a, b) => b.updatedAt - a.updatedAt)
    .slice(0, MAX_THREADS);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(trimmed));
  } catch {}
}

export function newThreadId(): string {
  return `t_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function deriveTitle(messages: ThreadMsg[]): string {
  const first = messages.find((m) => m.role === "user");
  if (!first) return "Új beszélgetés";
  return first.content.slice(0, 50).trim() || "Új beszélgetés";
}
