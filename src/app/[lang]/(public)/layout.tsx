import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { PageTransition } from "@/components/ui/motion"
import type { Locale } from "@/lib/i18n/config"

export default async function PublicLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = (await params) as { lang: Locale }

  return (
    <>
      <Navbar lang={lang} />
      <PageTransition>
        <main>{children}</main>
      </PageTransition>
      <Footer lang={lang} />
    </>
  )
}
