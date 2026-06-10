"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Agent } from "@/lib/agents";
import { ServicePage } from "@/components/agents/ServicePage";

export function AgentRouteClient({ agent }: { agent: Agent }) {
  const router = useRouter();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("orizon-theme") === "dark") {
      setDark(true);
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  function toggleTheme() {
    setDark((d) => {
      const next = !d;
      document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
      localStorage.setItem("orizon-theme", next ? "dark" : "light");
      return next;
    });
  }

  return (
    <ServicePage
      agent={agent}
      dark={dark}
      onToggleTheme={toggleTheme}
      onHome={() => router.push("/")}
    />
  );
}
