import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api", "/admin/dashboard"],
    },
    sitemap: "https://neodesignstudio.az/sitemap.xml",
  };
}
