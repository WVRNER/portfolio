import { BLOG_POSTS, type BlogPost } from "@/lib/blogData";

const GHOST_URL =
  process.env.GHOST_URL ||
  process.env.NEXT_PUBLIC_GHOST_URL ||
  "http://localhost:2368";
const GHOST_CONTENT_API_KEY =
  process.env.GHOST_CONTENT_API_KEY ||
  process.env.NEXT_PUBLIC_GHOST_CONTENT_API_KEY ||
  "";

export interface GhostRawPost {
  id: string;
  uuid: string;
  title: string;
  slug: string;
  html?: string;
  feature_image?: string | null;
  featured?: boolean;
  published_at?: string;
  custom_excerpt?: string | null;
  reading_time?: number;
  tags?: Array<{ id: string; name: string; slug: string }>;
  authors?: Array<{ id: string; name: string; slug: string; profile_image?: string }>;
}

export function transformGhostPost(raw: GhostRawPost): BlogPost {
  const matchingLocal = BLOG_POSTS.find((p) => p.slug === raw.slug);

  const tags = (raw.tags || []).map((t) => t.name);
  const category = tags[0] || matchingLocal?.category || "Infrastructure";

  const dateObj = raw.published_at ? new Date(raw.published_at) : new Date();
  const dateStr = dateObj
    .toLocaleDateString("en-US", { month: "short", year: "numeric" })
    .toUpperCase();

  return {
    slug: raw.slug,
    title: raw.title,
    date: matchingLocal?.date || dateStr,
    category,
    readingTime: `${Math.max(1, raw.reading_time || 5)} min read`,
    excerpt: raw.custom_excerpt || matchingLocal?.excerpt || "",
    tags: tags.length > 0 ? tags : (matchingLocal?.tags || ["Cloud", "DevOps"]),
    subtitle: matchingLocal?.subtitle || raw.custom_excerpt || undefined,
    pullQuote: matchingLocal?.pullQuote,
    invariant: matchingLocal?.invariant,
    issueNo: matchingLocal?.issueNo,
    nextSlug: matchingLocal?.nextSlug,
    nextTeaser: matchingLocal?.nextTeaser,
    content: matchingLocal?.content || {
      lead: raw.custom_excerpt || "",
      sections: [
        {
          paragraphs: [
            raw.html ? raw.html.replace(/<[^>]+>/g, " ").slice(0, 500) : "",
          ],
        },
      ],
    },
  };
}

/**
 * Fetch all posts from Ghost CMS Content API with fallback to static BLOG_POSTS.
 */
export async function getMergedPosts(): Promise<BlogPost[]> {
  try {
    const endpoint = `${GHOST_URL.replace(/\/$/, "")}/ghost/api/content/posts/?key=${encodeURIComponent(
      GHOST_CONTENT_API_KEY
    )}&include=tags,authors&limit=all`;

    const res = await fetch(endpoint, {
      next: { revalidate: 60 },
      headers: { "Accept-Version": "v5.0" },
    });

    if (!res.ok) {
      return BLOG_POSTS;
    }

    const data = await res.json();
    if (!data.posts || data.posts.length === 0) {
      return BLOG_POSTS;
    }

    // Map Ghost posts to BlogPost schema
    const ghostPosts = data.posts.map((p: GhostRawPost) => transformGhostPost(p));

    // Combine any local posts not present in Ghost to prevent 404s
    const ghostSlugs = new Set(ghostPosts.map((p: BlogPost) => p.slug));
    const extraLocals = BLOG_POSTS.filter((p) => !ghostSlugs.has(p.slug));

    return [...ghostPosts, ...extraLocals];
  } catch {
    // If Ghost server is offline or unreachable, return local blog data
    return BLOG_POSTS;
  }
}
