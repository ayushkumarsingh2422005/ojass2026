"use client";

import { useState } from "react";

interface FooterProps {
  isDestructive: boolean;
}

export default function Footer({ isDestructive }: FooterProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className="fixed bottom-0 left-1/2 -translate-x-1/2 flex items-end justify-center z-40"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div
        className={`relative aircraft-panel hud-grid transition-all duration-700 ease-out cursor-pointer ${
          isDestructive ? 'warning' : ''
        } ${
          isExpanded 
            ? 'w-[90vw] max-w-6xl px-12 py-6' 
            : 'w-[280px] px-8 py-4 animate-pulse-subtle'
        }`}
        style={{
          clipPath: isExpanded
            ? "polygon(5% 0%, 95% 0%, 100% 100%, 0% 100%)"
            : "polygon(15% 0%, 85% 0%, 95% 100%, 5% 100%)",
          borderRadius: "12px 12px 0 0",
        }}
      >
        {/* Small collapsed view */}
        <div className={`text-center transition-all duration-500 ${
          isExpanded ? 'opacity-0 max-h-0 overflow-hidden' : 'opacity-100 max-h-20'
        }`}>
          <div className={`text-xl font-bold font-mono tracking-[0.3em] aircraft-text ${
            isDestructive ? 'warning' : ''
          } relative`}>
            OJASS 2026
          </div>
        </div>

        {/* Expanded view */}
        <div className={`transition-all duration-700 ease-out ${
          isExpanded ? 'opacity-100 max-h-[500px]' : 'opacity-0 max-h-0 overflow-hidden'
        }`}>
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Left Section - About OJASS */}
            <div className="space-y-3">
              <h3 className={`text-2xl font-bold font-mono tracking-widest aircraft-text ${
                isDestructive ? 'warning' : ''
              }`}>
                OJASS 2026
              </h3>
              <p className={`text-xs font-mono tracking-wide aircraft-text ${
                isDestructive ? 'warning' : ''
              } opacity-90`}>
                TECHNO-MANAGEMENT FESTIVAL
              </p>
              <div className={`text-xs font-mono aircraft-text ${
                isDestructive ? 'warning' : ''
              } opacity-75`}>
                NIT JAMSHEDPUR | INSPIRING INNOVATION
              </div>
            </div>

            {/* Center Section - Quick Links */}
            <div className="space-y-3">
              <h3 className={`text-lg font-bold font-mono tracking-widest aircraft-text ${
                isDestructive ? 'warning' : ''
              }`}>
                NAVIGATION
              </h3>
              <div className="space-y-2">
                <div className={`text-xs font-mono tracking-wider aircraft-text cursor-pointer hover:scale-105 transition-transform ${
                  isDestructive ? 'warning' : ''
                } opacity-80 hover:opacity-100`}>
                  → EVENTS
                </div>
                <div className={`text-xs font-mono tracking-wider aircraft-text cursor-pointer hover:scale-105 transition-transform ${
                  isDestructive ? 'warning' : ''
                } opacity-80 hover:opacity-100`}>
                  → WORKSHOPS
                </div>
                <div className={`text-xs font-mono tracking-wider aircraft-text cursor-pointer hover:scale-105 transition-transform ${
                  isDestructive ? 'warning' : ''
                } opacity-80 hover:opacity-100`}>
                  → SPONSORS
                </div>
                <div className={`text-xs font-mono tracking-wider aircraft-text cursor-pointer hover:scale-105 transition-transform ${
                  isDestructive ? 'warning' : ''
                } opacity-80 hover:opacity-100`}>
                  → TEAM
                </div>
              </div>
            </div>

            {/* Right Section - Contact Info */}
            <div className="space-y-3">
              <h3 className={`text-lg font-bold font-mono tracking-widest aircraft-text ${
                isDestructive ? 'warning' : ''
              }`}>
                CONTACT
              </h3>
              <div className="space-y-2">
                <div className={`text-xs font-mono tracking-wide aircraft-text ${
                  isDestructive ? 'warning' : ''
                } opacity-80 flex items-center gap-2`}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                  OJASS@NITJSR.AC.IN
                </div>
                <div className={`text-xs font-mono tracking-wide aircraft-text ${
                  isDestructive ? 'warning' : ''
                } opacity-80 flex items-center gap-2`}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  NIT JAMSHEDPUR, JHARKHAND
                </div>
                <div className={`text-xs font-mono tracking-wide aircraft-text ${
                  isDestructive ? 'warning' : ''
                } opacity-80 flex items-center gap-2`}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                  +91-XXXX-XXXXXX
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className={`pt-4 border-t transition-all duration-700 ease-out mt-6 ${
            isDestructive 
              ? 'border-orange-500/30' 
              : 'border-cyan-500/30'
          }`}>
            <div className={`text-center text-[10px] font-mono tracking-widest aircraft-text ${
              isDestructive ? 'warning' : ''
            } opacity-70 uppercase`}>
              © 2026 OJASS | NIT JAMSHEDPUR | ALL RIGHTS RESERVED | WEB TEAM
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}