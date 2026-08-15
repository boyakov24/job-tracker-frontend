import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/providers/auth-provider";

export function ProtectedRoute() {
  const { isAuthenticated, user, token } = useAuth();

  if (token && !user) {
    return (
      <div className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-app-slate-50">
        <p className="text-muted-foreground">Checking authentication...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
