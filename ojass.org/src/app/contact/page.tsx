"use client";
import React, { useEffect, useRef } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { gsap } from "gsap";
import { useTheme } from "@/contexts/ThemeContext";

export default function StarfleetContact() {
  const { theme } = useTheme();
  const bgRef = useRef<HTMLDivElement>(null);

  // 🔮 Background glow animation
  useEffect(() => {
    if (!bgRef.current) return;
    const colorUtopia = "#00ffff";
    const colorDystopia = "#cc7722";
    const color = theme === "utopia" ? colorUtopia : colorDystopia;

    gsap.fromTo(
      bgRef.current,
      { opacity: 0.7 },
      {
        opacity: 1,
        boxShadow: `0 0 100px 20px ${color}`,
        duration: 2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      }
    );
  }, [theme]);

  // 🎨 Dynamic colors
  const glow = theme === "utopia" ? "#00ffff" : "#cc7722";
  const textGlow = theme === "utopia" ? "cyan" : "orange";
  const gradientFrom =
    theme === "utopia"
      ? "from-slate-950 via-blue-950 to-slate-900"
      : "from-black via-orange-950 to-stone-900";
  const borderColor =
    theme === "utopia" ? "border-cyan-400" : "border-amber-500";
  const textColor =
    theme === "utopia" ? "text-cyan-300" : "text-amber-400";

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${gradientFrom} flex items-center justify-center p-8 relative overflow-hidden`}
    >
      {/* ✨ Floating background stars */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-pulse"
            style={{
              backgroundColor: glow,
              width: Math.random() * 3 + 1 + "px",
              height: Math.random() * 3 + 1 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              opacity: 0.4 + Math.random() * 0.6,
              animationDelay: Math.random() * 3 + "s",
              animationDuration: Math.random() * 3 + 2 + "s",
            }}
          />
        ))}
      </div>

      {/* 💫 Radial light pulse */}
      <div className="absolute inset-0 opacity-30">
        <div
          ref={bgRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
          style={{
            background: `radial-gradient(circle, ${glow}33 0%, transparent 70%)`,
          }}
        />
      </div>

      {/* 🪩 Main container */}
      <div className="relative w-full max-w-5xl">
        {/* Outer glowing border */}
        <div
          className="absolute inset-0 rounded-3xl opacity-60 blur-xl"
          style={{
            background: `linear-gradient(135deg, ${glow}, ${glow}90, ${glow})`,
            clipPath:
              "polygon(3% 0%, 97% 0%, 100% 3%, 100% 97%, 97% 100%, 3% 100%, 0% 97%, 0% 3%)",
          }}
        />

        {/* 🌌 Card core */}
        <div
          className={`relative bg-slate-900/40 backdrop-blur-md border-2 ${borderColor} shadow-2xl overflow-hidden`}
          style={{
            clipPath:
              "polygon(3% 0%, 97% 0%, 100% 3%, 100% 97%, 97% 100%, 3% 100%, 0% 97%, 0% 3%)",
            boxShadow: `0 0 40px ${glow}80, inset 0 0 40px ${glow}20`,
          }}
        >
          {/* GRID */}
          <div className="relative grid md:grid-cols-2 gap-6 p-8">
            {/* LEFT PANEL */}
            <div
              className={`flex flex-col bg-slate-800/40 border ${borderColor}/50 p-6 rounded-xl backdrop-blur-sm h-[500px]`}
              style={{
                boxShadow: `0 0 20px ${glow}40, inset 0 0 20px ${glow}10`,
              }}
            >
              <h2
                className={`${textColor} text-xl font-light tracking-[0.3em] text-center mb-4`}
              >
                CONTACT DETAILS
              </h2>

              {/* evenly distributed cards inside fixed height */}
              <div className="flex flex-col justify-between flex-1 gap-y-3 pb-2">
                {[
                  {
                    icon: Mail,
                    title: "Email",
                    info: ["ojass@nitjsr.ac.in", "corporate.ojass@nitjsr.ac.in"],
                    desc: "Our friendly team is here to help.",
                  },
                  {
                    icon: MapPin,
                    title: "Office",
                    info: ["NIT Jamshedpur, Q4GV+RJ5, Adityapur, Jharkhand 831014"],
                    desc: "Drop mail before coming.",
                  },
                  {
                    icon: Phone,
                    title: "Phone",
                    info: ["+91 88638 32703"],
                    desc: "Mon–Fri from 8 am to 5 pm.",
                  },
                ].map(({ icon: Icon, title, info, desc }, i) => (
                  <div
                    key={i}
                    className={`relative bg-slate-800/60 border ${borderColor}/50 p-4 transition-all duration-300 hover:shadow-[0_0_20px_${glow}] flex-1`}
                    style={{
                      borderRadius: "12px",
                      boxShadow: `inset 0 0 10px ${glow}30`,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Icon
                        className={`w-5 h-5 ${textColor}`}
                        style={{
                          filter: `drop-shadow(0 0 5px ${glow})`,
                        }}
                      />
                      <h3
                        className={`${textColor} font-semibold text-lg`}
                        style={{
                          textShadow: `0 0 10px ${glow}99`,
                        }}
                      >
                        {title}
                      </h3>
                    </div>
                    <p className="text-cyan-100/70 text-sm mb-2">{desc}</p>
                    {info.map((line, j) => (
                      <p key={j} className={`${textColor} text-sm`}>
                        {line}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            </div>


            {/* RIGHT PANEL - Google Map */}
            <div
              className={`relative bg-slate-800/50 backdrop-blur-sm border ${borderColor}/50 overflow-hidden h-[500px] rounded-xl`}
              style={{
                boxShadow: `0 0 20px ${glow}40, inset 0 0 20px ${glow}10`,
              }}
            >
              <div className="border-b border-cyan-400/30 pb-3 pt-6 px-6 mb-2 bg-slate-800/70">
                <h2
                  className={`${textColor} text-xl font-light tracking-[0.3em] text-center`}
                  style={{ textShadow: `0 0 10px ${glow}88` }}
                >
                  FIND US ON MAP
                </h2>
              </div>

              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d4410.511572528896!2d86.14727399711373!3d22.773433066386442!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2sin!4v1756824796327!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
