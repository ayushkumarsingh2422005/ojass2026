"use client";

import { useDestructive } from "@/contexts/DestructiveContext";
import { useRef, useState } from "react";

// import { useDestructive } from "../contexts/DestructiveContext";


export default function ClientLayout() {
  const { isDestructive, setIsDestructive } = useDestructive();
  const [showGlitch, setShowGlitch] = useState(false);
  const glitchRef = useRef<HTMLDivElement>(null);
  const handleDestructiveClick = () => {
    setShowGlitch(true);
    
    // Phase 1: Fade in the glitch effect (opacity 0 → 1)
    if (glitchRef.current) {
      glitchRef.current.style.opacity = '0';
      glitchRef.current.style.transition = 'opacity 1s ease-in-out';
      
      // Force a reflow to ensure the initial opacity is applied
      glitchRef.current.offsetHeight;
      
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
      <div className="fixed top-0 left-0 w-full flex items-center justify-center">
        <div
          className={`aircraft-panel aircraft-text text-2xl font-bold relative px-9 py-2 pb-3 hud-grid ${isDestructive ? 'warning' : ''}`}
          style={{
            clipPath:
              "polygon(0% 0%, 100% 0%, 97% 65%, 80% 100%, 63% 100%, 60% 95%, 40% 95%, 37% 100%, 20% 100%, 3% 65%)"
          }}
        >
          <div className="flex items-center gap-2">
            <div className={`status-indicator ${isDestructive ? 'warning' : ''}`}></div>
            <span className={isDestructive ? 'warning' : ''}>OJASS 2026</span>
            <div className={`status-indicator ${isDestructive ? 'warning' : ''}`}></div>
          </div>
        </div>
      </div>

      <div
        className={`aircraft-panel w-[60px] h-[50vh] fixed bottom-0 right-0 flex flex-col items-center justify-center hud-grid py-10 pt-14 pl-3 ${isDestructive ? 'warning' : ''}`}
        style={{
          position: 'fixed',
          bottom: '0',
          right: '0',
          clipPath:
            "polygon(30px 0%, 100% 0%, 100% 100%, 0% 100%, 20% 95%, 0% 50px)"
        }}
      >
        <div className="flex flex-col items-center justify-between h-full py-8">
          {/* Social Media Icons */}
          <div className={`aircraft-text cursor-pointer hover:scale-110 transition-transform ${isDestructive ? 'warning' : ''}`} title="Instagram">
            <svg width="25" height="25" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </div>
          <div className={`aircraft-text cursor-pointer hover:scale-110 transition-transform ${isDestructive ? 'warning' : ''}`} title="Twitter">
            <svg width="25" height="25" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
          </div>
          <div className={`aircraft-text cursor-pointer hover:scale-110 transition-transform ${isDestructive ? 'warning' : ''}`} title="LinkedIn">
            <svg width="25" height="25" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </div>
          <div className={`aircraft-text cursor-pointer hover:scale-110 transition-transform ${isDestructive ? 'warning' : ''}`} title="GitHub">
            <svg width="25" height="25" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </div>
        </div>
      </div>
      <div
        className={`aircraft-panel w-[60px] h-[50vh] fixed bottom-0 left-0 flex flex-col items-center justify-center hud-grid py-10 pt-14 pr-3 ${isDestructive ? 'warning' : ''}`}
        style={{
          position: 'fixed',
          bottom: '0',
          left: '0',
          clipPath:
            "polygon(0% 0%, calc(100% - 30px) 0%, 100% 50px, 80% 95%, 100% 100%, 0% 100%, 0% 100%)"
        }}
      >
        <div className="flex flex-col items-center justify-between h-full py-8">
          {/* Navigation Icons */}
          <div className={`aircraft-text cursor-pointer hover:scale-110 transition-transform ${isDestructive ? 'warning' : ''}`} title="Home">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
          </div>
          <div className={`aircraft-text cursor-pointer hover:scale-110 transition-transform ${isDestructive ? 'warning' : ''}`} title="About">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
          </div>
          <div className={`aircraft-text cursor-pointer hover:scale-110 transition-transform ${isDestructive ? 'warning' : ''}`} title="Services">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.82,11.69,4.82,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
            </svg>
          </div>
          <div className={`aircraft-text cursor-pointer hover:scale-110 transition-transform ${isDestructive ? 'warning' : ''}`} title="Contact">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
          </div>
        </div>
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
          <video src="/glitch-effect.mp4" autoPlay muted loop playsInline className="w-full h-full object-cover" />
        </div>
    </>
  );
}
