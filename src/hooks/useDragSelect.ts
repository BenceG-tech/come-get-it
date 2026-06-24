import { useCallback, useRef } from "react";

/**
 * Gmail-style drag-to-toggle selection.
 * - mousedown on a row checkbox sets a "mode" (select or deselect) based on first row's state
 * - mouseenter on subsequent rows while dragging applies that mode
 * - shift+click selects a range from last anchor
 */
export function useDragSelect(opts: {
  ids: string[];
  selected: Set<string>;
  setSelected: (next: Set<string>) => void;
}) {
  const { ids, selected, setSelected } = opts;
  const dragging = useRef<null | "select" | "deselect">(null);
  const anchorRef = useRef<string | null>(null);
  const draftRef = useRef<Set<string>>(new Set(selected));

  // Keep draft in sync when selected changes externally
  draftRef.current = new Set(selected);

  const onMouseDown = useCallback((id: string, e: React.MouseEvent) => {
    if (e.shiftKey && anchorRef.current) {
      const a = ids.indexOf(anchorRef.current);
      const b = ids.indexOf(id);
      if (a >= 0 && b >= 0) {
        const [lo, hi] = a < b ? [a, b] : [b, a];
        const next = new Set(selected);
        for (let i = lo; i <= hi; i++) next.add(ids[i]);
        setSelected(next);
        return;
      }
    }
    const willSelect = !selected.has(id);
    dragging.current = willSelect ? "select" : "deselect";
    anchorRef.current = id;
    const next = new Set(selected);
    if (willSelect) next.add(id); else next.delete(id);
    draftRef.current = next;
    setSelected(next);

    const onUp = () => {
      dragging.current = null;
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mouseup", onUp);
  }, [ids, selected, setSelected]);

  const onMouseEnter = useCallback((id: string) => {
    if (!dragging.current) return;
    const next = new Set(draftRef.current);
    if (dragging.current === "select") next.add(id); else next.delete(id);
    draftRef.current = next;
    setSelected(next);
  }, [setSelected]);

  return { onMouseDown, onMouseEnter };
}
