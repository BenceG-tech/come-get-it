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

// Mirrors src/lib/csv-safety.ts: any formula-leading value (including phone-like strings
// such as "+1/0" and whitespace-prefixed triggers) gets an apostrophe. Stored data can
// bypass import checks, so exports re-neutralize too.
const FORMULA_LEADING = /^(?:[\t\r\n]|[ \u00a0\u3000\t\r\n]*[=+\-@＝＋－＠])/;
export function neutralizeFormula(v: string): string {
  return FORMULA_LEADING.test(v) ? `'${v}` : v;
}

/** Mask an email for server logs: keeps first char of local part and domain, hides the rest. */
export function maskEmail(email: string): string {
  const at = email.indexOf("@");
  if (at < 1) return "***";
  const local = email.slice(0, at);
  const domain = email.slice(at + 1);
  const dot = domain.lastIndexOf(".");
  const host = dot > 0 ? domain.slice(0, dot) : domain;
  const tld = dot > 0 ? domain.slice(dot) : "";
  return `${local.slice(0, 1)}***@${host.slice(0, 1)}***${tld}`;
}
