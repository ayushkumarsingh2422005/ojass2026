"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import OriginalSVG from "./OriginalSVG";

interface UtopianCoinFullTossProps {
  onTossComplete?: () => void;
}

const UtopianCoinFullToss: React.FC<UtopianCoinFullTossProps> = ({
  onTossComplete,
}) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const tossTimeline = useRef<gsap.core.Timeline | null>(null);
  const glowTimeline = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const svg = wrapperRef.current?.querySelector("svg");
    if (!svg) return;

    // ensure coin always visible
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    gsap.set(svg, {
      filter: "drop-shadow(0 0 25px #00ffff)",
      transformOrigin: "50% 50%",
      cursor: "pointer",
      zIndex: 1000,
      position: "relative",
    });

    // 🪙 Toss animation — smaller vertical range for corner placement
   tossTimeline.current = gsap.timeline({ paused: true });
tossTimeline.current
  .set(svg, { zIndex: 99999 }) // bring to front before toss
  .to(svg, {
    y: -window.innerHeight + 200, // 👈 full-screen upward flight
    rotationX: 1080,
    duration: 1.2,                // slower, smoother ascent
    ease: "power2.out",
  })
  .to(svg, {
    y: 0,
    rotationX: 2160,              // more spins for a cinematic fall
    duration: 1.1,
    ease: "power2.in",
    onComplete: () => {
      if (typeof onTossComplete === "function") onTossComplete();
    },
  })

      // subtle bounce
      .to(svg, { y: -15, duration: 0.2, ease: "power1.out" })
      .to(svg, { y: 0, duration: 0.2, ease: "power1.in" })
      .set(svg, { zIndex: 1000 }); // restore z-index after toss

    // ✨ Continuous cyan glow
    glowTimeline.current = gsap.to(svg, {
      keyframes: [
        { filter: "drop-shadow(0 0 10px #00ffff)" },
        { filter: "drop-shadow(0 0 20px #00ffff)" },
        { filter: "drop-shadow(0 0 15px #00ffff)" },
      ],
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    const handleClick = () => tossTimeline.current?.restart();
    svg.addEventListener("click", handleClick);

    return () => {
      tossTimeline.current?.kill();
      glowTimeline.current?.kill();
      svg.removeEventListener("click", handleClick);
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [onTossComplete]);

  return (
    <div className="fixed bottom-6 right-20 flex justify-center items-center perspective-[1000px] overflow-visible z-[9999]">
      <div ref={wrapperRef}>
        <OriginalSVG />
      </div>
    </div>
  );
};

export default UtopianCoinFullToss;
