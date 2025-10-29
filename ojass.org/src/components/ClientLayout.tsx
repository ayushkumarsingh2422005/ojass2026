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
      }, 4000); // Brief pause before fade out
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

      {/* Destructive/Constructive Toggle Button */}
      <button 
        className={`fixed top-4 right-4 p-3 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-110 ${
          isDestructive 
            ? 'bg-green-600 hover:bg-green-700' 
            : 'bg-red-600 hover:bg-red-700'
        }`}
        onClick={handleDestructiveClick}
        title={isDestructive ? "Constructive Mode" : "Destructive Mode"}
      >
        {isDestructive ? (
          // Constructive Icon (Repair/Tool)
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
          </svg>
        ) : (
          // Destructive Icon (Warning)
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
          </svg>
        )}
      </button>
        <div className="fixed w-screen h-screen bg-black top-0 left-0 opacity-0" ref={glitchRef} style={{ transition: 'opacity 1s ease-in-out', pointerEvents: 'none' }}>
          <video src="/glitch-effect.mov" autoPlay muted loop playsInline className="w-full h-full object-cover" />
        </div>
    </>
  );
}