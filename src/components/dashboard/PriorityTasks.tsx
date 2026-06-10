"use client";

import { useState } from "react";
import { CheckCircle2, Circle, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

const MOCK_TASKS = [
  {
    id: "1",
    title: "Finaliser le contrat PSLA — Famille Martin",
    priority: "high" as const,
    agent: "CLAIRE",
    agentColor: "#f59e0b",
    done: false,
  },
  {
    id: "2",
    title: "Rédiger 3 posts pour la semaine du 15",
    priority: "medium" as const,
    agent: "LILOU",
    agentColor: "#ec4899",
    done: false,
  },
  {
    id: "3",
    title: "Préparer la réunion partenaires promoteurs",
    priority: "high" as const,
    agent: "HUGO",
    agentColor: "#f97316",
    done: true,
  },
];

const priorityLabels: Record<string, { label: string; variant: "danger" | "warning" | "info" }> = {
  high:   { label: "Urgent",  variant: "danger" },
  medium: { label: "Moyen",   variant: "warning" },
  low:    { label: "Faible",  variant: "info" },
};

export function PriorityTasks() {
  const [tasks, setTasks] = useState(MOCK_TASKS);

  const toggle = (id: string) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );

  return (
    <div className="rounded-xl border border-surface-border bg-surface-raised p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-200">Tâches prioritaires</h3>
        <button className="flex items-center gap-1 text-xs text-zinc-600 hover:text-zinc-300 transition-colors">
          <Plus size={13} />
          Ajouter
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {tasks.map((task) => {
          const { label, variant } = priorityLabels[task.priority];
          return (
            <div
              key={task.id}
              className={cn(
                "flex items-start gap-2.5 rounded-lg p-2.5 transition-colors",
                task.done ? "opacity-50" : "hover:bg-surface-overlay"
              )}
            >
              <button
                onClick={() => toggle(task.id)}
                className="mt-0.5 flex-shrink-0 text-zinc-600 hover:text-brand-400 transition-colors"
              >
                {task.done ? (
                  <CheckCircle2 size={16} className="text-emerald-500" />
                ) : (
                  <Circle size={16} />
                )}
              </button>

              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "text-xs text-zinc-300",
                    task.done && "line-through"
                  )}
                >
                  {task.title}
                </p>
                <div className="mt-1 flex items-center gap-1.5">
                  <Badge variant={variant}>{label}</Badge>
                  <span
                    className="text-[10px] font-medium"
                    style={{ color: task.agentColor }}
                  >
                    {task.agent}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
