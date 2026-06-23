import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Pencil } from "lucide-react";

type Props = {
  table?: string;
  rowId: string;
  column: string;
  value: string | null;
  type?: "text" | "date";
  placeholder?: string;
  display?: (v: string | null) => React.ReactNode;
  onSaved?: (v: string | null) => void;
};

export default function InlineEditCell({
  table = "partners",
  rowId,
  column,
  value,
  type = "text",
  placeholder = "—",
  display,
  onSaved,
}: Props) {
  const [open, setOpen] = useState(false);
  const [val, setVal] = useState<string>(value ?? "");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const save = async () => {
    setSaving(true);
    const payload: any = { [column]: val.trim() === "" ? null : val };
    const { error } = await (supabase.from(table as any).update(payload).eq("id", rowId) as any);
    setSaving(false);
    if (error) {
      toast({ title: "Hiba", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Mentve" });
    onSaved?.(payload[column]);
    setOpen(false);
  };

  const rendered = display ? display(value) : (value || placeholder);
  const isEmpty = !value;

  return (
    <Popover open={open} onOpenChange={(o) => { setOpen(o); if (o) setVal(value ?? ""); }}>
      <PopoverTrigger asChild>
        <button
          className={`group inline-flex items-center gap-1 text-left hover:text-electric-300 transition ${isEmpty ? "text-nf-text-muted italic" : ""}`}
          title="Kattints a szerkesztéshez"
        >
          <span>{rendered}</span>
          <Pencil className="h-3 w-3 opacity-0 group-hover:opacity-60" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3 space-y-2" align="start">
        <Input
          type={type === "date" ? "date" : "text"}
          value={type === "date" && val ? val.slice(0, 10) : val}
          onChange={(e) => setVal(e.target.value)}
          placeholder={placeholder}
          autoFocus
          onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") setOpen(false); }}
        />
        <div className="flex justify-end gap-2">
          <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>Mégse</Button>
          <Button size="sm" variant="neon" onClick={save} disabled={saving}>{saving ? "…" : "Mentés"}</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
