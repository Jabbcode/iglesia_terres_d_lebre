import type { Metadata } from "next"
import { Schedule } from "@/components/sections/schedule"
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
  const { lang } = await params
  const dict = await getDictionary(lang)

  return {
    title: dict.schedule.title,
    description: dict.schedule.description,
    alternates: {
      canonical: `${SITE_URL}/${lang}/horarios`,
      languages: Object.fromEntries(
        locales.map((l) => [l, `${SITE_URL}/${l}/horarios`])
      ),
    },
  }
}

export default async function SchedulePage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const dict = await getDictionary(lang)
  return <Schedule lang={lang} dict={dict} />
}
