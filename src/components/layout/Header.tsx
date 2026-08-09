import { useAuth } from "@/providers/auth-provider";
// import LoginModal from "@/components/auth/LoginModal";
// import RegisterModal from "../auth/RegisterModal";
import AuthPopover from "../auth/AuthPopover";

function Header() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="flex items-center justify-between border-b px-6 py-4">
      <h1 className="text-xl font-bold text-slate-900">
        Job <span className="text-indigo-600">Tracker</span>
      </h1>

      <div className="flex gap-3">
        {isAuthenticated ? (
          <button
            onClick={logout}
            className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 transition-colors duration-200"
          >
            Logout
          </button>
        ) : (
          <>
            <AuthPopover />
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
