"use client";

import React from "react";
import { Calendar, Zap } from "lucide-react";

export default function RegisteredEvent({
  registeredEvents,
}: {
  registeredEvents: any[];
}) {
  return (
    <div className="space-y-3">
      {registeredEvents.map((event) => (
        <div
          key={event.id}
          className="p-4 border border-cyan-400/20 bg-gradient-to-r from-cyan-500/10 to-blue-500/5 hover:from-cyan-500/20 hover:to-blue-500/10 transition-all backdrop-blur-sm"
          style={{
            clipPath:
              "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
            boxShadow: "0 0 15px rgba(0, 255, 255, 0.1)",
          }}
        >
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <div className="text-sm font-semibold text-white">{event.name}</div>
              <div className="text-xs text-cyan-400 mt-1">
                Team: {event.team}
              </div>
            </div>
            <span
              className={`text-xs font-mono px-2 py-1 rounded ${
                event.status === "Confirmed"
                  ? "bg-green-500/20 text-green-300"
                  : "bg-yellow-500/20 text-yellow-300"
              }`}
            >
              {event.status}
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <Calendar size={12} />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <Zap size={12} />
              <span>{event.time}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
