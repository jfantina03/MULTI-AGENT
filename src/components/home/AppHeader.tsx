"use client";

import Link from "next/link";
import { Moon, Sun } from "lucide-react";
import { useState } from "react";

export function AppHeader() {
  const [dark, setDark] = useState(false);

  return (
    <header className="flex items-center justify-between px-6 pt-8 pb-5">
      {/* Logo stacked */}
      <Link href="/" className="inline-flex flex-col leading-none select-none gap-0">
        <span className="text-emerald-700 font-bold text-[1.6rem] tracking-tight leading-none">
          orizon
        </span>
        <span className="text-gray-500 font-medium text-[1.6rem] tracking-tight leading-none pl-[3px] mt-[1px]">
          ccession
        </span>
      </Link>

      {/* Dark mode toggle */}
      <button
        onClick={() => setDark((d) => !d)}
        className="flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 rounded-xl px-3 py-1.5 hover:bg-gray-50 transition-colors bg-white shadow-sm"
      >
        {dark ? <Sun size={13} className="text-amber-500" /> : <Moon size={13} />}
        <span>{dark ? "Clair" : "Sombre"}</span>
      </button>
    </header>
  );
}
