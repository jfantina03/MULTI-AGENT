"use client";

import { useEffect, useState } from "react";

interface Article {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  source: string;
}

interface Source {
  name: string;
  url: string;
}

const TOPIC_LABELS: Record<string, string> = {
  "veille-brs-rennes": "BRS Rennes",
  "veille-brs-france": "BRS France",
  "veille-ofs": "OFS",
  "veille-diagnostic": "Diagnostic",
  "veille-immobilier": "Immobilier",
  "veille-finance": "Finance",
  "veille-juridique": "Juridique",
};

const GRADIENTS = [
  "linear-gradient(145deg, #1E4D3A 0%, #2FA85F 100%)",
  "linear-gradient(145deg, #173B2C 0%, #1E4D3A 100%)",
  "linear-gradient(145deg, #204736 0%, #2FA85F 100%)",
  "linear-gradient(145deg, #1A4030 0%, #235c3a 100%)",
  "linear-gradient(145deg, #173B2C 0%, #2FA85F 100%)",
  "linear-gradient(145deg, #1E4D3A 0%, #4CAF72 100%)",
  "linear-gradient(145deg, #224030 0%, #1E4D3A 100%)",
];

function formatDate(pubDate: string): string {
  if (!pubDate) return "";
  try {
    const d = new Date(pubDate);
    const diff = Math.floor((Date.now() - d.getTime()) / 1000 / 3600);
    if (diff < 1) return "A l'instant";
    if (diff < 24) return `${diff}h`;
    const days = Math.floor(diff / 24);
    if (days < 7) return `${days}j`;
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  } catch {
    return "";
  }
}

function SkeletonCard({ large }: { large?: boolean }) {
  return (
    <div style={{
      borderRadius: 16,
      background: "var(--surface-3)",
      minHeight: large ? 230 : 158,
      gridColumn: large ? "span 2" : "auto",
      animation: "var(--anim-enter)",
    }} />
  );
}

export function VeilleView({ topic }: { topic: string }) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  function load() {
    setLoading(true);
    setError(false);
    fetch(`/api/veille?topic=${topic}&_=${Date.now()}`)
      .then((r) => r.json())
      .then((d) => { setArticles(d.articles ?? []); setSources(d.sources ?? []); })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, [topic]); // eslint-disable-line react-hooks/exhaustive-deps

  const label = TOPIC_LABELS[topic] ?? "Veille";

  return (
    <div style={{ paddingTop: 24, paddingBottom: 48 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 22 }}>
        <div>
          <p style={{ margin: 0, fontSize: 11.5, fontWeight: 800, letterSpacing: ".22em", textTransform: "uppercase", color: "var(--ink-faint)" }}>
            Veille informationnelle
          </p>
          <h2 style={{ margin: "5px 0 0", fontSize: 22, fontWeight: 800, color: "var(--ink)", letterSpacing: "-.01em" }}>
            {label}
          </h2>
        </div>
        <button
          onClick={load}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            height: 34, padding: "0 14px", borderRadius: 999,
            border: "1px solid var(--border-strong)",
            background: "transparent", color: "var(--ink-soft)",
            fontWeight: 700, fontSize: 12.5, cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Actualiser
        </button>
      </div>

      {/* Skeleton */}
      {loading && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          <SkeletonCard large />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div style={{
          padding: "32px 24px", textAlign: "center",
          borderRadius: 16, border: "1px dashed var(--border-strong)",
          color: "var(--ink-faint)", fontSize: 14, lineHeight: 1.6,
        }}>
          Impossible de charger les actualites.
          <br />Consultez les sources officielles ci-dessous.
        </div>
      )}

      {/* Flipboard grid */}
      {!loading && articles.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {articles.map((article, i) => (
            <a
              key={i}
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                gridColumn: i === 0 ? "span 2" : "auto",
                borderRadius: 16,
                background: GRADIENTS[i % GRADIENTS.length],
                display: "flex", flexDirection: "column", justifyContent: "flex-end",
                padding: 18,
                minHeight: i === 0 ? 230 : 158,
                textDecoration: "none",
                position: "relative",
                boxShadow: "var(--shadow)",
                transition: "transform .15s ease, box-shadow .15s ease",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "var(--shadow-lg)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "var(--shadow)";
              }}
            >
              {/* Source chip */}
              <span style={{
                position: "absolute", top: 13, left: 13,
                padding: "3px 9px", borderRadius: 999,
                background: "rgba(255,255,255,0.18)",
                color: "#fff", fontSize: 10.5, fontWeight: 700,
                letterSpacing: ".05em", maxWidth: 160,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {article.source}
              </span>
              {/* Date */}
              {article.pubDate && (
                <span style={{
                  position: "absolute", top: 13, right: 13,
                  fontSize: 10.5, color: "rgba(255,255,255,0.55)", fontWeight: 600,
                }}>
                  {formatDate(article.pubDate)}
                </span>
              )}
              {/* Dark gradient overlay at bottom */}
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 55%)",
                borderRadius: 16,
              }} />
              {/* Text */}
              <div style={{ position: "relative", zIndex: 1 }}>
                <p style={{
                  margin: "0 0 (i === 0 && article.description ? 6 : 0)px",
                  fontSize: i === 0 ? 17 : 13.5,
                  fontWeight: 800, color: "#fff", lineHeight: 1.35,
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: i === 0 ? 3 : 4,
                  WebkitBoxOrient: "vertical",
                }}>
                  {article.title}
                </p>
                {i === 0 && article.description && (
                  <p style={{
                    margin: "6px 0 0",
                    fontSize: 12.5, color: "rgba(255,255,255,0.72)", lineHeight: 1.5,
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}>
                    {article.description}
                  </p>
                )}
              </div>
            </a>
          ))}
        </div>
      )}

      {/* No results */}
      {!loading && !error && articles.length === 0 && (
        <div style={{
          padding: "32px 24px", textAlign: "center",
          borderRadius: 16, border: "1px dashed var(--border-strong)",
          color: "var(--ink-faint)", fontSize: 14,
        }}>
          Aucune actualite recente trouvee.
        </div>
      )}

      {/* Official sources */}
      {sources.length > 0 && (
        <div style={{ marginTop: 28 }}>
          <p style={{
            margin: "0 0 12px",
            fontSize: 11.5, fontWeight: 800, letterSpacing: ".2em",
            textTransform: "uppercase", color: "var(--ink-faint)",
          }}>
            Sources officielles
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {sources.map((s) => (
              <a
                key={s.url}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center",
                  height: 34, padding: "0 14px", borderRadius: 999,
                  border: "1px solid var(--border-strong)",
                  background: "var(--surface)",
                  color: "var(--ink-soft)", fontSize: 13, fontWeight: 600,
                  textDecoration: "none",
                  transition: "border-color .15s, color .15s, background .15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--forest)";
                  e.currentTarget.style.color = "#fff";
                  e.currentTarget.style.background = "var(--forest)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border-strong)";
                  e.currentTarget.style.color = "var(--ink-soft)";
                  e.currentTarget.style.background = "var(--surface)";
                }}
              >
                {s.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
