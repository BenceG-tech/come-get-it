// Pure input/output sanitizers shared by edge functions (unit-tested in sanitize_test.ts).

export type ChatMessage = { role: "user" | "assistant"; content: string | unknown[] };

/** Keep only plain user/assistant turns; drop system/tool/unknown roles and odd content. */
export function filterChatHistory(input: unknown, max = 40, maxChars = 8000): ChatMessage[] {
  if (!Array.isArray(input)) return [];
  return input
    .filter((m: any) => m && (m.role === "user" || m.role === "assistant") &&
      (typeof m.content === "string" || Array.isArray(m.content)))
    .map((m: any) => ({ role: m.role, content: typeof m.content === "string" ? m.content.slice(0, maxChars) : m.content }))
    .slice(-max);
}

export function escapeHtml(s: string): string {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

/** Single-line, length-capped email subject (prevents header injection). */
export function safeSubject(s: string): string {
  return String(s).replace(/[\r\n]+/g, " ").slice(0, 200);
}

const PHONE = /^\+?\d[\d\s()\-\/]*$/;
/** Prefix spreadsheet-formula triggers with an apostrophe; plain phone numbers stay as-is. */
export function neutralizeFormula(v: string): string {
  if (PHONE.test(v)) return v;
  return /^[=+\-@\t\r]/.test(v) ? `'${v}` : v;
}
