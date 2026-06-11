"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { AGENTS } from "@/lib/agents";
import type { Agent } from "@/lib/agents";

/* ─── Icons ───────────────────────────────────────── */
function ArrowLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" width={17} height={17}>
      <path d="M19 12H5M11 6l-6 6 6 6" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" width={19} height={19}>
      <path d="M22 2L11 13M22 2L15 22 11 13 2 9l20-7z" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ClipIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" width={18} height={18}>
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" width={17} height={17}>
      <path d="M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z" stroke="currentColor" strokeWidth={1.9} strokeLinejoin="round" />
    </svg>
  );
}
function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" width={17} height={17}>
      <circle cx={12} cy={12} r={4.2} stroke="currentColor" strokeWidth={1.9} />
      <path d="M12 2.5v2.2M12 19.3v2.2M21.5 12h-2.2M4.7 12H2.5M18.4 5.6l-1.5 1.5M7.1 16.9l-1.5 1.5M18.4 18.4l-1.5-1.5M7.1 7.1L5.6 5.6" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" />
    </svg>
  );
}

function FileIcon({ type }: { type: "pdf" | "doc" | "xls" | "img" }) {
  const colors: Record<string, string> = {
    pdf: "#E45353",
    doc: "#4A90D9",
    xls: "#3DAD6E",
    img: "#9B6DD4",
  };
  const labels: Record<string, string> = { pdf: "PDF", doc: "DOC", xls: "XLS", img: "IMG" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: 42, height: 42, borderRadius: 10, flexShrink: 0,
      background: `${colors[type]}18`,
      color: colors[type],
      fontSize: 10, fontWeight: 800, letterSpacing: ".04em",
    }}>
      {labels[type]}
    </span>
  );
}

/* ─── Types ────────────────────────────────────────── */
interface Message {
  id: string;
  role: "agent" | "user";
  text: string;
}

type Tab = "chat" | string; // "chat" | action.id | "docs"

interface ServicePageProps {
  agent: Agent;
  dark: boolean;
  onToggleTheme: () => void;
  onHome: () => void;
}

