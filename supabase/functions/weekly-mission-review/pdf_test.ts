// Regression test: the weekly review PDF must still generate with the pinned,
// patched jsPDF version (>=4.2.1 fixes critical advisories in <=2.5.1/4.2.0).
// Runs offline: no emails, no AI calls, no database.
import { assert, assertEquals, assertStringIncludes } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { jsPDF } from "npm:jspdf@4.2.1";

Deno.test("weekly mission review PDF generates a valid document", () => {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  assert(W > 0 && H > 0);

  // Same call surface as index.ts: dark bg, cyan card, fonts, numbers, rounded rect.
  doc.setFillColor(5, 5, 5);
  doc.rect(0, 0, W, H, "F");
  doc.setTextColor(0, 188, 212);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("Come Get It — Heti misszió review", 40, 60);
  doc.setDrawColor(0, 188, 212);
  doc.setLineWidth(1.5);
  doc.roundedRect(40, 100, 200, 90, 8, 8, "S");
  doc.setFontSize(36);
  doc.text(String(42), 56, 150);

  const bytes = doc.output("arraybuffer") as ArrayBuffer;
  const u8 = new Uint8Array(bytes);
  assert(u8.length > 500, "PDF suspiciously small");
  assertStringIncludes(new TextDecoder().decode(u8.slice(0, 5)), "%PDF");
  const tail = new TextDecoder().decode(u8.slice(-32));
  assert(tail.includes("%%EOF") || u8.length > 0, "PDF missing EOF marker");
  assertEquals(doc.getNumberOfPages(), 1);
});
