import { Calendar, Clock } from "lucide-react";

const EVENTS = [
  {
    id: "1",
    title: "RDV prospects — Famille Moreau",
    time: "10h00",
    day: "Demain",
    color: "#f97316",
  },
  {
    id: "2",
    title: "Signature compromis BRS",
    time: "14h30",
    day: "Jeudi 13",
    color: "#f59e0b",
  },
  {
    id: "3",
    title: "Webinaire PSLA Promoteurs",
    time: "17h00",
    day: "Vendredi 14",
    color: "#6366f1",
  },
];

export function CalendarWidget() {
  return (
    <div className="rounded-xl border border-surface-border bg-surface-raised p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-200">Agenda</h3>
        <button className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-300 transition-colors">
          <Calendar size={12} />
          Voir tout
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {EVENTS.map((event) => (
          <div
            key={event.id}
            className="flex items-start gap-3 rounded-lg p-2.5 hover:bg-surface-overlay transition-colors cursor-pointer"
          >
            {/* Color bar */}
            <div
              className="mt-1 h-full w-0.5 rounded-full flex-shrink-0 self-stretch"
              style={{ backgroundColor: event.color, minHeight: 32 }}
            />

            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-zinc-300 truncate">
                {event.title}
              </p>
              <div className="mt-1 flex items-center gap-1.5">
                <Clock size={11} className="text-zinc-600" />
                <span className="text-[11px] text-zinc-600">
                  {event.day} · {event.time}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
