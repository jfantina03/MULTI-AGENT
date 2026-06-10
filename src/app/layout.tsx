import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ORIZON ACCESSION AI",
  description: "Votre copilote d'entreprise immobilier — Agents IA spécialisés",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark">
      <body>{children}</body>
    </html>
  );
}
