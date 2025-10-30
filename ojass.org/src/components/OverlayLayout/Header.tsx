import { useTheme } from "@/contexts/ThemeContext";
import gsap from "gsap";
import { useEffect, useRef } from "react";

export default function Header() {
    const { theme } = useTheme();
    const isDystopia = theme === "dystopia";
    const headerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!headerRef.current) return;

        gsap.fromTo(
            headerRef.current,
            { y: -20, opacity: 0 },
            { y: 0, opacity: 1, duration: 2.5 },
        );
    }, []);

    return (
        <div
            ref={headerRef}
            className="fixed top-0 left-0 w-full flex items-center justify-center">
            <div
                className={`layout-panel layout-text text-2xl font-bold relative px-9 py-2 pb-3 ${
                    isDystopia ? "is-dystopia" : ""
                }`}
                style={{
                    clipPath:
                        "polygon(0% 0%, 100% 0%, 97% 65%, 80% 100%, 63% 100%, 60% 95%, 40% 95%, 37% 100%, 20% 100%, 3% 65%)",
                }}>
                <div className="flex items-center gap-2">
                    <span>OJASS 2026</span>
                </div>
            </div>
        </div>
    );
}
