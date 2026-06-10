import { TrendingUp, MessageSquare, FileText, Zap } from "lucide-react";

const STATS = [
  {
    label: "Conversations",
    value: "0",
    change: null,
    icon: MessageSquare,
    color: "#6366f1",
  },
  {
    label: "Documents créés",
    value: "0",
    change: null,
    icon: FileText,
    color: "#10b981",
  },
  {
    label: "Missions traitées",
    value: "0",
    change: null,
    icon: Zap,
    color: "#f59e0b",
  },
  {
    label: "Temps économisé",
    value: "0h",
    change: null,
    icon: TrendingUp,
    color: "#3b82f6",
  },
];

export function ActivityOverview() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {STATS.map(({ label, value, icon: Icon, color }) => (
        <div
          key={label}
          className="rounded-xl border border-surface-border bg-surface-raised p-4"
        >
          <div
            className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${color}18`, border: `1px solid ${color}25` }}
          >
            <Icon size={16} style={{ color }} />
          </div>
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="mt-0.5 text-xs text-zinc-600">{label}</p>
        </div>
      ))}
    </div>
  );
}
