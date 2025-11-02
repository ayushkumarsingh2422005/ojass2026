"use client";

import TimelineDial from '@/components/OverlayLayout/TimelineDial';
import { useGSAP } from '@gsap/react';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from 'react';
export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const isMouseParallaxEnabledRef = useRef<boolean>(true);

  if (typeof window !== 'undefined' && (gsap as any).registeredPlugins?.includes?.(ScrollTrigger) !== true) {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Smooth mouse tracking without throttling
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isMouseParallaxEnabledRef.current) return;
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        // Normalize to -1 to 1 range, centered at 0
        const normalizedX = (x - 0.5) * 2;
        const normalizedY = (y - 0.5) * 2;

        setMousePosition({ x: normalizedX, y: normalizedY });
      }
    };

    const handleMouseLeave = () => {
      // Smoothly reset to center when mouse leaves
      setMousePosition({ x: 0, y: 0 });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      };
    }
  }, []);


  // GSAP animations for parallax effect - moving the divs themselves
  useGSAP(() => {
    // Animate layers based on mouse position
    const animateLayers = () => {
      if (!isMouseParallaxEnabledRef.current) return; // enable only at top
      const { x, y } = mousePosition;

      // Different parallax speeds for each layer (closer layers move more)
      const bgSpeed = 0.1;      // Background moves least (furthest)
      const layer2Speed = 0.3;  // Layer 2 moves more
      const layer3Speed = 0.5;  // Layer 3 moves even more
      const bottomSpeed = 0.7;  // Bottom layer moves most (closest)

      // Calculate movement amounts for div positioning
      const bgX = x * bgSpeed * 40;      // Max 40px movement
      const bgY = y * bgSpeed * 30;      // Max 30px movement

      const layer2X = x * layer2Speed * 60;
      const layer2Y = y * layer2Speed * 40;

      const layer3X = x * layer3Speed * 80;
      const layer3Y = y * layer3Speed * 50;

      const bottomX = x * bottomSpeed * 100;
      const bottomY = y * bottomSpeed * 60;

      // Subtle rotation for 3D effect (very small angles)
      const bgRotateX = y * bgSpeed * 0.5;
      const bgRotateY = x * bgSpeed * 0.5;

      const layer2RotateX = y * layer2Speed * 1;
      const layer2RotateY = x * layer2Speed * 1;

      const layer3RotateX = y * layer3Speed * 1.5;
      const layer3RotateY = x * layer3Speed * 1.5;

      // Move the actual divs instead of background position
      gsap.to('#bg', {
        x: bgX,
        y: bgY,
        rotationX: bgRotateX,
        rotationY: bgRotateY,
        transformOrigin: 'center center',
        duration: 0.2,
        ease: 'none'
      });

      gsap.to('#layer2', {
        x: layer2X,
        y: layer2Y,
        rotationX: layer2RotateX,
        rotationY: layer2RotateY,
        transformOrigin: 'center center',
        duration: 0.2,
        ease: 'none'
      });

      gsap.to('#layer3', {
        x: layer3X,
        y: layer3Y,
        rotationX: layer3RotateX,
        rotationY: layer3RotateY,
        transformOrigin: 'center center',
        duration: 0.2,
        ease: 'none'
      });

      gsap.to('#bottom', {
        x: bottomX,
        y: bottomY,
        duration: 0.2,
        ease: 'none'
      });
    };

    animateLayers();
  }, [mousePosition]);

  useGSAP(() => {
    if (!containerRef.current) return;

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom+=100% top',
      scrub: true,
      onUpdate: (self) => {
        const scrollY = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = maxScroll > 0 ? scrollY / maxScroll : 0;

        // Mouse parallax only when page is at top
        isMouseParallaxEnabledRef.current = scrollY === 0;

        // Match @temp.jsx (18-28)
        gsap.set('#bg', {
          y: scrollY * 0.2,
          scale: 1 + progress * 0.15,
          rotationX: progress * 3,
          transformOrigin: 'center center'
        });

        gsap.set('#layer2', {
          y: scrollY * 0.45,
          scale: 1 + progress * 0.1,
        });

        gsap.set('#layer3', {
          y: scrollY * 0.65,
          scale: 1 + progress * 0.08,
        });

        gsap.set('#bottom', {
          y: scrollY * 0.25,
          scale: 1 + progress * 0.05,
        });
      }
    });
  }, []);

  return (
    <>
      <div
        ref={containerRef}
        className="w-full h-screen bg-black relative overflow-hidden"
        style={{
          perspective: '1000px',
          transformStyle: 'preserve-3d',
          overflowX: 'hidden',
        }}
      >
        <div
          className="absolute top-0 left-0"
          id="bg"
          style={{
            width: '120vw',
            height: '120vh',
            marginLeft: '-10vw',
            marginTop: '-10vh',
            backgroundImage: 'url(/layers/bg.jpg)',
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: 'blur(2px)',
            transformStyle: 'preserve-3d',
            willChange: 'transform'
          }}
        ></div>
      
        <div
          className="absolute bottom-[10vh] left-0"
          id="layer2"
          style={{
            width: '120vw',
            height: '70vh',
            marginLeft: '-10vw',
            backgroundImage: 'url(/layers/layer2.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: 'blur(1px)',
            transformStyle: 'preserve-3d',
            willChange: 'transform'
          }}
        ></div>

        <div
          className="absolute bottom-[10vh] left-0"
          id="layer3"
          style={{
            width: '120vw',
            height: '70vh',
            marginLeft: '-10vw',
            backgroundImage: 'url(/layers/layer3.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            transformStyle: 'preserve-3d',
            willChange: 'transform'
          }}
        ></div>
  
        <div
          className="absolute -bottom-[12vh] left-0"
          id="bottom"
          style={{
            width: '120vw',
            height: '35vh',
            marginLeft: '-10vw',
            backgroundImage: 'url(/layers/bottom.svg)',
            backgroundSize: 'cover',
            backgroundPosition: 'top left',
            backgroundRepeat: 'no-repeat',
            willChange: 'transform'
          }}
        ></div>
      </div>
      <div className='w-full h-screen bg-white relative overflow-hidden'>
        <div
          className="absolute -top-30 left-0"
          // id="bottom"
          style={{
            width: '100vw',
            height: '35vh',
            backgroundImage: 'url(/layers/top.svg)',
            backgroundSize: 'cover',
            backgroundPosition: 'top left',
            backgroundRepeat: 'no-repeat',
            willChange: 'transform'
          }}
        ></div>
      </div>
    </>
  );
}