"use client";

import React from "react";
import { Award, Calendar } from "lucide-react";

export default function Certificate({ certificates }: { certificates: any[] }) {
  return (
    <div className="space-y-3">
      {certificates.map((cert) => (
        <div
          key={cert.id}
          className="p-4 border border-cyan-400/20 bg-gradient-to-r from-cyan-500/10 to-blue-500/5 hover:from-cyan-500/20 hover:to-blue-500/10 transition-all backdrop-blur-sm"
          style={{
            clipPath:
              "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
            boxShadow: "0 0 15px rgba(0, 255, 255, 0.1)",
          }}
        >
          <div className="flex items-start gap-3">
            <Award size={16} className="text-cyan-400 mt-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white">{cert.event}</div>
              <div className="text-xs text-cyan-400 mb-1">{cert.type}</div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Calendar size={12} />
                {cert.date}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
