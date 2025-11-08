"use client";
import React from "react";
import { Bell, CheckCircle, AlertTriangle, Star } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export default function Notification() {
  const { theme } = useTheme();

  // Theme-driven styles (same pattern as Certificate.tsx)
  const glow = theme === "utopia" ? "#00ffff" : "#cc7722";
  const borderColor =
    theme === "utopia" ? "border-cyan-400/20" : "border-amber-500/20";
  const gradientFrom =
    theme === "utopia" ? "from-cyan-500/10" : "from-amber-500/10";
  const gradientTo =
    theme === "utopia" ? "to-blue-500/5" : "to-orange-500/5";
  const hoverFrom =
    theme === "utopia" ? "hover:from-cyan-500/20" : "hover:from-amber-500/20";
  const hoverTo =
    theme === "utopia" ? "hover:to-blue-500/10" : "hover:to-orange-500/10";
  const textAccent =
    theme === "utopia" ? "text-cyan-400" : "text-amber-400";
  const textLight =
    theme === "utopia" ? "text-cyan-300" : "text-amber-300";
  const scrollbarThumb =
    theme === "utopia" ? "scrollbar-thumb-cyan-500/40" : "scrollbar-thumb-amber-500/40";

  const notifications = [
    {
      icon: Star,
      title: "Welcome to Ojass!",
      desc: "Your registration is confirmed.",
    },
    {
      icon: CheckCircle,
      title: "Payment Successful",
      desc: "Your receipt is available in your dashboard.",
    },
    {
      icon: Bell,
      title: "Event Registration",
      desc: "New events are now open to join.",
    },
    {
      icon: AlertTriangle,
      title: "ID Card Pending",
      desc: "Upload your ID card to complete your profile setup.",
    },
  ];

  return (
    <div className={`space-y-3 overflow-y-auto ${scrollbarThumb} scrollbar-thin scrollbar-track-transparent`}>
      {notifications.map((n, index) => (
        <div
          key={index}
          className={`p-4 border ${borderColor} bg-gradient-to-r ${gradientFrom} ${gradientTo} ${hoverFrom} ${hoverTo} transition-all backdrop-blur-sm`}
          style={{
            clipPath:
              "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
            boxShadow: `0 0 15px ${glow}20`,
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="p-[6px] rounded flex-shrink-0"
              style={{
                background: `${glow}1A`,
                boxShadow: `0 0 10px ${glow}55`,
              }}
            >
              <n.icon size={16} className={`${textAccent}`} />
            </div>

            <div className="flex-1 min-w-0">
              <div className={`text-sm font-semibold text-white`}>
                {n.title}
              </div>
              <div className={`text-xs ${textLight}`}>
                {n.desc}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
