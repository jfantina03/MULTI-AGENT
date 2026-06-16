import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const RSS_SOURCES: Record<string, string[]> = {
  "veille-brs-rennes": [
    "https://news.google.com/rss/search?q=%22BRS%22+%22Rennes%22+logement+foncier&hl=fr&gl=FR&ceid=FR%3Afr",
    "https://news.google.com/rss/search?q=%22bail+r%C3%A9el+solidaire%22+%22Rennes%22&hl=fr&gl=FR&ceid=FR%3Afr",
  ],
  "veille-brs-france": [
    "https://news.google.com/rss/search?q=%22bail+r%C3%A9el+solidaire%22+logement&hl=fr&gl=FR&ceid=FR%3Afr",
    "https://news.google.com/rss/search?q=%22BRS%22+accession+sociale+logement&hl=fr&gl=FR&ceid=FR%3Afr",
    "https://www.anil.org/feed/",
  ],
  "veille-ofs": [
    "https://news.google.com/rss/search?q=%22organisme+de+foncier+solidaire%22+OFS&hl=fr&gl=FR&ceid=FR%3Afr",
    "https://news.google.com/rss/search?q=%22foncier+solidaire%22+logement+social&hl=fr&gl=FR&ceid=FR%3Afr",
  ],
  "veille-diagnostic": [
    "https://news.google.com/rss/search?q=DPE+diagnostic+performance+%C3%A9nerg%C3%A9tique+immobilier&hl=fr&gl=FR&ceid=FR%3Afr",
    "https://news.google.com/rss/search?q=diagnostic+immobilier+r%C3%A9glementation+%C3%A9nergie&hl=fr&gl=FR&ceid=FR%3Afr",
    "https://news.google.com/rss/search?q=passoires+thermiques+r%C3%A9novation+%C3%A9nerg%C3%A9tique+logement&hl=fr&gl=FR&ceid=FR%3Afr",
  ],
  "veille-immobilier": [
    "https://news.google.com/rss/search?q=march%C3%A9+immobilier+France+2026+prix&hl=fr&gl=FR&ceid=FR%3Afr",
    "https://news.google.com/rss/search?q=immobilier+logement+neuf+promotion+immobili%C3%A8re+France&hl=fr&gl=FR&ceid=FR%3Afr",
    "https://news.google.com/rss/search?q=immobilier+Rennes+Bretagne+logement&hl=fr&gl=FR&ceid=FR%3Afr",
  ],
  "veille-finance": [
    "https://news.google.com/rss/search?q=taux+cr%C3%A9dit+immobilier+2026+banque&hl=fr&gl=FR&ceid=FR%3Afr",
    "https://news.google.com/rss/search?q=pr%C3%AAt+immobilier+financement+logement+primo-acc%C3%A9dant&hl=fr&gl=FR&ceid=FR%3Afr",
    "https://news.google.com/rss/search?q=PTZ+pr%C3%AAt+taux+z%C3%A9ro+aide+accession+propri%C3%A9t%C3%A9&hl=fr&gl=FR&ceid=FR%3Afr",
  ],
  "veille-juridique": [
    "https://news.google.com/rss/search?q=droit+immobilier+r%C3%A9glementation+logement+France+2026&hl=fr&gl=FR&ceid=FR%3Afr",
    "https://news.google.com/rss/search?q=loi+logement+urbanisme+construction+France&hl=fr&gl=FR&ceid=FR%3Afr",
    "https://news.google.com/rss/search?q=jurisprudence+immobilier+copropri%C3%A9t%C3%A9+bail+France&hl=fr&gl=FR&ceid=FR%3Afr",
  ],
};

