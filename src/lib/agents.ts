export type AgentId = "thomas" | "hugo" | "lilou" | "ines" | "leo" | "lucas" | "claire" | "lea";

export interface AgentAction {
  id: string;
  label: string;
  seed: string;
  reply: string;
}

export interface AgentDocument {
  type: "pdf" | "doc" | "xls" | "img";
  name: string;
  meta: string;
}

export interface Agent {
  id: AgentId;
  name: string;
  role: string;
  isManager?: boolean;
  status: string;
  avatar: string;       // path to /avatars/{id}.png
  short: string;
  intro: string;
  actions: AgentAction[];
  documents: AgentDocument[];
}

export const AGENTS: Agent[] = [
  {
    id: "thomas",
    name: "Thomas",
    role: "Manager",
    isManager: true,
    status: "Orchestrateur",
    avatar: "/avatars/thomas.png",
    short: "Confiez-lui un objectif, il le répartit entre les bons services.",
    intro:
      "Jade, qu'est-ce qu'on attaque aujourd'hui ? Donne-moi un objectif et je le répartis entre les bons services.",
    actions: [
      {
        id: "deleguer",
        label: "Déléguer une mission",
        seed: "J'aimerais lancer la commercialisation d'un programme PSLA de 14 logements à Cesson-Sévigné.",
        reply:
          "Parfait. Je découpe la mission en 4 volets et je délègue :\n\n• Hugo (Commercial) — constituer une liste de prospects éligibles PSLA sur le bassin rennais.\n• Lilou (Community Manager) — préparer une campagne d'annonce sur Insta + LinkedIn, à la charte.\n• Léo (Financier) — bâtir le plan de financement type acquéreur (mensualités, redevance).\n• Claire (Juriste) — préparer le modèle de contrat de location-accession.\n\nJe vous fais un point d'équipe dès que les premiers livrables sont prêts. Je lance ?",
      },
      {
        id: "point",
        label: "Point d'équipe",
        seed: "Fais-moi un point d'équipe sur les missions en cours.",
        reply:
          "Voici l'état des lieux des services :\n\n• Hugo — liste de prospection 35 : 38 contacts qualifiés ✅\n• Lilou — calendrier édito juin validé, 2 carrousels en attente de votre relecture\n• Léo — prévisionnel 2026 : v2 prête\n• Claire — compromis lot Cesson : en relecture juridique\n\nDeux points demandent votre arbitrage. On les traite maintenant ?",
      },
    ],
    documents: [
      { type: "doc", name: "Brief mission — modèle", meta: "Modèle · 24 ko" },
      { type: "pdf", name: "Compte-rendu point d'équipe — mai", meta: "PDF · 312 ko" },
      { type: "doc", name: "Feuille de route Q3 2026", meta: "Modèle · 48 ko" },
    ],
  },
  {
    id: "hugo",
    name: "Hugo",
    role: "Commercial",
    status: "Disponible",
    avatar: "/avatars/hugo.png",
    short: "Repère les clients & entreprises à prospecter en Ille-et-Vilaine (35).",
    intro:
      "Salut Jade. Sur quoi tu veux avancer côté prospection ? Un secteur, un type de cible, un argumentaire — dis-moi.",
    actions: [
      {
        id: "prospection",
        label: "Liste de prospection",
        seed: "Établis une liste de prospection de primo-accédants éligibles PSLA sur Rennes Métropole.",
        reply:
          "Je prépare une liste qualifiée. Cible : ménages primo-accédants sous plafonds PSLA, secteur Rennes Métropole.\n\n• 38 profils éligibles identifiés (revenus sous plafond zone B1)\n• Priorité aux communes : Cesson-Sévigné, Chartres-de-Bretagne, Bruz\n• Canal recommandé : mailing + relance téléphonique\n\nJe vous exporte la liste complète dans l'onglet Documents. Je la segmente par commune ?",
      },
      {
        id: "fiche",
        label: "Fiche entreprise",
        seed: "Fais une fiche entreprise sur un employeur local à démarcher pour de l'accession.",
        reply:
          "Voici une fiche type d'entreprise à démarcher (partenariat employeur / Action Logement) :\n\n• Effectif : > 250 salariés sur le bassin rennais\n• Angle : accompagner les salariés primo-accédants (PSLA / BRS)\n• Interlocuteur : service RH / référent logement\n\nJe peux décliner cette fiche pour 5 employeurs cibles du 35. On y va ?",
      },
      {
        id: "argumentaire",
        label: "Argumentaire",
        seed: "Donne-moi un argumentaire pour vendre le PSLA à un primo-accédant hésitant.",
        reply:
          "Argumentaire PSLA — primo-accédant :\n\n1. On commence par louer, on achète quand on est prêt : phase locative sécurisante.\n2. TVA réduite (5,5 %) et exonération de taxe foncière (15 ans selon commune).\n3. Mensualités maîtrisées, redevance qui se transforme en apport.\n4. Garantie de rachat et de relogement : le filet de sécurité.\n\nJe vous le reformule en version orale pour un RDV ?",
      },
    ],
    documents: [
      { type: "xls", name: "Liste prospection 35 — mai", meta: "Tableur · 86 ko" },
      { type: "doc", name: "Fiche entreprise — modèle", meta: "Modèle · 31 ko" },
      { type: "pdf", name: "Argumentaire PSLA", meta: "PDF · 240 ko" },
    ],
  },
  {
    id: "lilou",
    name: "Lilou",
    role: "Community Manager",
    status: "En ligne",
    avatar: "/avatars/lilou.png",
    short: "Rédige posts, réels et carrousels Insta · TikTok · LinkedIn, à la charte.",
    intro:
      "Jade ! Qu'est-ce qu'on crée aujourd'hui ? Post, réel, carrousel — dis-moi le sujet et je m'en occupe.",
    actions: [
      {
        id: "linkedin",
        label: "Post LinkedIn",
        seed: "Rédige un post LinkedIn pour annoncer le programme PSLA de Cesson-Sévigné.",
        reply:
          "Voici une proposition de post LinkedIn :\n\n« 🔑 Devenir propriétaire à Cesson-Sévigné, sans se précipiter.\nNotre nouveau programme en location-accession (PSLA) ouvre : on loue d'abord, on achète quand on est prêt. TVA réduite, redevance qui devient apport, sécurité du rachat.\n14 logements. Bassin rennais. Premiers RDV ouverts. »\n\nJe vous prépare 3 variantes de hook ?",
      },
      {
        id: "carrousel",
        label: "Carrousel Insta",
        seed: "Propose un carrousel Instagram qui explique le BRS simplement.",
        reply:
          "Carrousel Insta « Le BRS en 5 slides » :\n\n1. Le BRS, c'est quoi ? (titre + visuel clé)\n2. On achète les murs, pas le terrain → prix réduit\n3. Une redevance modérée pour le foncier\n4. Pour qui ? primo-accédants sous plafonds\n5. Envie d'en savoir plus ? → CTA RDV\n\nJe respecte la charte (vert forêt + menthe). Je rédige les textes de chaque slide ?",
      },
      {
        id: "reel",
        label: "Idées de réel",
        seed: "Donne-moi des idées de réels courts pour TikTok / Insta.",
        reply:
          "5 idées de réels (15-30 s) :\n\n• « PSLA vs achat classique » en 3 chiffres\n• Visite éclair d'un T3 du programme Cesson\n• « 3 idées reçues sur l'accession sociale »\n• Témoignage primo-accédant (avant / après)\n• « Combien ça coûte vraiment ? » mensualité à l'écran\n\nJe vous écris le script du premier ?",
      },
      {
        id: "calendrier",
        label: "Calendrier édito",
        seed: "Construis-moi un calendrier éditorial pour le mois.",
        reply:
          "Calendrier édito — juin (3 posts/semaine) :\n\n• Lun — pédagogie (PSLA, BRS, accession)\n• Mer — programme / coulisses (visite, équipe)\n• Ven — preuve sociale (témoignage, chiffre)\n\nRéseaux : LinkedIn (pro), Insta (grand public), TikTok (jeunes actifs). Je vous le dépose dans Documents ?",
      },
    ],
    documents: [
      { type: "xls", name: "Calendrier édito — juin", meta: "Tableur · 54 ko" },
      { type: "pdf", name: "Charte réseaux sociaux Orizon", meta: "PDF · 1,2 Mo" },
      { type: "img", name: "Carrousel BRS — Insta", meta: "Visuels · 5 slides" },
    ],
  },
  {
    id: "ines",
    name: "Inès",
    role: "Analyste Stratégique",
    status: "Disponible",
    avatar: "/avatars/ines.png",
    short: "Analyse vos résultats dans une logique d'amélioration continue.",
    intro:
      "Jade, sur quoi tu veux voir plus clair ? Résultats du mois, benchmark concurrents, opportunités de marché — dis-moi ce qu'on analyse.",
    actions: [
      {
        id: "analyse",
        label: "Analyse de résultats",
        seed: "Analyse les résultats de notre campagne PSLA du mois.",
        reply:
          "Lecture des résultats du mois :\n\n• 38 prospects qualifiés → 11 RDV → 3 réservations\n• Taux de transformation RDV → réservation : 27 % (au-dessus de la moyenne secteur)\n• Point faible : délai moyen entre premier contact et RDV = 9 jours (trop long)\n\nRecommandation : mettre en place une séquence de nurturing à J+2 et J+5. Vous voulez que je vous la prépare ?",
      },
      {
        id: "benchmark",
        label: "Benchmark concurrents",
        seed: "Fais un benchmark des agences concurrentes sur Rennes.",
        reply:
          "Benchmark — agences accession sociale sur Rennes Métropole :\n\n• 4 acteurs identifiés avec une offre PSLA / BRS active\n• Différenciateur Orizon : accompagnement end-to-end + expertise accession aidée\n• Lacune concurrentielle : aucun concurrent ne communique sur le BRS de façon pédagogique\n\nOpportunité : prendre le leadership éditorial sur le BRS. Je vous détaille la stratégie ?",
      },
    ],
    documents: [
      { type: "pdf", name: "Rapport mensuel — mai", meta: "PDF · 480 ko" },
      { type: "xls", name: "Dashboard KPIs", meta: "Tableur · 62 ko" },
    ],
  },
  {
    id: "leo",
    name: "Léo",
    role: "Financier",
    status: "Disponible",
    avatar: "/avatars/leo.png",
    short: "Bilan, compte de résultat et prévisionnel — répond en données chiffrées.",
    intro:
      "Jade, qu'est-ce qu'on modélise ? Prévisionnel, plan de financement acquéreur, tableau de bord KPI — donne-moi les paramètres.",
    actions: [
      {
        id: "previsionnel",
        label: "Prévisionnel",
        seed: "Fais-moi un prévisionnel de chiffre d'affaires pour 2026.",
        reply:
          "Prévisionnel CA 2026 — hypothèse de base :\n\n• 12 transactions (ventes + honoraires) → CA estimé : 180 000 €\n• Dont accession aidée (PSLA/BRS) : 60 % du volume\n• Charges fixes estimées : 52 000 €\n• Résultat net prévisionnel : 87 000 € (marge nette 48 %)\n\nJe vous modélise 3 scénarios (pessimiste / réaliste / optimiste) et je dépose le tableau dans Documents ?",
      },
      {
        id: "kpi",
        label: "Tableau de bord KPIs",
        seed: "Propose-moi un tableau de bord KPIs adapté à mon activité.",
        reply:
          "KPIs recommandés pour Orizon Accession :\n\n• Volume : nb de transactions / mois, CA mensuel\n• Commercial : nb de RDV, taux de transformation, délai moyen\n• Marketing : portée organique, taux d'engagement, leads entrants\n• Opérationnel : délai moyen instruction dossier, satisfaction client (NPS)\n\nJe vous construis le dashboard Excel avec formules et graphiques auto-mis à jour ?",
      },
    ],
    documents: [
      { type: "xls", name: "Prévisionnel 2026 — v2", meta: "Tableur · 94 ko" },
      { type: "pdf", name: "Compte de résultat — T1 2026", meta: "PDF · 156 ko" },
    ],
  },
  {
    id: "lucas",
    name: "Lucas",
    role: "Présentateur",
    status: "En ligne",
    avatar: "/avatars/lucas.png",
    short: "Rédige vos mails types, vos comptes-rendus de RDV et reformule.",
    intro:
      "Jade, quel document on attaque ? Mail, compte rendu, présentation — donne-moi le contexte et je rédige.",
    actions: [
      {
        id: "courrier",
        label: "Courrier / Mail",
        seed: "Rédige un mail de relance pour un prospect qui n'a pas donné suite après un RDV PSLA.",
        reply:
          "Voici un mail de relance chaleureux et professionnel :\n\n---\nObjet : Suite à notre échange — programme PSLA [ville]\n\nBonjour [Prénom],\n\nJ'espère que vous allez bien. Suite à notre rendez-vous du [date], je voulais revenir vers vous pour savoir si vous aviez eu le temps de réfléchir à votre projet d'accession.\n\nNous avons encore quelques créneaux disponibles sur le programme de [ville]. N'hésitez pas à me recontacter — je reste disponible pour répondre à toutes vos questions.\n\nBien cordialement,\nJade — Orizon Accession\n---\n\nJe vous propose une variante plus directe ?",
      },
      {
        id: "cr",
        label: "Compte rendu",
        seed: "Rédige un compte rendu de RDV client à partir de mes notes.",
        reply:
          "Pour rédiger le compte rendu, donnez-moi vos notes brutes (points abordés, décisions, suite à donner) et je les structure en un document professionnel avec : contexte, points clés discutés, décisions prises, prochaines étapes et date de suivi.",
      },
    ],
    documents: [
      { type: "doc", name: "Modèles de mails — pack 10", meta: "Modèles · 38 ko" },
      { type: "pdf", name: "CR RDV Famille Moreau — 03/06", meta: "PDF · 88 ko" },
    ],
  },
  {
    id: "claire",
    name: "Claire",
    role: "Juriste",
    status: "Disponible",
    avatar: "/avatars/claire.png",
    short: "Contrats, questions de droit et veille d'actualité sur vos fiches sources.",
    intro:
      "Jade, qu'est-ce qu'il te faut ? Contrat, question de droit, veille BRS/PSLA/ANRU — je suis là.",
    actions: [
      {
        id: "contrat",
        label: "Rédiger un contrat",
        seed: "Rédige un modèle de contrat de location-accession (PSLA).",
        reply:
          "Je prépare la trame du contrat de location-accession conforme au décret n° 2004-esco du 25 mars 2004.\n\nStructure du document :\n1. Parties au contrat\n2. Description du logement (désignation, surface, équipements)\n3. Durée de la phase locative et conditions d'option d'achat\n4. Redevance (fraction locative + fraction acquisitive)\n5. Prix de vente et modalités de levée d'option\n6. Garanties (rachat, relogement)\n7. Clauses particulières\n\nJe vous génère le document complet dans Documents. Je l'adapte à votre programme de Cesson-Sévigné ?",
      },
      {
        id: "veille",
        label: "Veille réglementaire",
        seed: "Synthèse réglementaire générale : quelles sont les dernières évolutions sur le BRS, le PSLA et l'ANRU à connaître absolument ?",
        reply: "",
      },
      {
        id: "veille-brs-rennes",
        label: "Veille BRS Rennes",
        seed: "Fais une veille informationnelle complète sur le BRS à Rennes et Rennes Métropole : programmes en cours ou récents, OFS locaux actifs, spécificités territoriales, prix plafonds applicables, actualités.",
        reply: "",
      },
      {
        id: "veille-brs-france",
        label: "Veille BRS France",
        seed: "Fais une veille informationnelle nationale sur le BRS : dernières évolutions législatives et réglementaires, statistiques de déploiement, jurisprudence récente, tendances et perspectives du dispositif en France.",
        reply: "",
      },
      {
        id: "veille-ofs",
        label: "Veille OFS",
        seed: "Fais une veille sur les Organismes de Foncier Solidaire (OFS) : cadre juridique, liste des OFS agréés et notamment en Bretagne, actualités, jurisprudence, évolutions de leur agrément et de leur fonctionnement.",
        reply: "",
      },
    ],
    documents: [
      { type: "pdf", name: "Modèle contrat PSLA", meta: "PDF · 520 ko" },
      { type: "doc", name: "Note veille BRS — juin 2025", meta: "Document · 142 ko" },
      { type: "pdf", name: "Guide ANRU — accession aidée", meta: "PDF · 1,8 Mo" },
      { type: "doc", name: "Note veille BRS Rennes — 2026", meta: "Document · 98 ko" },
      { type: "pdf", name: "OFS agréés Bretagne — liste", meta: "PDF · 64 ko" },
    ],
  },
  {
    id: "lea",
    name: "Léa",
    role: "Reportrice",
    status: "En direct",
    avatar: "/avatars/lea.jpeg",
    short: "Veille quotidienne sur le diagnostic, l'immobilier, la finance et le juridique.",
    intro:
      "Jade, quel sujet on couvre aujourd'hui ? Marché immobilier, finance, juridique, diagnostic — choisis et je te fais le point.",
    actions: [
      {
        id: "veille-brs-rennes",
        label: "BRS 35",
        seed: "",
        reply: "",
      },
      {
        id: "veille-brs-france",
        label: "BRS France",
        seed: "",
        reply: "",
      },
      {
        id: "veille-diagnostic",
        label: "Diagnostic",
        seed: "",
        reply: "",
      },
      {
        id: "veille-immobilier",
        label: "Immobilier",
        seed: "",
        reply: "",
      },
      {
        id: "veille-finance",
        label: "Finance",
        seed: "",
        reply: "",
      },
      {
        id: "veille-juridique",
        label: "Juridique",
        seed: "",
        reply: "",
      },
    ],
    documents: [
      { type: "pdf", name: "Revue de presse immobilière — juin 2026", meta: "PDF · 320 ko" },
      { type: "doc", name: "Synthèse DPE & diagnostics — T1 2026", meta: "Document · 88 ko" },
      { type: "xls", name: "Taux crédit & marché — baromètre mensuel", meta: "Tableur · 64 ko" },
    ],
  },
];

export const AGENTS_BY_ID = Object.fromEntries(AGENTS.map((a) => [a.id, a]));

export function getAgent(id: string): Agent | undefined {
  return AGENTS_BY_ID[id];
}
