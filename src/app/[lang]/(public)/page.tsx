import { Metadata } from "next"
import { Hero } from "@/components/sections/hero"
import { NextService } from "@/components/sections/next-service"
import { Community } from "@/components/sections/community"
import { CtaNew } from "@/components/sections/cta-new"
import { UpcomingEvents } from "@/components/sections/upcoming-events"
import { IGLESIA_NAME, SITE_URL, SITE_DESCRIPTION } from "@/lib/constant"
import { getDictionary } from "@/dictionaries"
import { locales, type Locale } from "@/lib/i18n/config"

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>
}): Promise<Metadata> {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return {
    title: dict.home.title,
    description: dict.home.description,
    alternates: {
      canonical: `${SITE_URL}/${lang}`,
      languages: Object.fromEntries(
        locales.map((l) => [l, `${SITE_URL}/${l}`])
      ),
    },
    openGraph: {
      title: dict.home.title,
      description: dict.home.description,
      url: `${SITE_URL}/${lang}`,
    },
  }
}

export default async function Home({
  params,
}: {
  params: Promise<{ lang: Locale }>
}) {
  const { lang } = await params
  const dict = await getDictionary(lang)

  return (
    <>
      <Hero lang={lang} dict={dict} />
      <NextService lang={lang} dict={dict} />
      <Community lang={lang} dict={dict} />
      <CtaNew lang={lang} dict={dict} />
      <UpcomingEvents lang={lang} dict={dict} />
    </>
  )
}
