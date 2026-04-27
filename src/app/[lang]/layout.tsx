import "flag-icons/css/flag-icons.min.css"
import { Inter, Playfair_Display } from "next/font/google"
import { JsonLd } from "@/components/seo/json-ld"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import { GoogleAnalytics } from "@next/third-parties/google"
import { locales, isValidLocale, type Locale } from "@/lib/i18n/config"
import { notFound } from "next/navigation"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
})

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang: langStr } = await params
  if (!isValidLocale(langStr)) notFound()
  const lang = langStr as Locale

  return (
    <html lang={lang}>
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <JsonLd />
        {children}
        <Analytics />
        <SpeedInsights />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
      </body>
    </html>
  )
}
