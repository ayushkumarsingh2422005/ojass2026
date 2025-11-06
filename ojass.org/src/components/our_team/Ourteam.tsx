
'use client';

import Image from 'next/image';
import { useState } from 'react';

interface TeamMember {
    name: string;
    title: string;
    image: string;
}

const teamMembers: TeamMember[] = [
    { name: 'Ayush singh', title: 'Directeur artistique digital', image: '/team/simon.jpg' },
    { name: 'Mohak Raj', title: 'CEO associé', image: '/team/matthieu.jpg' },
    { name: 'Tanishk pandey', title: 'Développeur back associé', image: '/team/olivier.jpg' },
    { name: 'Utkarsh singh', title: 'Directrice marketing', image: '/team/emma.jpg' },
    { name: 'Ruchika sinha', title: 'Développeur front-end', image: '/team/lucas.jpg' },
    { name: 'Aditi Raj', title: 'Designer UI/UX', image: '/team/sophie.jpg' },
    { name: 'Kriti', title: 'Responsable produit', image: '/team/alexandre.jpg' },
    { name: 'Neha kumari', title: 'Chargée de communication', image: '/team/julie.jpg' },
    { name: 'Aditya Raj', title: 'Ingénieur DevOps', image: '/team/pierre.jpg' },
];

export default function TeamPage() {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    return (
        <main className=" relative  min-h-screen bg-gradient-to-b  py-16 px-4 sm:px-6 lg:px-8 ">
            {/* Section Header */}
            <video
                autoPlay
                loop
                muted
                playsInline // <-- Added this for mobile
                className="absolute inset-0 w-screen h-full object-cover z-[-1] " // <-- Set z-index to -2
                src="/events/spacebackground1.mp4"
            >
                {/* Optional: Add source tags for better compatibility */}
                <source src="/events/spacebackground.mp4" type="video/mp4" />
            </video>

            <header className="max-w-3xl  text-center mb-12 sm:mb-16 mx-auto ">
                <h1 className="text-3xl sm:text-4xl md:text-5xl  text-cyan-400 tracking-widest font-bold">
                    CREW-OJASS2026
                </h1>
            </header>

            {/* Responsive Grid */}
            
            <section className="  max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-16 justify-center">
                {teamMembers.map((member, index) => {
                    const isHovered = hoveredIndex === index;

                    return (
                        <article
                            key={index}
                            className={`
                relative group
                transition-transform duration-500 ease-out
             
                mx-auto 
                /* --- 1. Mobile (grid-cols-2) --- */
                /* Targets the 2nd, 4th, 6th item */
                even:translate-y-12
                
                /* --- 2. Tablet+ (sm:grid-cols-3) --- */
                /* Reset the mobile 'even' rule */
                sm:even:translate-y-0
                
                /* Target the 2nd, 5th, 8th item (middle column) */
               
                  sm:[&:nth-child(2n)]:translate-y-20
                    sm:[&:nth-child(2n+1)]:translate-y-10
              `}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            {/* Fixed Size Image Container */}
                            <div
                                className={`
                  relative 
                  w-[120px] h-[280px] 
                  sm:w-[140px] sm:h-[320px] 
                  lg:w-[150px] lg:h-[320px]
                  overflow-hidden shadow-2xl
                  transition-transform duration-500 ease-out
                  ${isHovered ? '-translate-y-2' : ''}
                  gap-24
                `}
                            >
                                <Image
                                    src="/events/spider.png"
                                    alt={member.name}
                                    fill
                                    className="object-cover object-center"
                                    sizes="(max-width: 640px) 120px, (max-width: 1024px) 140px, 150px"
                                    placeholder="blur"
                                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+4PAAL+AZD0vGZoAAAAAElFTkSuQmCC"
                                />

                                {/* Progressive Blur: Clear top → Blurry bottom */}
                                <div
                                    className="absolute inset-0 pointer-events-none"
                                    style={{
                                        background: `linear-gradient(
                      to bottom,
                      transparent 0%,
                      rgba(0, 0, 0, 0.1) 30%,
                      rgba(0, 0, 0, 0.3) 60%,
                      rgba(0, 0, 0, 0.6) 100%
                    )`,
                                        mixBlendMode: 'multiply',
                                    }}
                                />

                                {/* Hover Dark Overlay */}
                                <div
                                    className={`
                    absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent
                    opacity-0 transition-opacity duration-500
                    ${isHovered ? 'opacity-100' : ''}
                  `}
                                />
                            </div>

                            {/* Name & Title: Half inside (bottom), Half outside (left) */}
                            <div
                                className={`
                  absolute bottom-0 left-0 
                  w-[150%] -translate-x-1/4
                 
                  backdrop-blur-md 
                  p-3 sm:p-4 
                  rounded-r-2xl
                 
                  transition-all duration-500
                  ${isHovered ? 'translate-y-1' : 'translate-y-4'}
                `}
                            >
                                <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-white tracking-wide">
                                    {member.name}
                                </h3>
                                <p className="text-xs sm:text-sm text-cyan-300 font-light mt-0.5">
                                    {member.title}
                                </p>
                            </div>
                        </article>
                    );
                })}
            </section>

            {/* Extra space */}
            <div className="h-20 sm:h-32 lg:h-40" />
        </main>
    );
}