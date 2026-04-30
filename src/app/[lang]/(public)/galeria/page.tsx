import type { Metadata } from "next"

import { Gallery } from "@/components/sections/gallery"
import { getDictionary } from "@/dictionaries"
import { locales, type Locale } from "@/lib/i18n/config"
import { SITE_URL } from "@/lib/constant"
import { imagenService } from "@/modules/galeria"

export const revalidate = 86400

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
  const [dict, { items, hasMore, nextCursor }] = await Promise.all([
    getDictionary(lang),
    imagenService.getPublicCached(20),
  ])
  return (
    <Gallery
      lang={lang}
      dict={dict}
      imagenes={items}
      hasMore={hasMore}
      nextCursor={nextCursor}
    />
  )
}
