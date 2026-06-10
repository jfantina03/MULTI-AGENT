import { notFound } from "next/navigation";
import { AGENTS, getAgent } from "@/lib/agents";
import { AgentRouteClient } from "./AgentRouteClient";

interface Props {
  params: Promise<{ agentId: string }>;
}

export function generateStaticParams() {
  return AGENTS.map((agent) => ({ agentId: agent.id }));
}

export async function generateMetadata({ params }: Props) {
  const { agentId } = await params;
  const agent = getAgent(agentId);
  if (!agent) return { title: "Agent introuvable" };
  return { title: `${agent.name} — ${agent.role} | Orizon Accession` };
}

export default async function AgentRoute({ params }: Props) {
  const { agentId } = await params;
  const agent = getAgent(agentId);
  if (!agent) notFound();

  return <AgentRouteClient agent={agent} />;
}
