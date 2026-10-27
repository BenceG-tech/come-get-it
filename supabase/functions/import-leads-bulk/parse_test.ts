import { assertEquals, assert } from "https://deno.land/std@0.224.0/assert/mod.ts";
import * as XLSX from "./xlsx-0.20.3.mjs";
import { parseSheet, SHEETJS_VERSION } from "./parse.ts";

Deno.test("uses patched SheetJS >= 0.20.3", () => {
  const [maj, min, pat] = SHEETJS_VERSION.split(".").map(Number);
  assert(maj > 0 || min > 20 || (min === 20 && pat >= 3), `got ${SHEETJS_VERSION}`);
});

Deno.test("parses a small CSV fixture without side effects", () => {
  const csv = "company_name,city,phone\nTeszt Bar,Budapest,+36 70 000 0000\nMasik Kavezo,Szeged,\n";
  const rows = parseSheet(new TextEncoder().encode(csv));
  assertEquals(rows.length, 2);
  assertEquals(rows[0].company_name, "Teszt Bar");
  assertEquals(rows[1].city, "Szeged");
});

Deno.test("parses a small XLSX fixture with Hungarian headers", () => {
  const ws = XLSX.utils.aoa_to_sheet([["cégnév", "város"], ["Teszt Bár", "Győr"]]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Leads");
  const bytes = XLSX.write(wb, { type: "array", bookType: "xlsx" }) as ArrayBuffer;
  const rows = parseSheet(bytes);
  assertEquals(rows, [{ "cégnév": "Teszt Bár", "város": "Győr" }]);
});

Deno.test("prototype-polluting header does not pollute Object.prototype", () => {
  const rows = parseSheet(new TextEncoder().encode("__proto__,name\nx,y\n"));
  assertEquals(rows.length, 1);
  assertEquals(({} as Record<string, unknown>).polluted, undefined);
  assertEquals(Object.prototype.hasOwnProperty.call(Object.prototype, "x"), false);
});
