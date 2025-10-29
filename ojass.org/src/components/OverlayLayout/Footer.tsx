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
                className={`relative layout-panel hud-grid w-[90vw] max-w-6xl px-12 py-6 backdrop-blur-md transition-all duration-700 bg-black/60 ${
                    isDystopia ? "is-dystopia" : ""
                }`}
                style={{
                    clipPath:
                        "polygon(3% 28%, 18% 4%, 38% 4%, 40% 8%, 60% 8%, 62% 4%, 82% 4%, 97% 28%, 100% 100%, 0% 100%)",
                }}>
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                    {/* Left Section - About OJASS */}
                    <div className="space-y-3 pt-6 md:pt-8">
                        <h3
                            className={`text-2xl font-bold font-mono tracking-widest layout-text ${
                                isDystopia ? "is-dystopia" : ""
                            }`}>
                            OJASS &apos;26
                        </h3>
                        <p
                            className={`text-xs font-mono tracking-wide layout-text ${
                                isDystopia ? "is-dystopia" : ""
                            } opacity-90`}>
                            TECHNO-MANAGEMENT FESTIVAL
                        </p>
                        <div
                            className={`text-xs font-mono layout-text ${
                                isDystopia ? "is-dystopia" : ""
                            } opacity-75`}>
                            NIT JAMSHEDPUR | INSPIRING INNOVATION
                        </div>
                    </div>

                    {/* Center Section - Quick Links */}
                    <div className="space-y-3">
                        <h3
                            className={`text-lg font-bold font-mono tracking-widest layout-text ${
                                isDystopia ? "is-dystopia" : ""
                            }`}>
                            NAVIGATION
                        </h3>
                        <div className="space-y-2">
                            {["EVENTS", "WORKSHOPS", "SPONSORS", "TEAM"].map(
                                (link) => (
                                    <div
                                        key={link}
                                        className={`text-xs font-mono tracking-wider layout-text cursor-pointer hover:scale-105 transition-transform ${
                                            isDystopia ? "is-dystopia" : ""
                                        } opacity-80 hover:opacity-100`}>
                                        → {link}
                                    </div>
                                ),
                            )}
                        </div>
                    </div>

                    {/* Right Section - Contact Info */}
                    <div className="space-y-3">
                        <h3
                            className={`text-lg font-bold font-mono tracking-widest layout-text ${
                                isDystopia ? "is-dystopia" : ""
                            }`}>
                            CONTACT
                        </h3>
                        <div className="space-y-2">
                            <div
                                className={`text-xs font-mono tracking-wide layout-text ${
                                    isDystopia ? "is-dystopia" : ""
                                } opacity-80 flex items-center gap-2`}>
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="currentColor">
                                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                                </svg>
                                OJASS@NITJSR.AC.IN
                            </div>
                            <div
                                className={`text-xs font-mono tracking-wide layout-text ${
                                    isDystopia ? "is-dystopia" : ""
                                } opacity-80 flex items-center gap-2`}>
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="currentColor">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                </svg>
                                NIT JAMSHEDPUR, JHARKHAND
                            </div>
                            <div
                                className={`text-xs font-mono tracking-wide layout-text ${
                                    isDystopia ? "is-dystopia" : ""
                                } opacity-80 flex items-center gap-2`}>
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="currentColor">
                                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                                </svg>
                                +91-XXXX-XXXXXX
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Copyright */}

                <div
                    className={`pt-4 border-t transition-all duration-700 ease-out mt-6 ${
                        isDystopia
                            ? "border-orange-500/30"
                            : "border-cyan-500/30"
                    }`}>
                    <div
                        className={`text-center text-[10px] font-mono tracking-widest layout-text ${
                            isDystopia ? "is-dystopia" : ""
                        } opacity-70 uppercase`}>
                        © 2026 OJASS | NIT JAMSHEDPUR | ALL RIGHTS RESERVED |
                        WEB TEAM
                    </div>
                </div>
            </div>
        </div>
    );
}
