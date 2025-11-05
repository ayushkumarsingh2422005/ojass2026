
import React from 'react';
import Image from "next/image";

export default function Winner() {
  const winners = [
    { position: 1, name: "Mohak Sir", prize: "₹10,000", avatar: "🥇" },
    { position: 2, name: "Rahul Kumar", prize: "₹5,000", avatar: "🥈" },
    { position: 3, name: "Priya Sharma", prize: "₹2,500", avatar: "🥉" }
  ];

  return (

    <div className="relative min-h-screen flex items-center justify-center p-8">
      {/* Winners Container */}
      <Image
        src="/events/winner.jpeg"
        alt="Winner Image"
        fill
        className="object-cover "
        priority
      />
      <div
        className="
backdrop-blur-xl
    shadow-2xl
    flex flex-col
    overflow-hidden
    

   
    
        "
        style={{
          boxShadow: '0 0 60px rgba(34, 211, 238, 0.4), inset 0 0 60px rgba(34, 211, 238, 0.05)',
          // clipPath: 'polygon(8% 0, 92% 0, 100% 8%, 100% 92%, 92% 100%, 8% 100%, 0 92%, 0 8%)',
          border: '4px solid rgb(34, 211, 238)',
        }}
      >
        {/* Animated glow effects */}
        <div className="absolute -inset-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 rounded-[3rem] blur-3xl opacity-50 animate-pulse -z-10"></div>
        <div className="absolute -inset-4 bg-cyan-400/30 rounded-[3rem] blur-2xl -z-10"></div>

        {/* Top gradient overlay */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>

        {/* Header */}
        <div className="relative pt-0 pb-6">
          <h1
            className="text-[#00FFEF]  text-2xl md:text-3xl font-bold text-center tracking-wider mt-16"
            style={{
              textShadow: '0 0 20px rgba(34, 211, 238, 0.8), 0 0 30px rgba(34, 211, 238, 0.4)'
            }}
          >
            TOP WINNERS
          </h1>
          <div className="mt-2 h-1 w-20 mx-auto bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
        </div>

        {/* Winners List */}
        <div className="flex-1 px-4 pb-2 space-y-5 overflow-y-auto ">
          {winners.map((winner, index) => (
            <div
              key={index}
              className="relative border-2 border-cyan-400/70  bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-md overflow-hidden group hover:border-cyan-400 transition- p-8"
              style={{
                boxShadow: '0 0 25px rgba(34, 211, 238, 0.2), inset 0 0 25px rgba(34, 211, 238, 0.03)',
                clipPath: winner.position === 1
                  ? 'polygon(5% 0, 95% 0, 100% 20%, 100% 80%, 95% 100%, 5% 100%, 0 80%, 0 20%)'
                  : 'polygon(3% 0, 97% 0, 100% 15%, 100% 85%, 97% 100%, 3% 100%, 0 85%, 0 15%)',
              }}
            >
              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/20 to-cyan-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>

              <div className="relative flex items-center justify-between lg:gap-8 sm:gap-4 lg-2">
                {/* Left: Position & Avatar */}
                <div className="flex lg:gap-8 sm:gap-4 lg-2">
                  <span className="text-2xl">{winner.avatar}</span>
                  <div>
                    <div className="text-cyan-400 text-base font-bold drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">
                      {winner.name}
                    </div>

                  </div>
                </div>

                {/* Right: Prize */}
                <div className="text-right">
                  <div
                    className="text-cyan-400 text-lg font-bold"
                    style={{
                      textShadow: '0 0 10px rgba(34, 211, 238, 0.6)'
                    }}
                  >
                    {winner.prize}
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom decorative line */}
        <div className="h-2 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>
      </div>
    </div>
  );
}
