// CSV export hardening: values from the database (including old imports and phone fields)
// are neutralized at the export boundary so spreadsheets never evaluate them as formulas.

const PHONE = /^\+?\d[\d\s()\-/]*$/;

/** Prefix formula triggers (= + - @ tab CR) with an apostrophe; plain phone numbers stay readable. */
export function neutralizeCsvFormula(value: string): string {
  if (PHONE.test(value)) return value;
  return /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
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
