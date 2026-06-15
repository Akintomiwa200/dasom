"use client";

import { useState } from "react";
import Link from "next/link";

type LoginFormProps = {
  onLogin: (email: string, password: string) => Promise<boolean>;
};

export function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState("admin@dasom.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const ok = await onLogin(email.trim().toLowerCase(), password);
    if (!ok) setError("Invalid email or password");
    setLoading(false);
  };

  return (
    <div className="adm-dash adm-login-wrap">
      <div className="adm-login-box">
        <div className="adm-login-head">
          <div className="adm-wordmark" style={{ fontSize: 28, marginBottom: 8 }}>DASOM</div>
          <p className="body-sm text-muted">Davidic School of Ministry — Admin</p>
        </div>
        <form className="card" onSubmit={submit} style={{ padding: 32 }}>
          <div className="field">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@dasom.com" required autoComplete="email" />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" required autoComplete="current-password" />
          </div>
          {error && <div className="field-error" style={{ marginBottom: 16 }}>{error}</div>}
          <button type="submit" className="btn-primary" style={{ width: "100%" }} disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Link href="/" className="btn-text caption">← Back to public site</Link>
        </div>
      </div>
    </div>
  );
}
