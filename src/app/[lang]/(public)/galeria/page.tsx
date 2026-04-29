import type { Metadata } from "next"
import { Gallery } from "@/components/sections/gallery"
import { getDictionary } from "@/dictionaries"
import { locales, type Locale } from "@/lib/i18n/config"
import { SITE_URL } from "@/lib/constant"
import { imagenService } from "@/modules/galeria"
import { REVALIDATE_24H } from "@/lib/constants/cache"

export const revalidate = REVALIDATE_24H

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
    title: dict.gallery.title,
    description: dict.gallery.description,
    alternates: {
      canonical: `${SITE_URL}/${lang}/galeria`,
      languages: Object.fromEntries(
        locales.map((l) => [l, `${SITE_URL}/${l}/galeria`])
      ),
    },
  }
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang: langStr } = await params
  const lang = langStr as Locale
  const [dict, imagenes] = await Promise.all([
    getDictionary(lang),
    imagenService.getPublicCached(20),
  ])
  return <Gallery lang={lang} dict={dict} imagenes={imagenes} />
}
