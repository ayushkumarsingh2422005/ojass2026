
"use client";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useTheme } from "@/contexts/ThemeContext";

gsap.registerPlugin(ScrollTrigger);

interface TeamCardProps {
  name: string;
  title: string;
  img: string;
  phone: string;
  email: string;
  linkdin: string;
  github?: string;
}

export default function TeamCard({
  name,
  title,
  img,
  phone,
  email,
  linkdin,
  github,
}: TeamCardProps) {
  const { theme } = useTheme();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const svgBackRef = useRef<SVGSVGElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  // SVG animation effect
  useEffect(() => {
    const svgEl = svgRef.current;
    const svgBackEl = svgBackRef.current;
    if (!svgEl && !svgBackEl) return;

    const color = theme === "utopia" ? "#00ffff" : "#cc7722";

    const animateSvg = (svg: SVGSVGElement) => {
      const allPaths = svg.querySelectorAll("path");

      allPaths.forEach((el) => {
        el.setAttribute("fill", "none");
        el.setAttribute("stroke", color);
        el.setAttribute("strokeWidth", "4");

        el.style.filter = `
          drop-shadow(0 0 6px ${color})
          drop-shadow(0 0 12px ${color})
          drop-shadow(0 0 20px ${color})
          drop-shadow(0 0 35px ${color})
        `;
        el.style.mixBlendMode = "screen";
        el.style.transition = "filter 0.5s ease-in-out, stroke 0.5s ease-in-out";
      });

      // Only animate on first load
      if (!svg.dataset.animated) {
        gsap.fromTo(
          allPaths,
          { opacity: 0, scale: 0.96 },
          {
            opacity: 1,
            scale: 1,
            duration: 1.5,
            ease: "power3.out",
            stagger: 0.05,
            scrollTrigger: {
              trigger: svg,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
        svg.dataset.animated = "true";
      }
    };

    if (svgEl) animateSvg(svgEl);
    if (svgBackEl) animateSvg(svgBackEl);
  }, [theme, isFlipped]);

  // Text animation effect
  useEffect(() => {
    const textEl = textRef.current;
    const svgEl = svgRef.current;
    if (!textEl || !svgEl) return;

    const color = theme === "utopia" ? "#00ffff" : "#cc7722";

    gsap.fromTo(
      textEl,
      { opacity: 0, y: 0 },
      {
        opacity: 1,
        y: 0,
        color,
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: svgEl,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, [theme]);

  const themeColors = {
    text: theme === "utopia" ? "text-cyan-300" : "text-amber-400",
    textSecondary: theme === "utopia" ? "text-cyan-400/80" : "text-amber-300/80",
    shadow: theme === "utopia" ? "drop-shadow-[0_0_8px_#00ffff]" : "drop-shadow-[0_0_8px_#cc7722]",
    border: theme === "utopia" ? "border-cyan-400/40" : "border-amber-400/40",
    bgHover: theme === "utopia" 
      ? "bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300" 
      : "bg-amber-500/10 hover:bg-amber-500/20 text-amber-300",
  };

  const SVGPaths = () => (
    <g transform="translate(0,277) scale(0.1,-0.1)" fill="#000000" stroke="none">
      <path d="M126 2755 c-3 -8 -11 -15 -19 -15 -15 0 -59 -44 -76 -77 -12 -23 -15 -111 -5 -137 12 -31 33 15 34 71 0 48 4 56 38 88 30 28 45 35 82 35 25 0 55 6 68 13 l23 13 -26 12 c-38 17 -112 15 -119 -3z"/>
      <path d="M365 2750 c-11 -5 -31 -18 -45 -29 -22 -18 -25 -18 -37 -3 -11 16 -12 16 -13 1 0 -9 -12 -24 -26 -34 -32 -21 -164 -155 -164 -167 0 -4 -7 -8 -15 -8 -17 0 -20 -17 -4 -22 7 -2 3 -17 -11 -40 -16 -28 -21 -54 -22 -112 -1 -41 1 -79 5 -82 4 -4 7 29 7 74 0 48 4 82 10 82 6 0 10 5 10 10 0 6 70 80 155 165 l155 155 90 0 c83 0 90 -1 90 -20 0 -24 -462 -490 -485 -490 -13 0 -14 -4 -4 -21 9 -17 7 -25 -10 -43 -25 -26 -26 -33 -6 -33 8 0 15 3 15 7 0 3 134 140 297 303 l297 297 603 0 603 0 135 -135 135 -135 0 -160 c0 -128 -3 -160 -14 -160 -17 0 -138 -61 -148 -75 -4 -5 -8 -294 -8 -640 l0 -631 53 -30 c28 -16 67 -36 85 -43 l32 -13 0 -324 0 -325 -147 3 -146 3 -24 40 c-13 22 -31 57 -40 78 -10 20 -21 37 -25 37 -5 0 -8 7 -8 16 0 28 -28 46 -59 39 -42 -9 -780 -9 -814 0 -30 8 -56 -13 -57 -47 0 -10 -4 -18 -10 -18 -5 0 -10 -7 -10 -15 0 -8 -4 -15 -10 -15 -5 0 -10 -4 -10 -10 0 -5 -13 -30 -29 -56 l-30 -46 -188 0 -189 1 -137 138 -137 138 0 482 c0 310 -4 484 -10 488 -6 4 -10 150 -11 403 0 241 -4 389 -9 377 -5 -11 -9 -123 -9 -250 0 -126 0 -515 -1 -863 0 -685 -3 -651 54 -715 14 -15 27 -27 29 -27 2 0 44 -40 93 -90 49 -49 103 -97 121 -105 24 -12 72 -15 215 -15 l184 0 26 27 c14 16 39 57 55 93 50 110 5 101 483 100 477 -1 425 10 485 -107 53 -104 54 -105 191 -110 64 -2 127 -2 140 1 54 14 54 12 54 355 0 201 -4 321 -10 327 -7 7 -5 20 5 42 14 27 16 107 12 685 -2 360 -7 659 -11 666 -5 7 -5 29 -1 49 4 20 7 95 6 167 -1 102 -5 135 -18 155 -29 43 -243 250 -269 261 -16 5 -255 9 -612 8 l-586 0 -43 -26 -44 -25 -24 26 c-22 24 -31 26 -97 25 -40 0 -82 -4 -93 -9z m1760 -649 c0 -21 -125 -85 -138 -72 -14 14 -2 26 60 62 51 29 78 32 78 10z m-3 -76 c4 -20 -3 -28 -46 -51 -28 -15 -54 -32 -57 -37 -12 -17 -39 1 -33 20 13 39 27 61 38 57 6 -2 24 7 41 20 34 27 51 25 57 -9z m2 -73 c3 -4 -1 -18 -7 -31 -15 -29 -118 -85 -128 -69 -14 22 -1 43 36 63 22 11 45 26 53 33 15 14 38 16 46 4z m-1 -96 c8 -21 -17 -50 -62 -71 -23 -10 -41 -22 -41 -27 0 -11 -27 -10 -35 2 -13 21 8 51 51 71 24 12 47 25 50 30 8 14 31 11 37 -5z m7 -98 c-1 -22 -24 -42 -79 -70 -58 -28 -71 -28 -71 1 0 11 17 27 46 41 25 13 47 27 50 32 8 13 54 9 54 -4z m-18 -514 c-2 -329 0 -439 9 -450 18 -22 -5 -43 -29 -26 -9 6 -36 21 -59 32 l-43 20 0 399 0 399 53 30 c28 17 57 31 62 31 7 1 9 -149 7 -435z"/>
      <path d="M233 2546 l-141 -143 -3 -51 c-2 -28 -1 -53 2 -54 2 -2 92 86 200 195 l196 197 -56 -1 -56 0 -142 -143z m177 104 c0 -6 -17 -26 -37 -46 -21 -20 -89 -86 -150 -146 -110 -107 -113 -109 -113 -79 0 21 5 31 15 31 9 0 24 13 33 30 9 16 21 30 26 30 11 0 46 40 46 52 0 4 4 8 10 8 13 0 90 77 90 90 0 5 6 10 14 10 8 0 16 7 20 15 6 17 46 21 46 5z"/>
      <path d="M373 2404 l-283 -283 0 -403 -1 -403 51 -35 51 -35 -1 -420 -1 -420 117 -117 117 -118 136 0 c156 0 181 5 181 31 0 11 5 19 10 19 6 0 10 7 10 15 0 9 9 25 20 37 11 12 20 28 20 35 0 11 89 13 471 13 496 0 499 0 499 -44 0 -9 5 -16 10 -16 6 0 10 -9 10 -20 0 -11 5 -20 10 -20 6 0 10 -7 10 -16 0 -8 5 -12 10 -9 7 4 4 18 -9 38 -11 18 -27 46 -36 64 -9 17 -26 34 -38 37 -12 3 -227 3 -477 0 l-455 -4 -22 -28 c-13 -15 -30 -42 -38 -59 l-16 -33 -151 0 c-83 0 -148 3 -145 6 3 4 -12 20 -33 35 -22 16 -40 36 -40 44 0 8 -7 15 -15 15 -9 0 -18 7 -21 15 -4 8 -13 15 -20 15 -8 0 -17 13 -20 30 -4 16 -10 28 -14 25 -4 -2 -14 3 -23 13 -14 15 -17 70 -19 436 l-3 417 -35 30 c-19 16 -45 34 -56 39 -14 5 -23 21 -27 42 -4 27 -3 660 2 736 0 12 7 22 15 22 8 0 23 14 33 30 9 17 21 30 25 30 4 0 116 108 248 240 l242 240 589 -2 589 -3 110 -111 110 -111 0 -117 c0 -111 -10 -163 -30 -151 -5 3 -11 1 -15 -5 -3 -5 3 -10 14 -10 12 0 21 5 21 10 0 6 6 10 14 10 11 0 13 9 9 36 -4 25 -2 39 8 45 10 6 10 9 2 9 -9 0 -13 22 -13 75 0 43 4 75 10 75 23 0 4 24 -114 144 l-124 126 -598 -1 -599 -1 -282 -284z"/>
      <path d="M1965 2142 c-26 -14 -27 -17 -10 -20 10 -2 21 1 23 7 2 6 13 11 23 11 11 0 17 5 14 10 -8 13 -13 12 -50 -8z"/>
      <path d="M1905 2088 c-3 -7 -5 -44 -4 -83 0 -38 -1 -86 -1 -105 -5 -153 3 -1055 10 -1090 4 -25 8 255 9 623 0 367 -1 667 -4 667 -3 0 -8 -6 -10 -12z"/>
      <path d="M1935 761 c6 -11 63 -41 77 -41 5 0 16 -6 23 -12 34 -30 43 -36 48 -31 9 8 -4 33 -17 33 -18 0 -66 24 -66 33 0 4 -9 7 -20 7 -11 0 -20 5 -20 10 0 6 -7 10 -16 10 -8 0 -13 -4 -9 -9z"/>
      <path d="M2074 560 c0 -52 1 -74 3 -47 2 26 2 68 0 95 -2 26 -3 4 -3 -48z"/>
      <path d="M2068 255 c-2 -85 0 -155 5 -155 4 0 7 70 7 155 0 85 -2 155 -5 155 -2 0 -5 -70 -7 -155z"/>
      <path d="M1830 176 c0 -9 5 -16 10 -16 6 0 10 -7 10 -16 0 -15 22 -44 34 -44 10 0 -7 34 -31 63 -16 20 -23 24 -23 13z"/>
    </g>
  );

  return (
    <div
      className="relative w-80 h-[28rem] mt-12 rounded-xl overflow-hidden group z-30"
      style={{ perspective: "1000px" }}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      {/* Flip Container */}
      <div
        className="relative w-full h-full transition-transform duration-700 ease-in-out"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* ========== FRONT SIDE ========== */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Image */}
          <div className="absolute inset-0 flex items-center justify-center z-0">
            <div className="relative w-55 h-65 sm:h-60 md:h-75 lg:h-75">
              <Image
                style={{
                  clipPath:
                    "polygon(0% 20px, 20px 0, calc(100% - 20px) 0, 100% 20px, 100% calc(100% - 0px), 20px 100%, 0 calc(100% - 20px))",
                }}
                src={img}
                alt={name}
                fill
                className="object-cover object-center rounded-lg group-hover:scale-110 transition-transform duration-700"
              />
            </div>

            {/* Name & Title */}
            <div
              ref={textRef}
              className={`absolute bottom-[-2rem] left-11/20 -translate-x-1/2 text-center z-30 backdrop-blur-sm bg-black/40 px-5 py-2 rounded-lg border ${themeColors.border}`}
            >
              <h2 className={`text-lg md:text-2xl font-semibold tracking-wide ${themeColors.text} ${themeColors.shadow}`}>
                {name}
              </h2>
              <p className={`text-sm md:text-base ${themeColors.textSecondary}`}>
                {title}
              </p>
            </div>
          </div>

          {/* SVG Frame */}
          <svg
            ref={svgRef}
            version="1.0"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 221 277"
            preserveAspectRatio="xMidYMid meet"
            className="absolute top-0 left-0 w-full h-full z-20 pointer-events-none"
          >
            <SVGPaths />
          </svg>
        </div>

        {/* ========== BACK SIDE ========== */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {/* Background Image (Darkened) */}
          <div className="absolute inset-0 flex items-center justify-center z-0">
            <div className="relative w-55 h-70 sm:h-70 md:h-75 lg:h-75">
              <Image
                style={{
                  clipPath:
                    "polygon(0% 20px, 20px 0, calc(100% - 20px) 0, 100% 20px, 100% calc(100% - 0px), 20px 100%, 0 calc(100% - 20px))",
                }}
                src={img}
                alt={name}
                fill
                className="object-cover object-center rounded-lg opacity-20"
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="absolute inset-0 flex items-center justify-center z-30 px-4">
            <div className={`backdrop-blur-md bg-black/70 px-6 py-8 rounded-lg border ${themeColors.border} w-full max-w-[280px]`} 
              style={{
                  clipPath:
                    "polygon(0% 20px, 20px 0, calc(100% - 20px) 0, 100% 20px, 100% calc(100% - 0px), 20px 100%, 0 calc(100% - 20px))",
                }}
            >
              <h3 className={`text-xl font-bold mb-6 text-center ${themeColors.text} ${themeColors.shadow}`}>
                Contact Info
              </h3>

              <div className="space-y-3">
                {/* Phone */}
                {phone && (
                  <a
                    href={`tel:${phone}`}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all hover:scale-105 ${themeColors.bgHover}`}
                  >
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <span className="text-sm truncate">{phone}</span>
                  </a>
                )}

                {/* Email */}
                {email && (
                  <a
                    href={`mailto:${email}`}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all hover:scale-105 ${themeColors.bgHover}`}
                  >
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-sm truncate">{email}</span>
                  </a>
                )}

                {/* LinkedIn */}
                {linkdin && (
                  <a
                    href={linkdin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all hover:scale-105 ${themeColors.bgHover}`}
                  >
                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    <span className="text-sm">LinkedIn</span>
                  </a>
                )}

                {/* GitHub (Optional) */}
                {github && (
                  <a
                    href={github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all hover:scale-105 ${themeColors.bgHover}`}
                  >
                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    <span className="text-sm">GitHub</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* SVG Frame for Back Side */}
          <svg
            ref={svgBackRef}
            version="1.0"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 221 277"
            preserveAspectRatio="xMidYMid meet"
            className="absolute top-0 left-0 w-full h-full z-20 pointer-events-none"
          >
            <SVGPaths />
          </svg>
        </div>
      </div>
    </div>
  );
}