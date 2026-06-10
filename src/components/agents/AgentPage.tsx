"use client";

import { useState } from "react";
import { SendHorizonal, Sparkles, Clock, FileText } from "lucide-react";
import type { Agent } from "@/types";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface AgentPageProps {
  agent: Agent;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export function AgentPage({ agent }: AgentPageProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      { role: "user", content: input },
      {
        role: "assistant",
        content: `Bonjour Jade ! Je suis ${agent.name}. Cette fonctionnalité sera disponible en Phase 3. Votre message a bien été reçu : « ${input} »`,
      },
    ]);
    setInput("");
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-full flex-col gap-5 mx-auto max-w-5xl">
      {/* Agent header */}
      <div
        className="flex items-start gap-4 rounded-xl border p-5"
        style={{
          borderColor: `${agent.colorHex}30`,
          background: `linear-gradient(135deg, ${agent.colorHex}0a 0%, transparent 60%)`,
        }}
      >
        <div
          className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl text-2xl"
          style={{
            backgroundColor: `${agent.colorHex}15`,
            border: `1px solid ${agent.colorHex}30`,
          }}
        >
          {agent.emoji}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-white">{agent.name}</h1>
            <Badge variant="info" className="text-[10px]">
              {agent.role}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-zinc-400">{agent.description}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {agent.capabilities.map((cap) => (
              <span
                key={cap}
                className="rounded-full border px-2.5 py-0.5 text-[11px] text-zinc-400"
                style={{ borderColor: `${agent.colorHex}25` }}
              >
                {cap}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main area: chat + history */}
      <div className="flex flex-1 gap-5">
        {/* Chat */}
        <div className="flex flex-1 flex-col rounded-xl border border-surface-border bg-surface-raised overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px]">
            {messages.length === 0 ? (
              <EmptyChat agent={agent} />
            ) : (
              messages.map((msg, i) => (
                <ChatBubble key={i} message={msg} agent={agent} />
              ))
            )}
          </div>

          {/* Input */}
          <div className="border-t border-surface-border p-4">
            <div className="flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder={`Posez votre question à ${agent.name}…`}
                className="flex-1 resize-none rounded-lg border border-surface-border bg-surface-overlay px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-brand-500/40 focus:outline-none focus:ring-1 focus:ring-brand-500/20 transition-all"
                rows={2}
              />
              <Button
                variant="primary"
                size="md"
                onClick={handleSend}
                disabled={!input.trim()}
                className="self-end"
              >
                <SendHorizonal size={15} />
              </Button>
            </div>
            <p className="mt-2 text-[11px] text-zinc-700">
              Entrée pour envoyer · Maj+Entrée pour nouvelle ligne
            </p>
          </div>
        </div>

        {/* Sidebar panel */}
        <div className="hidden xl:flex w-56 flex-col gap-3">
          <div className="rounded-xl border border-surface-border bg-surface-raised p-3">
            <div className="flex items-center gap-2 mb-3">
              <Clock size={13} className="text-zinc-600" />
              <span className="text-xs font-semibold text-zinc-400">Historique</span>
            </div>
            <p className="text-[11px] text-zinc-700">Aucune conversation</p>
          </div>

          <div className="rounded-xl border border-surface-border bg-surface-raised p-3">
            <div className="flex items-center gap-2 mb-3">
              <FileText size={13} className="text-zinc-600" />
              <span className="text-xs font-semibold text-zinc-400">Documents</span>
            </div>
            <p className="text-[11px] text-zinc-700">Aucun document</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyChat({ agent }: { agent: Agent }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div
        className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
        style={{ backgroundColor: `${agent.colorHex}15`, border: `1px solid ${agent.colorHex}30` }}
      >
        {agent.emoji}
      </div>
      <p className="text-sm font-medium text-zinc-300">
        Nouvelle conversation avec {agent.name}
      </p>
      <p className="mt-1 text-xs text-zinc-600 max-w-xs">
        {agent.description}
      </p>
    </div>
  );
}

function ChatBubble({
  message,
  agent,
}: {
  message: ChatMessage;
  agent: Agent;
}) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex gap-3", isUser && "flex-row-reverse")}>
      {/* Avatar */}
      <div
        className={cn(
          "flex-shrink-0 flex h-7 w-7 items-center justify-center rounded-full text-xs",
          isUser
            ? "bg-brand-600 text-white font-bold"
            : "text-base"
        )}
        style={
          !isUser
            ? { backgroundColor: `${agent.colorHex}20`, border: `1px solid ${agent.colorHex}30` }
            : {}
        }
      >
        {isUser ? "J" : agent.emoji}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          "max-w-[80%] rounded-xl px-3.5 py-2.5 text-sm",
          isUser
            ? "bg-brand-600/20 border border-brand-600/30 text-zinc-200"
            : "bg-surface-overlay border border-surface-border text-zinc-300"
        )}
      >
        {message.content}
      </div>
    </div>
  );
}
