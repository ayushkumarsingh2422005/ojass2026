"use client";

import { useEffect, useRef } from "react";

interface GlitchTransitionProps {
    isVisible: boolean;
    src: string;
}

export default function GlitchTransition({
    isVisible,
    src = "glitch-effect.mov",
}: GlitchTransitionProps) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (!isVisible || !videoRef.current) return;
        videoRef.current.play().catch(console.error);
    }, [isVisible]);

    return (
        <div
            className="fixed w-screen h-screen bg-black top-0 left-0 opacity-0 pointer-events-none"
            style={{
                opacity: isVisible ? 1 : 0,
                transition: "opacity 1s ease-in-out",
            }}>
            <video
                ref={videoRef}
                src={src}
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
            />
        </div>
    );
}
