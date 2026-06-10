import type { Agent } from "@/types";

export const AGENTS: Agent[] = [
  {
    id: "thomas",
    name: "THOMAS",
    role: "Manager IA",
    description:
      "Coordonne les missions, répartit les tâches entre les agents et produit des plans d'action.",
    color: "bg-indigo-500",
    colorHex: "#6366f1",
    emoji: "🧠",
    href: "/agents/thomas",
    capabilities: [
      "Analyse et répartition des missions",
      "Plans d'action structurés",
      "Synthèses et comptes rendus",
      "Coordination multi-agents",
    ],
  },
  {
    id: "lilou",
    name: "LILOU",
    role: "Community Manager",
    description:
      "Crée les contenus Instagram, LinkedIn, TikTok, scripts vidéo et gère le calendrier éditorial.",
    color: "bg-pink-500",
    colorHex: "#ec4899",
    emoji: "📱",
    href: "/agents/lilou",
    capabilities: [
      "Posts Instagram, LinkedIn, TikTok",
      "Scripts vidéo et carrousels",
      "Calendrier éditorial",
      "Veille et tendances",
    ],
  },
  {
    id: "claire",
    name: "CLAIRE",
    role: "Juriste",
    description:
      "Rédige contrats et courriers, répond aux questions juridiques et assure la veille réglementaire.",
    color: "bg-amber-500",
    colorHex: "#f59e0b",
    emoji: "⚖️",
    href: "/agents/claire",
    capabilities: [
      "Rédaction de contrats",
      "Courriers juridiques",
      "Questions droit immobilier",
      "Veille BRS, PSLA, ANRU",
    ],
  },
  {
    id: "lucas",
    name: "LUCAS",
    role: "Assistant rédactionnel",
    description:
      "Reformule, rédige comptes rendus, courriers, e-mails, présentations et synthèses.",
    color: "bg-emerald-500",
    colorHex: "#10b981",
    emoji: "✍️",
    href: "/agents/lucas",
    capabilities: [
      "Reformulation professionnelle",
      "Comptes rendus de RDV",
      "Courriers et e-mails",
      "Synthèses et présentations",
    ],
  },
  {
    id: "leo",
    name: "LÉO",
    role: "Financier",
    description:
      "Produit prévisionnels, comptes de résultat, analyses financières et tableaux de bord KPI.",
    color: "bg-blue-500",
    colorHex: "#3b82f6",
    emoji: "📊",
    href: "/agents/leo",
    capabilities: [
      "Prévisionnels financiers",
      "Comptes de résultat",
      "Analyses et KPI",
      "Tableaux de bord",
    ],
  },
  {
    id: "hugo",
    name: "HUGO",
    role: "Commercial",
    description:
      "Prépare argumentaires, fiches entreprises, RDV clients et stratégie de prospection.",
    color: "bg-orange-500",
    colorHex: "#f97316",
    emoji: "🤝",
    href: "/agents/hugo",
    capabilities: [
      "Argumentaires de vente",
      "Préparation de RDV",
      "Fiches entreprises",
      "Prospection B2B/B2C",
    ],
  },
  {
    id: "ines",
    name: "INÈS",
    role: "Analyste stratégique",
    description:
      "Produit analyses concurrentielles, rapports stratégiques, veille marché et recommandations.",
    color: "bg-violet-500",
    colorHex: "#8b5cf6",
    emoji: "📈",
    href: "/agents/ines",
    capabilities: [
      "Analyse concurrentielle",
      "Rapports stratégiques",
      "Analyse des performances",
      "Veille et recommandations",
    ],
  },
];

export function getAgent(id: string): Agent | undefined {
  return AGENTS.find((a) => a.id === id);
}
