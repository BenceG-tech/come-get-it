import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { NAV_GROUPS } from "@/lib/admin-nav-config";
import { supabase } from "@/integrations/supabase/client";

type Crumb = { label: string; to?: string };

/**
 * Globális admin breadcrumb.
 * Forrás: route segmensek → NAV_GROUPS matching → ha entitás detail (partner/doksi), címkérés.
 */
export default function AdminBreadcrumb() {
  const location = useLocation();
  const params = useParams();
  const [entityLabel, setEntityLabel] = useState<string | null>(null);

  const segments = location.pathname.split("/").filter(Boolean); // e.g. ['admin','partners','abc-123']
  const hasEntityId = segments.length >= 3 && (segments[1] === "partners" || segments[1] === "documents");
  const entityKind = hasEntityId ? segments[1] : null;
  const entityId = hasEntityId ? segments[2] : null;

  useEffect(() => {
    if (!entityKind || !entityId) {
      setEntityLabel(null);
      return;
    }
    let cancel = false;
    (async () => {
      if (entityKind === "partners") {
        const { data } = await supabase.from("partners").select("company_name").eq("id", entityId).maybeSingle();
        if (!cancel) setEntityLabel((data as any)?.company_name ?? null);
      } else if (entityKind === "documents") {
        const { data } = await supabase.from("documents").select("title").eq("id", entityId).maybeSingle();
        if (!cancel) setEntityLabel((data as any)?.title ?? null);
      }
    })();
    return () => { cancel = true; };
  }, [entityKind, entityId]);

  // Build crumbs
  const crumbs: Crumb[] = [{ label: "Admin", to: "/admin" }];

  if (location.pathname !== "/admin") {
    // Find matching nav group + item
    let matchedItem: { to: string; label: string } | null = null;
    let matchedGroup: { label: string } | null = null;
    for (const g of NAV_GROUPS) {
      for (const it of g.items) {
        const matches = it.end ? location.pathname === it.to : location.pathname.startsWith(it.to);
        if (matches && (!matchedItem || it.to.length > matchedItem.to.length)) {
          matchedItem = { to: it.to, label: it.label };
          matchedGroup = { label: g.label };
        }
      }
    }

    if (matchedGroup) crumbs.push({ label: matchedGroup.label });
    if (matchedItem) crumbs.push({ label: matchedItem.label, to: matchedItem.to });

    // Entity tail
    if (entityId) {
      crumbs.push({ label: entityLabel ?? "…" });
    }
  }

  if (crumbs.length <= 1) return null;

  return (
    <nav aria-label="Breadcrumb" className="hidden md:flex items-center gap-1 text-xs text-nf-text-muted overflow-hidden">
      {crumbs.map((c, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <div key={i} className="flex items-center gap-1 min-w-0">
            {i > 0 && <ChevronRight className="h-3 w-3 shrink-0 opacity-50" />}
            {i === 0 && <Home className="h-3 w-3 shrink-0" />}
            {c.to && !isLast ? (
              <Link to={c.to} className="hover:text-electric-300 transition-colors truncate">{c.label}</Link>
            ) : (
              <span className={isLast ? "text-white truncate" : "truncate"}>{c.label}</span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
