export const revalidate = 86400
import type { Metadata } from "next"

import { Contact } from "@/components/sections/contact"
import { getDictionary } from "@/dictionaries"
import { locales, type Locale } from "@/lib/i18n/config"
import { SITE_URL } from "@/lib/constant"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang: langStr } = await params
  const lang = langStr as Locale
  const dict = await getDictionary(lang)

  return {
    title: dict.contact.title,
    description: dict.contact.description,
    alternates: {
      canonical: `${SITE_URL}/${lang}/contacto`,
      languages: Object.fromEntries(
        locales.map((l) => [l, `${SITE_URL}/${l}/contacto`])
      ),
    },
  }
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang: langStr } = await params
  const lang = langStr as Locale
  const dict = await getDictionary(lang)
  return <Contact lang={lang} dict={dict} />
}
