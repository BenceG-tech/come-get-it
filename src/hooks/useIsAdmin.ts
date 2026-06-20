import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export function useIsAdmin() {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
      if (cancelled) return;
      if (error) {
        console.error("[useIsAdmin] has_role error:", error);
        setError(error.message);
        setIsAdmin(false);
      } else {
        setError(null);
        setIsAdmin(data === true);
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [user, authLoading]);

  return { isAdmin, loading, error };
}
