

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from "@/contexts/ThemeContext";

export default function FuturisticHUD() {
  const { theme } = useTheme();
  const [scanProgress, setScanProgress] = useState(0);
  const [coordinates, setCoordinates] = useState({ x: -73.99308, y: 40.75058 });
  const [isScanning, setIsScanning] = useState(true);
  const [input, setInput] = useState('');
  const [chatState, setChatState] = useState<'idle' | 'typing' | 'generating'>('idle');
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Complete color configurations for both themes
  const themeConfig = {
    utopia: {
      primary: 'cyan',
      border: 'border-cyan-500',
      borderLight: 'border-cyan-500/30',
      borderMedium: 'border-cyan-500/40',
      borderHeavy: 'border-cyan-500/50',
      text: 'text-cyan',
      text400: 'text-cyan-400',
      text500: 'text-cyan-500',
      text600: 'text-cyan-600',
      text300: 'text-cyan-300',
      text200: 'text-cyan-200',
      bg: 'bg-cyan-900/50',
      bgLight: 'bg-cyan-900/20',
      shadow: 'shadow-cyan-500/20',
      gradient: 'from-cyan-400 to-cyan-600',
      gradientBg: 'from-blue-900/20',
      gridColor: 'cyan',
      // New properties for AI responses and threat level
      aiResponse: 'text-cyan-400',
      threatLevel: 'text-cyan-400',
      threatText: 'LOW' // Added threat level text
    },
    dystopia: {
      primary: 'red',
      border: 'border-red-500',
      borderLight: 'border-red-500/30',
      borderMedium: 'border-red-500/40',
      borderHeavy: 'border-red-500/50',
      text: 'text-red',
      text400: 'text-red-400',
      text500: 'text-red-500',
      text600: 'text-red-600',
      text300: 'text-red-300',
      text200: 'text-red-200',
      bg: 'bg-red-900/50',
      bgLight: 'bg-red-900/20',
      shadow: 'shadow-red-500/20',
      gradient: 'from-red-400 to-red-600',
      gradientBg: 'from-red-900/20',
      gridColor: 'red',
      // New properties for AI responses and threat level
      aiResponse: 'text-red-400',
      threatLevel: 'text-red-400',
      threatText: 'HIGH' // Added threat level text
    }
  };

  const colors = theme === 'dystopia' ? themeConfig.dystopia : themeConfig.utopia;

  useEffect(() => {
    if (isScanning) {
      const interval = setInterval(() => {
        setScanProgress((prev) => (prev >= 100 ? 0 : prev + 2));
      }, 50);
      return () => clearInterval(interval);
    }
  }, [isScanning]);

  useEffect(() => {
    const coordInterval = setInterval(() => {
      setCoordinates({
        x: -73.99308 + (Math.random() - 0.5) * 0.001,
        y: 40.75058 + (Math.random() - 0.5) * 0.001,
      });
    }, 100);
    return () => clearInterval(coordInterval);
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    setChatState('generating');
    setMessages((prev) => [...prev, { role: 'user', content: input }]);
    setInput('');

    // Simulated AI delay
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'This is an AI-generated response.' },
      ]);
      setChatState('idle');
    }, 3000);
  };

  return (
    <>
      <div className="flex min-h-screen bg-black items-center justify-center p-2 sm:p-4 md:p-8">
        <div
          className={`relative w-full max-w-[1500px] h-[95vh] sm:h-[92vh] md:h-[90vh] p-[2px] sm:p-1 ${theme === 'dystopia' ? 'bg-red-500' : 'bg-cyan-500'}`}
          style={{
            clipPath:
              'polygon(0% 20px, 20px 0, calc(100% - 20px) 0, 100% 20px, 100% calc(100% - 20px), calc(100% - 20px) 100%, 20px 100%, 0 calc(100% - 20px))',
          }}
        >
          <div
            className="relative w-full h-full overflow-hidden"
            style={{
              clipPath:
                'polygon(0% 20px, 20px 0, calc(100% - 20px) 0, 100% 20px, 100% calc(100% - 20px), calc(100% - 20px) 100%, 20px 100%, 0 calc(100% - 20px))',
            }}
          >
            <div className="relative w-full h-full bg-black overflow-hidden">
              <div className={`relative w-full h-full bg-gradient-to-b ${colors.gradientBg} to-black ${colors.borderLight} shadow-2xl ${colors.shadow} p-2 sm:p-4`}>
                <div className="absolute inset-0 bg-grid-pattern opacity-10 -z-10"></div>

                {/* Top Bar */}
                <div className={`absolute top-0 left-0 right-0 h-10 sm:h-12 border-b ${colors.borderHeavy} bg-black/50 backdrop-blur-sm z-10 flex items-center justify-between px-4`}>
                  <div className={`${colors.text500}/70 text-lg font-mono`}>OJASS 2026</div>
                  <div className={`${colors.text400} text-xs font-mono tracking-wider`}>
                    SYSTEM ONLINE
                  </div>
                </div>

                {/* Left Panel */}
                <div
                  className={`hidden lg:block absolute left-4 xl:left-8 top-16 xl:top-20 bottom-20 w-52 xl:w-60 ${colors.borderLight} bg-black/50 backdrop-blur-sm rounded-lg p-4`}
                  style={{
                    clipPath:
                      'polygon(0% 20px, 20px 0, calc(100% - 20px) 0, 100% 20px, 100% calc(100% - 20px), calc(100% - 20px) 100%, 20px 100%, 0 calc(100% - 20px))',
                  }}
                >
                  <h3 className={`${colors.text400} text-sm font-bold mb-4 font-mono`}>
                    OBJECT DATA
                  </h3>
                  <div className="space-y-10">
                    <div>
                      <div className={`${colors.text600} text-xs font-mono`}>STATUS</div>
                      <div className="text-white text-sm">LOCKED</div>
                    </div>
                    <div>
                      <div className={`${colors.text600} text-xs font-mono`}>DISTANCE</div>
                      <div className="text-white text-sm">1.24 KM</div>
                    </div>
                    <div>
                      <div className={`${colors.text600} text-xs font-mono`}>VELOCITY</div>
                      <div className="text-white text-sm">0.00 M/S</div>
                    </div>
                    <div>
                      <div className={`${colors.text600} text-xs font-mono`}>THREAT LEVEL</div>
                      <div className={` text-white text-sm`}>
                        {colors.threatText}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Panel */}
                <div
                  className={`hidden lg:block absolute right-4 xl:right-8 top-16 xl:top-20 bottom-20 w-52 xl:w-60 ${colors.borderLight} bg-black/50 backdrop-blur-sm rounded-lg p-4`}
                  style={{
                    clipPath:
                      'polygon(0% 20px, 20px 0, calc(100% - 20px) 0, 100% 20px, 100% calc(100% - 20px), calc(100% - 20px) 100%, 20px 100%, 0 calc(100% - 20px))',
                  }}
                >
                  <h3 className={`${colors.text400} text-sm font-bold mb-4 font-mono text-center`}>
                    ANALYSIS
                  </h3>
                  <div className="space-y-10">
                    <div>
                      <div className={`${colors.text600} text-xs font-mono`}>
                        SCAN PROGRESS
                      </div>
                      <div className={`w-full h-2 ${colors.bg} rounded-full mt-1 overflow-hidden border ${colors.borderMedium}`}>
                        <motion.div
                          className={`h-full bg-gradient-to-r ${colors.gradient}`}
                          style={{ width: `${scanProgress}%` }}
                        />
                      </div>
                      <div className="text-white text-xs mt-1">{scanProgress}%</div>
                    </div>
                    <div>
                      <div className={`${colors.text600} text-xs font-mono`}>COORDINATES</div>
                      <div className="text-white text-xs font-mono">
                        X: {coordinates.x.toFixed(5)}
                        <br />
                        Y: {coordinates.y.toFixed(5)}
                      </div>
                    </div>
                    <div>
                      <div className={`${colors.text600} text-xs font-mono`}>SYSTEM LOAD</div>
                      <div className="text-white text-sm">42%</div>
                    </div>
                  </div>
                </div>

                {/* Center Scanner & Chat */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pt-20 pb-24 px-4">
                  {/* Scanner */}
                  <div className="relative w-[420px] h-[420px] sm:w-[520px] sm:h-[520px] md:w-[580px] md:h-[600px] opacity-30">
                    <motion.div
                      className={`absolute inset-0 rounded-full border-2 ${colors.border}/50`}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    />
                    <motion.div
                      className={`absolute inset-8 rounded-full border ${colors.border}/30`}
                      animate={{ rotate: -360 }}
                      transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                    />
                    <div className={`absolute inset-0 flex flex-col items-center justify-center ${colors.text300} font-mono text-base sm:text-lg tracking-widest`}>
                      {chatState === 'typing' && <span>USER TYPING...</span>}
                      {chatState === 'generating' && <span>GENERATING...</span>}
                      {chatState === 'idle' && <span>IDLE</span>}
                    </div>
                  </div>

                  {/* Chatbox */}
                  <div
                    className={`absolute bottom-16 w-[95%] max-w-3xl border-2 ${colors.borderMedium} bg-black/70 backdrop-blur-md p-6 rounded-xl ${colors.text200} font-mono`}
                    style={{
                      clipPath:
                        'polygon(0% 10px, 10px 0%, calc(100% - 10px) 0%, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px))',
                    }}
                  >
                    <div
                      ref={chatContainerRef}
                      className="h-95 sm:h-40 lg:h-90 overflow-y-auto mb-4 space-y-3 text-sm sm:text-base scrollbar-thin scrollbar-thumb-cyan-700/50 scrollbar-track-transparent"
                    >
                      {messages.map((msg, i) => (
                        <div
                          key={i}
                          className={`${msg.role === 'user'
                            ? `${colors.text300} text-right`
                            : `${colors.aiResponse} text-left`
                            }`}
                        >
                          {msg.content}
                        </div>
                      ))}

                      {/* Generating Animation */}
                      {chatState === 'generating' && (
                        <div className="flex justify-start items-center gap-2">
                          <div className={`w-2 h-2 rounded-full animate-ping ${theme === 'dystopia' ? 'bg-red-400' : 'bg-cyan-400'}`}></div>
                          <div className={`w-2 h-2 rounded-full animate-pulse delay-100 ${theme === 'dystopia' ? 'bg-red-400' : 'bg-cyan-400'}`}></div>
                          <div className={`w-2 h-2 rounded-full animate-pulse delay-200 ${theme === 'dystopia' ? 'bg-red-400' : 'bg-cyan-400'}`}></div>
                          <span className={`text-xs ml-2 ${theme === 'dystopia' ? 'text-red-500' : 'text-cyan-500'}`}>AI is thinking...</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => {
                          setInput(e.target.value);
                          setChatState(e.target.value ? 'typing' : 'idle');
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSend();
                        }}
                        placeholder="Type your message...."
                        className={`flex-1 bg-black/60 ${colors.borderMedium} ${colors.text200} rounded-lg px-3 py-3 focus:outline-none focus:ring-1 ${theme === 'dystopia' ? 'focus:ring-red-400' : 'focus:ring-cyan-400'} ${theme === 'dystopia' ? 'placeholder-red-700' : 'placeholder-cyan-700'} text-sm`}
                      />
                      <button
                        onClick={handleSend}
                        className={`border ${colors.border}/50 px-5 py-3 text-sm rounded-lg ${theme === 'dystopia' ? 'hover:bg-red-500/20' : 'hover:bg-cyan-500/20'} transition-all`}
                      >
                        SEND
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bottom Bar */}
                <div className={`absolute bottom-0 left-0 right-0 h-12 sm:h-14 border-t ${colors.borderHeavy} bg-black/50 backdrop-blur-sm flex items-center justify-center ${colors.text400} text-xs font-mono tracking-widest animate-pulse`}>
                  {chatState === 'generating'
                    ? 'PROCESSING RESPONSE...'
                    : 'READY FOR INPUT'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .bg-grid-pattern {
          background-image: linear-gradient(${colors.gridColor} 1px, transparent 1px),
            linear-gradient(90deg, ${colors.gridColor} 1px, transparent 1px);
          background-size: 30px 30px;
        }
        @media (min-width: 640px) {
          .bg-grid-pattern {
            background-size: 40px 40px;
          }
        }
        @media (min-width: 1024px) {
          .bg-grid-pattern {
            background-size: 50px 50px;
          }
        }
      `}</style>
    </>
  );
}