import Link from "next/link";
import type { Agent } from "@/types";

interface AgentCardProps {
  agent: Agent;
}

export function AgentCard({ agent }: AgentCardProps) {
  return (
    <Link href={agent.href} className="block group">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 p-5 h-full flex flex-col">
        {/* Top row: avatar + status dot */}
        <div className="flex items-start justify-between mb-3">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${agent.color} flex-shrink-0`}
          >
            {agent.emoji}
          </div>
          <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            disponible
          </span>
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
