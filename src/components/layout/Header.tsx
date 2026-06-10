"use client";

import { Bell, Search } from "lucide-react";

interface HeaderProps {
  title?: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-surface-border bg-surface-base px-6">
      {title && (
        <h1 className="text-sm font-semibold text-zinc-200">{title}</h1>
      )}

      <div className="flex items-center gap-2 ml-auto">
        {/* Search bar */}
        <div className="hidden md:flex items-center gap-2 rounded-lg border border-surface-border bg-surface-raised px-3 py-1.5 text-xs text-zinc-500 hover:border-surface-muted transition-colors cursor-pointer">
          <Search size={13} />
          <span>Rechercher…</span>
          <kbd className="ml-4 rounded border border-surface-border px-1.5 py-0.5 text-[10px] text-zinc-600">
            ⌘K
          </kbd>
        </div>

        {/* Notifications */}
        <button className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-surface-border text-zinc-500 hover:bg-surface-overlay hover:text-zinc-200 transition-all">
          <Bell size={15} />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-brand-500" />
        </button>

        {/* Avatar */}
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-brand text-xs font-bold text-white">
          J
        </div>
      </div>
    </header>
  );
}
