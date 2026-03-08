import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/components/AuthProvider";
import "./globals.css";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://islefolio.dev";

export const metadata: Metadata = {
  title: {
    default: "ISLEFOLIO — Your Island on the Internet",
    template: "%s | ISLEFOLIO",
  },
  description:
    "Your GitHub profile as a living low-poly island. More code, bigger island. Explore the archipelago of developers.",
  metadataBase: new URL(BASE_URL),
  openGraph: {
    title: "ISLEFOLIO — Your Island on the Internet",
    description:
      "A living 3D archipelago where each developer has their own island. Explore, discover, grow.",
    url: BASE_URL,
    siteName: "ISLEFOLIO",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ISLEFOLIO — Your Island on the Internet",
    description:
      "A living 3D archipelago where each developer has their own island. Explore, discover, grow.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0e2a3a",
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
    <html lang="en">
      <head>
        {/* Island fonts — Amatic SC (display) + Nunito (body) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Amatic+SC:wght@400;700&family=Nunito:ital,wght@0,300;0,400;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-dc-void font-body text-dc-text antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
