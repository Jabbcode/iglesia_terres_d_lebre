import { locales, type Locale } from "@/lib/i18n/config"

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: Locale }>
}) {
  // Await params to satisfy Next.js 15+
  await params
  return children
}
