"use client";

import React from "react";
import { useTheme } from "@/contexts/ThemeContext";

export default function Receipt() {
  const { theme } = useTheme();

  // 🎨 Dynamic theme-based styles
  const glow = theme === "utopia" ? "#00ffff" : "#cc7722";
  const textColor =
    theme === "utopia" ? "text-cyan-300" : "text-amber-400";
  const borderColor =
    theme === "utopia" ? "border-cyan-400/30" : "border-amber-500/30";
  const gradientFrom =
    theme === "utopia"
      ? "from-cyan-500/10 to-blue-500/5"
      : "from-amber-700/15 to-orange-900/10";
  const boxShadow = `0 0 20px ${glow}33, inset 0 0 15px ${glow}22`;

  return (
    <div className="space-y-3">
      {/* 💳 Receipt Info */}
      <div
        className={`p-4 border ${borderColor} bg-gradient-to-r ${gradientFrom} backdrop-blur-md transition-all duration-300`}
        style={{
          clipPath:
            "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
          boxShadow,
        }}
      >
        <div className={`text-sm font-semibold ${textColor} mb-3`}>
          PAYMENT RECEIPT
        </div>
        <div className="space-y-2 text-xs text-gray-300">
          <div className="flex justify-between">
            <span className={textColor}>Receipt ID:</span>
            <span>RCP-2024-001234</span>
          </div>
          <div className="flex justify-between">
            <span className={textColor}>Amount:</span> <span>₹500.00</span>
          </div>
          <div className="flex justify-between">
            <span className={textColor}>Date:</span> <span>Nov 14, 2024</span>
          </div>
          <div className="flex justify-between">
            <span className={textColor}>Status:</span>{" "}
            <span className="text-green-400 font-medium">Paid</span>
          </div>
        </div>
      </div>

      {/* ⚙️ Transaction Info */}
      <div
        className={`p-4 border ${borderColor} bg-gradient-to-r ${gradientFrom} backdrop-blur-md transition-all duration-300`}
        style={{
          clipPath:
            "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
          boxShadow,
        }}
      >
        <div className={`text-sm font-semibold ${textColor} mb-2`}>
          TRANSACTION DETAILS
        </div>
        <div className="space-y-2 text-xs text-gray-300">
          <div>
            <span className={textColor}>Transaction ID:</span> TXN-2024-567890
          </div>
          <div>
            <span className={textColor}>Payment Method:</span> Online
          </div>
          <div>
            <span className={textColor}>Gateway:</span> Razorpay
          </div>
          <div>
            <span className={textColor}>Mode:</span> UPI
          </div>
        </div>
      </div>
    </div>
  );
}
