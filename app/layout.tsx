import type { Metadata } from "next";
import { Inter, Press_Start_2P, JetBrains_Mono } from "next/font/google";
import GlobalCursorHit from "@/components/common/GlobalCursorHit";
import MouseSparks from "@/components/ui/MouseSparks";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const pixelFont = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kazt.fun"),
  title: {
    default: "Kazt — Pour your rules. Set them in chain.",
    template: "%s | Kazt",
  },
  description:
    "Craft ACE execution rules with drag-and-drop GUI and deploy them on-chain. The first visual ACE rule builder on Solana.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Kazt — Pour your rules. Set them in chain.",
    description:
      "Craft ACE execution rules with drag-and-drop GUI and deploy them on-chain.",
    url: "https://kazt.fun",
    siteName: "Kazt",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kazt — Pour your rules. Set them in chain.",
    description:
      "Craft ACE execution rules with drag-and-drop GUI and deploy them on-chain.",
    images: ["/images/og-image.png"],
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
      className={`${inter.variable} ${pixelFont.variable} ${jetbrains.variable}`}
    >
      <body className="bg-bg text-text-primary font-sans antialiased">
        <GlobalCursorHit />
        <MouseSparks />
        {children}
      </body>
    </html>
  );
}
