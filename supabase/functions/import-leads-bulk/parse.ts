// Official patched SheetJS build (>= 0.20.3); the npm registry copy (0.18.5) is vulnerable
// to prototype pollution (GHSA-4r6h-8v6p-xvw6) and ReDoS (GHSA-5pgg-2g8v-p4x9).
import * as XLSX from "https://cdn.sheetjs.com/xlsx-0.20.3/package/xlsx.mjs";

export const SHEETJS_VERSION: string = XLSX.version;

/** Parse the first sheet of a CSV/XLSX buffer into row objects. No side effects. */
export function parseSheet(buf: ArrayBuffer | Uint8Array): Record<string, unknown>[] {
  const wb = XLSX.read(buf, { type: "array" });
  const ws = wb.Sheets[wb.SheetNames[0]];
  if (!ws) return [];
  return XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { defval: "" });
}
