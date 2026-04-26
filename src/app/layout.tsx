import type { Metadata } from "next"
import "./globals.css"
import {
  IGLESIA_NAME,
  SITE_URL,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
} from "@/lib/constant"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${IGLESIA_NAME} | Comunidad Cristiana en Tortosa`,
    template: `%s | ${IGLESIA_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  authors: [{ name: IGLESIA_NAME }],
  creator: IGLESIA_NAME,
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: SITE_URL,
    siteName: IGLESIA_NAME,
    title: IGLESIA_NAME,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${IGLESIA_NAME} - Comunidad cristiana en Terres de l'Ebre`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: IGLESIA_NAME,
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
}

// Root layout is intentionally minimal — nested layouts provide <html> and <body>
// so that [lang]/layout.tsx can set the correct lang attribute per locale.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
