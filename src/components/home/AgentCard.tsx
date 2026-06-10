import Link from "next/link";
import type { Agent } from "@/types";

// Warm avatar backgrounds matching the illustrated portrait style
const AVATAR_BG: Record<string, string> = {
  hugo:   "linear-gradient(135deg, #c4a882 0%, #a8855c 100%)",
  lilou:  "linear-gradient(135deg, #f9a8d4 0%, #ec4899 100%)",
  claire: "linear-gradient(135deg, #fde68a 0%, #f59e0b 100%)",
  lucas:  "linear-gradient(135deg, #6ee7b7 0%, #10b981 100%)",
  leo:    "linear-gradient(135deg, #93c5fd 0%, #3b82f6 100%)",
  ines:   "linear-gradient(135deg, #c4b5fd 0%, #8b5cf6 100%)",
  thomas: "linear-gradient(135deg, #c4a882 0%, #a8855c 100%)",
};

interface AgentCardProps {
  agent: Agent;
}

export function AgentCard({ agent }: AgentCardProps) {
  return (
    <Link href={agent.href} className="block group">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 p-5 h-full flex flex-col">

        {/* Avatar with status dot */}
        <div className="relative inline-block w-fit mb-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-sm"
            style={{ background: AVATAR_BG[agent.id] ?? AVATAR_BG.thomas }}
          >
            {agent.emoji}
          </div>
          {/* Status dot — bottom-right of avatar */}
          <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
        </div>

        {/* Name */}
        <p className="font-bold text-gray-900 text-base leading-tight mb-0.5">
          {agent.name}
        </p>

        {/* Role */}
        <p className="text-sm text-gray-500 mb-2">{agent.role}</p>

        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 flex-1">
          {agent.description}
        </p>

        {/* Ouvrir link */}
        <div className="mt-3 pt-3 border-t border-gray-50">
          <span className="text-emerald-600 font-medium text-sm group-hover:text-emerald-700 transition-colors">
            Ouvrir →
          </span>
        </div>
      </div>
    </Link>
  );
}
