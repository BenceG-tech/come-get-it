import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Mail } from "lucide-react";

function fill(template: string, vars: Record<string, string>) {
  return (template ?? "").replace(/\{\{(\w+)\}\}/g, (_, k) => vars[k] ?? `{{${k}}}`);
}

export default function EmailPreviewCard({
  subject, preheader, body, vars,
}: {
  subject: string; preheader?: string; body: string; vars: Record<string, string>;
}) {
  const [light, setLight] = useState(false);
  const s = fill(subject, vars);
  const p = fill(preheader ?? "", vars);
  const b = fill(body, vars);

  return (
    <Card className={`overflow-hidden border ${light ? "bg-white border-zinc-200" : "bg-nf-bg border-nf-border"}`}>
      <div className={`flex items-center justify-between px-3 py-2 border-b ${light ? "border-zinc-200 bg-zinc-50" : "border-nf-border bg-nf-surface/60"}`}>
        <div className={`flex items-center gap-2 text-xs ${light ? "text-zinc-600" : "text-nf-text-muted"}`}>
          <Mail className="h-3.5 w-3.5" /> Élő előnézet
        </div>
        <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => setLight((v) => !v)}>
          {light ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
        </Button>
      </div>
      <div className={`p-4 space-y-2 ${light ? "text-zinc-900" : "text-white"}`}>
        <div className={`text-xs ${light ? "text-zinc-500" : "text-nf-text-muted"}`}>From: Bence — Come Get It &lt;hello@come-get-it.app&gt;</div>
        <div className="font-semibold text-sm">{s || <span className="opacity-50">(üres subject)</span>}</div>
        {p && <div className={`text-xs ${light ? "text-zinc-500" : "text-nf-text-muted"} italic`}>{p}</div>}
        <hr className={light ? "border-zinc-200" : "border-nf-border"} />
        <pre className={`whitespace-pre-wrap font-sans text-sm leading-relaxed ${light ? "text-zinc-800" : "text-white/90"}`}>
          {b || <span className="opacity-50">(üres body)</span>}
        </pre>
      </div>
    </Card>
  );
}
