import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/student/", "/api/", "/login", "/register", "/dashboard/"],
      },
    ],
    sitemap: "https://edsecict.com/sitemap.xml",
    host: "https://edsecict.com",
  };
}
