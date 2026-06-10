export type AgentId =
  | "thomas"
  | "lilou"
  | "claire"
  | "lucas"
  | "leo"
  | "hugo"
  | "ines";

export interface Agent {
  id: AgentId;
  name: string;
  role: string;
  description: string;
  color: string;        // Tailwind color class (bg-...)
  colorHex: string;     // Hex for gradients / inline styles
  emoji: string;
  href: string;
  capabilities: string[];
}

export interface Document {
  id: string;
  title: string;
  agentId: AgentId;
  createdAt: Date;
  category: string;
  excerpt?: string;
}

export interface Task {
  id: string;
  title: string;
  priority: "high" | "medium" | "low";
  agentId?: AgentId;
  dueDate?: Date;
  done: boolean;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  agentId: AgentId;
  createdAt: Date;
}
