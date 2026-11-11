import type { Metadata } from "next";
import { Montserrat, Geist_Mono } from "next/font/google";
import "./globals.css";

const sans = Montserrat({ variable: "--font-geist", subsets: ["latin"], weight: ["400", "500", "600", "700", "800", "900"] });
const mono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bluecollar: your robot pays its own loan",
  description: "Robot financing priced on verified hours and repaid as a share of every job. Nothing due when the robot is down.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} antialiased`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
