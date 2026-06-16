"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { AGENTS } from "@/lib/agents";
import type { Agent } from "@/lib/agents";
import { ServicePage } from "@/components/agents/ServicePage";

/* ─── SVG Icons ───────────────────────────────── */
function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} width={24} height={24}>
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" width={18} height={18}>
      <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" stroke="currentColor" strokeWidth={1.9} strokeLinejoin="round" />
    </svg>
  );
}
function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" width={18} height={18}>
      <circle cx={12} cy={12} r={4.2} stroke="currentColor" strokeWidth={1.9} />
      <path d="M12 2.5v2.2M12 19.3v2.2M21.5 12h-2.2M4.7 12H2.5M18.4 5.6l-1.5 1.5M7.1 16.9l-1.5 1.5M18.4 18.4l-1.5-1.5M7.1 7.1L5.6 5.6" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" />
    </svg>
  );
}

/* ─── Theme Toggle ────────────────────────────── */
function ThemeToggle({ dark, onToggle }: { dark: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      style={{
        display: "inline-flex", alignItems: "center", gap: 9,
        height: 44, padding: "0 16px",
        borderRadius: 999,
        border: "1px solid var(--border-strong)",
        background: "var(--surface)",
        color: "var(--ink-soft)",
        fontWeight: 700, fontSize: 13.5,
        transition: "transform .15s ease, border-color .2s ease, color .2s ease",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
    >
      {dark ? <SunIcon /> : <MoonIcon />}
      <span>{dark ? "Clair" : "Sombre"}</span>
    </button>
  );
}

/* ─── Home Page ───────────────────────────────── */
export function HomePage() {
  const [dark, setDark] = useState(false);
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const initialTabRef = useRef<string | null>(null);
  const canvaErrorRef = useRef<boolean | string>(false);

  useEffect(() => {
    const saved = localStorage.getItem("orizon-theme");
    if (saved === "dark") {
      setDark(true);
      document.documentElement.setAttribute("data-theme", "dark");
    }
    // Auto-open agent after Canva OAuth redirect (?agent=lilou&tab=canva)
    const params = new URLSearchParams(window.location.search);
    const agentParam = params.get("agent");
    const tabParam = params.get("tab");
    const canvaError = params.get("canva_error");
    const canvaErrDetail = params.get("canva_err_detail");
    if (agentParam) {
      initialTabRef.current = tabParam;
      canvaErrorRef.current = canvaError === "1" ? (canvaErrDetail ?? true) : false;
      setActiveAgent(agentParam);
      window.history.replaceState({}, "", "/");
    }
  }, []);

  function toggleTheme() {
    setDark((d) => {
      const next = !d;
      document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
      localStorage.setItem("orizon-theme", next ? "dark" : "light");
      return next;
    });
  }

  const manager = AGENTS.find((a) => a.isManager)!;
  const services = AGENTS.filter((a) => !a.isManager);

  if (activeAgent) {
    const agent = AGENTS.find((a) => a.id === activeAgent);
    if (agent) {
      return (
        <ServicePage
          agent={agent}
          dark={dark}
          onToggleTheme={toggleTheme}
          onHome={() => setActiveAgent(null)}
          initialTab={initialTabRef.current ?? undefined}
          canvaError={canvaErrorRef.current}
        />
      );
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      {/* ── Topbar ── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 40,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 16,
        padding: "16px clamp(18px, 5vw, 56px)",
        background: "color-mix(in srgb, var(--bg) 80%, transparent)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Image
            src={dark ? "/logo-dark.png" : "/logo-light.png"}
            alt="Orizon Accession"
            height={48}
            width={200}
            style={{ height: 48, width: "auto" }}
            priority
          />
        </div>
        <ThemeToggle dark={dark} onToggle={toggleTheme} />
      </header>

      {/* ── Canvas ── */}
      <main style={{
        width: "100%", maxWidth: 1120, margin: "0 auto",
        padding: "clamp(22px, 4vw, 44px) clamp(18px, 5vw, 56px) 80px",
        flex: 1,
      }}>
        <h1 className="enter" style={{
          fontSize: "clamp(34px, 6vw, 52px)", fontWeight: 800,
          letterSpacing: "-.03em", margin: "8px 0 10px",
          color: "var(--ink)",
        }}>
          Bonjour Jade <span style={{ display: "inline-block" }}>👋</span>
        </h1>
        <p className="enter" style={{
          fontSize: "clamp(16px, 2.4vw, 19px)", color: "var(--ink-soft)",
          margin: "0 0 30px", maxWidth: "56ch", lineHeight: 1.5,
          animationDelay: ".04s",
        }}>
          Choisissez le Manager pour lui confier une mission, ou ouvrez un service directement.
        </p>

        {/* ── Thomas Hero ── */}
        <HeroCard agent={manager} onClick={() => setActiveAgent(manager.id)} />

        {/* ── Services Grid ── */}
        <p className="enter" style={{
          fontSize: 12.5, fontWeight: 800, letterSpacing: ".2em",
          textTransform: "uppercase", color: "var(--ink-faint)",
          margin: "38px 0 16px", animationDelay: ".12s",
        }}>
          Vos services
        </p>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 18,
        }}>
          {services.map((agent, i) => (
            <ServiceCard
              key={agent.id}
              agent={agent}
              delay={.14 + i * .05}
              onClick={() => setActiveAgent(agent.id)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

/* ─── Hero Card (Thomas) ──────────────────────── */
function HeroCard({ agent, onClick }: { agent: Agent; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      className="enter"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative", overflow: "hidden",
        display: "flex", alignItems: "center", gap: "clamp(16px, 3vw, 28px)",
        padding: "clamp(20px, 3.2vw, 30px)",
        borderRadius: "var(--radius-lg)",
        background: "linear-gradient(115deg, var(--hero-from), var(--hero-to))",
        color: "var(--hero-ink)",
        boxShadow: "var(--shadow-hero)",
        border: "none", width: "100%", textAlign: "left",
        cursor: "pointer",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        transition: "transform .2s ease",
        animationDelay: ".08s",
      }}
    >
      {/* Radial glow */}
      <div style={{
        content: "", position: "absolute", right: -60, top: -60,
        width: 260, height: 260, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(167,239,166,.3), transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Avatar */}
      <Image
        src={agent.avatar}
        alt={agent.name}
        width={104}
        height={104}
        style={{
          width: "clamp(76px, 11vw, 104px)",
          height: "clamp(76px, 11vw, 104px)",
          borderRadius: "50%",
          flexShrink: 0,
          objectFit: "cover",
          boxShadow: "0 8px 22px rgba(0,0,0,.25)",
        }}
      />

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0, zIndex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: ".26em", textTransform: "uppercase", color: "var(--hero-sub)" }}>
          Manager
        </div>
        <div style={{ fontSize: "clamp(24px, 4vw, 34px)", fontWeight: 800, letterSpacing: "-.02em", margin: "6px 0" }}>
          {agent.name}
        </div>
        <p style={{ margin: 0, fontSize: "clamp(14px, 2vw, 17px)", color: "rgba(255,255,255,.86)", lineHeight: 1.45, maxWidth: "46ch" }}>
          {agent.short}
        </p>
      </div>

      {/* Arrow button */}
      <span style={{
        zIndex: 1, flexShrink: 0,
        width: "clamp(52px, 7vw, 64px)", height: "clamp(52px, 7vw, 64px)",
        borderRadius: "50%", display: "grid", placeItems: "center",
        background: "var(--mint)", color: "var(--forest-deep)",
        border: "none",
        transform: hovered ? "translateX(4px)" : "translateX(0)",
        transition: "transform .2s ease",
      }}>
        <ArrowIcon />
      </span>
    </button>
  );
}

/* ─── Service Card ────────────────────────────── */
function ServiceCard({ agent, delay, onClick }: { agent: Agent; delay: number; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      className="enter"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative", textAlign: "left",
        display: "flex", flexDirection: "column", gap: 14,
        padding: 22,
        background: "var(--surface)",
        border: `1px solid ${hovered ? "rgba(47,168,95,.45)" : "var(--border)"}`,
        borderRadius: "var(--radius)",
        boxShadow: hovered ? "var(--shadow-lg)" : "var(--shadow)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "transform .18s ease, box-shadow .22s ease, border-color .2s ease",
        cursor: "pointer",
        animationDelay: `${delay}s`,
      }}
    >
      {/* Status dot */}
      <span style={{
        position: "absolute", top: 18, right: 18,
        width: 11, height: 11, borderRadius: "50%",
        background: "var(--green)",
        boxShadow: "0 0 0 4px rgba(47,168,95,.22)",
      }} />

      {/* Head: avatar + name/role */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <span style={{
          position: "relative", flexShrink: 0,
          width: 58, height: 58, borderRadius: "50%",
          background: "var(--disc)",
          boxShadow: "0 0 0 2.5px var(--ring)",
          overflow: "hidden",
          display: "block",
        }}>
          <Image
            src={agent.avatar}
            alt={agent.name}
            width={58}
            height={58}
            style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }}
          />
        </span>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: "-.01em", color: "var(--ink)" }}>
            {agent.name}
          </div>
          <div style={{ fontSize: 13.5, color: "var(--ink-soft)", fontWeight: 600, marginTop: 2 }}>
            {agent.role}
          </div>
        </div>
      </div>

      {/* Description */}
      <p style={{ fontSize: 14.5, lineHeight: 1.5, color: "var(--ink-soft)", margin: 0, flex: 1 }}>
        {agent.short}
      </p>

      {/* Open link */}
      <span style={{ display: "inline-flex", alignItems: "center", gap: 7, fontWeight: 700, fontSize: 14.5, color: "var(--accent)" }}>
        Ouvrir{" "}
        <ArrowIcon className={undefined} />
      </span>
    </button>
  );
}
