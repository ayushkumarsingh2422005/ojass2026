import { useTheme } from "@/contexts/ThemeContext";
import { NavItems } from "@/lib/constants";
import gsap from "gsap";
import Link from "next/link";
import { useEffect, useRef } from "react";

export default function LeftPanel() {
    const { theme } = useTheme();
    const isDystopia = theme === "dystopia";
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!panelRef.current) return;

        gsap.fromTo(
            panelRef.current,
            { x: -100, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.8, ease: "power2.out", delay: 0.2 },
        );
    }, []);

    return (
        <div
            ref={panelRef}
            className={`layout-panel w-[60px] h-[50vh] fixed bottom-0 left-0 flex flex-col items-center justify-center hud-grid py-10 pt-14 pr-3 ${
                isDystopia ? "is-dystopia" : ""
            }`}
            style={{
                position: "fixed",
                bottom: "0",
                left: "0",
                clipPath:
                    "polygon(0% 0%, calc(100% - 30px) 0%, 100% 50px, 80% 95%, 100% 100%, 0% 100%, 0% 100%)",
            }}>
            <div className="flex flex-col items-center justify-between h-full py-2">
                {/* Navigation Icons */}
                {NavItems.map((item, idx) => (
                    <Link
                        key={idx}
                        href={item.title==="Home"? "/":item.title.toLowerCase().replace(" ", "-")}
                        className={`layout-text cursor-pointer hover:scale-110 transition-transform ${
                            isDystopia ? "is-dystopia" : ""
                        }`}
                        title={item.title}
                    >
                        <item.element className="size-6" />
                    </Link>
                ))}
            </div>
        </div>
    );
}
