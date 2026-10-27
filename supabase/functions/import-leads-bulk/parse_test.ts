import { assertEquals, assert } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { parseSheet, SHEETJS_VERSION } from "./parse.ts";

Deno.test("uses patched SheetJS >= 0.20.3", () => {
  const [maj, min, pat] = SHEETJS_VERSION.split(".").map(Number);
  assert(maj > 0 || min > 20 || (min === 20 && pat >= 3), `got ${SHEETJS_VERSION}`);
});

Deno.test("parses a small CSV fixture without side effects", () => {
  const csv = "cégnév,város,telefon\nTeszt Bár,Budapest,+36 70 000 0000\nMásik Kávézó,Szeged,\n";
  const rows = parseSheet(new TextEncoder().encode(csv));
  assertEquals(rows.length, 2);
  assertEquals(rows[0]["cégnév"], "Teszt Bár");
  assertEquals(rows[1]["város"], "Szeged");
});

Deno.test("prototype-polluting header does not pollute Object.prototype", () => {
  const rows = parseSheet(new TextEncoder().encode("__proto__,name\nx,y\n"));
  assertEquals(rows.length, 1);
  assertEquals(({} as Record<string, unknown>).polluted, undefined);
  assertEquals(Object.prototype.hasOwnProperty.call(Object.prototype, "x"), false);
});
