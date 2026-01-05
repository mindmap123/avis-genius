import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { auth, setToken, clearToken } from "@/lib/api";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isDemo: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  loginDemo: () => void;
  logout: () => void;
}

const DEMO_USER: User = {
  id: "demo-user",
  email: "demo@avis-genius.com",
  name: "Mode Démo",
};

// Admin emails for demo mode (in production, this comes from the backend)
const DEMO_ADMIN_EMAILS = ["admin@avis-genius.com", "warren@example.com"];

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  // Check if user is admin (demo mode always has admin access for testing)
  const isAdmin = isDemo || (user?.email ? DEMO_ADMIN_EMAILS.includes(user.email.toLowerCase()) : false);

  useEffect(() => {
    // Check for demo mode
    const demoMode = localStorage.getItem("demo_mode");
    if (demoMode === "true") {
      setUser(DEMO_USER);
      setIsDemo(true);
      setIsLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    if (token) {
      auth.me()
        .then((res) => setUser(res.user))
        .catch(() => clearToken())
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await auth.login(email, password);
    setToken(res.token);
    setUser(res.user);
    setIsDemo(false);
  };

  const register = async (email: string, password: string, name: string) => {
    const res = await auth.register(email, password, name);
    setToken(res.token);
    setUser(res.user);
    setIsDemo(false);
  };

  const loginDemo = () => {
    localStorage.setItem("demo_mode", "true");
    setUser(DEMO_USER);
    setIsDemo(true);
  };

  const logout = () => {
    clearToken();
    localStorage.removeItem("demo_mode");
    setUser(null);
    setIsDemo(false);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isDemo, isAdmin, login, register, loginDemo, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
