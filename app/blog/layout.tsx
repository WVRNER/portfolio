import type { Metadata } from "next";
import { BlogThemeProvider } from "@/components/BlogThemeProvider";

export const metadata: Metadata = {
  title: "Writing & Engineering Field Notes | WVRNER",
  description:
    "Technical essays and production-grade field notes on cloud architecture, Terraform invariants, ephemeral infrastructure, and resilient systems.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Writing & Engineering Field Notes | WVRNER",
    description:
      "Technical essays and production-grade field notes on cloud architecture, Terraform invariants, ephemeral infrastructure, and resilient systems.",
    url: "https://wvrner.com/blog",
    siteName: "WVRNER",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Writing & Engineering Field Notes | WVRNER",
    description:
      "Technical essays and production-grade field notes on cloud architecture, Terraform invariants, ephemeral infrastructure, and resilient systems.",
    creator: "@wvrner",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Zero-flash theme initialization for blog routes */}
      <script
        id="blog-theme-init"
        dangerouslySetInnerHTML={{
          __html: `(function(){try{var t=localStorage.getItem("wvrner-blog-theme");var isSystemDark=window.matchMedia("(prefers-color-scheme: dark)").matches;var isDark=isSystemDark||t==="dark";if(isDark){document.documentElement.classList.add("dark");document.documentElement.setAttribute("data-blog-theme","dark");}else{document.documentElement.classList.remove("dark");document.documentElement.setAttribute("data-blog-theme","light");}}catch(e){}})();`,
        }}
      />
      <BlogThemeProvider>{children}</BlogThemeProvider>
    </>
  );
}
