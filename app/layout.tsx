import type { Metadata } from "next";
import { Red_Hat_Display, Geist_Mono } from "next/font/google";
import "./globals.css";

const sans = Red_Hat_Display({ variable: "--font-geist", subsets: ["latin"], weight: ["300", "400", "500", "700", "800"], style: ["normal", "italic"] });
const mono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hebl: leverage that clocks in",
  description: "Hebl: robot financing priced on telemetry-verified hours, repaid as a share of every job, nothing due when the robot is idle. Work receipts, Merkle proofs, agent-run collections. Built for YC's RFS: Wall Street for the Physical Buildout.",
  keywords: ["robot financing", "equipment finance", "revenue-based financing", "physical AI", "telemetry", "work receipts", "Merkle proof", "AI agents", "Stripe", "YC Request for Startups"],
  metadataBase: new URL("https://selfmade-yc.vercel.app"),
  openGraph: { title: "Hebl: loans for robots, repaid by the work they do", description: "Robot financing priced on verified work.", type: "website" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Hebl",
  applicationCategory: "FinanceApplication",
  description: "Loans for robots, repaid by the work they do. Telemetry-verified hours, sha256 work receipts with daily Merkle roots, agent-proposed actions with role quorum, Stripe settlement.",
  url: "https://selfmade-yc.vercel.app",
  codeRepository: "https://github.com/KarinaKKarinaK/c0mpile-YC",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} antialiased`}>
      <body className="min-h-screen"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />{children}</body>
    </html>
  );
}
