"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Moon, Sun, Paperclip, Send } from "lucide-react";
import type { Agent } from "@/types";

interface AgentLayoutProps {
  agent: Agent;
}

const TABS: Record<string, string[]> = {
  thomas: ["Discussion", "Plan d'action", "Synthèse", "Documents"],
  lilou:  ["Discussion", "Calendrier éditorial", "Contenus", "Documents"],
  claire: ["Discussion", "Contrats", "Courriers", "Documents"],
  lucas:  ["Discussion", "Comptes rendus", "Courriers", "Documents"],
  leo:    ["Discussion", "Prévisionnels", "Tableaux de bord", "Documents"],
  hugo:   ["Discussion", "Liste de prospection", "Fiche entreprise", "Argumentaire", "Documents"],
  ines:   ["Discussion", "Analyse marché", "Rapports", "Documents"],
};

const GREETINGS: Record<string, string> = {
  thomas: "Bonjour Jade ! Je suis Thomas, votre Manager IA. Donnez-moi un objectif et je le répartis entre les bons services.",
  lilou:  "Bonjour Jade ! Je suis Lilou, votre Community Manager. Dites-moi quels contenus vous souhaitez créer.",
  claire: "Bonjour Jade ! Je suis Claire, votre juriste IA. Posez-moi vos questions juridiques ou demandez-moi de rédiger un document.",
  lucas:  "Bonjour Jade ! Je suis Lucas, votre assistant rédactionnel. Je reformule, rédige vos comptes rendus et courriers.",
  leo:    "Bonjour Jade ! Je suis Léo, votre analyste financier. Je produis prévisionnels, bilans et tableaux de bord KPI.",
  hugo:   "Bonjour Jade ! Je suis Hugo, votre commercial. Je repère les clients et entreprises à prospecter en Ille-et-Vilaine (35). Dites-moi ce qu'il vous faut.",
  ines:   "Bonjour Jade ! Je suis Inès, votre analyste stratégique. Je produis analyses concurrentielles, rapports et veille marché.",
};

