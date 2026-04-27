import type { Metadata } from "next"
import { AboutUs } from "@/components/sections/about-us"
import { getDictionary } from "@/dictionaries"
import { locales, type Locale } from "@/lib/i18n/config"
import { SITE_URL } from "@/lib/constant"

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang: langStr } = await params
  const lang = langStr as Locale
  const dict = await getDictionary(lang)

  return {
    title: dict.about.title,
    description: dict.about.description,
    alternates: {
      canonical: `${SITE_URL}/${lang}/nosotros`,
      languages: Object.fromEntries(
        locales.map((l) => [l, `${SITE_URL}/${l}/nosotros`])
      ),
    },
  }
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang: langStr } = await params
  const lang = langStr as Locale
  const dict = await getDictionary(lang)
  return <AboutUs lang={lang} dict={dict} />
}
