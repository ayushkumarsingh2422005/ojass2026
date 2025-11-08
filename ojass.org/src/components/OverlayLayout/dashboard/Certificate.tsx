"use client";
import React from "react";
import { Award, Calendar } from "lucide-react";
import { FaEye, FaDownload } from "react-icons/fa";
import { useTheme } from "@/contexts/ThemeContext";

export default function Certificate({ certificates }: { certificates: any[] }) {
  const { theme } = useTheme();

  // 🌗 Theme-based color mapping
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
  const iconHover =
    theme === "utopia"
      ? "hover:text-cyan-300"
      : "hover:text-amber-300";
  const scrollbarThumb =
    theme === "utopia" ? "scrollbar-thumb-cyan-500/40" : "scrollbar-thumb-amber-500/40";

  const handleView = (url: string) => {
    window.open(url, "_blank");
  };

  const handleDownload = (url: string, name: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = name || "certificate.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`space-y-3 overflow-y-auto ${scrollbarThumb} scrollbar-thin scrollbar-track-transparent`}>
      {certificates.map((cert) => (
        <div
          key={cert.id}
          className={`p-4 border ${borderColor} bg-gradient-to-r ${gradientFrom} ${gradientTo} ${hoverFrom} ${hoverTo} transition-all backdrop-blur-sm`}
          style={{
            clipPath:
              "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
            boxShadow: `0 0 15px ${glow}20`,
          }}
        >
          <div className="flex items-start gap-3">
            <Award
              size={18}
              className={`${textAccent} mt-1 flex-shrink-0 drop-shadow-[0_0_4px_${glow}]`}
            />
            <div className="flex-1 min-w-0">
              <div className={`text-sm font-semibold text-white`}>
                {cert.event}
              </div>
              <div className={`text-xs ${textAccent} mb-1`}>
                {cert.type}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Calendar size={12} />
                {cert.date}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleView(cert.url)}
                className={`p-2 ${textAccent} ${iconHover} transition`}
                title="View Certificate"
              >
                <FaEye size={14} />
              </button>
              <button
                onClick={() => handleDownload(cert.url, cert.event)}
                className={`p-2 ${textAccent} ${iconHover} transition`}
                title="Download Certificate"
              >
                <FaDownload size={14} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
