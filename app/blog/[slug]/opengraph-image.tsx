import { ImageResponse } from "next/og";
import { BLOG_POSTS } from "@/lib/blogData";

export const dynamic = "force-static";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  const title = post?.title || "Engineering Field Notes";
  const tags = post?.tags && post.tags.length > 0 ? post.tags.slice(0, 4) : ["Cloud", "DevOps"];
  const readingTime = post?.readingTime || "5 min read";
  const category = post?.category ? post.category.toUpperCase() : "TECHNICAL ESSAY";

  // Dynamic font size scaling so long titles wrap cleanly and never overflow
  let titleFontSize = 54;
  if (title.length > 95) {
    titleFontSize = 40;
  } else if (title.length > 65) {
    titleFontSize = 46;
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0A0A0A",
          padding: "56px 64px",
          color: "#FFFFFF",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
        }}
      >
        {/* Subtle geometric perimeter border */}
        <div
          style={{
            position: "absolute",
            inset: "24px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            pointerEvents: "none",
          }}
        />

        {/* Top Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "#EDEDED",
            }}
          >
            WVRNER
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#888888",
            }}
          >
            <span>{category}</span>
            <span style={{ margin: "0 10px", color: "#555555" }}>·</span>
            <span>{readingTime.toUpperCase()}</span>
          </div>
        </div>

        {/* Center Main Stage (Title) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            maxWidth: "1040px",
          }}
        >
          <div
            style={{
              fontSize: 13,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#888888",
              fontFamily: "monospace",
            }}
          >
            FIELD DOCUMENTATION
          </div>
          <div
            style={{
              fontSize: titleFontSize,
              fontWeight: 800,
              letterSpacing: "-0.035em",
              lineHeight: 1.15,
              color: "#FFFFFF",
              display: "flex",
              flexWrap: "wrap",
              wordBreak: "break-word",
              maxHeight: "330px",
              overflow: "hidden",
            }}
          >
            {title}
          </div>
        </div>

        {/* Bottom Footer (Tags + Domain) */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            borderTop: "1px solid rgba(255, 255, 255, 0.12)",
            paddingTop: "24px",
          }}
        >
          {/* Tags */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            {tags.map((tag, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#D4D4D4",
                  border: "1px solid rgba(255, 255, 255, 0.16)",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  padding: "6px 14px",
                  borderRadius: "999px",
                }}
              >
                {tag}
              </div>
            ))}
          </div>

          {/* Domain */}
          <div
            style={{
              fontSize: 14,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#EDEDED",
              fontWeight: 600,
            }}
          >
            wvrner.com
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
