// CSV export hardening: values from the database (including old imports and phone fields)
// are neutralized at the export boundary so spreadsheets never evaluate them as formulas.

// A cell is dangerous if it starts with a formula trigger, or with a tab/CR/LF, or if
// leading whitespace is followed by a trigger (spreadsheets may trim before evaluating).
// Phone numbers like "+36 ..." are prefixed too: the apostrophe keeps them readable as text.
const FORMULA_LEADING = /^(?:[\t\r\n]|[ \u00a0\u3000\t\r\n]*[=+\-@\uff1d\uff0b\uff0d\uff20])/;

/** Prefix formula-leading values with an apostrophe. The original value is never trimmed. */
export function neutralizeCsvFormula(value: string): string {
  return FORMULA_LEADING.test(value) ? `'${value}` : value;
}

/** Convert any value into one safe, quoted-when-needed CSV cell. */
export function toCsvCell(value: unknown): string {
  if (value == null) return "";
  const raw =
    typeof value === "string" ? value
    : Array.isArray(value) ? value.join("|")
    : typeof value === "object" ? JSON.stringify(value)
    : String(value);
  const s = neutralizeCsvFormula(raw);
  return /[",\n\r;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCsv(rows: unknown[][]): string {
  return rows.map((r) => r.map(toCsvCell).join(",")).join("\n");
}
