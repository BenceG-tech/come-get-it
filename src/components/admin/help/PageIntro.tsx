import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Lightbulb, X } from "lucide-react";
import { ADMIN_PAGE_HELP, type AdminPageHelpKey } from "@/lib/admin-help-content";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Props {
  slug: AdminPageHelpKey;
  className?: string;
}

/**
 * Minden admin oldal tetején: célja, kinek szól, teendők, kapcsolat a szeptemberi misszióhoz.
 * "Ne mutasd újra" toggle (localStorage), újra megnyitható mini "?" gombbal.
 */
export default function PageIntro({ slug, className }: Props) {
  const content = ADMIN_PAGE_HELP[slug];
  const storageKey = `admin-page-intro-hidden:${slug}`;
  // Alapból REJTVE — kevesebb zaj az admin oldalakon. A "?" chip újranyitja.
  const [hidden, setHidden] = useState(true);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Csak akkor nyitjuk meg automatikusan, ha a user explicit megnyitotta korábban (storageKey == "0").
    const v = window.localStorage.getItem(storageKey);
    setHidden(v !== "0");
  }, [storageKey]);

  if (!content) return null;

  if (hidden) {
    return (
      <button
        onClick={() => {
          window.localStorage.setItem(storageKey, "0");
          setHidden(false);
          setOpen(true);
        }}
        className={cn("inline-flex items-center gap-1 text-[11px] text-nf-text-muted hover:text-electric-300 transition-colors", className)}
      >
        <Lightbulb className="h-3 w-3" /> Mire való ez az oldal?
      </button>
    );
  }

  return (
    <div className={cn("rounded-xl border border-electric-300/30 bg-electric-300/5 overflow-hidden", className)}>
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-electric-300/20">
        <Lightbulb className="h-4 w-4 text-electric-300 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-[10px] uppercase tracking-widest text-electric-300">Mire való ez az oldal?</div>
          <div className="text-sm font-semibold text-white truncate">{content.title}</div>
        </div>
        {content.phase && (
          <Badge variant="outline" className="text-[9px] border-electric-300/40 text-electric-300 shrink-0">
            {content.phase}
          </Badge>
        )}
        <button
          onClick={() => setOpen((o) => !o)}
          className="p-1 text-nf-text-muted hover:text-white"
          aria-label={open ? "Összecsukás" : "Kinyitás"}
        >
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        <button
          onClick={() => {
            window.localStorage.setItem(storageKey, "1");
            setHidden(true);
          }}
          className="p-1 text-nf-text-muted hover:text-white"
          aria-label="Bezárás"
          title="Bezárás"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      {open && (
        <div className="px-4 py-3 space-y-3 text-xs">
          {content.purpose && (
            <div>
              <div className="text-[10px] uppercase tracking-wider text-nf-text-muted mb-0.5">Cél</div>
              <p className="text-white/90 leading-relaxed">{content.purpose}</p>
            </div>
          )}
          {content.audience && (
            <div>
              <div className="text-[10px] uppercase tracking-wider text-nf-text-muted mb-0.5">Kinek</div>
              <p className="text-nf-text-muted leading-relaxed">{content.audience}</p>
            </div>
          )}
          {content.todos && content.todos.length > 0 && (
            <div>
              <div className="text-[10px] uppercase tracking-wider text-emerald-400 mb-1">Teendők</div>
              <ul className="space-y-0.5 text-white/85">
                {content.todos.map((t, i) => (
                  <li key={i} className="flex gap-1.5">
                    <span className="text-electric-300">›</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {content.missionLink && (
            <div className="pt-2 border-t border-electric-300/20 text-[11px] text-electric-300/90">
              🎯 <b>Szeptemberi misszió:</b> {content.missionLink}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
