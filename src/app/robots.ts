import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Keep the login page crawlable so its existing noindex can be read.
      disallow: ["/admin/collections/", "/admin/globals/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
