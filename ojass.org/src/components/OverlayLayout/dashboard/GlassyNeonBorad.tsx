"use client";

import React, { useMemo } from "react";
import { CreditCard } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface GlassyNeonBoardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export default function GlassyNeonBoard({
  children,
  title,
  className = "",
}: GlassyNeonBoardProps) {
  const { theme } = useTheme();
  const gridId = useMemo(() => `grid-${Math.random()}`, []);

  // 🌗 Theme-based dynamic colors
  const glow = theme === "utopia" ? "#00ffff" : "#cc7722";
  const textAccent = theme === "utopia" ? "text-cyan-400" : "text-amber-400";
  const textSoft = theme === "utopia" ? "text-cyan-300" : "text-amber-300";
  const gradientFrom =
    theme === "utopia" ? "from-cyan-500/15" : "from-amber-500/15";
  const gradientVia =
    theme === "utopia" ? "via-blue-500/8" : "via-orange-500/8";
  const borderColor =
    theme === "utopia" ? "border-cyan-400/40" : "border-amber-500/40";

  const buttonGradient =
    theme === "utopia"
      ? "linear-gradient(135deg, rgba(0,255,255,0.25), rgba(0,150,255,0.15))"
      : "linear-gradient(135deg, rgba(204,119,34,0.25), rgba(255,180,0,0.15))";

  const buttonHoverGradient =
    theme === "utopia"
      ? "linear-gradient(135deg, rgba(0,255,255,0.35), rgba(0,150,255,0.25))"
      : "linear-gradient(135deg, rgba(204,119,34,0.35), rgba(255,180,0,0.25))";

  const buttonBoxShadow =
    theme === "utopia"
      ? "0 0 30px rgba(0,255,255,0.3), inset 0 0 20px rgba(0,255,255,0.1)"
      : "0 0 30px rgba(204,119,34,0.3), inset 0 0 20px rgba(204,119,34,0.1)";

  const buttonHoverShadow =
    theme === "utopia"
      ? "0 0 40px rgba(0,255,255,0.6), inset 0 0 30px rgba(0,255,255,0.2)"
      : "0 0 40px rgba(204,119,34,0.6), inset 0 0 30px rgba(204,119,34,0.2)";

  const borderShadow =
    theme === "utopia"
      ? "0 0 60px rgba(0,255,255,0.3), inset 0 0 60px rgba(0,255,255,0.08)"
      : "0 0 60px rgba(204,119,34,0.3), inset 0 0 60px rgba(204,119,34,0.08)";

  return (
    <div
      className={`relative rounded-2xl overflow-hidden ${className}`}
      style={{
        clipPath:
          "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)",
      }}
    >
      {/* Background & Neon Border */}
      <div
        className={`absolute inset-0 backdrop-blur-xl bg-gradient-to-br ${gradientFrom} ${gradientVia} to-black/40 border-2 ${borderColor}`}
        style={{
          boxShadow: `${borderShadow}, 0 8px 32px rgba(31, 38, 135, 0.37)`,
        }}
      >
        {/* Grid Overlay */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ opacity: 0.08 }}
        >
          <defs>
            <pattern
              id={gridId}
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke={theme === "utopia" ? "rgba(0,255,255,0.2)" : "rgba(204,119,34,0.2)"}
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${gridId})`} />
        </svg>
      </div>

      {/* Content Layer */}
      <div className="relative z-10 p-4">
        {title && (
          <div className={`${textAccent} text-sm font-mono mb-6 tracking-widest`}>
            {title}
          </div>
        )}

        {children}

        {/* Payment Button (only under PROFILE) */}
        {title === "PROFILE" && (
          <button
            className="w-full py-4 px-6 rounded relative overflow-hidden group transition-all duration-300 mt-6"
            style={{
              clipPath:
                "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",
              background: buttonGradient,
              border: `2px solid ${theme === "utopia"
                ? "rgba(0,255,255,0.5)"
                : "rgba(204,119,34,0.5)"
              }`,
              boxShadow: buttonBoxShadow,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = buttonHoverShadow;
              e.currentTarget.style.background = buttonHoverGradient;
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = buttonBoxShadow;
              e.currentTarget.style.background = buttonGradient;
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div
              className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
              }}
            />
            <div className="relative flex items-center justify-center gap-3">
              <CreditCard size={20} className={`${textSoft}`} />
              <span className="text-white font-bold text-xl tracking-wide uppercase">
                Pay Registration Fee
              </span>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
