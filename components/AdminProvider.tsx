"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

interface AdminCtx {
  isAdmin: boolean;
  loading: boolean;
  refresh: () => void;
  logout: () => Promise<void>;
}

const Ctx = createContext<AdminCtx>({
  isAdmin: false,
  loading: true,
  refresh: () => {},
  logout: async () => {},
});

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    fetch("/api/admin/session")
      .then((r) => r.json())
      .then((d) => setIsAdmin(!!d.isAdmin))
      .catch(() => setIsAdmin(false))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const logout = useCallback(async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setIsAdmin(false);
  }, []);

  return (
    <Ctx.Provider value={{ isAdmin, loading, refresh, logout }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAdmin = () => useContext(Ctx);
