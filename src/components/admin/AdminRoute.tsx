import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin } from "@/hooks/useIsAdmin";

export const AdminRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading } = useIsAdmin();

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-nf-bg text-nf-text-muted">
        Betöltés…
      </div>
    );
  }
  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-nf-bg text-white p-6">
        <div className="max-w-md text-center space-y-3">
          <h1 className="text-2xl font-bold">Nincs jogosultság</h1>
          <p className="text-nf-text-muted">Ez a felület csak admin felhasználóknak elérhető.</p>
        </div>
      </div>
    );
  }
  return <>{children}</>;
};
