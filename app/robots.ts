import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const BASE_URL = "https://wvrner.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: [
          "GPTBot",
          "ClaudeBot",
          "PerplexityBot",
          "Applebot-Extended",
          "Google-Extended",
        ],
        allow: ["/", "/llms.txt", "/llms-full.txt"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
