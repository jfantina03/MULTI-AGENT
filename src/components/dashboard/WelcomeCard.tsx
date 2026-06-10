import { Sparkles } from "lucide-react";

export function WelcomeCard() {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Bonjour" : hour < 18 ? "Bon après-midi" : "Bonsoir";

  return (
    <div className="relative overflow-hidden rounded-xl border border-brand-600/30 bg-gradient-to-br from-brand-600/10 via-surface-raised to-surface-raised p-6">
      {/* Background glow */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-600/10 blur-3xl" />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-zinc-500">{greeting},</p>
          <h2 className="mt-0.5 text-2xl font-bold text-white">Jade 👋</h2>
          <p className="mt-2 max-w-md text-sm text-zinc-400">
            Bienvenue sur <span className="text-brand-400 font-medium">ORIZON ACCESSION AI</span>.
            Vos agents sont prêts. Quelle mission voulez-vous confier aujourd&apos;hui ?
          </p>
        </div>
        <div className="hidden sm:flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-brand-600/20 border border-brand-600/30">
          <Sparkles size={22} className="text-brand-400" />
        </div>
      </div>

      {/* Stats row */}
      <div className="mt-5 flex flex-wrap gap-4">
        {[
          { label: "Agents actifs", value: "7" },
          { label: "Documents générés", value: "0" },
          { label: "Missions ce mois", value: "0" },
        ].map(({ label, value }) => (
          <div key={label} className="flex flex-col">
            <span className="text-xl font-bold text-white">{value}</span>
            <span className="text-xs text-zinc-500">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
