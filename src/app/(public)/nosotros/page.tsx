import type { Metadata } from "next"
import { AboutUs } from "@/components/sections/about-us"

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Conoce nuestra historia, misión, visión y valores. Somos una comunidad de fe comprometida con el amor de Cristo en Terres de l'Ebre.",
}

export default function AboutPage() {
  return <AboutUs />
}
