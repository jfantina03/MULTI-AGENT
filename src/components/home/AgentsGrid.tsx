import { AGENTS } from "@/lib/agents";
import { AgentCard } from "./AgentCard";

export function AgentsGrid() {
  // Exclude Thomas — he has his own hero card
  const serviceAgents = AGENTS.filter((a) => a.id !== "thomas");

  return (
    <section className="px-6 pb-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
        Vos services
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {serviceAgents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    </section>
  );
}
