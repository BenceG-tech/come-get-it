import { toCsv } from "@/lib/csv-safety";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function exportRowsAsCsv(rows: any[], columns: { key: string; label: string }[], filename = "export.csv") {
  const csv = `\uFEFF${toCsv([columns.map((c) => c.label), ...rows.map((r) => columns.map((c) => r[c.key]))])}`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}
