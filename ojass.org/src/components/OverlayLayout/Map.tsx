// import React, { useState, useMemo } from "react";
// import { Calendar, Clock, MapPin, Zap, Cpu, Wifi, Globe } from "lucide-react";

// const SciFiEventMap = () => {
//   const [selectedStop, setSelectedStop] = useState(null);
//   const [hoveredStop, setHoveredStop] = useState<number | null>(null);

//   /** 🔹 Event Data */
//   const events = useMemo(
//     () => [
//       {
//         id: 1,
//         title: "Neural Sync Assembly",
//         time: "09:00",
//         description: "Quantum consciousness integration workshop",
//         type: "tech",
//         icon: Cpu,
//       },
//       {
//         id: 2,
//         title: "Plasma Core Briefing",
//         time: "11:30",
//         description: "Energy matrix optimization protocols",
//         type: "energy",
//         icon: Zap,
//       },
//       {
//         id: 3,
//         title: "Cybernetic Enhancement Lab",
//         time: "14:00",
//         description: "Biotech augmentation demonstrations",
//         type: "bio",
//         icon: Wifi,
//       },
//       {
//         id: 4,
//         title: "Temporal Flux Analysis",
//         time: "16:45",
//         description: "Chronospace distortion patterns review",
//         type: "temporal",
//         icon: Clock,
//       },
//       {
//         id: 5,
//         title: "Holomatrix Conference",
//         time: "19:00",
//         description: "Virtual reality ecosystem summit",
//         type: "virtual",
//         icon: Globe,
//       },
//       {
//         id: 6,
//         title: "Nanotech Synthesis",
//         time: "21:30",
//         description: "Molecular reconstruction experiments",
//         type: "nano",
//         icon: MapPin,
//       },
//       {
//         id: 7,
//         title: "Neural Sync Assembly",
//         time: "09:00",
//         description: "Quantum consciousness integration workshop",
//         type: "tech",
//         icon: Cpu,
//       },
//       {
//         id: 8,
//         title: "Plasma Core Briefing",
//         time: "11:30",
//         description: "Energy matrix optimization protocols",
//         type: "energy",
//         icon: Zap,
//       },
//       {
//         id: 9,
//         title: "Cybernetic Enhancement Lab",
//         time: "14:00",
//         description: "Biotech augmentation demonstrations",
//         type: "bio",
//         icon: Wifi,
//       },
//       {
//         id: 10,
//         title: "Temporal Flux Analysis",
//         time: "16:45",
//         description: "Chronospace distortion patterns review",
//         type: "temporal",
//         icon: Clock,
//       },
//       {
//         id: 11,
//         title: "Holomatrix Conference",
//         time: "19:00",
//         description: "Virtual reality ecosystem summit",
//         type: "virtual",
//         icon: Globe,
//       },
//       {
//         id: 12,
//         title: "Nanotech Synthesis",
//         time: "21:30",
//         description: "Molecular reconstruction experiments",
//         type: "nano",
//         icon: MapPin,
//       },
//     ],
//     []
//   );

//   /** 🔹 Generate evenly spaced zigzag path points */
// const generatePath = useMemo(() => {
//   const width = 900;
//   const height = 400;
//   const xStart = 150;
//   const xEnd = 750;

//   return events.map((event, i) => {
//     const progress = i / (events.length - 1);
//     const x = xStart + (xEnd - xStart) * progress;
//     // Smooth S-curve zigzag pattern
//     const zigzagAmplitude = 100;
//     const yOffset = Math.sin(progress * Math.PI * 6) * zigzagAmplitude;
//     const y = height / 2 + yOffset;

//     return {
//       x,
//       y,
//       event,
//     };
//   });
// }, [events]);

//   /** 🔹 Create SVG path string */
//   const pathString = useMemo(() => {
//     if (generatePath.length < 2) return "";

//     let path = `M ${generatePath[0].x} ${generatePath[0].y}`;
//     for (let i = 1; i < generatePath.length; i++) {
//       const prev = generatePath[i - 1];
//       const curr = generatePath[i];
//       const controlX = prev.x + (curr.x - prev.x) * 0.5;

//       path += ` C ${controlX} ${prev.y}, ${controlX} ${curr.y}, ${curr.x} ${curr.y}`;
//     }
//     return path;
//   }, [generatePath]);

//   /** 🔹 Event type colors */
//   const getEventTypeColor = (type: string) => {
//     const colors: Record<string, string> = {
//       tech: "#00ffff",
//       energy: "#ff00ff",
//       bio: "#00ff00",
//       temporal: "#ffaa00",
//       virtual: "#aa00ff",
//       nano: "#ff0066",
//     };
//     return colors[type] || "#ffffff";
//   };