/* ─── Service Page ─────────────────────────────────── */
export function ServicePage({ agent, dark, onToggleTheme, onHome }: ServicePageProps) {
  const thomas = AGENTS.find((a) => a.isManager)!;
  const [activeTab, setActiveTab] = useState<Tab>("chat");
  const [messages, setMessages] = useState<Message[]>([
    { id: "intro", role: "agent", text: agent.intro },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function uid() {
    return Math.random().toString(36).slice(2);
  }

  async function callAPI(userMsg: Message) {
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    const msgsBefore = messages;
    setMessages((prev) => [...prev, userMsg]);
    setTyping(true);

    const agentMsgId = uid();
    let firstChunk = true;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: abortRef.current.signal,
        body: JSON.stringify({
          agentId: agent.id,
          messages: [...msgsBefore, userMsg],
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let text = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        if (firstChunk) {
          firstChunk = false;
          setTyping(false);
          setMessages((prev) => [...prev, { id: agentMsgId, role: "agent", text: "" }]);
        }

        text += decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) => (m.id === agentMsgId ? { ...m, text } : m))
        );
      }

      if (firstChunk) setTyping(false);
    } catch (e: unknown) {
      if (e instanceof Error && e.name === "AbortError") return;
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: agentMsgId,
          role: "agent",
          text: "Désolé, une erreur s'est produite. Veuillez réessayer.",
        },
      ]);
    }
  }

  function runAction(actionId: string) {
    const action = agent.actions.find((a) => a.id === actionId);
    if (!action) return;
    setActiveTab(actionId);
    callAPI({ id: uid(), role: "user", text: action.seed });
  }

  function sendMessage() {
    const text = input.trim();
    if (!text || typing) return;
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    callAPI({ id: uid(), role: "user", text });
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function autoResize(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 140) + "px";
  }

  const showChat = activeTab !== "docs";

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)" }}>

      {/* ── Topbar ── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 40,
        display: "flex", alignItems: "center", gap: 14,
        padding: "0 clamp(16px, 4vw, 48px)",
        height: 66,
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
      }}>
        {/* Back */}
        <button
          onClick={onHome}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            height: 40, padding: "0 16px",
            borderRadius: 999,
            border: "1px solid var(--border-strong)",
            background: "transparent",
            color: "var(--ink-soft)",
            fontWeight: 700, fontSize: 13.5,
            flexShrink: 0, cursor: "pointer",
            transition: "transform .15s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "translateX(-2px)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
        >
          <ArrowLeftIcon />
          Accueil
        </button>

        {/* Agent identity */}
        <div style={{ display: "flex", alignItems: "center", gap: 11, flex: 1, minWidth: 0 }}>
          <span style={{
            position: "relative", flexShrink: 0,
            width: 40, height: 40, borderRadius: "50%",
            boxShadow: "0 0 0 2.5px var(--ring)",
            overflow: "hidden", display: "block",
            background: "var(--disc)",
          }}>
            <Image src={agent.avatar} alt={agent.name} width={40} height={40} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
          </span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: 16, letterSpacing: "-.01em", color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {agent.name}
            </div>
            <div style={{ fontSize: 12.5, color: "var(--ink-faint)", fontWeight: 600 }}>
              {agent.role}
            </div>
          </div>
          {/* Status badge */}
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            height: 26, padding: "0 11px",
            borderRadius: 999,
            background: "var(--green-soft)",
            color: "var(--green)",
            fontSize: 12, fontWeight: 700,
            flexShrink: 0,
          }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--green)", display: "inline-block" }} />
            En ligne
          </span>
        </div>

        {/* Theme toggle */}
        <button
          onClick={onToggleTheme}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            height: 40, padding: "0 14px",
            borderRadius: 999,
            border: "1px solid var(--border-strong)",
            background: "var(--surface)",
            color: "var(--ink-soft)",
            fontWeight: 700, fontSize: 13,
            flexShrink: 0, cursor: "pointer",
            transition: "transform .15s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
        >
          {dark ? <SunIcon /> : <MoonIcon />}
          <span style={{ display: "none" as const }}>{dark ? "Clair" : "Sombre"}</span>
        </button>
      </header>

      {/* ── Tabs ── */}
      <div style={{
        position: "sticky", top: 66, zIndex: 30,
        background: "color-mix(in srgb, var(--bg) 88%, transparent)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid var(--border)",
        padding: "0 clamp(16px, 4vw, 48px)",
        display: "flex", alignItems: "center", gap: 8,
        overflowX: "auto", msOverflowStyle: "none",
        scrollbarWidth: "none",
        height: 54,
      }}>
        {/* Discussion tab */}
        <TabPill label="Discussion" active={activeTab === "chat"} onClick={() => setActiveTab("chat")} />
        {/* Action tabs */}
        {agent.actions.map((action) => (
          <TabPill
            key={action.id}
            label={action.label}
            active={activeTab === action.id}
            onClick={() => runAction(action.id)}
          />
        ))}
        {/* Documents tab — pushed right */}
        <span style={{ marginLeft: "auto", flexShrink: 0 }}>
          <TabPill
            label="Documents"
            active={activeTab === "docs"}
            onClick={() => setActiveTab("docs")}
            dashed
          />
        </span>
      </div>

      {/* ── Main content ── */}
      <main style={{ flex: 1, width: "100%", maxWidth: 820, margin: "0 auto", padding: "0 clamp(16px, 4vw, 48px)", display: "flex", flexDirection: "column" }}>

        {/* ── Thomas pill (not shown for Thomas himself) ── */}
        {!agent.isManager && (
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 9,
            margin: "20px 0 4px",
            padding: "7px 14px 7px 9px",
            borderRadius: 999,
            background: "var(--surface-3)",
            border: "1px solid var(--border)",
            alignSelf: "flex-start",
          }}>
            <span style={{ width: 28, height: 28, borderRadius: "50%", overflow: "hidden", display: "block", flexShrink: 0 }}>
              <Image src={thomas.avatar} alt="Thomas" width={28} height={28} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </span>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--ink-soft)" }}>
              Service piloté par <span style={{ color: "var(--ink)" }}>Thomas</span> (Manager)
            </span>
          </div>
        )}

        {/* ── Chat view ── */}
        {showChat && (
          <>
            <div style={{ flex: 1, paddingTop: agent.isManager ? 20 : 12, paddingBottom: 16, display: "flex", flexDirection: "column", gap: 6 }}>
              {messages.map((msg) => (
                <ChatMessage key={msg.id} msg={msg} agent={agent} />
              ))}

              {/* Typing indicator */}
              {typing && (
                <div style={{ display: "flex", alignItems: "flex-end", gap: 10, marginTop: 6 }}>
                  <span style={{
                    width: 36, height: 36, borderRadius: "50%", overflow: "hidden", display: "block", flexShrink: 0,
                    boxShadow: "0 0 0 2px var(--ring)", marginBottom: 0,
                  }}>
                    <Image src={agent.avatar} alt={agent.name} width={36} height={36} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </span>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 5,
                    padding: "12px 16px", borderRadius: "18px 18px 18px 6px",
                    background: "var(--bubble-agent)",
                    boxShadow: "var(--shadow)",
                    border: "1px solid var(--border)",
                  }}>
                    {[0, 1, 2].map((i) => (
                      <span key={i} style={{
                        width: 7, height: 7, borderRadius: "50%",
                        background: "var(--ink-faint)",
                        animation: "bounce 1.2s ease infinite",
                        animationDelay: `${i * 0.18}s`,
                        display: "inline-block",
                      }} />
                    ))}
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* ── Composer ── */}
            <div style={{
              position: "sticky", bottom: 0,
              paddingTop: 10, paddingBottom: 20,
              background: "linear-gradient(to top, var(--bg) 70%, transparent)",
            }}>
              <div style={{
                display: "flex", alignItems: "flex-end", gap: 10,
                padding: "10px 12px 10px 16px",
                borderRadius: 22,
                border: "1.5px solid var(--border-strong)",
                background: "var(--surface)",
                boxShadow: "var(--shadow)",
                transition: "border-color .2s ease",
              }}
                onFocusCapture={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                onBlurCapture={(e) => (e.currentTarget.style.borderColor = "var(--border-strong)")}
              >
                {/* Clip button */}
                <button style={{
                  flexShrink: 0, width: 38, height: 38,
                  display: "grid", placeItems: "center",
                  borderRadius: "50%", border: "none",
                  background: "transparent", color: "var(--ink-faint)",
                  cursor: "pointer", transition: "color .15s ease",
                }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ink-soft)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink-faint)")}
                >
                  <ClipIcon />
                </button>

                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={autoResize}
                  onKeyDown={handleKey}
                  placeholder={`Message ${agent.name}…`}
                  rows={1}
                  style={{
                    flex: 1, border: "none", outline: "none", resize: "none",
                    background: "transparent", font: "inherit",
                    fontSize: 15, color: "var(--ink)",
                    lineHeight: 1.5, padding: "6px 0",
                    maxHeight: 140,
                  }}
                />

                {/* Send button */}
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || typing}
                  style={{
                    flexShrink: 0, width: 40, height: 40,
                    display: "grid", placeItems: "center",
                    borderRadius: "50%", border: "none",
                    background: (input.trim() && !typing) ? "var(--forest)" : "var(--border)",
                    color: (input.trim() && !typing) ? "#fff" : "var(--ink-faint)",
                    cursor: (input.trim() && !typing) ? "pointer" : "default",
                    transition: "background .2s ease",
                  }}
                >
                  <SendIcon />
                </button>
              </div>
            </div>
          </>
        )}

        {/* ── Documents view ── */}
        {activeTab === "docs" && (
          <div style={{ paddingTop: 24, paddingBottom: 40 }}>
            <p style={{ fontSize: 12.5, fontWeight: 800, letterSpacing: ".2em", textTransform: "uppercase", color: "var(--ink-faint)", margin: "0 0 18px" }}>
              Documents
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {agent.documents.map((doc, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: "14px 18px",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  boxShadow: "var(--shadow)",
                }}>
                  <FileIcon type={doc.type} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {doc.name}
                    </div>
                    <div style={{ fontSize: 12.5, color: "var(--ink-faint)", marginTop: 2 }}>
                      {doc.meta}
                    </div>
                  </div>
                  <button style={{
                    flexShrink: 0,
                    height: 34, padding: "0 14px",
                    borderRadius: 999,
                    border: "1px solid var(--border-strong)",
                    background: "transparent",
                    color: "var(--ink-soft)",
                    fontWeight: 700, fontSize: 13,
                    cursor: "pointer",
                    transition: "background .15s ease, color .15s ease",
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "var(--forest)"; e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--ink-soft)"; }}
                  >
                    Télécharger
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

/* ─── Tab Pill ─────────────────────────────────────── */
function TabPill({ label, active, onClick, dashed }: { label: string; active: boolean; onClick: () => void; dashed?: boolean }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center",
        height: 34, padding: "0 16px",
        borderRadius: 999, flexShrink: 0,
        border: dashed ? "1.5px dashed var(--border-strong)" : `1px solid ${active ? "transparent" : "var(--border)"}`,
        background: active ? "var(--forest)" : "transparent",
        color: active ? "#fff" : "var(--ink-soft)",
        fontWeight: 700, fontSize: 13.5,
        cursor: "pointer",
        transition: "background .18s ease, color .18s ease",
        whiteSpace: "nowrap" as const,
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.background = "var(--surface)";
          e.currentTarget.style.color = "var(--ink)";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "var(--ink-soft)";
        }
      }}
    >
      {label}
    </button>
  );
}

