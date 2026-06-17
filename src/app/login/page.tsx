"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.ok) {
      router.push("/");
      router.refresh();
    } else {
      setError("Email ou mot de passe incorrect.");
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "var(--bg)", padding: "24px",
    }}>
      <div style={{
        width: "100%", maxWidth: 400,
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-hero)",
        padding: "40px 36px",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Image
            src="/logo-light.png"
            alt="Orizon Accession"
            width={180}
            height={44}
            style={{ height: 44, width: "auto" }}
            priority
          />
        </div>

        <h1 style={{
          fontSize: 22, fontWeight: 800, letterSpacing: "-.02em",
          color: "var(--ink)", margin: "0 0 6px", textAlign: "center",
        }}>
          Accès privé
        </h1>
        <p style={{ fontSize: 14, color: "var(--ink-soft)", textAlign: "center", margin: "0 0 28px" }}>
          Connecte-toi à ton espace Orizon AI
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: "var(--ink-soft)" }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="jade@orizon-accession.fr"
              style={{
                padding: "10px 14px", borderRadius: 10,
                border: "1.5px solid var(--border-strong)",
                background: "var(--bg)", color: "var(--ink)",
                fontSize: 15, outline: "none", fontFamily: "inherit",
                transition: "border-color .15s ease",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--green)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border-strong)")}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 700, color: "var(--ink-soft)" }}>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              style={{
                padding: "10px 14px", borderRadius: 10,
                border: "1.5px solid var(--border-strong)",
                background: "var(--bg)", color: "var(--ink)",
                fontSize: 15, outline: "none", fontFamily: "inherit",
                transition: "border-color .15s ease",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--green)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border-strong)")}
            />
          </div>

          {error && (
            <p style={{
              margin: 0, padding: "8px 12px", borderRadius: 8,
              background: "rgba(220,53,69,.1)", color: "#c0392b",
              fontSize: 13, fontWeight: 600,
            }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 4, padding: "12px 0", borderRadius: 10,
              background: loading ? "var(--border)" : "var(--forest)",
              color: loading ? "var(--ink-faint)" : "#fff",
              border: "none", fontWeight: 800, fontSize: 15,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              transition: "background .2s ease",
            }}
          >
            {loading ? "Connexion…" : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