//   return (
//     <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0a0e1a] to-[#1a0e2e] p-5 font-mono">
//       {/* Grid Background */}
//       <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />

//       {/* Scan Lines */}
//       <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,255,255,0.03)_2px,rgba(0,255,255,0.03)_4px)]" />

//       {/* Main Container */}
//       <div className="relative mx-auto max-w-[900px] rounded-2xl border-2 border-cyan-500/30 bg-[#001428]/50 p-5 shadow-[0_0_50px_rgba(0,255,255,0.2),inset_0_0_50px_rgba(0,255,255,0.05)]">
//         <h1 className="mb-2 text-center text-3xl font-bold uppercase tracking-widest text-cyan-400 md:text-4xl animate-pulse-slow">
//           OJASS'26 Timeline
//         </h1>
//         <p className="mb-8 text-center text-sm tracking-wider text-cyan-200/60">
//           SYSTEM DATE: 2157.03.15 | SECTOR: ALPHA-7
//         </p>

//         {/* Timeline SVG */}
//         <div className="relative">
//           <svg
//             className="h-[600px] w-full drop-shadow-[0_0_10px_rgba(0,255,255,0.3)]"
//             viewBox="0 0 800 600"
//           >
//             <defs>
//               <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
//                 <stop offset="0%" stopColor="#00ffff" stopOpacity="0.3" />
//                 <stop offset="50%" stopColor="#ff00ff" stopOpacity="0.5" />
//                 <stop offset="100%" stopColor="#ffaa00" stopOpacity="0.3" />
//               </linearGradient>

//               <filter id="glow">
//                 <feGaussianBlur stdDeviation="3" result="coloredBlur" />
//                 <feMerge>
//                   <feMergeNode in="coloredBlur" />
//                   <feMergeNode in="SourceGraphic" />
//                 </feMerge>
//               </filter>
//             </defs>

//             {/* Path */}
//             <path
//               d={pathString}
//               stroke="url(#pathGradient)"
//               className="fill-none stroke-[3] stroke-dasharray-[10,5] animate-dash-move drop-shadow-[0_0_5px_currentColor]"
//             />

//             {/* Stops */}
//             {generatePath.map((point) => {
//               const color = getEventTypeColor(point.event.type);
//               const isHovered = hoveredStop === point.event.id;
//               const isSelected = selectedStop?.id === point.event.id;

//               return (
//                 <g
//                   key={point.event.id}
//                   className="cursor-pointer transition-all duration-300"
//                   onClick={() => setSelectedStop(point.event)}
//                   onMouseEnter={() => setHoveredStop(point.event.id)}
//                   onMouseLeave={() => setHoveredStop(null)}
//                 >
//                   {/* Outer Ring */}
//                   <circle
//                     cx={point.x}
//                     cy={point.y}
//                     r={isHovered ? 25 : 20}
//                     fill="none"
//                     stroke={color}
//                     strokeWidth="2"
//                     opacity="0.5"
//                     filter="url(#glow)"
//                   />

//                   {/* Inner Glow */}
//                   <circle
//                     cx={point.x}
//                     cy={point.y}
//                     r="12"
//                     fill={color}
//                     filter="url(#glow)"
//                     className="animate-pulse"
//                   />

//                   {/* Dark Inner Background */}
//                   <circle cx={point.x} cy={point.y} r="10" fill="rgba(0,0,0,0.8)" />

//                   {/* Time Label */}
//                   <text
//                     x={point.x}
//                     y={point.y - 30}
//                     fill={color}
//                     fontSize="12"
//                     textAnchor="middle"
//                     fontWeight="bold"
//                   >
//                     {point.event.time}
//                   </text>
//                 </g>
//               );
//             })}
//           </svg>

//           {/* Event Details Popup */}
//           {selectedStop && (
//             <div
//               className="absolute left-1/2 top-1/2 z-50 w-[280px] -translate-x-1/2 -translate-y-1/2 animate-slide-in rounded-xl border-2 p-5"
//               style={{
//                 background:
//                   "linear-gradient(135deg, rgba(0,20,40,0.95) 0%, rgba(20,0,40,0.95) 100%)",
//                 borderColor: getEventTypeColor(selectedStop.type),
//                 boxShadow: "0 0 30px rgba(0,255,255,0.4)",
//               }}
//             >
//               <button
//                 onClick={() => setSelectedStop(null)}
//                 className="absolute top-2.5 right-2.5 flex h-6 w-6 items-center justify-center rounded-full border border-white/30 text-white/70 transition-all duration-300 hover:border-red-500/50 hover:bg-red-500/20 hover:text-red-500"
//               >
//                 ×
//               </button>

