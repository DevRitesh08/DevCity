import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/components/AuthProvider";
import "./globals.css";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://devcity.dev";

export const metadata: Metadata = {
  title: {
    default: "DevCity — Your GitHub Profile as a Cyberpunk Skyscraper",
    template: "%s | DevCity",
  },
  description:
    "Your GitHub profile as a neon-lit 3D skyscraper in a living cyberpunk city. The more you contribute, the taller your tower rises.",
  metadataBase: new URL(BASE_URL),
  openGraph: {
    title: "DevCity — Your GitHub Profile as a Cyberpunk Skyscraper",
    description:
      "A neon-lit 3D cyberpunk city where every developer is a skyscraper. Explore, claim, customize.",
    url: BASE_URL,
    siteName: "DevCity",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevCity — Your GitHub Profile as a Cyberpunk Skyscraper",
    description:
      "A neon-lit 3D cyberpunk city where every developer is a skyscraper. Explore, claim, customize.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0F",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Cyberpunk fonts — JetBrains Mono + Orbitron from Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Orbitron:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-dc-void font-mono text-dc-text antialiased">
        {/* Scanline overlay — subtle cyberpunk effect */}
        <div className="scanline-overlay" />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
