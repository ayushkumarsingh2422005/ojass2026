"use client";

import { useTheme } from "@/contexts/ThemeContext";
import gsap from "gsap";
import { useEffect, useRef } from "react";

export default function Footer() {
    const { theme } = useTheme();
    const isDystopia = theme === "dystopia";
    const footerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.innerHeight + window.scrollY;
            const documentHeight = document.body.offsetHeight;
            const isNearBottom = scrollPosition >= documentHeight - 10;

            if (isNearBottom) {
                gsap.to(footerRef.current, {
                    y: 0,
                    opacity: 1,
                    pointerEvents: "auto",
                    duration: 0.9,
                    overwrite: "auto",
                });
            } else {
                gsap.to(footerRef.current, {
                    y: 200,
                    opacity: 0,
                    pointerEvents: "none",
                    duration: 1.5,
                    overwrite: "auto",
                });
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div
            ref={footerRef}
            className="fixed bottom-0 left-0 right-0 flex items-end justify-center z-40"
            style={{ opacity: 0, pointerEvents: "none" }}>
            <div
                className={`relative layout-panel hud-grid px-6 py-3 backdrop-blur-md transition-all duration-700 bg-black/60 ${
                    isDystopia ? "is-dystopia" : ""
                }`}
                style={{
                        width: "fit-content",
                        clipPath:
                            "polygon(0% 100%, 100% 100%, 97% 35%, 80% 0%, 63% 0%, 60% 5%, 40% 5%, 37% 0%, 20% 0%, 3% 35%)",
                }}>
                <div className="relative z-10 flex flex-col items-center justify-center gap-1 text-xs font-mono tracking-wider layout-text opacity-85 text-center">
                    {/* Navigation Links */}
                    <div className="flex flex-wrap items-center justify-center gap-6">
                        {[
                            { name: "OUR TEAM", href: "/team" },
                            { name: "PRIVACY POLICY", href: "/privacy-policy" },
                            { name: "EVENTS", href: "/events" },
                        ].map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className={`flex items-center gap-1 cursor-pointer hover:scale-105 transition-transform hover:opacity-100 ${
                                    isDystopia ? "is-dystopia" : ""
                                } opacity-80`}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="10"
                                    height="10"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="transition-transform duration-200 group-hover:translate-x-1">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                                {link.name}
                            </a>
                        ))}
                    </div>

                    {/* Design Credit Line */}
                    <div
                        className={`text-[10px] uppercase opacity-60 mt-1 ${
                            isDystopia ? "is-dystopia" : ""
                        }`}>
                        © 2026 OJASS | DESIGN & DEVELOPED BY{" "}
                        <a
                            href="https://digicraft.tech"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline hover:opacity-100 opacity-70">
                            DIGICRAFT
                        </a>
                    </div>
                </div>
            </div>
        </div>


    );
}
