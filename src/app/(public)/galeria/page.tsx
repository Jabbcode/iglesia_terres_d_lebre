import type { Metadata } from "next"
import { Gallery } from "@/components/sections/gallery"
import { IGLESIA_NAME } from "@/lib/constant"

export const metadata: Metadata = {
  title: `Galería | ${IGLESIA_NAME}`,
  description:
    "Explora los momentos que hemos compartido en comunidad. Cada imagen es un testimonio de nuestra fe, alegría y comunión.",
}

export default function GalleryPage() {
  return <Gallery />
}
