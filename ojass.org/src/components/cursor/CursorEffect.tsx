'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

export default function CursorEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1, y: -1 }); // Initialize to -1 to track if mouse has moved
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const { theme } = useTheme();
  const isDystopia = theme === 'dystopia';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions to match viewport
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      
      // Add new particles at cursor position for fire trail
      for (let i = 0; i < 3; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2 + 0.5;
        particlesRef.current.push({
          x: e.clientX + (Math.random() - 0.5) * 20,
          y: e.clientY + (Math.random() - 0.5) * 20,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2, // Upward bias for fire effect
          life: 1,
          maxLife: 1,
          size: Math.random() * 4 + 2,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    // Also track on document to catch mouse movements
    document.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= 0.02;
        particle.vx *= 0.98; // Friction
        particle.vy *= 0.98;
        particle.vy -= 0.1; // Gravity (negative for upward movement)

        // Draw particle with theme-based gradient
        if (particle.life > 0) {
          const alpha = particle.life;
          const size = particle.size * particle.life;

          // Create gradient
          const gradient = ctx.createRadialGradient(
            particle.x,
            particle.y,
            0,
            particle.x,
            particle.y,
            size
          );

          // Theme-based colors
          if (isDystopia) {
            // Fire red colors (dystopia): yellow -> orange -> red
            gradient.addColorStop(0, `rgba(255, 255, 100, ${alpha})`);
            gradient.addColorStop(0.5, `rgba(255, 150, 0, ${alpha * 0.8})`);
            gradient.addColorStop(1, `rgba(255, 50, 0, ${alpha * 0.3})`);
          } else {
            // Neon blue colors (utopia): cyan -> light blue -> deep blue
            gradient.addColorStop(0, `rgba(100, 255, 255, ${alpha})`);
            gradient.addColorStop(0.5, `rgba(0, 200, 255, ${alpha * 0.8})`);
            gradient.addColorStop(1, `rgba(0, 100, 255, ${alpha * 0.3})`);
          }

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
          ctx.fill();
        }

        return particle.life > 0;
      });

      // Draw main circle at cursor
      const mouse = mouseRef.current;
      if (mouse.x >= 0 && mouse.y >= 0) {
        // Outer glow
        const glowGradient = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          30
        );
        
        if (isDystopia) {
          // Fire red glow
          glowGradient.addColorStop(0, 'rgba(255, 200, 100, 0.6)');
          glowGradient.addColorStop(0.5, 'rgba(255, 150, 0, 0.3)');
          glowGradient.addColorStop(1, 'rgba(255, 50, 0, 0)');
        } else {
          // Neon blue glow
          glowGradient.addColorStop(0, 'rgba(100, 255, 255, 0.6)');
          glowGradient.addColorStop(0.5, 'rgba(0, 200, 255, 0.3)');
          glowGradient.addColorStop(1, 'rgba(0, 100, 255, 0)');
        }

        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 30, 0, Math.PI * 2);
        ctx.fill();

        // Inner circle
        const circleGradient = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          12
        );
        
        if (isDystopia) {
          // Fire red inner circle
          circleGradient.addColorStop(0, 'rgba(255, 255, 200, 1)');
          circleGradient.addColorStop(0.7, 'rgba(255, 150, 0, 0.8)');
          circleGradient.addColorStop(1, 'rgba(255, 80, 0, 0.6)');
        } else {
          // Neon blue inner circle
          circleGradient.addColorStop(0, 'rgba(200, 255, 255, 1)');
          circleGradient.addColorStop(0.7, 'rgba(0, 255, 255, 0.8)');
          circleGradient.addColorStop(1, 'rgba(0, 150, 255, 0.6)');
        }

        ctx.fillStyle = circleGradient;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 12, 0, Math.PI * 2);
        ctx.fill();

        // Bright center
        if (isDystopia) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        } else {
          ctx.fillStyle = 'rgba(200, 255, 255, 0.9)';
        }
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', setCanvasSize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isDystopia]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 pointer-events-none"
      style={{ 
        width: '100vw', 
        height: '100vh',
        display: 'block',
        visibility: 'visible',
        zIndex: 10000 // Higher than glitch effect's 9999
      }}
    />
  );
}
