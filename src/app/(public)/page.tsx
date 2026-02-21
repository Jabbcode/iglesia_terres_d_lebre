import { Metadata } from "next"
import { Hero } from "@/components/sections/hero"
import { NextService } from "@/components/sections/next-service"
import { Community } from "@/components/sections/community"
import { CtaNew } from "@/components/sections/cta-new"
import { UpcomingEvents } from "@/components/sections/upcoming-events"
import { IGLESIA_NAME, SITE_URL, SITE_DESCRIPTION } from "@/lib/constant"

export const metadata: Metadata = {
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: `Bienvenidos a ${IGLESIA_NAME}`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  },
}

export default function Home() {
  return (
    <>
      <Hero />
      <NextService />
      <Community />
      <CtaNew />
      <UpcomingEvents />
    </>
  )
}
