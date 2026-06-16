"use client";

import { useEffect, useState, useCallback } from "react";

/* ── Types ────────────────────────────────────────────────── */
interface CanvaDesign {
  id: string;
  title?: string;
  thumbnail?: {
    url?: string;
    width?: number;
    height?: number;
  };
  urls?: {
    view_url?: string;
    edit_url?: string;
  };
  created_at?: number;
  updated_at?: number;
}

interface DesignsResponse {
  connected: boolean;
  designs?: CanvaDesign[];
  error?: string;
}

/* ── Skeleton ─────────────────────────────────────────────── */
function DesignSkeleton() {
  return (
    <div
      style={{
        background: "var(--surface-3)",
        borderRadius: 12,
        overflow: "hidden",
        border: "1px solid var(--border-strong)",
      }}
    >
      <div
        style={{
          width: "100%",
          aspectRatio: "16/9",
          background: "linear-gradient(90deg, var(--surface-3) 0%, var(--surface-2) 50%, var(--surface-3) 100%)",
          backgroundSize: "200% 100%",
          animation: "canva-shimmer 1.4s ease infinite",
        }}
      />
      <div style={{ padding: "10px 12px" }}>
        <div
          style={{
            height: 12,
            width: "70%",
            borderRadius: 6,
            background: "linear-gradient(90deg, var(--surface-3) 0%, var(--surface-2) 50%, var(--surface-3) 100%)",
            backgroundSize: "200% 100%",
            animation: "canva-shimmer 1.4s ease infinite",
          }}
        />
      </div>
    </div>
  );
}

/* ── Design Card ──────────────────────────────────────────── */
function DesignCard({ design }: { design: CanvaDesign }) {
  const [hovered, setHovered] = useState(false);
  const editUrl = design.urls?.edit_url ?? design.urls?.view_url;
  const title = design.title ?? "Sans titre";
  const thumbUrl = design.thumbnail?.url;

  const card = (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "var(--surface)",
        border: `1px solid ${hovered ? "var(--green)" : "var(--border-strong)"}`,
        borderRadius: 12,
        overflow: "hidden",
        cursor: editUrl ? "pointer" : "default",
        transition: "border-color .18s ease, box-shadow .18s ease, transform .18s ease",
        boxShadow: hovered ? "var(--shadow-lg)" : "var(--shadow)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
      }}
    >
      {/* Thumbnail */}
      <div
        style={{
          width: "100%",
          aspectRatio: "16/9",
          background: "var(--surface-3)",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {thumbUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbUrl}
            alt={title}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <CanvaLogoIcon size={32} color="var(--ink-soft)" />
        )}
      </div>

      {/* Title */}
      <div style={{ padding: "10px 12px" }}>
        <p
          style={{
            margin: 0,
            fontSize: 13,
            fontWeight: 600,
            color: "var(--ink)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          title={title}
        >
          {title}
        </p>
      </div>
    </div>
  );

  if (editUrl) {
    return (
      <a
        href={editUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none", display: "block" }}
      >
        {card}
      </a>
    );
  }

  return card;
}

/* ── Canva Logo SVG ───────────────────────────────────────── */
function CanvaLogoIcon({ size = 24, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="60" rx="12" fill={color} fillOpacity="0.15" />
      <text
        x="50%"
        y="54%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="22"
        fontWeight="700"
        fill={color}
        fontFamily="Plus Jakarta Sans, system-ui, sans-serif"
      >
        C
      </text>
    </svg>
  );
}

/* ── Main Component ───────────────────────────────────────── */
export function CanvaPanel() {
  const [status, setStatus] = useState<"loading" | "connected" | "disconnected">("loading");
  const [designs, setDesigns] = useState<CanvaDesign[]>([]);
  const [disconnecting, setDisconnecting] = useState(false);

  const fetchDesigns = useCallback(async () => {
    setStatus("loading");
    try {
      const res = await fetch("/api/canva/designs");
      const data: DesignsResponse = await res.json();
      if (data.connected) {
        setDesigns(data.designs ?? []);
        setStatus("connected");
      } else {
        setStatus("disconnected");
      }
    } catch {
      setStatus("disconnected");
    }
  }, []);

  useEffect(() => {
    fetchDesigns();
  }, [fetchDesigns]);

  async function handleDisconnect() {
    setDisconnecting(true);
    try {
      await fetch("/api/canva/disconnect", { method: "POST" });
    } finally {
      setDisconnecting(false);
      setDesigns([]);
      setStatus("disconnected");
    }
  }

  /* ── Loading State ── */
  if (status === "loading") {
    return (
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border-strong)",
          borderRadius: "var(--radius)",
          padding: 24,
        }}
      >
        <PanelHeader />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: 12,
            marginTop: 20,
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <DesignSkeleton key={i} />
          ))}
        </div>
        <style>{shimmerKeyframes}</style>
      </div>
    );
  }

  /* ── Disconnected State ── */
  if (status === "disconnected") {
    return (
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border-strong)",
          borderRadius: "var(--radius)",
          padding: 24,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 16,
        }}
      >
        <PanelHeader />
        <p style={{ margin: 0, fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.5 }}>
          Connectez votre compte Canva pour accéder à vos créations directement depuis Orizon.
        </p>
        <a
          href="/api/canva/auth"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 18px",
            borderRadius: 10,
            background: "var(--forest)",
            color: "var(--hero-ink)",
            fontWeight: 700,
            fontSize: 14,
            textDecoration: "none",
            border: "none",
            cursor: "pointer",
            transition: "opacity .15s ease, transform .15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.88";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <CanvaLogoIcon size={18} color="#A7EFA6" />
          Connecter Canva
        </a>
      </div>
    );
  }

  /* ── Connected State ── */
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border-strong)",
        borderRadius: "var(--radius)",
        padding: 24,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <PanelHeader badge="Connecté" />
        <button
          onClick={handleDisconnect}
          disabled={disconnecting}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "7px 14px",
            borderRadius: 8,
            background: "transparent",
            color: "var(--ink-soft)",
            fontWeight: 600,
            fontSize: 13,
            border: "1px solid var(--border-strong)",
            cursor: disconnecting ? "not-allowed" : "pointer",
            opacity: disconnecting ? 0.6 : 1,
            transition: "background .15s ease, color .15s ease",
          }}
          onMouseEnter={(e) => {
            if (!disconnecting) {
              e.currentTarget.style.background = "var(--surface-3)";
              e.currentTarget.style.color = "var(--ink)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--ink-soft)";
          }}
        >
          {disconnecting ? "Déconnexion…" : "Déconnecter"}
        </button>
      </div>

      {designs.length === 0 ? (
        <p
          style={{
            margin: "20px 0 0",
            fontSize: 14,
            color: "var(--ink-soft)",
            textAlign: "center",
            padding: "24px 0",
          }}
        >
          Aucun design trouvé dans votre compte Canva.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: 12,
            marginTop: 20,
          }}
        >
          {designs.map((design) => (
            <DesignCard key={design.id} design={design} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Panel Header ─────────────────────────────────────────── */
function PanelHeader({ badge }: { badge?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 9,
          background: "var(--surface-3)",
          border: "1px solid var(--border-strong)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <CanvaLogoIcon size={20} color="var(--green)" />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
        <span
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: "var(--ink)",
            letterSpacing: "-.01em",
          }}
        >
          Canva
        </span>
        {badge && (
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: 999,
              background: "rgba(47,168,95,.15)",
              color: "var(--green)",
              letterSpacing: ".02em",
            }}
          >
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}

/* ── Shimmer animation ────────────────────────────────────── */
const shimmerKeyframes = `
@keyframes canva-shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
`;
