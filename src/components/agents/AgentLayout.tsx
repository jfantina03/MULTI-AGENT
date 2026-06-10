"use client";

import { useState } from "react";
import Link from "next/link";
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
  thomas: "Bonjour ! Je suis Thomas, votre Manager IA. Donnez-moi un objectif et je le répartis entre les bons services.",
  lilou:  "Salut ! Je suis Lilou, votre Community Manager. Partagez-moi vos besoins en contenu et je prépare tout pour vous.",
  claire: "Bonjour ! Je suis Claire, votre juriste IA. Posez-moi vos questions juridiques ou demandez-moi de rédiger un document.",
  lucas:  "Bonjour ! Je suis Lucas, votre assistant rédactionnel. Je peux reformuler, rédiger des comptes rendus, courriers et présentations.",
  leo:    "Bonjour ! Je suis Léo, votre analyste financier. Je peux produire des prévisionnels, comptes de résultat et tableaux de bord KPI.",
  hugo:   "Bonjour ! Je suis Hugo, votre commercial IA. Je peux préparer vos argumentaires, fiches entreprises et stratégie de prospection.",
  ines:   "Bonjour ! Je suis Inès, votre analyste stratégique. Je peux produire des analyses concurrentielles, rapports stratégiques et veille marché.",
};

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function AgentLayout({ agent }: AgentLayoutProps) {
  const tabs = TABS[agent.id] ?? ["Discussion", "Documents"];
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "greeting",
      role: "assistant",
      content: GREETINGS[agent.id] ?? `Bonjour ! Je suis ${agent.name}. Comment puis-je vous aider ?`,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  function handleSend() {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");

    // Simulate assistant response
    setTimeout(() => {
      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: `Je travaille sur votre demande : "${trimmed}". Je vous prépare une réponse détaillée.`,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    }, 800);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const displayName =
    agent.name.charAt(0).toUpperCase() + agent.name.slice(1).toLowerCase();

  return (
    <div
      className={`min-h-screen flex flex-col ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}
    >
      {/* ── Header ── */}
      <header
        className={`flex items-center justify-between px-4 py-3 border-b ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        {/* Back button */}
        <Link
          href="/"
          className={`flex items-center gap-1 text-sm font-medium transition-colors ${
            darkMode
              ? "text-gray-300 hover:text-white"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          ← Accueil
        </Link>

        {/* Agent identity */}
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center text-lg ${agent.color}`}
          >
            {agent.emoji}
          </div>
          <div className="leading-tight">
            <p className="font-bold text-sm">{displayName}</p>
            <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              {agent.role}
            </p>
          </div>
          {/* Availability badge */}
          <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-0.5 ml-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            disponible
          </span>
        </div>

        {/* Dark mode toggle */}
        <button
          onClick={() => setDarkMode((d) => !d)}
          className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
            darkMode
              ? "bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
              : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
          }`}
        >
          {darkMode ? "Clair" : "Sombre"}
        </button>
      </header>

      {/* ── Tab bar ── */}
      <div
        className={`flex items-center gap-1 px-4 py-2 border-b overflow-x-auto ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
        }`}
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab
                ? darkMode
                  ? "bg-gray-600 text-white"
                  : "bg-gray-900 text-white"
                : darkMode
                  ? "text-gray-400 hover:text-gray-200"
                  : "text-gray-500 hover:text-gray-800"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Info banner (not for Thomas) ── */}
      {agent.id !== "thomas" && (
        <div
          className={`px-4 py-2 text-xs ${
            darkMode ? "bg-gray-700/50 text-gray-400" : "bg-gray-100 text-gray-500"
          }`}
        >
          Service piloté par Thomas (Manager)
        </div>
      )}

      {/* ── Chat area ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            {/* Avatar */}
            {msg.role === "assistant" && (
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${agent.color}`}
              >
                {agent.emoji}
              </div>
            )}

            {/* Bubble */}
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-emerald-600 text-white rounded-tr-sm"
                  : darkMode
                    ? "bg-gray-700 text-gray-100 rounded-tl-sm"
                    : "bg-white border border-gray-100 shadow-sm text-gray-800 rounded-tl-sm"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* ── Input bar ── */}
      <div
        className={`px-4 py-3 border-t ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <div className="flex items-center gap-2 max-w-4xl mx-auto">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Écrire à ${displayName}...`}
            className={`flex-1 rounded-xl px-4 py-2.5 text-sm outline-none transition-colors ${
              darkMode
                ? "bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:border-emerald-500"
                : "bg-gray-50 text-gray-900 placeholder-gray-400 border border-gray-200 focus:border-emerald-400"
            }`}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 hover:bg-emerald-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed font-bold text-base"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
