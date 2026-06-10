import { AppLayout } from "@/components/layout/AppLayout";
import { Library, Search, Filter } from "lucide-react";
import { AGENTS } from "@/lib/agents";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "Bibliothèque documentaire | ORIZON AI",
};

export default function BibliothequePage() {
  return (
    <AppLayout title="Bibliothèque documentaire">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Bibliothèque</h1>
            <p className="mt-1 text-sm text-zinc-500">
              Tous vos documents générés, classés par agent et par catégorie.
            </p>
          </div>
          <Button variant="secondary" size="sm">
            <Filter size={13} />
            Filtrer
          </Button>
        </div>

        {/* Search */}
        <div className="mb-5 flex items-center gap-2 rounded-xl border border-surface-border bg-surface-raised px-4 py-2.5">
          <Search size={15} className="text-zinc-600" />
          <input
            type="text"
            placeholder="Rechercher un document…"
            className="flex-1 bg-transparent text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none"
          />
        </div>

        {/* Agent tabs */}
        <div className="mb-5 flex flex-wrap gap-2">
          <button className="rounded-lg border border-brand-600/40 bg-brand-600/10 px-3 py-1.5 text-xs font-medium text-brand-400">
            Tous
          </button>
          {AGENTS.map((agent) => (
            <button
              key={agent.id}
              className="rounded-lg border border-surface-border px-3 py-1.5 text-xs font-medium text-zinc-500 hover:border-surface-muted hover:text-zinc-300 transition-colors"
            >
              {agent.name}
            </button>
          ))}
        </div>

        {/* Empty state */}
        <div className="flex flex-col items-center justify-center py-20 text-center rounded-xl border border-dashed border-surface-border">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-overlay border border-surface-border">
            <Library size={24} className="text-zinc-600" />
          </div>
          <p className="text-sm font-medium text-zinc-400">
            Aucun document pour l&apos;instant
          </p>
          <p className="mt-1.5 text-xs text-zinc-600 max-w-xs">
            Les documents générés par vos agents apparaîtront ici automatiquement.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
