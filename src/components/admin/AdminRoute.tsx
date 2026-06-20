import { ReactNode } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { Button } from "@/components/ui/button";

export const AdminRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { isAdmin, loading, error } = useIsAdmin();
  const navigate = useNavigate();

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-nf-bg text-nf-text-muted">
        Betöltés…
      </div>
    );
  }
  if (!user) return <Navigate to="/auth?redirect=/admin" replace />;

  if (!isAdmin) {
    const handleRelogin = async () => {
      await signOut();
      navigate("/auth?redirect=/admin", { replace: true });
    };
    return (
      <div className="min-h-screen flex items-center justify-center bg-nf-bg text-white p-6">
        <div className="max-w-md w-full text-center space-y-4">
          <h1 className="text-2xl font-bold">Nincs jogosultság</h1>
          <p className="text-nf-text-muted">
            Ez a felület csak admin felhasználóknak elérhető.
          </p>
          <div className="text-xs text-nf-text-muted/80 space-y-1">
            <div>
              Belépve mint: <span className="text-white">{user.email}</span>
            </div>
            {error && (
              <div className="text-amber-300 break-words">
                Hiba az ellenőrzéskor: {error}
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button onClick={() => window.location.reload()} variant="outline" className="flex-1">
              Újra ellenőrzés
            </Button>
            <Button onClick={handleRelogin} className="flex-1">
              Másik fiókkal belépek
            </Button>
          </div>
          <button
            onClick={() => navigate("/")}
            className="text-xs text-nf-text-muted underline hover:text-white"
          >
            Vissza a főoldalra
          </button>
        </div>
      </div>
    );
  }
  return <>{children}</>;
};
