import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/providers/auth-provider";
// import LoginModal from "@/components/auth/LoginModal";
// import RegisterModal from "../auth/RegisterModal";
import AuthPopover from "../auth/AuthPopover";
import AccountDialog from "../account/AccountDialog";
import { useState } from "react";

function Header() {
  const { isAuthenticated, logout } = useAuth();

  const location = useLocation();

  const [isAccountOpen, setIsAccountOpen] = useState(false);

  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-xl font-bold text-slate-900">
          Job <span className="text-indigo-600">Tracker</span>
        </Link>

        <div className="flex gap-3 shrink-0">
          {isAuthenticated ? (
            <>
              {location.pathname !== "/dashboard" && (
                <Link
                  to="/dashboard"
                  className="flex items-center justify-center rounded-md bg-[#0ea5e9] px-4 py-2 text-sm text-white shadow-sm shadow-sky-500/10 hover:bg-[#0284c7] transition-colors duration-200"
                >
                  Dashboard
                </Link>
              )}

              <button
                onClick={logout}
                className="rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
              >
                Logout
              </button>

              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full border bg-[#0ea5e9]/10 px-4 shadow-sm shadow-sky-500/5 hover:bg-[#0ea5e9]/20 transition-colors duration-200"
                onClick={() => setIsAccountOpen(true)}
              >
                <span className="text-lg">👤</span>
              </button>
            </>
          ) : (
            <>
              <AuthPopover />
            </>
          )}
        </div>
      </div>
      <AccountDialog open={isAccountOpen} onOpenChange={setIsAccountOpen} />
    </header>
  );
}

export default Header;
