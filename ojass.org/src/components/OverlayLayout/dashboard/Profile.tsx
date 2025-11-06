"use client";

import React from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { User, Code, Users, Zap, Mail, Phone, Shield } from "lucide-react";

export default function Profile({ profileData }: { profileData: any }) {
  const { theme } = useTheme();

  const isUtopia = theme === "utopia";
  const glow = isUtopia ? "#00ffff" : "#cc7722";
  const textColor = isUtopia ? "text-cyan-300" : "text-amber-400";
  const subTextColor = isUtopia ? "text-gray-400" : "text-amber-200/80";
  const borderColor = isUtopia ? "border-cyan-400" : "border-amber-500";
  const bgGradient = isUtopia
    ? "linear-gradient(135deg, rgba(0,255,255,0.15), rgba(0,100,200,0.08))"
    : "linear-gradient(135deg, rgba(255,180,0,0.15), rgba(180,90,0,0.08))";

  return (
    <div className="space-y-5 relative px-3 pb-8 overflow-y-auto">
      {/* Background Glow */}
      <div
        className="absolute inset-0 opacity-30 blur-3xl"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${glow}55, transparent 70%)`,
        }}
      />

      {/* Avatar */}
      <div className="relative flex items-center justify-center mb-6">
        <div
          className="absolute w-28 h-28 rounded-full animate-spin"
          style={{
            border: "2px solid transparent",
            borderTopColor: `${glow}99`,
            borderRightColor: `${glow}66`,
            animationDuration: "3s",
          }}
        />
        <div
          className={`relative w-24 h-24 flex items-center justify-center backdrop-blur-sm border-2 ${borderColor} transition-all duration-300 hover:scale-110`}
          style={{
            clipPath: "circle(50%)",
            background: isUtopia
              ? "linear-gradient(135deg, rgba(0,255,255,0.3), rgba(0,100,200,0.1))"
              : "linear-gradient(135deg, rgba(255,180,0,0.3), rgba(120,60,0,0.1))",
            boxShadow: `0 0 40px ${glow}80, inset 0 0 30px ${glow}30`,
          }}
        >
          <User size={36} className={textColor} />
          <div
            className="absolute -top-1 -right-1 w-6 h-6 flex items-center justify-center"
            style={{
              background: glow,
              clipPath: "polygon(0 0, 100% 0, 100% 100%)",
              boxShadow: `0 0 10px ${glow}`,
            }}
          >
            <Shield size={10} className="text-black absolute top-0 right-0" />
          </div>
        </div>
      </div>

      {/* Name + Ojass ID */}
      <div className="text-center relative">
        <h2
          className={`text-2xl font-bold mb-2 tracking-wide ${textColor}`}
          style={{
            textShadow: `0 0 20px ${glow}`,
          }}
        >
          {profileData.name}
        </h2>
        <div
          className="inline-block px-4 py-1 rounded-sm"
          style={{
            background: isUtopia
              ? "linear-gradient(90deg, rgba(0,255,255,0.25), rgba(0,150,255,0.1))"
              : "linear-gradient(90deg, rgba(255,200,0,0.25), rgba(180,90,0,0.1))",
            border: `1px solid ${glow}55`,
          }}
        >
          <p className={`${textColor} font-mono text-xs tracking-widest`}>
            {profileData.ojassId}
          </p>
        </div>
      </div>

      {/* Info Grid */}
      <div
        className={`grid sm:grid-cols-1 lg:grid-cols-2 gap-3 p-5 rounded relative overflow-hidden border ${borderColor}`}
        style={{
          clipPath:
            "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
          background: bgGradient,
          boxShadow: `0 0 30px ${glow}40, inset 0 0 20px ${glow}15`,
        }}
      >
        {/* corner glow */}
        <div
          className="absolute top-0 right-0 w-8 h-8"
          style={{
            background: `linear-gradient(135deg, ${glow}66, transparent)`,
            clipPath: "polygon(100% 0, 100% 100%, 0 0)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-8 h-8"
          style={{
            background: `linear-gradient(135deg, transparent, ${glow}66)`,
            clipPath: "polygon(0 100%, 100% 100%, 0 0)",
          }}
        />

        {[
          { icon: Code, label: "Branch", value: profileData.branch },
          { icon: Users, label: "Year", value: profileData.year },
          { icon: Zap, label: "College", value: profileData.college },
          { icon: Mail, label: "Email", value: profileData.email },
          { icon: Phone, label: "Phone", value: profileData.phone },
        ].map(({ icon: Icon, label, value }, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-2 rounded transition-all duration-200 hover:bg-opacity-10"
            style={{
              background: `${glow}10`,
              borderLeft: `2px solid transparent`,
              boxShadow: `inset 0 0 10px ${glow}15`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderLeftColor = glow;
              e.currentTarget.style.boxShadow = `0 0 20px ${glow}66, inset 0 0 15px ${glow}22`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderLeftColor = "transparent";
              e.currentTarget.style.boxShadow = `inset 0 0 10px ${glow}15`;
            }}
          >
            <div
              className="p-2 rounded"
              style={{
                background: `${glow}20`,
                boxShadow: `0 0 10px ${glow}40`,
              }}
            >
              <Icon size={16} className={textColor} />
            </div>
            <div className="flex-1">
              <span
                className={`${subTextColor} text-xs uppercase tracking-wider`}
              >
                {label}
              </span>
              <p
                className={`${textColor} text-sm font-medium break-words leading-tight`}
              >
                {value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
