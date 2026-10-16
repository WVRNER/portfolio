import type { Metadata, Viewport } from "next";
import { Manrope, Geist, Geist_Mono, Instrument_Serif, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

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
  title: "WVRNER — Nima Hosseini | Cloud / DevOps Engineer",
  description:
    "Personal Cloud / DevOps engineering portfolio of Nima Hosseini (WVRNER). AWS, Terraform, GitHub Actions, Docker & container architectures.",
  authors: [{ name: "Nima Hosseini" }],
  keywords: [
    "WVRNER",
    "Nima Hosseini",
    "Cloud Engineer",
    "DevOps Engineer",
    "AWS",
    "Terraform",
    "GitHub Actions",
    "Docker",
    "Infrastructure as Code"
  ],
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
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
      className={`${plusJakartaSans.variable} ${manrope.variable} ${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} selection:bg-[#0A0A0A] selection:text-white`}
    >
      <body className="min-h-[100dvh] bg-white text-[#0A0A0A] font-sans antialiased relative selection:bg-[#0A0A0A] selection:text-white">
        <div className="fixed inset-0 pointer-events-none bg-noise-grain opacity-40 z-50" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
