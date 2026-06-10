"use client";

import { useState } from "react";
import { SendHorizonal, ChevronDown } from "lucide-react";
import { AGENTS } from "@/lib/agents";
import { Button } from "@/components/ui/Button";

export function NewRequestCard() {
  const [request, setRequest] = useState("");
  const [selectedAgent, setSelectedAgent] = useState<string>("thomas");

  const agent = AGENTS.find((a) => a.id === selectedAgent);

  return (
    <div className="rounded-xl border border-surface-border bg-surface-raised p-4">
      <h3 className="mb-3 text-sm font-semibold text-zinc-200">
        Nouvelle demande
      </h3>

      <div className="flex flex-col gap-3">
        {/* Text area */}
        <textarea
          value={request}
          onChange={(e) => setRequest(e.target.value)}
          placeholder="Décrivez votre mission… THOMAS la transmettra automatiquement au bon agent."
          className="min-h-[80px] w-full resize-none rounded-lg border border-surface-border bg-surface-overlay px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-brand-500/50 focus:outline-none focus:ring-1 focus:ring-brand-500/20 transition-all"
          rows={3}
        />

        {/* Bottom row */}
        <div className="flex items-center justify-between">
          {/* Agent selector */}
          <div className="relative flex items-center gap-2">
            <span className="text-xs text-zinc-600">Confier à :</span>
            <button className="flex items-center gap-1.5 rounded-lg border border-surface-border bg-surface-overlay px-2.5 py-1.5 text-xs text-zinc-300 hover:border-surface-muted transition-colors">
              {agent && (
                <span className="text-emerald-400 font-bold text-xs">{agent.name[0]}</span>
              )}
              <span>{agent?.name ?? "THOMAS"}</span>
              <ChevronDown size={11} className="text-zinc-600" />
            </button>

            {/* Dropdown — will be wired in Phase 3 */}
            <div className="absolute left-16 top-full mt-1 hidden w-48 rounded-lg border border-surface-border bg-surface-overlay p-1 shadow-xl">
              {AGENTS.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setSelectedAgent(a.id)}
                  className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs text-zinc-300 hover:bg-surface-raised"
                >
                  <span className="text-emerald-400 font-bold">{a.name[0]}</span>
                  <span>{a.name}</span>
                </button>
              ))}
            </div>
          </div>

          <Button
            variant="primary"
            size="sm"
            disabled={!request.trim()}
            className="gap-1.5"
          >
            <SendHorizonal size={13} />
            Envoyer
          </Button>
        </div>
      </div>
    </div>
  );
}