const OFFICIAL_SOURCES: Record<string, { name: string; url: string }[]> = {
  "veille-brs-rennes": [
    { name: "Foncier Solidaire Ouest", url: "https://www.fonciersol-ouest.fr" },
    { name: "Rennes Métropole Habitat", url: "https://metropole.rennes.fr/habitat-et-logement" },
    { name: "Espacil Habitat", url: "https://espacil.com" },
    { name: "Aiguillon Construction", url: "https://www.aiguillon.fr" },
    { name: "ANIL Bretagne", url: "https://www.anil.org" },
  ],
  "veille-brs-france": [
    { name: "ANIL", url: "https://www.anil.org" },
    { name: "Banque des Territoires", url: "https://www.banquedesterritoires.fr" },
    { name: "Légifrance (CCH L.255-1)", url: "https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006074096/LEGISCTA000031086088/" },
    { name: "Ministère du Logement", url: "https://www.ecologie.gouv.fr/politiques-publiques/logement-social" },
    { name: "USH (HLM)", url: "https://www.union-habitat.org" },
  ],
  "veille-diagnostic": [
    { name: "ADEME", url: "https://www.ademe.fr" },
    { name: "Légifrance — DPE", url: "https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006074096/LEGISCTA000006158994/" },
    { name: "Ministère de la Transition Écologique", url: "https://www.ecologie.gouv.fr" },
    { name: "ANIL — Diagnostics", url: "https://www.anil.org/votre-projet/vous-vendez-ou-achetez/achat-immobilier/les-diagnostics-immobiliers/" },
    { name: "Observatoire DPE", url: "https://observatoire-dpe-audit.ademe.fr" },
  ],
  "veille-immobilier": [
    { name: "SeLoger — Baromètre", url: "https://www.seloger.com/actualites" },
    { name: "MeilleursAgents", url: "https://www.meilleursagents.com/prix-immobilier" },
    { name: "Fédération des Promoteurs (FPI)", url: "https://www.fpi.fr" },
    { name: "CGEDD — Logement", url: "https://www.ecologie.gouv.fr/direction-generale-lamenagement-du-logement-et-de-la-nature" },
    { name: "INSEE — Immobilier", url: "https://www.insee.fr/fr/statistiques?idTheme=24" },
  ],
  "veille-finance": [
    { name: "Banque de France", url: "https://www.banque-france.fr" },
    { name: "Empruntis — Taux", url: "https://www.empruntis.com/financement/actualites/index.php" },
    { name: "Meilleurtaux.com", url: "https://www.meilleurtaux.com/credit-immobilier/barometre-des-taux.html" },
    { name: "Banque des Territoires", url: "https://www.banquedesterritoires.fr" },
    { name: "ANIL — Financement", url: "https://www.anil.org/votre-projet/vous-vendez-ou-achetez/achat-immobilier/financer-votre-achat/" },
  ],
  "veille-juridique": [
    { name: "Légifrance", url: "https://www.legifrance.gouv.fr" },
    { name: "ANIL — Références juridiques", url: "https://www.anil.org/professionnels/references-juridiques/" },
    { name: "Service-public.fr — Logement", url: "https://www.service-public.fr/particuliers/vosdroits/logement" },
    { name: "Ministère du Logement", url: "https://www.ecologie.gouv.fr/politiques-publiques/logement-social" },
    { name: "USH (HLM)", url: "https://www.union-habitat.org" },
  ],
  "veille-ofs": [
    { name: "Foncier Solidaire Ouest", url: "https://www.fonciersol-ouest.fr" },
    { name: "Légifrance (CCH L.329-1)", url: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000033969726" },
    { name: "Banque des Territoires", url: "https://www.banquedesterritoires.fr" },
    { name: "ANIL", url: "https://www.anil.org/professionnels/references-juridiques/jurisprudence/bail-reel-solidaire/" },
    { name: "DHUP (Logement)", url: "https://www.ecologie.gouv.fr" },
  ],
};

interface Article {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  source: string;
}

function extract(str: string, re: RegExp): string {
  return (str.match(re)?.[1] ?? "").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"').trim();
}

function parseRSS(xml: string): Article[] {
  const raw = xml.match(/<item>([\s\S]*?)<\/item>/g) ?? [];
  return raw.slice(0, 10).reduce<Article[]>((acc, item) => {
    const title =
      extract(item, /<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/) ||
      extract(item, /<title>([\s\S]*?)<\/title>/);
    const link =
      extract(item, /<link>(https?:\/\/[^\s<]+)<\/link>/) ||
      extract(item, /<link href="(https?:\/\/[^"]+)"/);
    if (!title || !link) return acc;
    const description = (
      extract(item, /<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/) ||
      extract(item, /<description>([\s\S]*?)<\/description>/)
    ).replace(/<[^>]+>/g, "").slice(0, 240);
    const pubDate = extract(item, /<pubDate>([\s\S]*?)<\/pubDate>/);
    let source = extract(item, /<source[^>]*>([\s\S]*?)<\/source>/);
    if (!source && link) {
      try { source = new URL(link).hostname.replace(/^www\./, ""); } catch { /* noop */ }
    }
    acc.push({ title, link, description, pubDate, source });
    return acc;
  }, []);
}

export async function GET(req: NextRequest) {
  const topic = req.nextUrl.searchParams.get("topic") ?? "";
  const urls = RSS_SOURCES[topic];
  if (!urls) return NextResponse.json({ articles: [], sources: [] });

  const allArticles: Article[] = [];

  await Promise.allSettled(
    urls.map(async (url) => {
      const res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; ORIZONBot/1.0)" },
        signal: AbortSignal.timeout(6000),
        next: { revalidate: 1800 },
      });
      if (!res.ok) return;
      const xml = await res.text();
      allArticles.push(...parseRSS(xml));
    })
  );

  const seen = new Set<string>();
  const unique = allArticles.filter((a) => {
    if (seen.has(a.title)) return false;
    seen.add(a.title);
    return true;
  });

  return NextResponse.json({
    articles: unique.slice(0, 12),
    sources: OFFICIAL_SOURCES[topic] ?? [],
  });
}
