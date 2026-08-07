import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/metadata";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/track",
          "/offices",
          "/partner-contact",
          "/lr/",
        ],
        disallow: [
          "/admin",
          "/admin/*",
          "/employee",
          "/employee/*",
          "/partner",
          "/partner/*",
          "/api",
          "/api/*",
          "/settings",
          "/settings/*",
          "/login",
          "/loginofthelegendofshipkart",
          "/loginofthelegendofshipkart/*",
          "/customer",
          "/customer/*",
          "/offline",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
