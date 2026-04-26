import type { Metadata } from "next"
import { Gallery } from "@/components/sections/gallery"

export const metadata: Metadata = {
  title: "Galería",
  description:
    "Explora los momentos que hemos compartido en comunidad. Cada imagen es un testimonio de nuestra fe, alegría y comunión.",
  keywords: [
    "fotos iglesia Tortosa",
    "galería comunidad cristiana",
    "momentos iglesia Terres de l'Ebre",
    "adoración en imágenes",
    "eventos iglesia evangélica Tortosa",
    "fotos culto dominical",
    "fotos comunitat cristiana Tortosa",
  ],
}

export default function GalleryPage() {
  return <Gallery />
}
