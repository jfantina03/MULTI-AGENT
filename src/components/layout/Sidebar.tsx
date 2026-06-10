"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Library,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { AGENTS } from "@/lib/agents";
import { cn } from "@/lib/utils";
import { useState } from "react";

const NAV_TOP = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

const NAV_BOTTOM = [
  { href: "/bibliotheque", label: "Bibliothèque", icon: Library },
  { href: "/parametres", label: "Paramètres", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "relative flex h-screen flex-col border-r border-surface-border bg-surface-base transition-all duration-300",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center border-b border-surface-border px-4">
        {!collapsed ? (
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-brand shadow-lg shadow-indigo-900/40">
              <span className="text-xs font-bold text-white">OA</span>
            </div>
            <div>
              <p className="text-xs font-bold tracking-wide text-white">ORIZON</p>
              <p className="text-[9px] font-medium uppercase tracking-widest text-zinc-500">
                Accession AI
              </p>
            </div>
          </div>
        ) : (
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-brand shadow-lg shadow-indigo-900/40">
            <span className="text-xs font-bold text-white">OA</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-2 pt-3">
        {/* Top links */}
        {NAV_TOP.map(({ href, label, icon: Icon }) => (
          <NavLink
            key={href}
            href={href}
            label={label}
            icon={<Icon size={16} />}
            active={pathname === href || pathname.startsWith(href + "/")}
            collapsed={collapsed}
          />
        ))}

        {/* Agents section */}
        <div className={cn("mt-4 mb-1", collapsed ? "px-1" : "px-2")}>
          {!collapsed && (
            <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
              Agents IA
            </p>
          )}
          {collapsed && <div className="border-t border-surface-border" />}
        </div>

        {AGENTS.map((agent) => (
          <NavLink
            key={agent.id}
            href={agent.href}
            label={`${agent.name} — ${agent.role}`}
            icon={
              <span
                className="flex h-4 w-4 items-center justify-center rounded text-[11px]"
                style={{ color: agent.colorHex }}
              >
                {agent.emoji}
              </span>
            }
            active={pathname.startsWith(agent.href)}
            collapsed={collapsed}
            agentColor={agent.colorHex}
          />
        ))}

        {/* Bottom links */}
        <div className="mt-auto flex flex-col gap-1 pt-4 border-t border-surface-border">
          {NAV_BOTTOM.map(({ href, label, icon: Icon }) => (
            <NavLink
              key={href}
              href={href}
              label={label}
              icon={<Icon size={16} />}
              active={pathname.startsWith(href)}
              collapsed={collapsed}
            />
          ))}
        </div>
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-[72px] flex h-6 w-6 items-center justify-center rounded-full border border-surface-border bg-surface-raised text-zinc-500 hover:text-zinc-200 transition-colors z-10"
        aria-label={collapsed ? "Déplier la sidebar" : "Replier la sidebar"}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}

interface NavLinkProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
  collapsed: boolean;
  agentColor?: string;
}

function NavLink({ href, label, icon, active, collapsed, agentColor }: NavLinkProps) {
  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      className={cn(
        "group flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-xs font-medium transition-all duration-150",
        active
          ? "bg-brand-600/15 text-zinc-100"
          : "text-zinc-500 hover:bg-surface-overlay hover:text-zinc-200",
        collapsed && "justify-center px-2"
      )}
      style={active && agentColor ? { color: agentColor } : undefined}
    >
      <span
        className={cn(
          "flex-shrink-0",
          active && !agentColor ? "text-brand-400" : ""
        )}
      >
        {icon}
      </span>
      {!collapsed && <span className="truncate">{label}</span>}
      {active && !collapsed && (
        <span
          className="ml-auto h-1.5 w-1.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: agentColor ?? "#6366f1" }}
        />
      )}
    </Link>
  );
}