/* ─── Chat Message ─────────────────────────────────── */
function ChatMessage({ msg, agent }: { msg: Message; agent: Agent }) {
  const isAgent = msg.role === "agent";

  if (isAgent) {
    return (
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, maxWidth: "80%" }}>
        <span style={{
          width: 36, height: 36, borderRadius: "50%", overflow: "hidden", display: "block",
          flexShrink: 0, marginTop: 22,
          boxShadow: "0 0 0 2px var(--ring)",
        }}>
          <Image src={agent.avatar} alt={agent.name} width={36} height={36} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </span>
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--ink-faint)", marginBottom: 6 }}>
            {agent.name}
          </div>
          <div style={{
            padding: "12px 16px",
            borderRadius: "18px 18px 18px 6px",
            background: "var(--bubble-agent)",
            color: "var(--bubble-agent-ink)",
            boxShadow: "var(--shadow)",
            border: "1px solid var(--border)",
            fontSize: 15, lineHeight: 1.6,
            whiteSpace: "pre-wrap",
          }}>
            {msg.text}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6 }}>
      <div style={{
        maxWidth: "76%",
        padding: "12px 16px",
        borderRadius: "18px 6px 18px 18px",
        background: "var(--bubble-me)",
        color: "var(--bubble-me-ink)",
        fontSize: 15, lineHeight: 1.6,
        whiteSpace: "pre-wrap",
      }}>
        {msg.text}
      </div>
    </div>
  );
}
