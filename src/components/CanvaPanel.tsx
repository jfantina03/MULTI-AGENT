"use client";

import { useEffect, useState, useCallback } from "react";

interface CanvaDesign {
  id: string;
  title?: string;
  thumbnail?: { url?: string };
  urls?: { view_url?: string; edit_url?: string };
}

interface BrandTemplate {
  id: string;
  title?: string;
  thumbnail?: { url?: string; width?: number; height?: number };
  create_url?: string;
  view_url?: string;
}

interface DesignsResponse {
  connected: boolean;
  designs?: CanvaDesign[];
}

interface TemplatesResponse {
  connected: boolean;
  templates?: BrandTemplate[];
  scopeMissing?: boolean;
}

const FALLBACK_TYPES = [
  { label: "Post Instagram", designType: "SocialMedia" },
  { label: "Story / Réel", designType: "InstagramStory" },
  { label: "Post LinkedIn", designType: "LinkedInPost" },
  { label: "Carrousel", designType: "Presentation" },
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
      if (data.base64 && data.mimeType) onSendToChat(data.base64, data.mimeType, title);
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
          <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleSend(); }} disabled={sending} style={{
            width: "100%", padding: "5px 0", borderRadius: 7,
            background: "var(--forest)", color: "#fff",
            border: "none", fontSize: 11.5, fontWeight: 700,
            cursor: sending ? "not-allowed" : "pointer", opacity: sending ? 0.6 : 1, fontFamily: "inherit",
          }}>
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

