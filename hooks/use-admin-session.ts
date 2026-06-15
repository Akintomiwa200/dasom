"use client";

import { useCallback, useEffect, useState } from "react";

export function useAdminSession() {
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkSession = useCallback(async () => {
    const res = await fetch("/api/admin/session", { credentials: "include" });
    setAuthed(res.ok);
    setLoading(false);
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const login = async (email: string, password: string) => {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) setAuthed(true);
    return res.ok;
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
    setAuthed(false);
  };

  return { authed, loading, login, logout };
}
