import { useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin } from "@/hooks/useIsAdmin";

/**
 * Returns an onClick handler. N clicks within windowMs on the bound element:
 *  - not logged in  -> /auth?redirect=/admin
 *  - logged in admin -> /admin
 *  - logged in non-admin -> silently nothing (don't reveal admin existence)
 */
export function useSecretAdminEntry(target: string = "/admin", clicksNeeded = 5, windowMs = 2500) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin } = useIsAdmin();
  const timesRef = useRef<number[]>([]);

  const onClick = useCallback((event?: { preventDefault?: () => void; stopPropagation?: () => void }) => {
    const now = Date.now();
    timesRef.current = [...timesRef.current, now].filter((t) => now - t <= windowMs);
    if (timesRef.current.length >= clicksNeeded) {
      timesRef.current = [];
      event?.preventDefault?.();
      event?.stopPropagation?.();
      if (!user) {
        navigate(`/auth?redirect=${encodeURIComponent(target)}`);
      } else if (isAdmin) {
        navigate(target);
      }
      // logged-in non-admin: silent
    }
  }, [user, isAdmin, navigate, target, clicksNeeded, windowMs]);

  return onClick;
}

export default useSecretAdminEntry;
