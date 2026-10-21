import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/blogData";

export const dynamic = "force-static";

const BASE_URL = "https://wvrner.com";

export default function sitemap(): MetadataRoute.Sitemap {
  // Filter out any placeholder, draft, or test posts
  const validPosts = BLOG_POSTS.filter((post) => {
    if (!post.slug || post.slug === "placeholder") return false;
    const hasTestTag = post.tags?.some(
      (t) => t.trim().toLowerCase() === "test"
    );
    if (hasTestTag) return false;
    if (post.slug.toLowerCase().includes("test")) return false;
    return true;
  });

  const postEntries: MetadataRoute.Sitemap = validPosts.map((post) => {
    let lastMod = new Date();
    if (post.date) {
      const parsed = new Date(post.date);
      if (!isNaN(parsed.getTime())) {
        lastMod = parsed;
      }
    }

    return {
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: lastMod,
      changeFrequency: "monthly",
      priority: 0.7,
    };
  });

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    ...postEntries,
  ];
}
