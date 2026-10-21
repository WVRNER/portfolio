import { notFound } from "next/navigation";
import { Suspense } from "react";
import { BLOG_POSTS } from "@/lib/blogData";
import { ArticleClientWrapper } from "./ArticleClientWrapper";

export async function generateStaticParams() {
  if (BLOG_POSTS.length === 0) {
    return [{ slug: "placeholder" }];
  }
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: "Article Not Found | WVRNER",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const isTestPost = Boolean(
    post.tags?.some((t) => t.trim().toLowerCase() === "test") ||
      slug.toLowerCase().includes("test")
  );

  const ogImage = post.featureImage || "/hero-poster.jpg";

  return {
    title: `${post.title} | WVRNER`,
    description: post.excerpt,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    robots: isTestPost
      ? {
          index: false,
          follow: true,
        }
      : undefined,
    openGraph: {
      title: `${post.title} | WVRNER`,
      description: post.excerpt,
      url: `https://wvrner.com/blog/${slug}`,
      siteName: "WVRNER",
      type: "article",
      images: [
        {
          url: ogImage,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | WVRNER`,
      description: post.excerpt,
      images: [ogImage],
      creator: "@wvrner",
    },
  };
}

async function ArticleContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return <ArticleClientWrapper post={post} />;
}

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<div className="min-h-[100dvh] bg-[#FBFBFA]" />}>
      <ArticleContent params={params} />
    </Suspense>
  );
}
