import { useAuth } from "@/providers/auth-provider";
// import LoginModal from "@/components/auth/LoginModal";
// import RegisterModal from "../auth/RegisterModal";
import AuthPopover from "../auth/AuthPopover";

function Header() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <h1 className="text-xl font-bold text-slate-900">
          Job <span className="text-indigo-600">Tracker</span>
        </h1>

        <div className="flex gap-3">
          {isAuthenticated ? (
            <button
              onClick={logout}
              className="rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
            >
              Logout
            </button>
          ) : (
            <>
              <AuthPopover />
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
