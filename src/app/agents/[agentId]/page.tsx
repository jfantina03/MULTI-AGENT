import { notFound } from "next/navigation";
import { AgentLayout } from "@/components/agents/AgentLayout";
import { AGENTS, getAgent } from "@/lib/agents";

interface Props {
  params: Promise<{ agentId: string }>;
}

// Pre-generate all agent pages at build time
export function generateStaticParams() {
  return AGENTS.map((agent) => ({ agentId: agent.id }));
}

export async function generateMetadata({ params }: Props) {
  const { agentId } = await params;
  const agent = getAgent(agentId);
  if (!agent) return { title: "Agent introuvable" };
  return { title: `${agent.name} — ${agent.role} | ORIZON AI` };
}

export default async function AgentRoute({ params }: Props) {
  const { agentId } = await params;
  const agent = getAgent(agentId);
  if (!agent) notFound();

  return <AgentLayout agent={agent} />;
}
