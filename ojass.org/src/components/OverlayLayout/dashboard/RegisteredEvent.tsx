"use client";

import React from "react";
import { Calendar, Zap } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export default function RegisteredEvent({
  registeredEvents,
}: {
  registeredEvents: any[];
}) {
  const { theme } = useTheme();

  // 🎨 Theme-based glow and colors
  const glow = theme === "utopia" ? "#00ffff" : "#cc7722";
  const borderColor =
    theme === "utopia" ? "border-cyan-400/30" : "border-amber-500/30";
  const gradientFrom =
    theme === "utopia"
      ? "from-cyan-500/10 to-blue-500/5"
      : "from-amber-700/15 to-orange-900/10";
  const hoverGradient =
    theme === "utopia"
      ? "hover:from-cyan-500/20 hover:to-blue-500/10"
      : "hover:from-amber-700/25 hover:to-orange-900/15";
  const textColor =
    theme === "utopia" ? "text-cyan-300" : "text-amber-400";
  const boxShadow = `0 0 15px ${glow}22, inset 0 0 12px ${glow}18`;

  return (
    <div className="space-y-3">
      {registeredEvents.map((event) => (
        <div
          key={event.id}
          className={`p-4 border ${borderColor} bg-gradient-to-r ${gradientFrom} ${hoverGradient} transition-all backdrop-blur-md rounded-md`}
          style={{
            clipPath:
              "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
            boxShadow,
          }}
        >
          {/* 🏷️ Event Header */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <div
                className={`text-sm font-semibold text-white drop-shadow-[0_0_6px_${glow}]`}
              >
                {event.name}
              </div>
              <div className={`text-xs ${textColor} mt-1`}>
                Team: {event.team}
              </div>
            </div>
            <span
              className={`text-xs font-mono px-2 py-1 rounded border border-white/10 ${
                event.status === "Confirmed"
                  ? "bg-green-500/20 text-green-300"
                  : "bg-yellow-500/20 text-yellow-300"
              }`}
              style={{
                boxShadow:
                  event.status === "Confirmed"
                    ? `0 0 10px rgba(0,255,0,0.3)`
                    : `0 0 10px rgba(255,255,0,0.3)`,
              }}
            >
              {event.status}
            </span>
          </div>

          {/* 📅 Event Details */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <Calendar
                size={12}
                style={{ filter: `drop-shadow(0 0 4px ${glow})` }}
              />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <Zap
                size={12}
                style={{ filter: `drop-shadow(0 0 4px ${glow})` }}
              />
              <span>{event.time}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
