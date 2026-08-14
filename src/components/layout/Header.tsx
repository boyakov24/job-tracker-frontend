import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/providers/auth-provider";
// import LoginModal from "@/components/auth/LoginModal";
// import RegisterModal from "../auth/RegisterModal";
import AuthPopover from "../auth/AuthPopover";
import AccountDialog from "../account/AccountDialog";
import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

function Header() {
  const { isAuthenticated, logout } = useAuth();

  const location = useLocation();

  const [isAccountOpen, setIsAccountOpen] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);

    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((current) => !current);
  };

  return (
    <header className="border-b bg-app-bg-color">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex gap-3 items-center shrink-0">
          <Link to="/" className="text-xl font-bold text-app-slate-900">
            Job <span className="text-app-indigo-600">Tracker</span>
          </Link>
          <button
            type="button"
            onClick={toggleDarkMode}
            className="flex h-10 w-10 items-center justify-center rounded-full border bg-background text-foreground transition-colors hover:bg-muted"
            aria-label={
              isDarkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>
        </div>

        <div className="flex gap-3 shrink-0">
          {isAuthenticated ? (
            <>
              {location.pathname !== "/dashboard" && (
                <Link
                  to="/dashboard"
                  className="flex items-center justify-center rounded-md bg-app-sky-500 px-4 py-2 text-sm text-app-white shadow-sm shadow-sky-500/10 hover:bg-app-sky-600 transition-colors duration-200"
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
                className="flex h-10 w-10 items-center justify-center rounded-full border bg-app-sky-500/10 px-4 shadow-sm shadow-app-sky-500/5 hover:bg-app-hover-sky transition-colors duration-200"
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
