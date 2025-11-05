"use client";

import React from "react";
import { User, Code, Users, Zap, Mail, Phone, CreditCard, Shield } from "lucide-react";

export default function Profile({ profileData }: { profileData: any }) {
  return (
    <div className="space-y-4 relative">
      {/* Animated background glow */}
      <div
        className="absolute inset-0 opacity-30 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, rgba(0, 255, 255, 0.3), transparent 70%)",
        }}
      />

      {/* Profile Avatar Section */}
      <div className="relative flex items-center justify-center mb-8">
        {/* Outer rotating ring */}
        <div
          className="absolute w-28 h-28 rounded-full animate-spin"
          style={{
            border: "2px solid transparent",
            borderTopColor: "rgba(0, 255, 255, 0.6)",
            borderRightColor: "rgba(0, 150, 255, 0.3)",
            animationDuration: "3s",
          }}
        />
        
        {/* Inner avatar container */}
        <div
          className="relative w-24 h-24 flex items-center justify-center bg-gradient-to-br from-cyan-500/30 to-blue-500/20 backdrop-blur-sm border-2 border-cyan-400 transition-all duration-300 hover:scale-110"
          style={{
            clipPath: "circle(50%)",
            boxShadow:
              "0 0 40px rgba(0, 255, 255, 0.5), inset 0 0 30px rgba(0, 255, 255, 0.15)",
          }}
        >
          <User size={36} className="text-cyan-300" />
          
          {/* Corner accent */}
          <div
            className="absolute -top-1 -right-1 w-6 h-6 bg-cyan-400 flex items-center justify-center"
            style={{
              clipPath: "polygon(0 0, 100% 0, 100% 100%)",
              boxShadow: "0 0 10px rgba(0, 255, 255, 0.8)",
            }}
          >
            <Shield size={10} className="text-gray-900 absolute top-0 right-0" />
          </div>
        </div>
      </div>

      {/* Name and ID Section */}
      <div className="text-center relative">
        <h2 className="text-2xl font-bold text-white mb-2 tracking-wide"
          style={{
            textShadow: "0 0 20px rgba(0, 255, 255, 0.5)",
          }}
        >
          {profileData.name}
        </h2>
        <div
          className="inline-block px-4 py-1 rounded-sm"
          style={{
            background: "linear-gradient(90deg, rgba(0, 255, 255, 0.2), rgba(0, 150, 255, 0.1))",
            border: "1px solid rgba(0, 255, 255, 0.3)",
          }}
        >
          <p className="text-cyan-400 font-mono text-xs tracking-wider">
            {profileData.ojassId}
          </p>
        </div>
      </div>

      {/* Info Grid */}
      <div
        className="space-y-3 p-5 rounded relative overflow-hidden"
        style={{
          clipPath:
            "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
          background:
            "linear-gradient(135deg, rgba(0, 255, 255, 0.15), rgba(0, 100, 200, 0.08))",
          border: "1px solid rgba(0, 255, 255, 0.3)",
          boxShadow: "0 0 30px rgba(0, 255, 255, 0.2), inset 0 0 30px rgba(0, 255, 255, 0.05)",
        }}
      >
        {/* Corner decorations */}
        <div
          className="absolute top-0 right-0 w-8 h-8"
          style={{
            background: "linear-gradient(135deg, rgba(0, 255, 255, 0.4), transparent)",
            clipPath: "polygon(100% 0, 100% 100%, 0 0)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-8 h-8"
          style={{
            background: "linear-gradient(135deg, transparent, rgba(0, 255, 255, 0.4))",
            clipPath: "polygon(0 100%, 100% 100%, 0 0)",
          }}
        />

        {[
          { icon: Code, label: "Branch", value: profileData.branch },
          { icon: Users, label: "Year", value: profileData.year },
          { icon: Zap, label: "College", value: profileData.college },
          { icon: Mail, label: "Email", value: profileData.email },
          { icon: Phone, label: "Phone", value: profileData.phone },
        ].map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-2 rounded transition-all duration-200 hover:bg-cyan-500/10"
            style={{
              borderLeft: "2px solid transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderLeftColor = "rgba(0, 255, 255, 0.6)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderLeftColor = "transparent";
            }}
          >
            <div
              className="p-2 rounded"
              style={{
                background: "rgba(0, 255, 255, 0.1)",
                boxShadow: "0 0 10px rgba(0, 255, 255, 0.2)",
              }}
            >
              <item.icon size={16} className="text-cyan-400" />
            </div>
            <div className="flex-1">
              <span className="text-gray-400 text-xs uppercase tracking-wider">
                {item.label}
              </span>
              <p className="text-cyan-300 text-sm font-medium">
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>
      
    </div>
    
  );
}