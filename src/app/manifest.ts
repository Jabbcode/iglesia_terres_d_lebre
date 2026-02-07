import { MetadataRoute } from "next";
import { IGLESIA_NAME, SITE_DESCRIPTION } from "@/lib/constant";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: IGLESIA_NAME,
    short_name: "IBTE",
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#FAF7F2",
    theme_color: "#E8913A",
    icons: [
      {
        src: "/logo.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
