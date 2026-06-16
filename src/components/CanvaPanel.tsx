"use client";

import { useEffect, useState, useCallback } from "react";

interface CanvaDesign {
  id: string;
  title?: string;
  thumbnail?: { url?: string };
  urls?: { view_url?: string; edit_url?: string };
}

interface DesignsResponse {
  connected: boolean;
  designs?: CanvaDesign[];
}

const CREATE_TYPES = [
  { label: "Post Instagram", designType: "SocialMedia", icon: "📷" },
  { label: "Story / Réel", designType: "InstagramStory", icon: "🎬" },
  { label: "Post LinkedIn", designType: "LinkedInPost", icon: "💼" },
  { label: "Carrousel", designType: "Presentation", icon: "🖼️" },
];

function CanvaIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="8" fill="var(--green)" fillOpacity=".15" />
      <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle"
        fontSize="16" fontWeight="800" fill="var(--green)"
        fontFamily="Plus Jakarta Sans, system-ui">C</text>
    </svg>
  );
}

function DesignCard({ design, onSendToChat }: {
  design: CanvaDesign;
  onSendToChat?: (base64: string, mimeType: string, name: string) => void;
}) {
  const url = design.urls?.edit_url ?? design.urls?.view_url;
  const title = design.title ?? "Sans titre";
  const thumbUrl = design.thumbnail?.url;
  const [h, setH] = useState(false);
  const [sending, setSending] = useState(false);

  async function handleSend() {
    if (!thumbUrl || !onSendToChat) return;
    setSending(true);
    try {
      const res = await fetch(`/api/canva/thumb?url=${encodeURIComponent(thumbUrl)}`);
      const data = await res.json() as { base64?: string; mimeType?: string };
      if (data.base64 && data.mimeType) {
        onSendToChat(data.base64, data.mimeType, title);
      }
    } finally {
      setSending(false);
    }
  }

  const inner = (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{
      borderRadius: 12, overflow: "hidden",
      border: `1px solid ${h ? "var(--green)" : "var(--border-strong)"}`,
      background: "var(--surface)",
      transform: h ? "translateY(-2px)" : "none",
      boxShadow: h ? "var(--shadow-lg)" : "var(--shadow)",
      transition: "all .18s ease",
      position: "relative",
    }}>
      <div style={{ width: "100%", aspectRatio: "1/1", background: "var(--surface-3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {thumbUrl
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={thumbUrl} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <CanvaIcon size={32} />}
      </div>
      <div style={{ padding: "8px 10px 10px" }}>
        <p style={{ margin: "0 0 6px", fontSize: 12.5, fontWeight: 600, color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</p>
        {onSendToChat && thumbUrl && (
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleSend(); }}
            disabled={sending}
            style={{
              width: "100%", padding: "5px 0", borderRadius: 7,
              background: "var(--forest)", color: "#fff",
              border: "none", fontSize: 11.5, fontWeight: 700,
              cursor: sending ? "not-allowed" : "pointer",
              opacity: sending ? 0.6 : 1,
              fontFamily: "inherit",
            }}
          >
            {sending ? "Envoi…" : "Envoyer à Lilou"}
          </button>
        )}
      </div>
    </div>
  );

  return url
    ? <a href={url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>{inner}</a>
    : inner;
}

function CreateButton({ label, icon, designType, onCreated }: {
  label: string; icon: string; designType: string; onCreated: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [h, setH] = useState(false);

  async function handleCreate() {
    setLoading(true);
    try {
      const res = await fetch("/api/canva/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: `${label} — Orizon`, designType }),
      });
      const data = await res.json() as { ok?: boolean; editUrl?: string };
      if (data.ok && data.editUrl) {
        window.open(data.editUrl, "_blank");
        onCreated();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleCreate}
      disabled={loading}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "10px 16px", borderRadius: 10,
        border: `1px solid ${h ? "var(--forest)" : "var(--border-strong)"}`,
        background: h ? "var(--forest)" : "var(--surface)",
        color: h ? "#fff" : "var(--ink)",
        fontWeight: 600, fontSize: 13.5,
        cursor: loading ? "not-allowed" : "pointer",
        opacity: loading ? 0.6 : 1,
        transition: "all .15s ease",
        fontFamily: "inherit",
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ fontSize: 16 }}>{icon}</span>
      {loading ? "Création…" : label}
    </button>
  );
}