function TemplateCard({ template, onCreated }: { template: BrandTemplate; onCreated: () => void }) {
  const [h, setH] = useState(false);
  const title = template.title ?? "Template";
  const thumbUrl = template.thumbnail?.url;

  function handleCreate() {
    const url = template.create_url ?? template.view_url;
    if (url) {
      window.open(url, "_blank");
      onCreated();
    }
  }

  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{
      borderRadius: 12, overflow: "hidden",
      border: `1px solid ${h ? "var(--forest)" : "var(--border-strong)"}`,
      background: "var(--surface)",
      transform: h ? "translateY(-2px)" : "none",
      boxShadow: h ? "var(--shadow-lg)" : "var(--shadow)",
      transition: "all .18s ease",
    }}>
      <div style={{ width: "100%", aspectRatio: "4/3", background: "var(--surface-3)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        {thumbUrl
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={thumbUrl} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <CanvaIcon size={32} />}
        <div style={{
          position: "absolute", inset: 0, background: h ? "rgba(0,0,0,.35)" : "transparent",
          transition: "background .18s ease",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {h && (
            <button onClick={handleCreate} style={{
              padding: "8px 18px", borderRadius: 8,
              background: "var(--forest)", color: "#fff",
              border: "none", fontWeight: 700, fontSize: 13,
              cursor: "pointer", fontFamily: "inherit",
            }}>
              Utiliser ce template
            </button>
          )}
        </div>
      </div>
      <div style={{ padding: "8px 10px 10px" }}>
        <p style={{ margin: 0, fontSize: 12.5, fontWeight: 600, color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</p>
      </div>
    </div>
  );
}

function FallbackCreateButton({ label, designType, onCreated }: { label: string; designType: string; onCreated: () => void }) {
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
      if (data.ok && data.editUrl) { window.open(data.editUrl, "_blank"); onCreated(); }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button onClick={handleCreate} disabled={loading} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{
      display: "flex", alignItems: "center", gap: 8,
      padding: "10px 16px", borderRadius: 10,
      border: `1px solid ${h ? "var(--forest)" : "var(--border-strong)"}`,
      background: h ? "var(--forest)" : "var(--surface)",
      color: h ? "#fff" : "var(--ink)",
      fontWeight: 600, fontSize: 13.5,
      cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1,
      transition: "all .15s ease", fontFamily: "inherit", whiteSpace: "nowrap",
    }}>
      {loading ? "Création…" : label}
    </button>
  );
}

export function CanvaPanel({ onSendToChat, oauthError }: {
  onSendToChat?: (base64: string, mimeType: string, name: string) => void;
  oauthError?: boolean | string;
}) {
  const [status, setStatus] = useState<"loading" | "connected" | "disconnected">("loading");
  const [designs, setDesigns] = useState<CanvaDesign[]>([]);
  const [templates, setTemplates] = useState<BrandTemplate[]>([]);
  const [scopeMissing, setScopeMissing] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const [designsRes, templatesRes] = await Promise.all([
        fetch("/api/canva/designs").then((r) => r.json() as Promise<DesignsResponse>),
        fetch("/api/canva/brand-templates").then((r) => r.json() as Promise<TemplatesResponse>),
      ]);
      setDesigns(designsRes.designs ?? []);
      setTemplates(templatesRes.templates ?? []);
      setScopeMissing(templatesRes.scopeMissing ?? false);
      setStatus(designsRes.connected ? "connected" : "disconnected");
    } catch {
      setStatus("disconnected");
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function disconnect() {
    setDisconnecting(true);
    await fetch("/api/canva/disconnect", { method: "POST" });
    setDesigns([]); setTemplates([]);
    setStatus("disconnected");
    setDisconnecting(false);
  }

  const header = (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
      <CanvaIcon size={36} />
      <div>
        <p style={{ margin: 0, fontSize: 11, fontWeight: 800, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--ink-faint)" }}>Intégration</p>
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
          {[...Array(6)].map((_, i) => <div key={i} style={{ borderRadius: 12, background: "var(--surface-3)", aspectRatio: "4/3" }} />)}
        </div>
      </div>
    );
  }

  if (status === "disconnected") {
    return (
      <div style={{ paddingTop: 24, paddingBottom: 40 }}>
        {header}
        {oauthError && (
          <div style={{
            marginBottom: 16, padding: "10px 14px", borderRadius: 10,
            background: "rgba(220,53,69,.1)", border: "1px solid rgba(220,53,69,.3)",
            fontSize: 13, color: "#c0392b", lineHeight: 1.5,
          }}>
            <strong>Erreur de connexion Canva.</strong>{" "}
            {typeof oauthError === "string"
              ? <>Code : <code style={{ background: "rgba(220,53,69,.15)", padding: "1px 4px", borderRadius: 4 }}>{oauthError}</code> — </>
              : null}
            Vérifie que le Client ID et Secret dans Vercel sont à jour, puis réessaie.
          </div>
        )}
        <p style={{ margin: "0 0 20px", fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.6 }}>
          Connectez votre compte Canva pour créer des visuels depuis vos templates de marque et accéder à vos designs.
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

      {/* Brand templates */}
      <div style={{ marginBottom: 32 }}>
        <p style={{ margin: "0 0 12px", fontSize: 11, fontWeight: 800, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--ink-faint)" }}>
          Créer depuis ma charte graphique
        </p>
        {templates.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 10 }}>
            {templates.map((t) => <TemplateCard key={t.id} template={t} onCreated={load} />)}
          </div>
        ) : scopeMissing ? (
          <div style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(255,165,0,.1)", border: "1px solid rgba(255,165,0,.3)", fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.5 }}>
            <strong>Scope manquant.</strong> Ajoute <code style={{ background: "rgba(0,0,0,.08)", padding: "1px 5px", borderRadius: 4 }}>brandtemplate:meta:read</code> et <code style={{ background: "rgba(0,0,0,.08)", padding: "1px 5px", borderRadius: 4 }}>brandtemplate:content:read</code> dans ton intégration Canva, puis déconnecte et reconnecte.
          </div>
        ) : (
          <div style={{ marginBottom: 8 }}>
            <p style={{ fontSize: 13, color: "var(--ink-soft)", margin: "0 0 10px" }}>
              Aucun template de marque trouvé. Créer un design vierge :
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {FALLBACK_TYPES.map((t) => <FallbackCreateButton key={t.designType} {...t} onCreated={load} />)}
            </div>
          </div>
        )}
      </div>

      {/* Recent designs */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <p style={{ margin: 0, fontSize: 11, fontWeight: 800, letterSpacing: ".18em", textTransform: "uppercase", color: "var(--ink-faint)" }}>
          Mes designs récents
        </p>
        <button onClick={disconnect} disabled={disconnecting} style={{
          background: "none", border: "none", fontSize: 12.5,
          color: "var(--ink-faint)", cursor: "pointer", fontFamily: "inherit", fontWeight: 600,
        }}>
          {disconnecting ? "…" : "Déconnecter"}
        </button>
      </div>

      {designs.length === 0 ? (
        <p style={{ fontSize: 14, color: "var(--ink-soft)", padding: "20px 0", textAlign: "center" }}>
          Aucun design trouvé.
        </p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10 }}>
          {designs.map((d) => <DesignCard key={d.id} design={d} onSendToChat={onSendToChat} />)}
        </div>
      )}
    </div>
  );
}