// Warm gradients matching home page avatar styles
const AVATAR_BG: Record<string, string> = {
  hugo:   "linear-gradient(135deg, #c4a882 0%, #a8855c 100%)",
  lilou:  "linear-gradient(135deg, #f9a8d4 0%, #ec4899 100%)",
  claire: "linear-gradient(135deg, #fde68a 0%, #f59e0b 100%)",
  lucas:  "linear-gradient(135deg, #6ee7b7 0%, #10b981 100%)",
  leo:    "linear-gradient(135deg, #93c5fd 0%, #3b82f6 100%)",
  ines:   "linear-gradient(135deg, #c4b5fd 0%, #8b5cf6 100%)",
  thomas: "linear-gradient(135deg, #c4a882 0%, #a8855c 100%)",
};

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function AgentLayout({ agent }: AgentLayoutProps) {
  const tabs = TABS[agent.id] ?? ["Discussion", "Documents"];
  // Separate "Documents" from the other tabs
  const mainTabs = tabs.filter((t) => t !== "Documents");

  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "greeting",
      role: "assistant",
      content:
        GREETINGS[agent.id] ??
        `Bonjour Jade ! Je suis ${agent.name}. Comment puis-je vous aider ?`,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const displayName =
    agent.name.charAt(0).toUpperCase() + agent.name.slice(1).toLowerCase();

  function handleSend() {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    setMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, role: "user", content: trimmed },
    ]);
    setInputValue("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: `Je travaille sur votre demande : « ${trimmed} ». Je vous prépare une réponse détaillée.`,
        },
      ]);
    }, 800);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const bg = darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900";
  const border = darkMode ? "border-gray-700" : "border-gray-200";
  const headerBg = darkMode ? "bg-gray-900" : "bg-white";
  const subtleText = darkMode ? "text-gray-400" : "text-gray-500";
  const tabInactive = darkMode ? "text-gray-400 hover:text-gray-100" : "text-gray-500 hover:text-gray-900";
  const bannerBg = darkMode ? "bg-gray-800 text-gray-400" : "bg-gray-50 text-gray-500";
  const bubbleBg = darkMode ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-white border border-gray-100 shadow-sm text-gray-800";
  const userBubble = "bg-emerald-600 text-white";
  const inputBg = darkMode ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400";

  return (
    <div className={`min-h-screen flex flex-col ${bg}`}>

      {/* ── Header ── */}
      <header className={`flex items-center justify-between px-4 py-3 border-b ${headerBg} ${border}`}>
        {/* Back */}
        <Link
          href="/"
          className={`flex items-center gap-1 text-sm font-medium ${subtleText} hover:text-gray-900 dark:hover:text-white transition-colors`}
        >
          <ChevronLeft size={16} />
          Accueil
        </Link>

        {/* Agent identity */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-base shadow-sm flex-shrink-0"
            style={{ background: AVATAR_BG[agent.id] ?? AVATAR_BG.thomas }}
          >
            {agent.emoji}
          </div>
          <div className="leading-tight">
            <p className="font-bold text-sm">{displayName}</p>
            <p className={`text-xs ${subtleText}`}>{agent.role}</p>
          </div>
          {/* Disponible badge */}
          <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
            disponible
          </span>
        </div>

        {/* Dark mode toggle */}
        <button
          onClick={() => setDarkMode((d) => !d)}
          className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-xl border transition-colors ${
            darkMode
              ? "bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700"
              : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
          }`}
        >
          {darkMode ? (
            <Sun size={13} className="text-amber-500" />
          ) : (
            <Moon size={13} />
          )}
          {darkMode ? "Clair" : "Sombre"}
        </button>
      </header>

      {/* ── Tab bar ── */}
      <div className={`flex items-center px-4 py-2 border-b ${headerBg} ${border} overflow-x-auto gap-1`}>
        {/* Main tabs */}
        {mainTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3.5 py-1.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab
                ? darkMode
                  ? "bg-gray-600 text-white"
                  : "bg-gray-900 text-white"
                : tabInactive
            }`}
          >
            {tab}
          </button>
        ))}

        {/* Spacer + Documents tab pushed right */}
        <div className="flex-1" />
        <button
          onClick={() => setActiveTab("Documents")}
          className={`px-3.5 py-1.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
            activeTab === "Documents"
              ? darkMode
                ? "bg-gray-600 text-white"
                : "bg-gray-900 text-white"
              : tabInactive
          }`}
        >
          Documents
        </button>
      </div>

      {/* ── Thomas banner (hidden for Thomas) ── */}
      {agent.id !== "thomas" && (
        <div className={`flex items-center gap-2 px-4 py-2 text-xs ${bannerBg}`}>
          {/* Mini Thomas avatar */}
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #c4a882 0%, #a8855c 100%)" }}
          >
            🧠
          </div>
          <span>Service piloté par Thomas (Manager)</span>
        </div>
      )}

      {/* ── Chat area ── */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-5">
        {messages.map((msg) =>
          msg.role === "assistant" ? (
            /* Assistant message: avatar + name + bubble */
            <div key={msg.id} className="flex items-start gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5"
                style={{ background: AVATAR_BG[agent.id] ?? AVATAR_BG.thomas }}
              >
                {agent.emoji}
              </div>
              <div className="flex flex-col gap-1 max-w-[80%]">
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {displayName}
                </span>
                <div className={`rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed ${bubbleBg}`}>
                  {msg.content}
                </div>
              </div>
            </div>
          ) : (
            /* User message: right-aligned green bubble */
            <div key={msg.id} className="flex justify-end">
              <div className={`max-w-[75%] rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed ${userBubble}`}>
                {msg.content}
              </div>
            </div>
          )
        )}
      </div>

      {/* ── Input bar ── */}
      <div className={`px-4 py-3 border-t ${headerBg} ${border}`}>
        <div className="flex items-center gap-2 max-w-3xl mx-auto">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Écrire à ${displayName}...`}
            className={`flex-1 rounded-xl px-4 py-2.5 text-sm border outline-none transition-colors focus:border-emerald-400 ${inputBg}`}
          />
          {/* Paperclip */}
          <button className={`p-2 rounded-lg transition-colors ${darkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-400 hover:text-gray-600"}`}>
            <Paperclip size={17} />
          </button>
          {/* Send */}
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 hover:bg-emerald-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
