"use client";

import { useTheme } from '@/contexts/ThemeContext';
import { useGSAP } from '@gsap/react';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from 'react';
export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const isMouseParallaxEnabledRef = useRef<boolean>(true);
  const { theme } = useTheme();
  const isDystopia = theme === "dystopia";
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
      const titleSpeed = 0.9;

      // Calculate movement amounts for div positioning
      const bgX = x * bgSpeed * 40;      // Max 40px movement
      const bgY = y * bgSpeed * 30;      // Max 30px movement

      const layer2X = x * layer2Speed * 60;
      const layer2Y = y * layer2Speed * 40;

      const layer3X = x * layer3Speed * 80;
      const layer3Y = y * layer3Speed * 50;

      const bottomX = x * bottomSpeed * 100;
      const bottomY = y * bottomSpeed * 60;
      
      const titleX = x * titleSpeed * 80;
      const titleY = y * titleSpeed * 50;

      // Subtle rotation for 3D effect (very small angles)
      const bgRotateX = y * bgSpeed * 0.5;
      const bgRotateY = x * bgSpeed * 0.5;

      const layer2RotateX = y * layer2Speed * 1;
      const layer2RotateY = x * layer2Speed * 1;

      const layer3RotateX = y * layer3Speed * 1.5;
      const layer3RotateY = x * layer3Speed * 1.5;

      const titleRotateY = x * titleSpeed * 1.2;
      

      // Parallax for the title text
       // faster for foreground text

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

      gsap.to('#title', {
        x: titleX,
        y: titleY,
        rotationY: titleRotateY,
        transformOrigin: 'center center',
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

        gsap.set('#title', {
          y: -1* scrollY * 0.8,
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
          className="absolute top-0 left-0 "
          id="bg"
          style={{
            width: '120vw',
            height: '120vh',
            marginLeft: '-10vw',
            marginTop: '-10vh',
            backgroundImage: 'url(/layers/bg_new_3.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: isDystopia ? 'blur(1.5px) hue-rotate(180deg)' : 'blur(1.5px) hue-rotate(0deg)',
            transformStyle: 'preserve-3d',
            willChange: 'transform'
          }}
        ></div>
        {/* <video
          className="absolute top-0 left-0 w-screen h-screen"
          id="bg"
          autoPlay
          loop
          muted
          playsInline
          style={{
            objectFit: 'cover',
            filter: 'blur(0px)',
            transformStyle: 'preserve-3d',
            willChange: 'transform',
            width: '100%',
            height: '100%'
          }}
        >
          <source src="/bg_blue.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video> */}
      
        <div
          className="absolute bottom-[3vh] left-0"
          id="layer2"
          style={{
            width: '120vw',
            height: '70vh',
            marginLeft: '-10vw',
            backgroundImage: 'url(/layers/layer2_new_2.png)',
            backgroundSize: '50% 120%',
            backgroundPosition: 'center',
            backgroundRepeat: 'repeat-x',
            filter: isDystopia ? 'blur(1px) brightness(1.2) hue-rotate(180deg)' : 'blur(1px) brightness(1.2) hue-rotate(0deg)',
            transformStyle: 'preserve-3d',
            willChange: 'transform',
          }}
        ></div>
        
        <div
          id="title"
          className='absolute top-[20%] font-bold text-[200px] text-center w-full bg-[url(/layers/text.png)] bg-contain bg-center bg-no-repeat h-[30vh]'
          style={{ willChange: 'transform', pointerEvents: 'none', filter: isDystopia ? 'hue-rotate(180deg)' : 'hue-rotate(0deg)', }}
        >
        </div>

        <div
          className="absolute bottom-[5vh] left-0 flex flex-row justify-between"
          id="layer3"
          style={{
            width: '120vw',
            height: '90vh',
            marginLeft: '-10vw',
            transformStyle: 'preserve-3d',
              willChange: 'transform',
          }}
        >
          <div
            style={{
              height: '100%',
              width: '50%',
              minWidth: '40vw',
              backgroundImage: 'url(/layers/layer3_1.png)',
              backgroundSize: 'contain',
              backgroundPosition: '80% bottom',
              backgroundRepeat: 'no-repeat',
              transform: 'scaleX(-1)',
              willChange: 'transform',
              filter: isDystopia ? 'hue-rotate(180deg)' : 'hue-rotate(0deg)',
              // backgroundColor: 'red'
            }}
          ></div>
          <div
            style={{
              height: '100%',
              width: '50%',
              minWidth: '40vw',
              backgroundImage: 'url(/layers/layer3_2.png)',
              backgroundSize: '90%',
              backgroundPosition: '40% bottom',
              backgroundRepeat: 'no-repeat',
              filter: isDystopia ? 'hue-rotate(180deg)' : 'hue-rotate(0deg)',
            }}
          ></div>
        </div>
  
        <div
          className="absolute -bottom-[5vh] left-0"
          id="bottom"
          style={{
            width: '120vw',
            height: '35vh',
            marginLeft: '-10vw',
            backgroundImage: 'url(/layers/bottom.png)',
            backgroundSize: 'contain',
            backgroundPosition: 'bottom center',
            backgroundRepeat: 'no-repeat',
            willChange: 'transform',
            filter: isDystopia ? 'hue-rotate(180deg)' : 'hue-rotate(0deg)',
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


// "use client";

// import { useGSAP } from '@gsap/react';
// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { useEffect, useRef, useState } from 'react';
// export default function Home() {
//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
//   const containerRef = useRef<HTMLDivElement>(null);
//   const isMouseParallaxEnabledRef = useRef<boolean>(true);

//   if (typeof window !== 'undefined' && (gsap as any).registeredPlugins?.includes?.(ScrollTrigger) !== true) {
//     gsap.registerPlugin(ScrollTrigger);
//   }

//   // Smooth mouse tracking without throttling
//   useEffect(() => {
//     const handleMouseMove = (e: MouseEvent) => {
//       if (!isMouseParallaxEnabledRef.current) return;
//       if (containerRef.current) {
//         const rect = containerRef.current.getBoundingClientRect();
//         const x = (e.clientX - rect.left) / rect.width;
//         const y = (e.clientY - rect.top) / rect.height;

//         // Normalize to -1 to 1 range, centered at 0
//         const normalizedX = (x - 0.5) * 2;
//         const normalizedY = (y - 0.5) * 2;

//         setMousePosition({ x: normalizedX, y: normalizedY });
//       }
//     };

//     const handleMouseLeave = () => {
//       // Smoothly reset to center when mouse leaves
//       setMousePosition({ x: 0, y: 0 });
//     };

//     const container = containerRef.current;
//     if (container) {
//       container.addEventListener('mousemove', handleMouseMove);
//       container.addEventListener('mouseleave', handleMouseLeave);

//       return () => {
//         container.removeEventListener('mousemove', handleMouseMove);
//         container.removeEventListener('mouseleave', handleMouseLeave);
//       };
//     }
//   }, []);


//   // GSAP animations for parallax effect - moving the divs themselves
//   useGSAP(() => {
//     // Animate layers based on mouse position
//     const animateLayers = () => {
//       if (!isMouseParallaxEnabledRef.current) return; // enable only at top
//       const { x, y } = mousePosition;

//       // Different parallax speeds for each layer (closer layers move more)
//       const bgSpeed = 0.1;      // Background moves least (furthest)
//       const layer2Speed = 0.3;  // Layer 2 moves more
//       const layer3Speed = 0.5;  // Layer 3 moves even more
//       const bottomSpeed = 0.7;  // Bottom layer moves most (closest)

//       // Calculate movement amounts for div positioning
//       const bgX = x * bgSpeed * 40;      // Max 40px movement
//       const bgY = y * bgSpeed * 30;      // Max 30px movement

//       const layer2X = x * layer2Speed * 60;
//       const layer2Y = y * layer2Speed * 40;

//       const layer3X = x * layer3Speed * 80;
//       const layer3Y = y * layer3Speed * 50;

//       const bottomX = x * bottomSpeed * 100;
//       const bottomY = y * bottomSpeed * 60;

//       // Subtle rotation for 3D effect (very small angles)
//       const bgRotateX = y * bgSpeed * 0.5;
//       const bgRotateY = x * bgSpeed * 0.5;

//       const layer2RotateX = y * layer2Speed * 1;
//       const layer2RotateY = x * layer2Speed * 1;

//       const layer3RotateX = y * layer3Speed * 1.5;
//       const layer3RotateY = x * layer3Speed * 1.5;

//       // Move the actual divs instead of background position
//       gsap.to('#bg', {
//         x: bgX,
//         y: bgY,
//         rotationX: bgRotateX,
//         rotationY: bgRotateY,
//         transformOrigin: 'center center',
//         duration: 0.2,
//         ease: 'none'
//       });

//       gsap.to('#layer2', {
//         x: layer2X,
//         y: layer2Y,
//         rotationX: layer2RotateX,
//         rotationY: layer2RotateY,
//         transformOrigin: 'center center',
//         duration: 0.2,
//         ease: 'none'
//       });

//       gsap.to('#layer3', {
//         x: layer3X,
//         y: layer3Y,
//         rotationX: layer3RotateX,
//         rotationY: layer3RotateY,
//         transformOrigin: 'center center',
//         duration: 0.2,
//         ease: 'none'
//       });

//       gsap.to('#bottom', {
//         x: bottomX,
//         y: bottomY,
//         duration: 0.2,
//         ease: 'none'
//       });
//     };

//     animateLayers();
//   }, [mousePosition]);

//   useGSAP(() => {
//     if (!containerRef.current) return;

//     ScrollTrigger.create({
//       trigger: containerRef.current,
//       start: 'top top',
//       end: 'bottom+=100% top',
//       scrub: true,
//       onUpdate: (self) => {
//         const scrollY = window.scrollY;
//         const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
//         const progress = maxScroll > 0 ? scrollY / maxScroll : 0;

//         // Mouse parallax only when page is at top
//         isMouseParallaxEnabledRef.current = scrollY === 0;

//         // Match @temp.jsx (18-28)
//         gsap.set('#bg', {
//           y: scrollY * 0.2,
//           scale: 1 + progress * 0.15,
//           rotationX: progress * 3,
//           transformOrigin: 'center center'
//         });

//         gsap.set('#layer2', {
//           y: scrollY * 0.45,
//           scale: 1 + progress * 0.1,
//         });

//         gsap.set('#layer3', {
//           y: scrollY * 0.65,
//           scale: 1 + progress * 0.08,
//         });

//         gsap.set('#bottom', {
//           y: scrollY * 0.25,
//           scale: 1 + progress * 0.05,
//         });
//       }
//     });
//   }, []);

//   return (
//     <>
//       <div
//         ref={containerRef}
//         className="w-full h-screen bg-black relative overflow-hidden"
//         style={{
//           perspective: '1000px',
//           transformStyle: 'preserve-3d',
//           overflowX: 'hidden',
//         }}
//       >
//         <video
//           className="absolute top-0 left-0 w-screen h-screen"
//           id="bg"
//           autoPlay
//           loop
//           muted
//           playsInline
//           style={{
//             objectFit: 'cover',
//             filter: 'blur(0px)',
//             transformStyle: 'preserve-3d',
//             willChange: 'transform',
//             width: '100%',
//             height: '100%'
//           }}
//         >
//           <source src="/bg_blue.mp4" type="video/mp4" />
//           Your browser does not support the video tag.
//         </video>
      
//         <div
//           className="absolute bottom-[30vh] left-0"
//           id="layer2"
//           style={{
//             width: '120vw',
//             height: '90vh',
//             marginLeft: '-10vw',
//             backgroundImage: 'url(/ut_layer_clouds.png)',
//             backgroundSize: 'cover',
//             backgroundPosition: 'center',
//             backgroundRepeat: 'no-repeat',
//             filter: 'blur(1.5px) brightness(1.2)',
//             transformStyle: 'preserve-3d',
//             willChange: 'transform'
//           }}
//         ></div>

//         <div
//           className="absolute bottom-[30vh] left-0"
//           id="layer3"
//           style={{
//             width: '120vw',
//             height: '90vh',
//             marginLeft: '-10vw',
//             backgroundImage: 'url(/ut_layer_build_nobg.png)',
//             backgroundSize: 'cover',
//             backgroundPosition: 'center',
//             backgroundRepeat: 'no-repeat',
//             transformStyle: 'preserve-3d',
//             willChange: 'transform'
//           }}
//         ></div>
  
//         {/* <div
//           className="absolute -bottom-[17vh] left-0"
//           id="bottom"
//           style={{
//             width: '120vw',
//             height: '35vh',
//             marginLeft: '-10vw',
//             backgroundImage: 'url(/layers/bottom.svg)',
//             backgroundSize: 'cover',
//             backgroundPosition: 'top left',
//             backgroundRepeat: 'no-repeat',
//             willChange: 'transform'
//           }}
//         ></div> */}
//       </div>
//       <div className='w-full h-screen bg-white relative overflow-hidden'>
//         <div
//           className="absolute -top-30 left-0"
//           // id="bottom"
//           style={{
//             width: '100vw',
//             height: '35vh',
//             backgroundImage: 'url(/layers/top.svg)',
//             backgroundSize: 'cover',
//             backgroundPosition: 'top left',
//             backgroundRepeat: 'no-repeat',
//             willChange: 'transform'
//           }}
//         ></div>
//       </div>
//     </>
//   );
// }