import { AppHeader } from "@/components/home/AppHeader";
import { ThomasHeroCard } from "@/components/home/ThomasHeroCard";
import { AgentsGrid } from "@/components/home/AgentsGrid";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto">
        <AppHeader />

        {/* Thomas hero card */}
        <div className="px-6 mb-6">
          <ThomasHeroCard />
        </div>

        {/* Service agents grid */}
        <AgentsGrid />
      </div>
    </main>
  );
}
