import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "OJASS 2026 Sponsorship | Partner with India's Premier Tech Fest at NIT Jamshedpur",
  description: "Partner with OJASS 2026, NIT Jamshedpur's flagship annual techno-management festival. Reach 25,000+ students on-ground and 5M+ digital impressions. Explore sponsorship packages, brand visibility, and recruitment opportunities.",
  keywords: [
    "OJASS 2026",
    "OJASS sponsorship",
    "NIT Jamshedpur",
    "college fest sponsorship",
    "tech fest sponsorship India",
    "student engagement",
    "brand visibility",
    "campus marketing",
    "recruitment opportunities",
    "college festival sponsor",
    "techno-cultural fest",
    "youth marketing India",
    "campus ambassador program",
  ],
  authors: [{ name: "OJASS NIT Jamshedpur" }],
  creator: "OJASS NIT Jamshedpur",
  publisher: "OJASS NIT Jamshedpur",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://sponsor.ojass.org",
    title: "OJASS 2026 Sponsorship | Partner with India's Premier Tech Fest",
    description: "Partner with OJASS 2026 at NIT Jamshedpur. Reach 25,000+ students on-ground and 5M+ digital impressions. Explore sponsorship packages and brand visibility opportunities.",
    siteName: "OJASS Sponsorship Portal",
    images: [
      {
        url: "/logo.webp",
        width: 1200,
        height: 630,
        alt: "OJASS 2026 Sponsorship",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OJASS 2026 Sponsorship | Partner with India's Premier Tech Fest",
    description: "Partner with OJASS 2026 at NIT Jamshedpur. Reach 25,000+ students and 5M+ digital impressions. Explore sponsorship opportunities.",
    images: ["/logo.webp"],
    creator: "@ojass_nitjsr",
  },
  alternates: {
    canonical: "https://sponsor.ojass.org",
  },
  category: "Events & Sponsorship",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${poppins.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
