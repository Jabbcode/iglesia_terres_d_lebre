import type { Metadata } from "next"
import { Gallery } from "@/components/sections/gallery"

export const metadata: Metadata = {
  title: "Galería",
  description:
    "Explora los momentos que hemos compartido en comunidad. Cada imagen es un testimonio de nuestra fe, alegría y comunión.",
}

export default function GalleryPage() {
  return <Gallery />
}
