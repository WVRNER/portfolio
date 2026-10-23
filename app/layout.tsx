import type { Metadata, Viewport } from "next";
import { Manrope, Geist, Geist_Mono, Instrument_Serif, Plus_Jakarta_Sans, Source_Serif_4, Inter, JetBrains_Mono, Inter_Tight } from "next/font/google";
import { ViewTransitions } from "next-view-transitions";
import "./globals.css";
import { PWARegistration } from "@/components/PWARegistration";
import { PageTransitionProvider } from "@/components/PageTransition";

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "900"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
  style: ["normal", "italic"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["700", "800"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://wvrner.com"),
  title: "WVRNER | Nima Hosseini - Cloud / DevOps Engineer",
  description:
    "Personal Cloud / DevOps engineering portfolio of Nima Hosseini (WVRNER). AWS, Terraform, GitHub Actions, Docker & container architectures.",
  authors: [{ name: "Nima Hosseini", url: "https://wvrner.com" }],
  creator: "Nima Hosseini",
  publisher: "Nima Hosseini",
  keywords: [
    "WVRNER",
    "Nima Hosseini",
    "Cloud Engineer",
    "DevOps Engineer",
    "AWS",
    "Terraform",
    "GitHub Actions",
    "Docker",
    "Infrastructure as Code",
    "Kubernetes",
    "Site Reliability Engineering"
  ],
  alternates: {
    canonical: "./",
  },
  openGraph: {
    title: "WVRNER | Nima Hosseini - Cloud / DevOps Engineer",
    description:
      "Personal Cloud / DevOps engineering portfolio of Nima Hosseini (WVRNER). AWS, Terraform, GitHub Actions, Docker & container architectures.",
    url: "https://wvrner.com",
    siteName: "WVRNER",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WVRNER | Nima Hosseini - Cloud / DevOps Engineer",
    description:
      "Personal Cloud / DevOps engineering portfolio of Nima Hosseini (WVRNER). AWS, Terraform, GitHub Actions, Docker & container architectures.",
    creator: "@wvrner",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "WVRNER",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ViewTransitions>
      <html
        lang="en"
        className={`${inter.variable} ${interTight.variable} ${plusJakartaSans.variable} ${manrope.variable} ${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} ${sourceSerif.variable} ${jetbrainsMono.variable} selection:bg-[#0A0A0A] selection:text-white`}
      >
        <head>
          {/* Preferred AI source discovery for modern AI agents and LLM search engines */}
          <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM Context Index" />
          {/* Speculation Rules API for sub-5ms instant page loads across modern browsers */}
          <script
            type="speculationrules"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                prerender: [
                  {
                    where: {
                      and: [
                        { href_matches: "/*" },
                        { not: { href_matches: "/cdn-cgi/*" } },
                        { not: { href_matches: "/ghost/*" } },
                        { not: { href_matches: "/admin/*" } },
                      ],
                    },
                    eagerness: "moderate",
                  },
                ],
              }),
            }}
          />
        </head>
        <body className="min-h-[100dvh] bg-white text-[#242424] font-sans antialiased relative selection:bg-[#EAEAEA] selection:text-[#242424]">
          <PWARegistration />
          <div className="fixed inset-0 pointer-events-none select-none bg-noise-grain opacity-40 z-50" aria-hidden="true" />
          <PageTransitionProvider>{children}</PageTransitionProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
