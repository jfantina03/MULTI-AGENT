import Link from "next/link";

export function ThomasHeroCard() {
  return (
    <Link href="/agents/thomas" className="block group">
      <div
        className="relative w-full rounded-2xl p-8 overflow-hidden transition-transform duration-200 group-hover:scale-[1.01]"
        style={{
          background: "linear-gradient(135deg, #065f46 0%, #047857 60%, #059669 100%)",
        }}
      >
        {/* Subtle background texture */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 80% 20%, #a7f3d0 0%, transparent 50%)",
          }}
        />

        <div className="relative flex items-center justify-between gap-6">
          {/* Left: text content */}
          <div className="flex-1 min-w-0">
            <p className="text-emerald-200 text-xs font-semibold uppercase tracking-widest mb-2">
              Manager
            </p>
            <h2 className="text-white font-bold text-4xl mb-3 leading-none">
              Thomas
            </h2>
            <p className="text-emerald-100 text-sm leading-relaxed max-w-xs">
              Confiez-lui un objectif, il le répartit entre les bons services.
            </p>
          </div>

          {/* Right: avatar + action button */}
          <div className="flex flex-col items-center gap-4 flex-shrink-0">
            {/* Avatar circle */}
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl bg-emerald-600/50 border-2 border-emerald-400/40 shadow-lg">
              🧠
            </div>
            {/* Arrow button */}
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-emerald-400 text-emerald-900 font-bold text-lg shadow-md transition-colors group-hover:bg-emerald-300">
              →
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
