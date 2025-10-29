"use client";

import { useEffect, useRef } from 'react';

export default function Home() {
  const bgRef = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);
  const layer3Ref = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = scrollY / maxScroll;
      
      // Vertical parallax with scale effect
      const bgOffset = scrollY * 0.2;
      const bgScale = 1 + scrollProgress * 0.15;
      
      const layer2Offset = scrollY * 0.45;
      const layer2Scale = 1 + scrollProgress * 0.1;
      
      const layer3Offset = scrollY * 0.65;
      const layer3Scale = 1 + scrollProgress * 0.08;
      
      const bottomOffset = scrollY * 0.85;
      const bottomScale = 1 + scrollProgress * 0.05;
      
      // 3D rotation effect
      const rotX = scrollProgress * 3;
      
      // Left-Right parallax effect (horizontal movement)
      const bgHorizontal = scrollProgress * 100; // -100px to 100px
      const layer2Horizontal = scrollProgress * 70;
      const layer3Horizontal = scrollProgress * 50;
      const bottomHorizontal = scrollProgress * 30;
      
      if (bgRef.current) {
        bgRef.current.style.transform = `translateY(${bgOffset}px) translateX(${bgHorizontal}px) scale(${bgScale}) rotateX(${rotX}deg)`;
      }
      if (layer2Ref.current) {
        layer2Ref.current.style.transform = `translateY(${layer2Offset}px) translateX(${layer2Horizontal}px) scale(${layer2Scale})`;
      }
      if (layer3Ref.current) {
        layer3Ref.current.style.transform = `translateY(${layer3Offset}px) translateX(${layer3Horizontal}px) scale(${layer3Scale})`;
      }
      if (bottomRef.current) {
        bottomRef.current.style.transform = `translateY(${bottomOffset}px) translateX(${bottomHorizontal}px) scale(${bottomScale})`;
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-screen h-screen bg-black relative overflow-hidden"
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d'
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

        <div className="min-h-screen flex items-center justify-center border-b border-white/10">
          <div className="max-w-3xl text-white px-8">
            <h2 className="text-5xl font-bold mb-8">Day 1 Highlights</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-6 py-2">
                <h3 className="text-xl font-bold mb-1">Tech Events</h3>
                <p className="text-gray-300">Robo Wars, Electrospection, Hack de Science, Cansys</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-6 py-2">
                <h3 className="text-xl font-bold mb-1">Management Events</h3>
                <p className="text-gray-300">Mock Stock, Crypto Clash, Business Simulation Challenge</p>
              </div>
              <div className="border-l-4 border-green-500 pl-6 py-2">
                <h3 className="text-xl font-bold mb-1">Gaming & Leisure</h3>
                <p className="text-gray-300">BGMI Showdown, Chess Tournament, Wax Comb Challenge</p>
              </div>
              <div className="border-l-4 border-yellow-500 pl-6 py-2">
                <h3 className="text-xl font-bold mb-1">Guest Lecture</h3>
                <p className="text-gray-300">Dr. Yogesh N. Dhoble - Sustainable Innovation through Material Science</p>
              </div>
            </div>
          </div>
        </div>

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
        className="absolute -bottom-[10vh] left-0" 
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
  );
}