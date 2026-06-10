import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";

// Placeholder data — will be replaced by real data in Phase 3
const MOCK_DOCS = [
  {
    id: "1",
    title: "Contrat de mandat — Dupont",
    agent: "CLAIRE",
    agentColor: "#f59e0b",
    category: "Juridique",
    date: "Aujourd'hui",
  },
  {
    id: "2",
    title: "Post LinkedIn — Lancement agence",
    agent: "LILOU",
    agentColor: "#ec4899",
    category: "Social media",
    date: "Hier",
  },
  {
    id: "3",
    title: "Prévisionnel CA — S1 2025",
    agent: "LÉO",
    agentColor: "#3b82f6",
    category: "Finance",
    date: "Il y a 2j",
  },
];

export function RecentDocuments() {
  return (
    <div className="rounded-xl border border-surface-border bg-surface-raised p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-200">
          Derniers documents
        </h3>
        <Button variant="ghost" size="sm" className="text-zinc-600 hover:text-zinc-300">
          Tout voir
        </Button>
      </div>

      {MOCK_DOCS.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex flex-col gap-1">
          {MOCK_DOCS.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center gap-3 rounded-lg p-2.5 hover:bg-surface-overlay transition-colors cursor-pointer group"
            >
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-surface-overlay border border-surface-border">
                <FileText size={14} className="text-zinc-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-zinc-300 truncate">
                  {doc.title}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className="text-[10px] font-medium"
                    style={{ color: doc.agentColor }}
                  >
                    {doc.agent}
                  </span>
                  <span className="text-zinc-700">·</span>
                  <span className="text-[10px] text-zinc-600">{doc.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-surface-overlay border border-surface-border">
        <Plus size={18} className="text-zinc-600" />
      </div>
      <p className="text-xs text-zinc-500">Aucun document pour l&apos;instant</p>
      <p className="text-[11px] text-zinc-700 mt-1">
        Vos documents générés apparaîtront ici
      </p>
    </div>
  );
}
