import { AppLayout } from "@/components/layout/AppLayout";
import { User, Bell, Shield, Palette, Cpu } from "lucide-react";

export const metadata = {
  title: "Paramètres | ORIZON AI",
};

const SECTIONS = [
  {
    id: "profil",
    label: "Profil",
    icon: User,
    description: "Nom, e-mail, photo de profil",
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
    description: "Alertes et rappels",
  },
  {
    id: "securite",
    label: "Sécurité",
    icon: Shield,
    description: "Mot de passe, authentification",
  },
  {
    id: "apparence",
    label: "Apparence",
    icon: Palette,
    description: "Thème et personnalisation",
  },
  {
    id: "ia",
    label: "Agents IA",
    icon: Cpu,
    description: "Configuration des agents et des API",
  },
];

export default function ParametresPage() {
  return (
    <AppLayout title="Paramètres">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-white">Paramètres</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Gérez votre compte et la configuration de la plateforme.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          {SECTIONS.map(({ id, label, icon: Icon, description }) => (
            <button
              key={id}
              className="flex items-center gap-4 rounded-xl border border-surface-border bg-surface-raised p-4 text-left hover:border-surface-muted hover:bg-surface-overlay transition-all"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-surface-overlay border border-surface-border">
                <Icon size={18} className="text-zinc-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-200">{label}</p>
                <p className="text-xs text-zinc-600">{description}</p>
              </div>
              <div className="ml-auto text-zinc-700">›</div>
            </button>
          ))}
        </div>

        {/* Version */}
        <p className="mt-8 text-center text-[11px] text-zinc-700">
          ORIZON ACCESSION AI · v0.1.0 · Phase 1
        </p>
      </div>
    </AppLayout>
  );
}
