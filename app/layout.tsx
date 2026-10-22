import type { Metadata, Viewport } from "next";
import { Manrope, Geist, Geist_Mono, Instrument_Serif, Plus_Jakarta_Sans, Source_Serif_4, Inter } from "next/font/google";
import "./globals.css";
import { PWARegistration } from "@/components/PWARegistration";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
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
    <html
      lang="en"
      className={`${inter.variable} ${plusJakartaSans.variable} ${manrope.variable} ${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} ${sourceSerif.variable} selection:bg-[#0A0A0A] selection:text-white`}
    >
      <body className="min-h-[100dvh] bg-white text-[#0A0A0A] font-sans antialiased relative selection:bg-[#0A0A0A] selection:text-white">
        <PWARegistration />
        <div className="fixed inset-0 pointer-events-none bg-noise-grain opacity-40 z-50" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