//               <div
//                 className="mb-2.5 text-xl font-bold uppercase tracking-wide"
//                 style={{ color: getEventTypeColor(selectedStop.type) }}
//               >
//                 {selectedStop.title}
//               </div>

//               <div className="mb-2.5 flex items-center gap-2 text-sm opacity-80">
//                 <Clock size={16} /> {selectedStop.time}
//               </div>

//               <div className="text-sm leading-relaxed opacity-90">
//                 {selectedStop.description}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SciFiEventMap;

import React, { useState, useMemo } from "react";
import { Calendar, Clock, MapPin, Zap, Cpu, Wifi, Globe } from "lucide-react";

const SciFiEventMap = () => {
  const [selectedStop, setSelectedStop] = useState(null);
  const [hoveredStop, setHoveredStop] = useState<number | null>(null);

  /** 🔹 Event Data */
  const events = useMemo(
    () => [
      {
        id: 1,
        title: "Neural Sync Assembly",
        time: "09:00",
        description: "Quantum consciousness integration workshop",
        type: "tech",
        icon: Cpu,
      },
      {
        id: 2,
        title: "Plasma Core Briefing",
        time: "11:30",
        description: "Energy matrix optimization protocols",
        type: "energy",
        icon: Zap,
      },
      {
        id: 3,
        title: "Cybernetic Enhancement Lab",
        time: "14:00",
        description: "Biotech augmentation demonstrations",
        type: "bio",
        icon: Wifi,
      },
      {
        id: 4,
        title: "Temporal Flux Analysis",
        time: "16:45",
        description: "Chronospace distortion patterns review",
        type: "temporal",
        icon: Clock,
      },
      {
        id: 5,
        title: "Holomatrix Conference",
        time: "19:00",
        description: "Virtual reality ecosystem summit",
        type: "virtual",
        icon: Globe,
      },
      {
        id: 6,
        title: "Nanotech Synthesis",
        time: "21:30",
        description: "Molecular reconstruction experiments",
        type: "nano",
        icon: MapPin,
      },
      {
        id: 7,
        title: "Neural Sync Assembly",
        time: "09:00",
        description: "Quantum consciousness integration workshop",
        type: "tech",
        icon: Cpu,
      },
      {
        id: 8,
        title: "Plasma Core Briefing",
        time: "11:30",
        description: "Energy matrix optimization protocols",
        type: "energy",
        icon: Zap,
      },
      {
        id: 9,
        title: "Cybernetic Enhancement Lab",
        time: "14:00",
        description: "Biotech augmentation demonstrations",
        type: "bio",
        icon: Wifi,
      },
      {
        id: 10,
        title: "Temporal Flux Analysis",
        time: "16:45",
        description: "Chronospace distortion patterns review",
        type: "temporal",
        icon: Clock,
      },
      {
        id: 11,
        title: "Holomatrix Conference",
        time: "19:00",
        description: "Virtual reality ecosystem summit",
        type: "virtual",
        icon: Globe,
      },
      {
        id: 12,
        title: "Nanotech Synthesis",
        time: "21:30",
        description: "Molecular reconstruction experiments",
        type: "nano",
        icon: MapPin,
      },
    ],
    []
  );

  /** 🔹 Generate evenly spaced zigzag path points */
const generatePath = useMemo(() => {
  const width = 900;
  const height = 400;
  const xStart = 150;
  const xEnd = 750;

  return events.map((event, i) => {
    const progress = i / (events.length - 1);
    const x = xStart + (xEnd - xStart) * progress;
    // Smooth S-curve zigzag pattern
    const zigzagAmplitude = 100;
    const yOffset = Math.sin(progress * Math.PI * 6) * zigzagAmplitude;
    const y = height / 2 + yOffset;

    return {
      x,
      y,
      event,
    };
  });
}, [events]);

  /** 🔹 Create SVG path string */
  const pathString = useMemo(() => {
    if (generatePath.length < 2) return "";

    let path = `M ${generatePath[0].x} ${generatePath[0].y}`;
    for (let i = 1; i < generatePath.length; i++) {
      const prev = generatePath[i - 1];
      const curr = generatePath[i];
      const controlX = prev.x + (curr.x - prev.x) * 0.5;

      path += ` C ${controlX} ${prev.y}, ${controlX} ${curr.y}, ${curr.x} ${curr.y}`;
    }
    return path;
  }, [generatePath]);

  /** 🔹 Event type colors */
  const getEventTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      tech: "#00ffff",
      energy: "#ff00ff",
      bio: "#00ff00",
      temporal: "#ffaa00",
      virtual: "#aa00ff",
      nano: "#ff0066",
    };
    return colors[type] || "#ffffff";
  };

  return (
    <div className="relative h-screen overflow-hidden bg-gradient-to-br from-[#0a0e1a] to-[#1a0e2e] p-5 font-mono flex items-center justify-center">
      {/* Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />

      {/* Scan Lines */}
      <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,255,255,0.03)_2px,rgba(0,255,255,0.03)_4px)]" />

      {/* Main Container */}
      <div className="relative w-full max-w-[1000px] h-[90vh] rounded-2xl border-2 border-cyan-500/30 bg-[#001428]/50 p-5 shadow-[0_0_50px_rgba(0,255,255,0.2),inset_0_0_50px_rgba(0,255,255,0.05)] flex flex-col">
        <h1 className="mb-1 text-center text-4xl font-bold uppercase tracking-widest text-cyan-400 md:text-3xl animate-pulse-slow">
          OJASS'26 Timeline
        </h1>
        <p className="mb-4 text-center text-xs tracking-wider text-cyan-200/60">
          SYSTEM DATE: 2157.03.15 | SECTOR: ALPHA-7
        </p>

        {/* Timeline SVG */}
        <div className="relative flex-1 flex items-center justify-center">
          <svg
            className="w-full h-full max-h-[500px] drop-shadow-[0_0_10px_rgba(0,255,255,0.3)]"
            viewBox="0 0 900 400"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00ffff" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#ff00ff" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#ffaa00" stopOpacity="0.3" />
              </linearGradient>

              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Path */}
            <path
              d={pathString}
              stroke="url(#pathGradient)"
              className="fill-none stroke-[3] stroke-dasharray-[10,5] animate-dash-move drop-shadow-[0_0_5px_currentColor]"
            />

            {/* Stops */}
            {generatePath.map((point) => {
              const color = getEventTypeColor(point.event.type);
              const isHovered = hoveredStop === point.event.id;
              const isSelected = selectedStop?.id === point.event.id;

              return (
                <g
                  key={point.event.id}
                  className="cursor-pointer transition-all duration-300"
                  onClick={() => setSelectedStop(point.event)}
                  onMouseEnter={() => setHoveredStop(point.event.id)}
                  onMouseLeave={() => setHoveredStop(null)}
                >
                  {/* Outer Ring */}
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={isHovered ? 25 : 20}
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    opacity="0.5"
                    filter="url(#glow)"
                  />

                  {/* Inner Glow */}
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="12"
                    fill={color}
                    filter="url(#glow)"
                    className="animate-pulse"
                  />

                  {/* Dark Inner Background */}
                  <circle cx={point.x} cy={point.y} r="10" fill="rgba(0,0,0,0.8)" />

                  {/* Time Label */}
                  <text
                    x={point.x}
                    y={point.y - 30}
                    fill={color}
                    fontSize="12"
                    textAnchor="middle"
                    fontWeight="bold"
                  >
                    {point.event.time}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Event Details Popup */}
          {selectedStop && (
            <div
              className="absolute left-1/2 top-1/2 z-50 w-[280px] -translate-x-1/2 -translate-y-1/2 animate-slide-in rounded-xl border-2 p-5"
              style={{
                background:
                  "linear-gradient(135deg, rgba(0,20,40,0.95) 0%, rgba(20,0,40,0.95) 100%)",
                borderColor: getEventTypeColor(selectedStop.type),
                boxShadow: "0 0 30px rgba(0,255,255,0.4)",
              }}
            >
              <button
                onClick={() => setSelectedStop(null)}
                className="absolute top-2.5 right-2.5 flex h-6 w-6 items-center justify-center rounded-full border border-white/30 text-white/70 transition-all duration-300 hover:border-red-500/50 hover:bg-red-500/20 hover:text-red-500"
              >
                ×
              </button>

              <div
                className="mb-2.5 text-xl font-bold uppercase tracking-wide"
                style={{ color: getEventTypeColor(selectedStop.type) }}
              >
                {selectedStop.title}
              </div>

              <div className="mb-2.5 flex items-center gap-2 text-sm opacity-80">
                <Clock size={16} /> {selectedStop.time}
              </div>

              <div className="text-sm leading-relaxed opacity-90">
                {selectedStop.description}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SciFiEventMap;