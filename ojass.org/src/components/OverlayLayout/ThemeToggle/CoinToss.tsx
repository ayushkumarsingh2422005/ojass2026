"use client";

import DystopianSVG from "@/components/OverlayLayout/ThemeToggle/DystopianSVG";
import UtopianSVG from "@/components/OverlayLayout/ThemeToggle/UtopianSVG";
import { useTheme } from "@/contexts/ThemeContext";
import { gsap } from "gsap";
import { useEffect, useRef } from "react";

const glowConfigs = {
    dystopia: {
        color: "#ff0000",
        keyframes: [
            { filter: "drop-shadow(0 0 10px #ff1a1a)" },
            { filter: "drop-shadow(0 0 25px #ff0000)" },
        ],
    },
    utopia: {
        color: "#00ffff",
        keyframes: [
            { filter: "drop-shadow(0 0 10px #00ffff)" },
            { filter: "drop-shadow(0 0 20px #00ffff)" },
            { filter: "drop-shadow(0 0 15px #00ffff)" },
        ],
    },
};

const CoinToss = ({ onToggle }: { onToggle: () => void }) => {
    const { theme } = useTheme();
    const isDystopia = theme === "dystopia";

    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const tossTimeline = useRef<gsap.core.Timeline | null>(null);
    const glowTween = useRef<gsap.core.Tween | null>(null);

    useEffect(() => {
        const svg = wrapperRef.current?.querySelector("svg");
        if (!svg) return;

        // Setup glow color + visual base
        const { color, keyframes } =
            glowConfigs[isDystopia ? "dystopia" : "utopia"];

        gsap.set(svg, {
            filter: `drop-shadow(0 0 25px ${color})`,
            transformOrigin: "50% 50%",
            cursor: "pointer",
            zIndex: 1000,
            position: "relative",
        });

        // Toss animation
        tossTimeline.current?.kill();
        tossTimeline.current = gsap
            .timeline({ paused: true })
            .set(svg, { zIndex: 99999 })
            .to(svg, {
                y: -window.innerHeight + 200,
                rotationX: 1080,
                duration: 0.8,
                ease: "power2.out",
            })
            .to(svg, {
                y: 0,
                rotationX: 2160,
                duration: 0.8,
                ease: "power2.in",
                onComplete: onToggle,
            })
            .set(svg, { zIndex: 1000 });

        // Glow animation
        glowTween.current?.kill();
        glowTween.current = gsap.to(svg, {
            keyframes,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
        });

        // Event listener
        const handleClick = () => tossTimeline.current?.restart();
        svg.addEventListener("click", handleClick);

        return () => {
            tossTimeline.current?.kill();
            glowTween.current?.kill();
            svg.removeEventListener("click", handleClick);
        };
    }, [isDystopia, onToggle]);

    return (
        <div className="fixed bottom-6 right-20 flex justify-center items-center z-[9999]">
            <div ref={wrapperRef}>
                {isDystopia ? <DystopianSVG /> : <UtopianSVG />}
            </div>
        </div>
    );
};

export default CoinToss;
