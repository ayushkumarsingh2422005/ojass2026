"use client";

import { useDestructive } from "@/contexts/DestructiveContext";
import { useRef, useState } from "react";
import Header from "./Header";
import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";
import ToggleButton from "./ToggleButton";
import Footer from "./Footer";


export default function ClientLayout() {
  const { isDestructive, setIsDestructive } = useDestructive();
  const [, setShowGlitch] = useState(false);
  const glitchRef = useRef<HTMLDivElement>(null);
  
  const handleDestructiveClick = () => {
    setShowGlitch(true);
    
    // Phase 1: Fade in the glitch effect (opacity 0 → 1)
    if (glitchRef.current) {
      glitchRef.current.style.opacity = '0';
      glitchRef.current.style.transition = 'opacity 1s ease-in-out';
      
      // Force a reflow to ensure the initial opacity is applied
      void glitchRef.current.offsetHeight;
      
      // Start fade in
      glitchRef.current.style.opacity = '1';
    }
    
    // Phase 2: After fade in completes, toggle destructive state
    setTimeout(() => {
      setIsDestructive(!isDestructive);
      
      // Phase 3: After a brief moment, fade out the glitch effect
      setTimeout(() => {
        if (glitchRef.current) {
          glitchRef.current.style.opacity = '0';
          
          // Hide the glitch element after fade out completes
          setTimeout(() => {
            setShowGlitch(false);
          }, 1000); // Match the transition duration
        }
      }, 1000); // Brief pause before fade out
    }, 1000); // Wait for fade in to complete
  };

  return (
    <>
      <Header isDestructive={isDestructive} />
      <RightPanel isDestructive={isDestructive} />
      <LeftPanel isDestructive={isDestructive} />
      <ToggleButton isDestructive={isDestructive} onToggle={handleDestructiveClick} />
      <Footer isDestructive={isDestructive} />
      
      <div className="fixed w-screen h-screen bg-black top-0 left-0 opacity-0 z-[100]" ref={glitchRef} style={{ transition: 'opacity 1s ease-in-out', pointerEvents: 'none' }}>
        <video src="/glitch-effect.mp4" autoPlay muted loop playsInline className="w-full h-full object-cover" />
      </div>
    </>
  );
}