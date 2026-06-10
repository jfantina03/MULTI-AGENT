import Link from "next/link";
import { AGENTS } from "@/lib/agents";
import { ArrowRight } from "lucide-react";

export function AgentShortcuts() {
  return (
    <div className="rounded-xl border border-surface-border bg-surface-raised p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-200">Mes agents</h3>
        <span className="text-xs text-zinc-600">{AGENTS.length} disponibles</span>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {AGENTS.map((agent) => (
          <Link
            key={agent.id}
            href={`/agents/${agent.id}`}
            className="group flex items-center gap-3 rounded-lg border border-transparent p-2.5 transition-all duration-150 hover:border-surface-border hover:bg-surface-overlay"
          >
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold bg-emerald-900/30 text-emerald-400">
              {agent.name[0]}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-zinc-200 truncate">
                {agent.name}
              </p>
              <p className="text-[11px] text-zinc-600 truncate">{agent.role}</p>
            </div>

            <ArrowRight
              size={13}
              className="flex-shrink-0 text-zinc-700 opacity-0 transition-opacity group-hover:opacity-100"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
