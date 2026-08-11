import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { getToken, removeToken, setToken } from "@/lib/auth-storage";

type AuthContextType = {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setTokenState] = useState<string | null>(getToken());

  useEffect(() => {
    if (!token) {
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const expiresAt = payload.exp * 1000;
      const timeUntilExpiration = expiresAt - Date.now();

      if (timeUntilExpiration <= 0) {
        logout();
        return;
      }

      const timeoutId = window.setTimeout(() => {
        logout();
      }, timeUntilExpiration);

      return () => {
        window.clearTimeout(timeoutId);
      };
    } catch {
      logout();
    }
  }, [token]);

  function login(newToken: string) {
    setToken(newToken);
    setTokenState(newToken);
  }

  function logout() {
    removeToken();
    setTokenState(null);
    window.location.href = "/";
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: Boolean(token),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
