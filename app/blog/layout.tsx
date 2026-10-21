import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stories & Engineering Field Notes | WVRNER",
  description:
    "Technical essays and production-grade field notes on cloud architecture, Terraform invariants, ephemeral infrastructure, and resilient systems.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Stories & Engineering Field Notes | WVRNER",
    description:
      "Technical essays and production-grade field notes on cloud architecture, Terraform invariants, ephemeral infrastructure, and resilient systems.",
    url: "https://wvrner.com/blog",
    siteName: "WVRNER",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/hero-poster.jpg",
        width: 1200,
        height: 630,
        alt: "WVRNER Stories & Engineering Field Notes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stories & Engineering Field Notes | WVRNER",
    description:
      "Technical essays and production-grade field notes on cloud architecture, Terraform invariants, ephemeral infrastructure, and resilient systems.",
    images: ["/hero-poster.jpg"],
    creator: "@wvrner",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
