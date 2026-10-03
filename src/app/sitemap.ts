import type { MetadataRoute } from "next";
import { PUBLIC_PATHS, SITE } from "@/lib/seo/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_PATHS.map((path) => ({
    url: `${SITE.url}${path === "/" ? "" : path}`,
    priority: path === "/" ? 1 : 0.6,
  }));
}
