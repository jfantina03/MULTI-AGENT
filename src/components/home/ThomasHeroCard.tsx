import Link from "next/link";

export function ThomasHeroCard() {
  return (
    <Link href="/agents/thomas" className="block group">
      <div
        className="relative w-full rounded-2xl px-8 py-7 overflow-hidden transition-transform duration-200 group-hover:scale-[1.01]"
        style={{
          background: "linear-gradient(135deg, #065f46 0%, #047857 60%, #059669 100%)",
        }}
      >
        {/* Subtle radial glow */}
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 75% 30%, #a7f3d0 0%, transparent 55%)",
          }}
        />

        <div className="relative flex items-center justify-between gap-4">
          {/* Left: text */}
          <div className="flex-1 min-w-0">
            <p className="text-emerald-200 text-[10px] font-bold uppercase tracking-[0.18em] mb-2">
              Manager
            </p>
            <h2 className="text-white font-bold text-4xl mb-3 leading-none">
              Thomas
            </h2>
            <p className="text-emerald-100/90 text-sm leading-relaxed max-w-xs">
              Confiez-lui un objectif, il le répartit entre les bons services.
            </p>
          </div>

          {/* Right: avatar + arrow — horizontal row */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Avatar */}
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-3xl shadow-lg border-2 border-emerald-400/30 flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #c4a882 0%, #a8855c 100%)" }}
            >
              🧠
            </div>

            {/* Arrow button */}
            <div className="w-11 h-11 rounded-full flex items-center justify-center bg-emerald-400 text-white font-bold text-xl shadow-md transition-colors group-hover:bg-emerald-300 flex-shrink-0">
              →
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
