import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/components/AuthProvider";
import "./globals.css";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://devcity.dev";

export const metadata: Metadata = {
  title: {
    default: "DevCity — Where Code Builds Cities",
    template: "%s | DevCity",
  },
  description:
    "Your developer profile as a 3D pixel art building in an interactive city. Connect GitHub, GitLab, npm & more.",
  metadataBase: new URL(BASE_URL),
  openGraph: {
    title: "DevCity — Where Code Builds Cities",
    description:
      "Your developer profile as a 3D pixel art building. Explore, connect, grow.",
    url: BASE_URL,
    siteName: "DevCity",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevCity — Where Code Builds Cities",
    description:
      "Your developer profile as a 3D pixel art building. Explore, connect, grow.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0e1a",
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
        {/* Pixel font — Silkscreen from Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Silkscreen:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-bg font-pixel text-cream antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
