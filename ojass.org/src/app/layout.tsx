import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "../components/ClientLayout";
import { DestructiveProvider } from "../contexts/DestructiveContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OJASS 2026 - Annual Technical Festival",
  description: "Join us for OJASS 2026, the premier annual technical festival featuring cutting-edge technology, innovation, and exciting competitions.",
  keywords: ["OJASS", "technical festival", "technology", "innovation", "competitions", "2026"],
  authors: [{ name: "OJASS Team" }],
  openGraph: {
    title: "OJASS 2026 - Annual Technical Festival",
    description: "Join us for OJASS 2026, the premier annual technical festival featuring cutting-edge technology, innovation, and exciting competitions.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "OJASS 2026 - Annual Technical Festival",
    description: "Join us for OJASS 2026, the premier annual technical festival featuring cutting-edge technology, innovation, and exciting competitions.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <DestructiveProvider>
          {children}
          <ClientLayout />
        </DestructiveProvider>
      </body>
    </html>
  );
}
