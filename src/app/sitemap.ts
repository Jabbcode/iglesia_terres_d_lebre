import { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/constant"
import { locales } from "@/lib/i18n/config"

const pages: {
  path: string
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]
  priority: number
}[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/nosotros", changeFrequency: "monthly", priority: 0.9 },
  { path: "/contacto", changeFrequency: "monthly", priority: 0.9 },
  { path: "/creencias", changeFrequency: "monthly", priority: 0.8 },
  { path: "/horarios", changeFrequency: "weekly", priority: 0.8 },
  { path: "/galeria", changeFrequency: "weekly", priority: 0.7 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  return pages.flatMap((page) =>
    locales.map((lang) => ({
      url: `${SITE_URL}/${lang}${page.path}`,
      lastModified: now,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${SITE_URL}/${l}${page.path}`])
        ),
      },
    }))
  )
}
