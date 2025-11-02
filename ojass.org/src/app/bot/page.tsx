"use client";

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function Bot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Greetings, traveler! I'm your AI assistant. How may I assist you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);
  const nebula1Ref = useRef<HTMLDivElement>(null);
  const nebula2Ref = useRef<HTMLDivElement>(null);
  const nebula3Ref = useRef<HTMLDivElement>(null);
  const movingStarsRef = useRef<HTMLDivElement>(null);

  // Enhanced star field and nebula animations - match OverlayLayout
  useEffect(() => {
    if (!starsRef.current) return;
    const stars = starsRef.current;
    const starCount = 400;
    stars.innerHTML = '';
    // Two sizes/kinds: bright normal & tiny faint specks
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      const size = i < 320 ? Math.random() * 1.7 + 0.4 : Math.random() * 0.7 + 0.2;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const brightness = i < 320 ? (Math.random() * 0.6 + 0.15) : (Math.random() * 0.20 + 0.05);
      const color = i < 320 ? 'white' : 'rgba(180,210,255,0.7)';
      star.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: 50%;
        left: ${x}%;
        top: ${y}%;
        opacity: ${brightness};
        box-shadow: 0 0 ${(size*3).toFixed(1)}px ${color};
        pointer-events: none;
      `;
      stars.appendChild(star);
    }

    // Create moving stars (shooting stars effect)
    if (movingStarsRef.current) {
      const movingStars = movingStarsRef.current;
      movingStars.innerHTML = '';
      
      for (let i = 0; i < 20; i++) {
        const movingStar = document.createElement('div');
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        const distance = 30 + Math.random() * 40;
        const angle = Math.random() * Math.PI * 2;
        const duration = 3 + Math.random() * 4;
        const delay = Math.random() * 5;

        movingStar.style.cssText = `
          position: absolute;
          width: 2px;
          height: 20px;
          background: linear-gradient(to bottom, white, transparent);
          left: ${startX}%;
          top: ${startY}%;
          opacity: 0;
          transform-origin: center;
          transform: rotate(${angle * 180 / Math.PI}deg);
        `;

        movingStars.appendChild(movingStar);

        const timeline = gsap.timeline({ repeat: -1, delay: delay });
        timeline.to(movingStar, {
          opacity: 1,
          x: Math.cos(angle) * distance + '%',
          y: Math.sin(angle) * distance + '%',
          duration: duration / 2,
          ease: 'power1.in'
        });
        timeline.to(movingStar, {
          opacity: 0,
          duration: duration / 2,
          ease: 'power1.out'
        });
      }
    }

    // Animate nebula effects with more movement
    if (nebula1Ref.current) {
      gsap.to(nebula1Ref.current, {
        opacity: 0.7,
        scale: 1.2,
        x: '+=50',
        y: '+=30',
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      });
    }
    
    if (nebula2Ref.current) {
      gsap.to(nebula2Ref.current, {
        opacity: 0.7,
        scale: 1.3,
        x: '-=40',
        y: '-=20',
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      });
    }

    if (nebula3Ref.current) {
      gsap.to(nebula3Ref.current, {
        opacity: 0.5,
        scale: 1.15,
        x: '+=30',
        y: '+=50',
        duration: 7,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      });
    }
  }, []);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: messages.length + 2,
        text: "I understand your query. This is a simulated response. In a real implementation, this would connect to your AI backend.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-screen relative overflow-hidden"
      style={{
        fontFamily: 'monospace',
        background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #0a0a1a 50%, #000000 100%)'
      }}
    >
      {/* Deep space background */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-950/20 via-blue-950/30 to-black" />
      
      {/* Animated stars background */}
      <div ref={starsRef} className="absolute inset-0 w-full h-full z-0" />

      {/* Moving stars (shooting stars) */}
      <div ref={movingStarsRef} className="absolute inset-0 w-full h-full z-0" />

      {/* Enhanced nebula effects */}
      <div className="absolute inset-0 w-full h-full z-0">
        <div ref={nebula1Ref} className="absolute top-1/4 left-1/5 w-[600px] h-[600px] bg-purple-500 rounded-full blur-[100px] opacity-40" />
        <div ref={nebula2Ref} className="absolute bottom-1/4 right-1/5 w-[700px] h-[700px] bg-blue-500 rounded-full blur-[120px] opacity-40" />
        <div ref={nebula3Ref} className="absolute top-1/2 right-1/3 w-[500px] h-[500px] bg-indigo-500 rounded-full blur-[90px] opacity-20" />
      </div>

      {/* Distant galaxy effect */}
      <div className="absolute top-1/4 right-1/4 w-[800px] h-[800px] opacity-20 z-0">
        <div className="absolute inset-0 bg-gradient-radial from-blue-400/10 via-purple-400/5 to-transparent rounded-full blur-3xl" />
      </div>

      {/* Main chatbot container - spaceship window style */}
      <div className="relative z-10 w-full h-full flex items-center justify-center pt-24 pb-8 px-4 md:px-8">
        <div
          className="w-full max-w-7xl h-[85vh] max-h-[800px] bg-[rgba(0,32,55,0.065)] border-2 rounded-lg backdrop-blur-[10px] relative overflow-hidden layout-panel"
          style={{
            borderColor: 'rgba(0, 200, 255, 0.09)',
            boxShadow: `
              0 0 20px 1px rgba(0,180,255,0.10),
              0 0 50px 0px rgba(0,100,180,0.09),
              0 2px 10px 1px rgba(0,200,255,0.09),
              inset 0 0 18px rgba(80,160,220,0.04)
            `,
            display: 'flex',
            flexDirection: 'column',
            background: 'none'
          }}
        >
          {/* Subtle blue tint overlay - very transparent */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(180deg, rgba(0, 150, 255, 0.05) 0%, rgba(0, 102, 255, 0.08) 50%, rgba(0, 150, 255, 0.05) 100%)',
              backdropFilter: 'blur(1px)'
            }}
          />
          
          {/* Subtle window reflection effects */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              background: `
                linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.05) 50%, transparent 70%),
                linear-gradient(-45deg, transparent 30%, rgba(255, 255, 255, 0.03) 50%, transparent 70%)
              `
            }}
          />
          {/* Spaceship header panel - transparent */}
          <div
            className="w-full p-4 border-b-4 relative z-10"
            style={{
              borderColor: 'rgba(0, 102, 255, 0.5)',
              background: 'linear-gradient(180deg, rgba(0, 102, 255, 0.12) 0%, rgba(0, 150, 255, 0.06) 100%)',
              boxShadow: '0 4px 20px rgba(0, 102, 255, 0.2), inset 0 1px 0 rgba(0, 200, 255, 0.2)',
              backdropFilter: 'blur(8px)'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full animate-pulse"
                  style={{
                    background: '#00ff00',
                    boxShadow: '0 0 10px #00ff00'
                  }}
                />
                <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-blue-400 to-blue-500">
                  SPACESHIP AI ASSISTANT
                </h1>
              </div>
              <div className="flex gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: '#ff0000',
                    boxShadow: '0 0 8px #ff0000'
                  }}
                />
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: '#ffff00',
                    boxShadow: '0 0 8px #ffff00'
                  }}
                />
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: '#00ff00',
                    boxShadow: '0 0 8px #00ff00'
                  }}
                />
              </div>
            </div>
            {/* Status bar */}
            <div className="mt-2 text-xs text-blue-300/90 font-mono">
              <span>STATUS: ONLINE</span>
              <span className="mx-2">|</span>
              <span>CONNECTION: ESTABLISHED</span>
              <span className="mx-2">|</span>
              <span>LATENCY: &lt;50ms</span>
            </div>
          </div>

          {/* Messages container */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 relative z-10 scrollbar-thin scrollbar-thumb-blue-500/50 scrollbar-track-transparent max-h-[80vh]">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] p-4 rounded-lg border-2 ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-br from-blue-500/20 to-blue-600/12 border-blue-400/40'
                      : 'bg-gradient-to-br from-blue-700/20 to-blue-800/12 border-blue-500/40'
                  }`}
                  style={{
                    boxShadow: `0 0 15px ${
                      message.sender === 'user'
                        ? 'rgba(0, 150, 255, 0.3)'
                        : 'rgba(0, 102, 255, 0.3)'
                    }`,
                    backdropFilter: 'blur(12px)'
                  }}
                >
                  <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">
                    {message.text}
                  </p>
                  <span
                    className="text-xs mt-2 block opacity-60"
                    style={{
                      color: message.sender === 'user' ? '#66b3ff' : '#0099ff'
                    }}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Input area - spaceship control panel style - transparent */}
          <div
            className="w-full p-4 border-t-4 relative z-10"
            style={{
              borderColor: 'rgba(0, 102, 255, 0.5)',
              background: 'linear-gradient(0deg, rgba(0, 102, 255, 0.12) 0%, rgba(0, 150, 255, 0.06) 100%)',
              boxShadow: '0 -4px 20px rgba(0, 102, 255, 0.2), inset 0 1px 0 rgba(0, 200, 255, 0.2)',
              backdropFilter: 'blur(8px)'
            }}
          >
            <div className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message... (Press Enter to send)"
                  className="w-full p-3 pr-12 bg-blue-950/25 border-2 border-blue-500/40 rounded-lg text-white placeholder:text-blue-300/50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 resize-none font-mono text-sm"
                  style={{
                    boxShadow: 'inset 0 0 10px rgba(0, 102, 255, 0.15), 0 0 10px rgba(0, 150, 255, 0.15)',
                    backdropFilter: 'blur(8px)'
                  }}
                  rows={1}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
                  }}
                />
                <div
                  className="absolute right-2 bottom-2 text-xs text-blue-300/60 font-mono"
                  style={{ pointerEvents: 'none' }}
                >
                  {inputValue.length}/500
                </div>
              </div>
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold rounded-lg border-2 border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-mono text-sm uppercase tracking-wider"
                style={{
                  boxShadow: inputValue.trim()
                    ? '0 0 20px rgba(0, 102, 255, 0.6), inset 0 0 10px rgba(0, 150, 255, 0.3)'
                    : 'none',
                  textShadow: '0 0 10px rgba(255, 255, 255, 0.5)'
                }}
                onMouseEnter={(e) => {
                  if (inputValue.trim()) {
                    gsap.to(e.currentTarget, {
                      scale: 1.05,
                      duration: 0.2
                    });
                  }
                }}
                onMouseLeave={(e) => {
                  gsap.to(e.currentTarget, {
                    scale: 1,
                    duration: 0.2
                  });
                }}
              >
                SEND
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Corner decorative elements - spaceship panels */}
      <div
        className="absolute top-8 left-8 w-32 h-32 border-2 border-blue-500/30 opacity-50 z-10"
        style={{
          clipPath: 'polygon(0 0, 100% 0, 85% 15%, 15% 85%, 0 100%)'
        }}
      />
      <div
        className="absolute bottom-8 right-8 w-32 h-32 border-2 border-blue-400/30 opacity-50 z-10"
        style={{
          clipPath: 'polygon(15% 0, 100% 0, 100% 100%, 0 85%, 0 15%)'
        }}
      />
    </div>
  );
}
