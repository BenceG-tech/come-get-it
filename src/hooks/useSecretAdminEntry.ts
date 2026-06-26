import { useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useIsAdmin } from "@/hooks/useIsAdmin";

/**
 * Returns an onClick handler. 5 clicks within 2 seconds on the bound element
 * silently navigates to /admin if the current user is an admin. No visual hint.
 */
export function useSecretAdminEntry(target: string = "/admin", clicksNeeded = 5, windowMs = 2000) {
  const navigate = useNavigate();
  const { isAdmin } = useIsAdmin();
  const timesRef = useRef<number[]>([]);

  const onClick = useCallback(() => {
    const now = Date.now();
    timesRef.current = [...timesRef.current, now].filter((t) => now - t <= windowMs);
    if (timesRef.current.length >= clicksNeeded) {
      timesRef.current = [];
      if (isAdmin) navigate(target);
    }
  }, [isAdmin, navigate, target, clicksNeeded, windowMs]);

  return onClick;
}

export default useSecretAdminEntry;
