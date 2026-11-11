import type { Metadata } from "next";
import { Red_Hat_Display, Geist_Mono } from "next/font/google";
import "./globals.css";

const sans = Red_Hat_Display({ variable: "--font-geist", subsets: ["latin"], weight: ["300", "400", "500", "700", "800"], style: ["normal", "italic"] });
const mono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fleiss: your robot pays off its own loan",
  description: "Robot financing priced on verified hours and repaid as a share of every job. Nothing due when the robot is down.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} antialiased`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
