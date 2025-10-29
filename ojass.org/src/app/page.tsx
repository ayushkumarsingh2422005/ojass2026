"use client";

import { useEffect, useRef } from "react";

export default function Home() {
    const bgRef = useRef<HTMLDivElement>(null);
    const layer2Ref = useRef<HTMLDivElement>(null);
    const layer3Ref = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const maxScroll =
                document.documentElement.scrollHeight - window.innerHeight;
            const scrollProgress = scrollY / maxScroll;

            // More extreme parallax with scale effect
            const bgOffset = scrollY * 0.2;
            const bgScale = 1 + scrollProgress * 0.15;

            const layer2Offset = scrollY * 0.45;
            const layer2Scale = 1 + scrollProgress * 0.1;

            const layer3Offset = scrollY * 0.65;
            const layer3Scale = 1 + scrollProgress * 0.08;

            const bottomOffset = scrollY * 0.85;
            const bottomScale = 1 + scrollProgress * 0.05;

            // Add subtle rotation for 3D effect
            const rotX = scrollProgress * 3;

            if (bgRef.current) {
                bgRef.current.style.transform = `translateY(${bgOffset}px) scale(${bgScale}) rotateX(${rotX}deg)`;
            }
            if (layer2Ref.current) {
                layer2Ref.current.style.transform = `translateY(${layer2Offset}px) scale(${layer2Scale})`;
            }
            if (layer3Ref.current) {
                layer3Ref.current.style.transform = `translateY(${layer3Offset}px) scale(${layer3Scale})`;
            }
            if (bottomRef.current) {
                bottomRef.current.style.transform = `translateY(${bottomOffset}px) scale(${bottomScale})`;
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div
            className="w-full bg-black overflow-x-hidden"
            style={{ perspective: "1200px" }}>
            <div
                className="relative w-full h-screen bg-black overflow-hidden"
                style={{
                    perspective: "1200px",
                    transformStyle: "preserve-3d",
                }}>
                <div
                    ref={bgRef}
                    className="absolute top-0 left-0"
                    style={{
                        width: "100%",
                        height: "120vh",
                        backgroundImage: "url(/layers/bg.jpg)",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        filter: "blur(2px)",
                        willChange: "transform",
                    }}></div>

                <div
                    ref={layer2Ref}
                    className="absolute bottom-[10vh] left-0"
                    style={{
                        width: "100%",
                        height: "70vh",
                        backgroundImage: "url(/layers/layer2.png)",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        filter: "blur(1px)",
                        willChange: "transform",
                    }}></div>

                <div
                    ref={layer3Ref}
                    className="absolute bottom-[7vh] left-0"
                    style={{
                        width: "100%",
                        height: "80vh",
                        backgroundImage: "url(/layers/layer3.png)",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        willChange: "transform",
                    }}></div>

                <div
                    ref={bottomRef}
                    className="absolute -bottom-[10vh] left-0 z-50"
                    style={{
                        width: "100%",
                        height: "40vh",
                        backgroundImage: "url(/layers/bottom.svg)",
                        backgroundSize: "cover",
                        backgroundPosition: "top left",
                        backgroundRepeat: "no-repeat",
                        willChange: "transform",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}>
                    <div
                        style={{
                            fontSize: "120px",
                            fontWeight: "bold",
                            color: "rgba(255, 255, 255, 0.9)",
                            textShadow:
                                "0 0 40px rgba(59, 130, 246, 0.8), 0 0 80px rgba(59, 130, 246, 0.4)",
                            letterSpacing: "10px",
                            fontFamily: "monospace",
                            animation: "glow 2s ease-in-out infinite",
                        }}>
                        OJASS 26
                    </div>
                    <style>{`
            @keyframes glow {
              0%, 100% {
                textShadow: 0 0 40px rgba(59, 130, 246, 0.8), 0 0 80px rgba(59, 130, 246, 0.4);
              }
              50% {
                textShadow: 0 0 60px rgba(59, 130, 246, 1), 0 0 120px rgba(59, 130, 246, 0.6);
              }
            }
          `}</style>
                </div>
            </div>

            {/* Scrollable content */}
            <div className="relative z-20 bg-black/85 backdrop-blur-sm">
                <div className="min-h-screen flex items-center justify-center border-b border-white/10">
                    <div className="text-center text-white px-8">
                        <h1 className="text-7xl font-bold mb-4">OJASS 2026</h1>
                        <p className="text-3xl text-blue-400 font-semibold mb-6">
                            Annual Techno-Management Fest
                        </p>
                        <p className="text-xl text-gray-300">
                            NIT Jamshedpur • February 14-16, 2026
                        </p>
                    </div>
                </div>

                <div className="min-h-screen flex items-center justify-center border-b border-white/10">
                    <div className="max-w-3xl text-white px-8">
                        <h2 className="text-5xl font-bold mb-6">About OJASS</h2>
                        <p className="text-lg text-gray-300 leading-relaxed mb-4">
                            OJASS is the annual techno-management fest of NIT
                            Jamshedpur, started in 2004 and originally called
                            Pravah until 2007 when it adopted its present name
                            meaning "vigour". Since then, the festival has grown
                            exponentially.
                        </p>
                        <p className="text-lg text-gray-300 leading-relaxed mb-4">
                            Standing as the second largest event of its kind in
                            Eastern India with over 8000+ footfall, OJASS
                            features a prize pool of INR 8 lakhs and hosts over
                            40+ diverse competitions during its 3-day
                            extravaganza.
                        </p>
                        <p className="text-lg text-gray-300 leading-relaxed">
                            A platform where curiosity meets innovation, OJASS
                            brings together students, professionals, educators,
                            and artists from top colleges across the nation.
                        </p>
                    </div>
                </div>

                <div className="min-h-screen flex items-center justify-center border-b border-white/10">
                    <div className="max-w-4xl text-white px-8">
                        <h2 className="text-5xl font-bold mb-8">
                            Event Clusters
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-blue-900/30 border border-blue-500/30 p-6 rounded-lg hover:border-blue-500/60 transition">
                                <h3 className="text-2xl font-bold mb-2 text-blue-400">
                                    Programming
                                </h3>
                                <p className="text-gray-300">
                                    A journey through coding, algorithmic
                                    challenges, and competitive programming
                                    adventures
                                </p>
                            </div>
                            <div className="bg-purple-900/30 border border-purple-500/30 p-6 rounded-lg hover:border-purple-500/60 transition">
                                <h3 className="text-2xl font-bold mb-2 text-purple-400">
                                    Robotics
                                </h3>
                                <p className="text-gray-300">
                                    Robo Wars, Electrospection, and innovative
                                    mechanical projects
                                </p>
                            </div>
                            <div className="bg-green-900/30 border border-green-500/30 p-6 rounded-lg hover:border-green-500/60 transition">
                                <h3 className="text-2xl font-bold mb-2 text-green-400">
                                    Gaming
                                </h3>
                                <p className="text-gray-300">
                                    BGMI, Valorant, Chess tournaments and
                                    esports competitions
                                </p>
                            </div>
                            <div className="bg-orange-900/30 border border-orange-500/30 p-6 rounded-lg hover:border-orange-500/60 transition">
                                <h3 className="text-2xl font-bold mb-2 text-orange-400">
                                    Management
                                </h3>
                                <p className="text-gray-300">
                                    Mock Stock, Crypto Clash, Business
                                    Simulation Challenge
                                </p>
                            </div>
                            <div className="bg-red-900/30 border border-red-500/30 p-6 rounded-lg hover:border-red-500/60 transition">
                                <h3 className="text-2xl font-bold mb-2 text-red-400">
                                    Innovation
                                </h3>
                                <p className="text-gray-300">
                                    Hack de Science, Paper Presentations,
                                    Innovative Projects
                                </p>
                            </div>
                            <div className="bg-cyan-900/30 border border-cyan-500/30 p-6 rounded-lg hover:border-cyan-500/60 transition">
                                <h3 className="text-2xl font-bold mb-2 text-cyan-400">
                                    Workshops
                                </h3>
                                <p className="text-gray-300">
                                    Expert-led sessions on latest technology
                                    trends and domains
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="min-h-screen flex items-center justify-center border-b border-white/10">
                    <div className="max-w-3xl text-white px-8">
                        <h2 className="text-5xl font-bold mb-8">
                            Day 1 Highlights
                        </h2>
                        <div className="space-y-4">
                            <div className="border-l-4 border-blue-500 pl-6 py-2">
                                <h3 className="text-xl font-bold mb-1">
                                    Tech Events
                                </h3>
                                <p className="text-gray-300">
                                    Robo Wars, Electrospection, Hack de Science,
                                    Cansys
                                </p>
                            </div>
                            <div className="border-l-4 border-purple-500 pl-6 py-2">
                                <h3 className="text-xl font-bold mb-1">
                                    Management Events
                                </h3>
                                <p className="text-gray-300">
                                    Mock Stock, Crypto Clash, Business
                                    Simulation Challenge
                                </p>
                            </div>
                            <div className="border-l-4 border-green-500 pl-6 py-2">
                                <h3 className="text-xl font-bold mb-1">
                                    Gaming & Leisure
                                </h3>
                                <p className="text-gray-300">
                                    BGMI Showdown, Chess Tournament, Wax Comb
                                    Challenge
                                </p>
                            </div>
                            <div className="border-l-4 border-yellow-500 pl-6 py-2">
                                <h3 className="text-xl font-bold mb-1">
                                    Guest Lecture
                                </h3>
                                <p className="text-gray-300">
                                    Dr. Yogesh N. Dhoble - Sustainable
                                    Innovation through Material Science
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="min-h-screen flex items-center justify-center border-b border-white/10">
                    <div className="max-w-3xl text-white px-8">
                        <h2 className="text-5xl font-bold mb-8">
                            Special Sessions
                        </h2>
                        <div className="space-y-6">
                            <div className="bg-white/5 border border-white/10 p-6 rounded-lg">
                                <h3 className="text-2xl font-bold text-blue-400 mb-2">
                                    Day 2: Striver's Coding Masterclass
                                </h3>
                                <p className="text-gray-300">
                                    Raj Vikramaditya, legendary YouTuber and
                                    competitive programming guru, shares
                                    insights on problem-solving and coding
                                    strategies
                                </p>
                            </div>
                            <div className="bg-white/5 border border-white/10 p-6 rounded-lg">
                                <h3 className="text-2xl font-bold text-purple-400 mb-2">
                                    Day 2: Comedy Night
                                </h3>
                                <p className="text-gray-300">
                                    Ashish Solanki brings stand-up comedy and
                                    entertainment to light up the evening
                                </p>
                            </div>
                            <div className="bg-white/5 border border-white/10 p-6 rounded-lg">
                                <h3 className="text-2xl font-bold text-green-400 mb-2">
                                    Day 3: Robo Rumble Finals
                                </h3>
                                <p className="text-gray-300">
                                    High-stakes robotics competition with teams
                                    showcasing their mechanical prowess
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center text-white px-8">
                        <h2 className="text-5xl font-bold mb-4">
                            Prize Pool: ₹8 Lakhs
                        </h2>
                        <p className="text-2xl text-gray-300 mb-8">
                            40+ Events • 3 Days • Unlimited Innovation
                        </p>
                        <button className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-lg text-xl font-bold transition">
                            View All Events
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
