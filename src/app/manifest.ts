import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: SITE.shortName,
    description: SITE.description,
    start_url: "/",
    display: "standalone",
    background_color: SITE.themeColor.dark,
    theme_color: SITE.themeColor.dark,
    icons: [
      { src: "/image/dexisphere-icon192.png", sizes: "192x192", type: "image/png" },
      { src: "/image/dexisphere-icon512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
