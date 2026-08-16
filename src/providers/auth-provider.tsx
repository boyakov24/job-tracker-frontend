import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  useCallback,
} from "react";
import { getProfile, type UserProfile } from "@/api/auth";
import { getToken, removeToken, setToken } from "@/lib/auth-storage";

type AuthContextType = {
  token: string | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
  updateUser: (user: UserProfile) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function parseJWT(token: string) {
  try {
    const base64Url = token.split(".")[1];

    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setTokenState] = useState<string | null>(() => getToken());

  const [user, setUser] = useState<UserProfile | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const logout = useCallback(() => {
    removeToken();
    setTokenState(null);
    setUser(null);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    const payload = parseJWT(token);
    if (!payload || !payload.exp) {
      logout();
      return;
    }

    const expiresAt = payload.exp * 1000;
    const timeUntilExpiration = expiresAt - Date.now();

    if (timeUntilExpiration <= 0) {
      logout();
      return;
    }

    const timeoutId = window.setTimeout(() => {
      logout();
    }, timeUntilExpiration);

    setIsLoading(true);
    getProfile()
      .then((profile) => {
        setUser(profile);
      })
      .catch((error) => {
        console.error("Failed to load profile:", error);
        logout();
      })
      .finally(() => {
        setIsLoading(false);
      });

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [token, logout]);

  function login(newToken: string) {
    setToken(newToken);
    setTokenState(newToken);
  }

  function updateUser(updatedUser: UserProfile) {
    setUser(updatedUser);
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: Boolean(token),
        isLoading,
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
