"use client";

import React from "react";

export default function GlassyNeonBoard({
  children,
  title,
  className = "",
}: {
  children: React.ReactNode;
  title?: string;
  className?: string;
}) {
  const gridId = React.useMemo(() => `grid-${Math.random()}`, []);

  return (
    <div
      className={`relative rounded-2xl overflow-hidden ${className}`}
      style={{
        clipPath:
          "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)",
      }}
    >
      <div
        className="absolute inset-0 backdrop-blur-xl bg-gradient-to-br from-cyan-500/15 via-blue-500/8 to-black/40 border-2 border-cyan-400/40"
        style={{
          boxShadow:
            "0 0 60px rgba(0, 255, 255, 0.3), inset 0 0 60px rgba(0, 255, 255, 0.08), 0 8px 32px rgba(31, 38, 135, 0.37)",
        }}
      >
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
                stroke="rgba(0, 255, 255, 0.2)"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${gridId})`} />
        </svg>
      </div>

      {/* Corner borders */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400/50 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-400/50 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-400/50 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-400/50 pointer-events-none"></div>

      <div className="relative z-10 p-8">
        {title && (
          <div className="text-cyan-400 text-sm font-mono mb-6 tracking-widest">
            {title}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