export function CanvaPanel({ onSendToChat }: { onSendToChat?: (base64: string, mimeType: string, name: string) => void }) {
  const [status, setStatus] = useState<"loading" | "connected" | "disconnected">("loading");
  const [designs, setDesigns] = useState<CanvaDesign[]>([]);
  const [disconnecting, setDisconnecting] = useState(false);

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const res = await fetch("/api/canva/designs");
      const data: DesignsResponse = await res.json();
      setDesigns(data.designs ?? []);
      setStatus(data.connected ? "connected" : "disconnected");
    } catch {
      setStatus("disconnected");
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function disconnect() {
    setDisconnecting(true);
    await fetch("/api/canva/disconnect", { method: "POST" });
    setDesigns([]);
    setStatus("disconnected");
    setDisconnecting(false);
  }

  /* Header */
  const header = (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
      <CanvaIcon size={36} />
      <div>
        <p style={{ margin: 0, fontSize: 11, fontWeight: 800, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--ink-faint)" }}>
          Intégration
        </p>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "var(--ink)" }}>Canva</h3>
      </div>
      {status === "connected" && (
        <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 999, background: "rgba(47,168,95,.15)", color: "var(--green)" }}>
          Connecté
        </span>
      )}
    </div>
  );

  if (status === "loading") {
    return (
      <div style={{ paddingTop: 24, paddingBottom: 40 }}>
        {header}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{ borderRadius: 12, background: "var(--surface-3)", aspectRatio: "1/1" }} />
          ))}
        </div>
      </div>
    );
  }

  if (status === "disconnected") {
    return (
      <div style={{ paddingTop: 24, paddingBottom: 40 }}>
        {header}
        <p style={{ margin: "0 0 20px", fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.6 }}>
          Connectez votre compte Canva pour créer des visuels directement depuis Orizon et accéder à vos designs.
        </p>
        <a href="/api/canva/auth" style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "11px 20px", borderRadius: 10,
          background: "var(--forest)", color: "#fff",
          fontWeight: 700, fontSize: 14, textDecoration: "none",
        }}>
          <CanvaIcon size={18} />
          Connecter Canva
        </a>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 24, paddingBottom: 40 }}>
      {header}

      {/* Create buttons */}
      <div style={{ marginBottom: 28 }}>
        <p style={{ margin: "0 0 12px", fontSize: 11, fontWeight: 800, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--ink-faint)" }}>
          Créer un nouveau design
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {CREATE_TYPES.map((t) => (
            <CreateButton key={t.designType} {...t} onCreated={load} />
          ))}
        </div>
      </div>

      {/* Existing designs */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <p style={{ margin: 0, fontSize: 11, fontWeight: 800, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--ink-faint)" }}>
          Mes designs récents
        </p>
        <button onClick={disconnect} disabled={disconnecting} style={{
          background: "none", border: "none", fontSize: 12.5,
          color: "var(--ink-faint)", cursor: "pointer", fontFamily: "inherit",
          fontWeight: 600,
        }}>
          {disconnecting ? "…" : "Déconnecter"}
        </button>
      </div>

      {designs.length === 0 ? (
        <p style={{ fontSize: 14, color: "var(--ink-soft)", padding: "20px 0", textAlign: "center" }}>
          Aucun design trouvé. Créez votre premier design ci-dessus.
        </p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10 }}>
          {designs.map((d) => <DesignCard key={d.id} design={d} onSendToChat={onSendToChat} />)}
        </div>
      )}
    </div>
  );
}
