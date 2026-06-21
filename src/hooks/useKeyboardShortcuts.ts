import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Vim-szerű "G+<betű>" navigációs shortcutok az admin oldalakhoz.
 * G megnyomása után 1.2 mp-en belül a következő billentyű navigál.
 * Aktív input/textarea fókuszban nem fut.
 */
const MAP: Record<string, string> = {
  d: "/admin",
  i: "/admin/inbox",
  l: "/admin/leads",
  p: "/admin/partners",
  o: "/admin/outreach",
  t: "/admin/trends",
  k: "/admin/documents",
  c: "/admin/content",
  n: "/admin/calendar",
  r: "/admin/retro",
  b: "/admin/brand",
  a: "/admin/ai",
};

export function useKeyboardShortcuts() {
  const navigate = useNavigate();
  useEffect(() => {
    let gPressed = false;
    let timer: number | undefined;
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key.toLowerCase() === "g" && !gPressed) {
        gPressed = true;
        timer = window.setTimeout(() => { gPressed = false; }, 1200);
        return;
      }
      if (gPressed) {
        const key = e.key.toLowerCase();
        if (MAP[key]) {
          e.preventDefault();
          navigate(MAP[key]);
        }
        gPressed = false;
        if (timer) clearTimeout(timer);
      }
    };
    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
      if (timer) clearTimeout(timer);
    };
  }, [navigate]);
}

export const SHORTCUT_LABELS: Record<string, string> = {
  "/admin": "G D",
  "/admin/inbox": "G I",
  "/admin/leads": "G L",
  "/admin/partners": "G P",
  "/admin/outreach": "G O",
  "/admin/trends": "G T",
  "/admin/documents": "G K",
  "/admin/content": "G C",
  "/admin/calendar": "G N",
  "/admin/retro": "G R",
  "/admin/brand": "G B",
  "/admin/ai": "G A",
};
