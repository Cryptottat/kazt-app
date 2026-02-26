import type { Metadata } from "next";
import { Inter, Oswald, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Kazt -- Pour your rules. Set them in chain.",
    template: "%s | Kazt",
  },
  description:
    "Forge ACE execution rules with drag-and-drop GUI and deploy them on-chain. The first visual ACE rule builder on Solana.",
  openGraph: {
    title: "Kazt -- Pour your rules. Set them in chain.",
    description:
      "Forge ACE execution rules with drag-and-drop GUI and deploy them on-chain.",
    url: "https://kazt.fun",
    siteName: "Kazt",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kazt -- Pour your rules. Set them in chain.",
    description:
      "Forge ACE execution rules with drag-and-drop GUI and deploy them on-chain.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${oswald.variable} ${jetbrains.variable}`}
    >
      <body className="bg-bg text-text-primary font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
