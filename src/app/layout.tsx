import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { IGLESIA_NAME } from "@/lib/constant";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: IGLESIA_NAME,
  description:
    "Somos una comunidad cristiana en Terres de l'Ebre. Un lugar donde encontrarás familia, propósito y fe. Te estábamos esperando.",
  keywords: [
    "iglesia",
    "comunidad cristiana",
    "Terres de l'Ebre",
    "Tortosa",
    "culto dominical",
    "grupos de vida",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
