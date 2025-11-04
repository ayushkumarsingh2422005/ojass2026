import OverlayLayout from "@/components/OverlayLayout/Layout";
import { ThemeProvider } from "@/contexts/ThemeContext";
import type { Metadata } from "next";
import { ReactNode } from "react";
import "./globals.css";

const metaDataDescription =
    "Join us for OJASS 2026, the premier annual techno-management festival featuring cutting-edge technology, innovation, and exciting competitions.";

export const metadata: Metadata = {
    title: "OJASS 2026 | NIT Jamshedpur",
    description: metaDataDescription,
    keywords: [
        "OJASS",
        "technical festival",
        "technology",
        "innovation",
        "competitions",
        "2026",
    ],
    authors: [{ name: "OJASS Team" }],
    openGraph: {
        title: "OJASS 2026 - NIT Jamshedpur",
        description: metaDataDescription,
        type: "website",
        locale: "en_US",
    },
    twitter: {
        card: "summary_large_image",
        title: "OJASS 2026 | NIT Jamshedpur",
        description: metaDataDescription,
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return (
        <html lang="en" className="overflow-x-hidden">
            <body>
                <ThemeProvider>
                    {children}
                    <OverlayLayout />
                </ThemeProvider>
            </body>
        </html>
    );
}
