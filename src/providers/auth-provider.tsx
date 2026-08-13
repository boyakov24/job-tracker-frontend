import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

import { getProfile, type UserProfile } from "@/api/auth";
import { getToken, removeToken, setToken } from "@/lib/auth-storage";

type AuthContextType = {
  token: string | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  updateUser: (user: UserProfile) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setTokenState] = useState<string | null>(getToken());
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!token) {
      setUser(null);
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

      getProfile()
        .then((profile) => {
          setUser(profile);
        })
        .catch((error) => {
          console.error("Failed to load profile:", error);
        });

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

  function updateUser(updatedUser: UserProfile) {
    setUser(updatedUser);
  }

  function logout() {
    console.log("🔥 LOGOUT CALLED");

    removeToken();
    setTokenState(null);
    setUser(null);
    window.location.href = "/";
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: Boolean(token),
        login,
        logout,
        updateUser,
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
