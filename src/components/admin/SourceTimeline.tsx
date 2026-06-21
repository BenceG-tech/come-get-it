import { ExternalLink, Globe } from "lucide-react";

interface Source {
  url?: string | null;
  title?: string | null;
  scraped_at?: string | null;
  label?: string | null;
}

interface Props {
  sources: Source[];
  className?: string;
  title?: string;
}

/**
 * Forrás-timeline: minden AI-insight alatt megmutatja "honnan tudjuk".
 * Favicont a Google s2 szolgáltatásból szed.
 */
export default function SourceTimeline({ sources, className = "", title = "Honnan tudjuk?" }: Props) {
  const valid = sources.filter(s => s.url || s.title);
  if (valid.length === 0) {
    return (
      <div className={`text-[10px] text-nf-text-muted italic ${className}`}>
        AI-szintézis élő webes forrás nélkül
      </div>
    );
  }
  return (
    <div className={`space-y-1 ${className}`}>
      <div className="text-[10px] uppercase tracking-wider text-nf-text-muted flex items-center gap-1">
        <Globe className="w-3 h-3" /> {title} ({valid.length})
      </div>
      <ul className="space-y-0.5">
        {valid.map((s, i) => {
          const host = s.url ? (() => { try { return new URL(s.url).hostname.replace(/^www\./, ""); } catch { return null; } })() : null;
          const favicon = host ? `https://www.google.com/s2/favicons?domain=${host}&sz=32` : null;
          return (
            <li key={i} className="flex items-center gap-1.5 text-[11px]">
              {favicon && <img src={favicon} alt="" className="w-3 h-3 shrink-0 rounded-sm" loading="lazy" />}
              {s.url ? (
                <a href={s.url} target="_blank" rel="noreferrer" className="text-electric-300 hover:underline inline-flex items-center gap-1 truncate flex-1">
                  <span className="truncate">{s.title || host || s.url}</span>
                  <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                </a>
              ) : (
                <span className="text-nf-text-muted truncate flex-1">{s.title || s.label}</span>
              )}
              {s.scraped_at && (
                <span className="text-[9px] text-nf-text-muted shrink-0">{new Date(s.scraped_at).toLocaleDateString("hu-HU")}</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
