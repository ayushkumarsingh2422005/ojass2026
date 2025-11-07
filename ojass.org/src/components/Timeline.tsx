import React, { useState, useRef, useEffect } from "react";
import {
    motion,
    AnimatePresence,
    useMotionValue,
    useSpring,
} from "framer-motion";
import {
    Calendar,
    Coffee,
    Book,
    Briefcase,
    Home,
    Users,
    Moon,
    Sun,
    Star,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const DAY_POSITIONS = { 1: 0, 2: 120, 3: 240 };

const TimelinePage = () => {
    const [selectedDay, setSelectedDay] = useState(1);
    const [isAnimating, setIsAnimating] = useState(false);
    const [angle, setAngle] = useState(0);
    const [isThrottled, setIsThrottled] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const { theme } = useTheme();

    const startAngleRef = useRef(0);
    const currentAngleRef = useRef(0);
    const svgContainerRef = useRef<SVGSVGElement | null>(null);
    const textContainerRef = useRef<HTMLDivElement | null>(null);
    const prevDayRef = useRef(selectedDay);
    const throttleDelay = 1000;

    const direction = selectedDay > prevDayRef.current ? "left" : "right";
    useEffect(() => {
        prevDayRef.current = selectedDay;
    }, [selectedDay]);

    // Timeline data for 3 days
    const timelineData = {
        1: {
            title: "Day 1 - Monday",
            events: [
                {
                    time: "08:00",
                    title: "Morning Coffee",
                    description: "Start the day with team standup",
                    icon: Coffee,
                },
                {
                    time: "10:00",
                    title: "Project Meeting",
                    description: "Discuss Q4 roadmap",
                    icon: Briefcase,
                },
                {
                    time: "12:30",
                    title: "Lunch Break",
                    description: "Team lunch at downtown",
                    icon: Sun,
                },
                {
                    time: "15:00",
                    title: "Workshop",
                    description: "React best practices session",
                    icon: Book,
                },
                {
                    time: "18:00",
                    title: "Wrap up",
                    description: "Review daily goals",
                    icon: Home,
                },
            ],
        },
        2: {
            title: "Day 2 - Tuesday",
            events: [
                {
                    time: "09:00",
                    title: "Team Sync",
                    description: "Weekly planning session",
                    icon: Users,
                },
                {
                    time: "11:00",
                    title: "Client Call",
                    description: "Product demo presentation",
                    icon: Briefcase,
                },
                {
                    time: "13:00",
                    title: "Lunch & Learn",
                    description: "AI in web development",
                    icon: Book,
                },
                {
                    time: "16:00",
                    title: "Code Review",
                    description: "PR reviews and feedback",
                    icon: Star,
                },
                {
                    time: "19:00",
                    title: "Evening Yoga",
                    description: "Team wellness activity",
                    icon: Moon,
                },
            ],
        },
        3: {
            title: "Day 3 - Wednesday",
            events: [
                {
                    time: "08:30",
                    title: "Early Bird",
                    description: "Documentation updates",
                    icon: Sun,
                },
                {
                    time: "10:30",
                    title: "Design Review",
                    description: "UI/UX feedback session",
                    icon: Star,
                },
                {
                    time: "12:00",
                    title: "Birthday Celebration",
                    description: "Team member's birthday",
                    icon: Coffee,
                },
                {
                    time: "14:30",
                    title: "Sprint Planning",
                    description: "Next sprint preparation",
                    icon: Calendar,
                },
                {
                    time: "17:30",
                    title: "Happy Hour",
                    description: "Team bonding time",
                    icon: Users,
                },
            ],
        },
    };

    // Day labels for the dial (only 3 days)
    const dayLabels = [
        { angle: 0, day: 1, label: "DAY 1", subtext: "Monday" },
        { angle: 120, day: 2, label: "DAY 2", subtext: "Tuesday" },
        { angle: 240, day: 3, label: "DAY 3", subtext: "Wednesday" },
    ];

    // Handle rotation
    const rotate = (dir: number) => {
        if (isAnimating) return;

        const newAngle = angle + dir * 120;
        setAngle(newAngle);
        currentAngleRef.current = newAngle;

        const normalizedAngle = ((newAngle % 360 + 360) % 360);
        const newDay = normalizedAngle === 0 ? 1 : normalizedAngle === 120 ? 2 : 3;

        if (newDay !== selectedDay) {
            setIsAnimating(true);
            setTimeout(() => {
                setSelectedDay(newDay);
                setTimeout(() => {
                    setIsAnimating(false);
                }, 600);
            }, 100);
        }
    };

    const handleWheel = (e: any) => {
        e.preventDefault();
        if (isThrottled || isAnimating) return;

        const direction = Math.abs(e.deltaX) > Math.abs(e.deltaY)
            ? Math.sign(e.deltaX)
            : Math.sign(e.deltaY);

        if (direction !== 0) {
            setIsThrottled(true);
            rotate(direction);
            setTimeout(() => setIsThrottled(false), throttleDelay);
        }
    };

    const getAngle = (x: number, y: number, rect: any) => {
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        return Math.atan2(y - cy, x - cx) * (180 / Math.PI);
    };

    const handleMouseDown = (e: any) => {
        if (isThrottled || isAnimating) return;
        setIsDragging(true);
        const rect = e.currentTarget.getBoundingClientRect();
        startAngleRef.current = getAngle(e.clientX, e.clientY, rect);
        currentAngleRef.current = angle;
    };

    const handleMouseMove = (e: any) => {
        if (!isDragging) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const delta = getAngle(e.clientX, e.clientY, rect) - startAngleRef.current;
        const newAngle = currentAngleRef.current + delta;
        setAngle(newAngle);
    };

    const handleMouseUp = () => {
        if (!isDragging) return;
        setIsDragging(false);
        const snap = Math.round(angle / 120) * 120;
        setAngle(snap);
        currentAngleRef.current = snap;

        const normalizedAngle = ((snap % 360 + 360) % 360);
        const newDay = normalizedAngle === 0 ? 1 : normalizedAngle === 120 ? 2 : 3;

        if (newDay !== selectedDay && !isAnimating) {
            setIsAnimating(true);
            setTimeout(() => {
                setSelectedDay(newDay);
                setTimeout(() => {
                    setIsAnimating(false);
                }, 600);
            }, 100);
        }
    };

    const currentIndex = () => {
        const normalizedAngle = ((angle % 360 + 360) % 360);
        return normalizedAngle === 0 ? 0 : normalizedAngle === 120 ? 1 : 2;
    };

    // Page-level variants
    const pageVariants = {
        initial: (custom: any) => ({
            x: custom.direction === "left" ? "-20vw" : "20vw",
            rotate: custom.direction === "left" ? -5 : 5,
            opacity: 0,
        }),
        animate: {
            x: 0,
            rotate: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 20,
                duration: 0.6,
            },
        },
        exit: (custom: any) => ({
            x: custom.direction === "left" ? "20vw" : "-20vw",
            rotate: custom.direction === "left" ? 5 : -5,
            opacity: 0,
            transition: { duration: 0.45, ease: "easeInOut" },
        }),
    };

    const eventVariants = {
        initial: { opacity: 0, y: 20 },
        animate: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.1, duration: 0.4 },
        }),
    };

    return (
        <div className="min-h-screen relative overflow-hidden ">
            {/* Animated Background and Content */}
            <AnimatePresence mode="wait" custom={{ direction }}>
                <motion.div
                    key={selectedDay}
                    custom={{ direction }}
                    variants={pageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 absolute inset-0">

                    {/* Background decoration */}
                    <div className="absolute inset-0">
                        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                        <div className="absolute top-40 right-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                    </div>

                    {/* Main Timeline Content */}
                    <div className="relative z-10 container mx-auto px-4 pt-8 pb-64">
                        <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-12">
                            Timeline Navigator
                        </h1>

                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-8 text-center">
                                {timelineData[selectedDay].title}
                            </h2>

                            <div className="relative">
                                {/* Timeline line */}
                                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-400 via-blue-400 to-purple-400"></div>

                                {/* Events */}
                                {timelineData[selectedDay].events.map((event, index) => {
                                    const Icon = event.icon;
                                    return (
                                        <motion.div
                                            key={index}
                                            custom={index}
                                            variants={eventVariants}
                                            initial="initial"
                                            animate="animate"
                                            className="relative flex items-start mb-8 group">
                                            {/* Timeline dot */}
                                            <div className="absolute left-8 w-4 h-4 bg-white rounded-full transform -translate-x-1/2 ring-4 ring-purple-400 group-hover:ring-blue-400 transition-all duration-300"></div>

                                            {/* Event card */}
                                            <div className="ml-20 bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl flex-1">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <Icon className="w-5 h-5 text-purple-300" />
                                                            <span className="text-sm text-blue-300 font-semibold">
                                                                {event.time}
                                                            </span>
                                                        </div>
                                                        <h3 className="text-xl font-semibold text-white mb-2">
                                                            {event.title}
                                                        </h3>
                                                        <p className="text-gray-300">
                                                            {event.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Fixed Dial at Bottom */}
            <div className="fixed bottom-0 left-0 right-0 z-11">
                <div
                    className="relative w-[350px] h-[350px] mx-auto"
                    onWheel={handleWheel}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    style={{
                        cursor: isDragging ? "grabbing" : "grab",
                        marginBottom: "-235px",
                        marginTop: "20px"
                    }}
                >
                    <svg
                        viewBox="0 0 538 538"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        ref={svgContainerRef}
                        style={{
                            width: '100%',
                            height: '100%',
                            transform: `rotate(${angle}deg)`,
                            transitionDuration: isDragging ? '0s' : '1s',
                            pointerEvents: 'none',
                            filter: theme === 'utopia'
                                ? 'drop-shadow(0 0 30px rgba(0, 255, 255, 0.4))'
                                : 'drop-shadow(0 0 30px rgba(139, 0, 0, 0.5))',
                        }}
                        className='absolute top-0 left-0'
                    >
                        <defs>
                            <clipPath id="clip0_1_4">
                                <rect width="538" height="538" fill="white" />
                            </clipPath>


                            <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                {theme === 'utopia' ? (
                                    <>
                                        <stop offset="0%" stopColor="#00ffff" stopOpacity="0.9" />
                                        <stop offset="50%" stopColor="#0088ff" stopOpacity="0.7" />
                                        <stop offset="100%" stopColor="#00ffff" stopOpacity="0.9" />
                                    </>
                                ) : (
                                    <>
                                        <stop offset="0%" stopColor="#ff0000" stopOpacity="0.9" />
                                        <stop offset="50%" stopColor="#8B0000" stopOpacity="0.7" />
                                        <stop offset="100%" stopColor="#ff0000" stopOpacity="0.9" />
                                    </>
                                )}
                            </linearGradient>

                            <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                                {theme === 'utopia' ? (
                                    <>
                                        <stop offset="0%" stopColor="#00ffff" stopOpacity="0.4" />
                                        <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                                    </>
                                ) : (
                                    <>
                                        <stop offset="0%" stopColor="#ff0000" stopOpacity="0.4" />
                                        <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                                    </>
                                )}
                            </radialGradient>

                            <filter id="glow" x="-60%" y="-120%" width="220%" height="300%">
                                <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur1" />
                                <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur2" />
                                <feBlend in="blur1" in2="blur2" mode="lighten" />
                                <feMerge>
                                    <feMergeNode in="blur2" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>


                            <filter id="strongGlow" x="-60%" y="-120%" width="220%" height="300%">
                                <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur1" />
                                <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur2" />
                                <feBlend in="blur1" in2="blur2" mode="lighten" />
                                <feMerge>
                                    <feMergeNode in="blur2" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>

                            <pattern id="techGrid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                                <path
                                    d="M 20 0 L 0 0 0 20"
                                    fill="none"
                                    stroke={theme === 'utopia' ? 'rgba(0,255,255,0.1)' : 'rgba(139,0,0,0.1)'}
                                    strokeWidth="0.5"
                                />
                            </pattern>

                            <pattern id="hexPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path
                                    d="M20,5 L30,15 L30,25 L20,35 L10,25 L10,15 Z"
                                    fill="none"
                                    stroke={theme === 'utopia' ? 'rgba(0,200,255,0.08)' : 'rgba(139,0,0,0.08)'}
                                    strokeWidth="0.5"
                                />
                            </pattern>
                        </defs>

                        <g clipPath="url(#clip0_1_4)">
                            {/* Background effects */}
                            <circle cx="269" cy="269" r="250" fill="url(#centerGlow)" />
                            <circle cx="269" cy="269" r="265" fill="url(#techGrid)" stroke="none" />
                            <circle cx="269" cy="269" r="230" fill="url(#hexPattern)" stroke="none" />

                            {/* Outer ring system */}
                            <circle cx="269" cy="269" r="265" stroke="url(#ringGradient)" strokeWidth="5" fill="none" filter="url(#strongGlow)" />
                            <circle cx="269" cy="269" r="265" stroke={theme === 'utopia' ? 'rgba(0,255,255,0.4)' : 'rgba(255,0,0,0.4)'} strokeWidth="2" fill="none" />
                            <circle cx="269" cy="269" r="268" stroke={theme === 'utopia' ? 'rgba(0,200,255,0.2)' : 'rgba(139,0,0,0.2)'} strokeWidth="1" fill="none" strokeDasharray="10,5" />

                            {/* Inner ring system */}
                            <circle cx="269" cy="269" r="192" stroke="url(#ringGradient)" strokeWidth="4" fill="none" filter="url(#glow)" />
                            <circle cx="269" cy="269" r="192" stroke={theme === 'utopia' ? 'rgba(0,255,255,0.3)' : 'rgba(255,0,0,0.3)'} strokeWidth="2" fill="none" />

                            {/* Additional decorative rings */}
                            <circle cx="269" cy="269" r="230" stroke={theme === 'utopia' ? 'rgba(0,200,255,0.2)' : 'rgba(139,0,0,0.2)'} strokeWidth="1.5" fill="none" strokeDasharray="8,4" />
                            <circle cx="269" cy="269" r="210" stroke={theme === 'utopia' ? 'rgba(0,200,255,0.15)' : 'rgba(139,0,0,0.15)'} strokeWidth="1" fill="none" strokeDasharray="4,4" />
                            <circle cx="269" cy="269" r="175" stroke={theme === 'utopia' ? 'rgba(0,150,255,0.1)' : 'rgba(100,0,0,0.1)'} strokeWidth="0.5" fill="none" strokeDasharray="3,3" />

                            {/* Timeline markers with enhanced glow */}
                            <line x1="465" y1="265" x2="538" y2="265" stroke="url(#ringGradient)" strokeWidth="6" filter="url(#strongGlow)" />
                            <line x1="465" y1="265" x2="538" y2="265" stroke={theme === 'utopia' ? 'rgba(0,255,255,0.6)' : 'rgba(255,0,0,0.6)'} strokeWidth="3" />

                            <line y1="265" x2="73" y2="265" stroke="url(#ringGradient)" strokeWidth="6" filter="url(#strongGlow)" />
                            <line y1="265" x2="73" y2="265" stroke={theme === 'utopia' ? 'rgba(0,255,255,0.6)' : 'rgba(255,0,0,0.6)'} strokeWidth="3" />

                            {/* Diagonal markers */}
                            <path d="M406.961 38.06L367 104" stroke="url(#ringGradient)" strokeWidth="4" filter="url(#glow)" />
                            <line x1="174.474" y1="439.982" x2="137.979" y2="503.951" stroke="url(#ringGradient)" strokeWidth="4" filter="url(#glow)" />
                            <line x1="371.497" y1="436.059" x2="407.002" y2="500.022" stroke="url(#ringGradient)" strokeWidth="4" filter="url(#glow)" />
                            <path d="M137.936 33.987L178.5 99.5" stroke="url(#ringGradient)" strokeWidth="4" filter="url(#glow)" />

                            {/* Energy nodes at endpoints */}
                            <circle cx="538" cy="265" r="8" fill={theme === 'utopia' ? '#00ffff' : '#ff0000'} filter="url(#strongGlow)" />
                            <circle cx="538" cy="265" r="5" fill={theme === 'utopia' ? '#ffffff' : '#ffcccc'} />

                            <circle cx="0" cy="265" r="8" fill={theme === 'utopia' ? '#00ffff' : '#ff0000'} filter="url(#strongGlow)" />
                            <circle cx="0" cy="265" r="5" fill={theme === 'utopia' ? '#ffffff' : '#ffcccc'} />

                            <circle cx="407" cy="38" r="6" fill={theme === 'utopia' ? '#00ddff' : '#ff3333'} filter="url(#glow)" />
                            <circle cx="138" cy="34" r="6" fill={theme === 'utopia' ? '#00ddff' : '#ff3333'} filter="url(#glow)" />
                            <circle cx="407" cy="500" r="6" fill={theme === 'utopia' ? '#00ddff' : '#ff3333'} filter="url(#glow)" />
                            <circle cx="138" cy="504" r="6" fill={theme === 'utopia' ? '#00ddff' : '#ff3333'} filter="url(#glow)" />

                            {/* Center power core */}
                            <circle cx="269" cy="269" r="35" fill={theme === 'utopia' ? 'rgba(0,255,255,0.05)' : 'rgba(255,0,0,0.05)'} stroke="url(#ringGradient)" strokeWidth="2" filter="url(#glow)" />
                            <circle cx="269" cy="269" r="25" fill={theme === 'utopia' ? 'rgba(0,200,255,0.15)' : 'rgba(200,0,0,0.15)'} stroke={theme === 'utopia' ? '#00ffff' : '#ff0000'} strokeWidth="2" filter="url(#glow)" />
                            <circle cx="269" cy="269" r="15" fill={theme === 'utopia' ? 'rgba(0,255,255,0.3)' : 'rgba(255,0,0,0.3)'} stroke={theme === 'utopia' ? '#00ffff' : '#ff0000'} strokeWidth="1.5" />
                            <circle cx="269" cy="269" r="8" fill={theme === 'utopia' ? '#00ffff' : '#ff0000'} filter="url(#strongGlow)" />
                            <circle cx="269" cy="269" r="4" fill={theme === 'utopia' ? '#ffffff' : '#ffffff'} />

                            {/* Tick marks around the dial */}
                            {[...Array(60)].map((_, i) => {
                                const tickAngle = (i * 6) * Math.PI / 180;
                                const innerR = i % 5 === 0 ? 240 : 250;
                                const outerR = 260;
                                const x1 = 269 + innerR * Math.cos(tickAngle);
                                const y1 = 269 + innerR * Math.sin(tickAngle);
                                const x2 = 269 + outerR * Math.cos(tickAngle);
                                const y2 = 269 + outerR * Math.sin(tickAngle);
                                return (
                                    <line
                                        key={i}
                                        x1={x1} y1={y1} x2={x2} y2={y2}
                                        stroke={theme === 'utopia' ? 'rgba(0,200,255,0.3)' : 'rgba(139,0,0,0.3)'}
                                        strokeWidth={i % 5 === 0 ? 2 : 0.5}
                                    />
                                );
                            })}
                        </g>
                    </svg>

                    {/* Day labels - positioned outside the rotating SVG */}
                    <div
                        ref={textContainerRef}
                        className="absolute top-0 left-0 w-full h-full pointer-events-none"
                    >
                        {dayLabels.map((day, index) => {
                            const labelAngle = (day.angle - angle) * Math.PI / 180;
                            const radius = 220;
                            const x = 175 + radius * Math.cos(labelAngle - Math.PI / 2);
                            const y = 175 + radius * Math.sin(labelAngle - Math.PI / 2);

                            const isActive = currentIndex() === index;

                            return (
                                <div
                                    key={index}
                                    className="absolute transition-all duration-1000"
                                    style={{
                                        left: `${x}px`,
                                        top: `${y}px`,
                                        transform: 'translate(-50%, -50%)',
                                        opacity: isActive ? 1 : 0.4,
                                    }}
                                >
                                    <div className="text-center">
                                        <div
                                            className={`font-mono font-bold mb-1 transition-all duration-500 text-cyan-400`}
                                            style={{
                                                fontSize: isActive ? '14px' : '11px',
                                                textShadow: isActive ? '0 0 20px rgba(147, 51, 234, 0.8)' : 'none'
                                            }}
                                        >
                                            {day.label}
                                        </div>
                                        <div
                                            className={`font-mono text-xs text-cyan-600`}
                                            style={{
                                                opacity: isActive ? 1 : 0.6,
                                                fontSize: '9px'
                                            }}
                                        >
                                            {day.subtext}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Invisible interaction zones */}
                    <div className='absolute top-0 left-0 h-full w-full flex'>
                        <div className='w-1/2' onClick={() => rotate(-1)}></div>
                        <div className='w-1/2' onClick={() => rotate(1)}></div>
                    </div>
                </div>

                {/* Drag hint */}
                {!isDragging && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 whitespace-nowrap">
                        Drag or scroll to rotate
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes blob {
                    0% {
                        transform: translate(0px, 0px) scale(1);
                    }
                    33% {
                        transform: translate(30px, -50px) scale(1.1);
                    }
                    66% {
                        transform: translate(-20px, 20px) scale(0.9);
                    }
                    100% {
                        transform: translate(0px, 0px) scale(1);
                    }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
            `}</style>
        </div>
    );
};

export default TimelinePage;