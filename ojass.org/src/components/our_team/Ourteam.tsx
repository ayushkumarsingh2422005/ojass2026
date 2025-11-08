
"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import TeamCard from "@/components/OverlayLayout/TeamCard";
import { useTheme } from "@/contexts/ThemeContext";
interface TeamMember {
  id: string;
  name: string;
  title: string;
  img: string;
  phone:string;
  email:string;
  linkdin:string;
}

export default function TeamPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
 const { theme } = useTheme();

 
  const themeColors = { 
     text: theme === "utopia" ? "text-cyan-300" : "text-amber-400",
  }
  // ✅ Fetch team data
  useEffect(() => {
    fetch("/team.json")
      .then((res) => res.json())
      .then((data) => setTeamMembers(data))
      .catch((err) => console.error("Error loading team data:", err));
  }, []);

  // ✅ Mouse parallax background animation
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to("#team-bg", { x: -x * 40, y: -y * 20, duration: 0.3 });
      gsap.to("#team-fg", { x: -x * 10, y: -y * 5, duration: 0.3 });
    };

    const reset = () => {
      gsap.to(["#team-bg", "#team-fg"], { x: 0, y: 0, duration: 0.4 });
    };

    container.addEventListener("mousemove", handleMove);
    container.addEventListener("mouseleave", reset);
    return () => {
      container.removeEventListener("mousemove", handleMove);
      container.removeEventListener("mouseleave", reset);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen overflow-hidden flex flex-col items-center justify-center py-10 bg-black"
    >
      {/* 🪐 Background Layers */}
      
      {/* 🌟 Page Title */}
      <h1 className={`text-4xl md:text-5xl uppercase font-bold ${themeColors.text} mb-12 tracking-wide drop-shadow-lg`}>
        CREW-ojass2026
      </h1>

      {/* 👥 Team Grid */}
      <div
        className="
          grid 
          grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 
          gap-12 px-6 md:px-12 w-full max-w-7xl 
        "
      >
        {teamMembers.map((member) => (
          <div key={member.id} className=" relative z-20 flex justify-center ">
            <TeamCard
              name={member.name}
              title={member.title}
              img="/events/spider.png"
              phone={member.phone}
            email={member.email}
             linkdin={member.linkdin}

            />
          </div>
        ))}
      </div>

      {/* 💫 Hologram glow */}
    
    </div>
  );
}
