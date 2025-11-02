"use client"
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Swiper, SwiperSlide } from 'swiper/react';

import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import EventCard from '@/components/OverlayLayout/EventCard';
import Link from 'next/link';
import Dropdown from '@/components/OverlayLayout/Dropdown';


interface CardData {
  id: string;
  name: string; // <-- JSON se match karne ke liye 'name'
  description: string;
  img: string;
  redirect:string;
  // Baaki properties (jaise 'prizes', 'rules') add kar sakte hain, par zaroori nahi hai
}
type Props = {}

export default function Page({ }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [allEvents, setAllEvents] = useState<CardData[][]>([]);
  const [selectedEventIndex, setSelectedEventIndex] = useState<number>(0);

  useEffect(() => {
    // <-- FIX 1: Path ko 'public' folder ke root se fetch karein
    fetch('/event.json')
      .then(response => response.json())
      .then((data: CardData[][]) => {
        setAllEvents(data);
      })
      .catch(error => console.error("Error fetching event data:", error));
  }, []); // [] = Sirf ek baar component mount hone par chalega

  // Aapka GSAP animation wala useEffect (NO CHANGES)
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height
      const normalizedX = (x - 0.5) * 2
      const normalizedY = (y - 0.5) * 2

      const maxX = 40 // px
      const maxY = 20 // px
      const targetX = -normalizedX * maxX // opposite direction
      const targetY = -normalizedY * maxY // opposite direction

      gsap.to('#events-bg', {
        x: targetX,
        y: targetY,
        duration: 0.2,
        ease: 'none'
      })

      const fgMaxX = 10
      const fgMaxY = 5
      const fgX = -normalizedX * fgMaxX
      const fgY = -normalizedY * fgMaxY
      gsap.to('#events-fg', {
        x: fgX,
        y: fgY,
        duration: 0.2,
        ease: 'none'
      })
    }

    const handleMouseLeave = () => {
      gsap.to('#events-bg', { x: 0, y: 0, duration: 0.4, ease: 'power2.out' })
      gsap.to('#events-fg', { x: 0, y: 0, duration: 0.4, ease: 'power2.out' })
    }

    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  // State se data derive karna (NO CHANGES)
  const dropdownOptions = allEvents.map((_, index) => ({
    value: index,
    label: `Event ${index + 1}` // Aap yahaan title bhi de sakte hain
  }));

  const currentEventCards = allEvents[selectedEventIndex] || [];

  const handleDropdownChange = (newValue: string | number) => {
    setSelectedEventIndex(Number(newValue));
  };

  return (
    <div ref={containerRef} className='w-full h-screen relative overflow-hidden'>

      {/* Background/Foreground Images (NO CHANGES) */}
      <div id="events-bg" className="w-full h-full absolute bottom-10 left-0 scale-150 md:scale-80" style={{
        pointerEvents: 'none',
        // transform: "scale(0.8)"
      }}>
        <Image
          src="/events/bg_bg.png"
          alt="Event 1"
          width={1000}
          height={1000}
          className="w-full h-full object-cover object-center-bottom"
          style={{ objectPosition: "center center" }}
        />
      </div>

      <div id="events-fg" className="w-full h-full absolute bottom-0 left-0 pointer-events-none"
        style={{
          transform: "scale(1.1)",
        }}>
        <Image
          src="/events/bg.png"
          alt="Event 1"
          width={1000}
          height={1000}
          className="w-full h-full object-cover object-center-bottom"
          style={{ objectPosition: "center bottom", pointerEvents: 'none', }}
        />
        {/* Reduced left positioning */}
        <div className='absolute inset-0 flex items-center justify-center w-full md:w-1/2 -top-[10vh] pointer-events-auto left-4 md:left-[calc(50%+65px)] md:-translate-x-1/2 z-20'>

          <div className="swiper-3d-container w-full h-full">
        <Swiper
          key={selectedEventIndex}
          spaceBetween={80}
          slidesPerView={1}
          loop={true}
          centeredSlides={true}
          className="w-full h-full events-swiper"
          style={{
        borderRadius: '1rem',
        width: '100%',
        height: '100%',
        background: 'transparent',
        border: 'none',
        padding: 0,
          }}
          breakpoints={{
        0: { slidesPerView: 1 },
        640: { slidesPerView: 1 },
        1024: { slidesPerView: 3 },
          }}
          modules={[Navigation]}
          navigation={{ nextEl: '.events-next', prevEl: '.events-prev' }}
        >

          {currentEventCards.map((card) => (
        <SwiperSlide key={card.id}>
          <div className="w-full h-full aspect-[9/18] flex items-center justify-center">
        <Link href={card.redirect}>
          <div className="card-wrap w-[260px] md:w-[320px] lg:w-[360px] h-full">
        <EventCard
          id={card.id}
          name={card.name}
          description={card.description}
          img={card.img}
        />
          </div>
        </Link>
          </div>
        </SwiperSlide>
          ))}

        </Swiper>
          </div>

          <style jsx global>{`
        .events-swiper .swiper-slide {
            transition: transform 300ms ease, opacity 300ms ease;
            transform: scale(0.8);
            opacity: 0.9;
          }
          .events-swiper .swiper-slide-prev,
          .events-swiper .swiper-slide-next {
            transform: scale(0.6);
            opacity: 0.9;
          }
          .events-swiper .swiper-slide-active {
            transform: scale(1.05);
            opacity: 1;
            z-index: 2;
          }
          `}</style>
        </div>

        {/* Buttons aur Holo Image (NO CHANGES) */}
             <button
          className="events-prev absolute left-24 top-1/2 -translate-y-1/2 z-30 pointer-events-auto bg-black/50 text-white px-3 py-2 rounded-full hover:bg-black/70"
          aria-label="Next"
        >
          ◀
        </button>

        <button
          className="events-next absolute right-24 top-1/2 -translate-y-1/2 z-30 pointer-events-auto bg-black/50 text-white px-3 py-2 rounded-full hover:bg-black/70"
          aria-label="Previous"
        >
          ▶
        </button>
        <div className='absolute bottom-10 mx-auto flex items-center justify-center w-full h-1/2 z-10' style={{
          pointerEvents: 'none',
        }}>
          <Image
            src="/events/holo.png"
            alt="Event 1"
            width={1000}
            height={1000}
            className="h-[70vh] object-contain object-center-bottom"
            style={{ objectPosition: "center bottom" }}
          />
        </div>
      </div>

      {/* Dropdown (NO CHANGES) */}
      <div className="absolute left-[400px] top-12 z-30 pointer-events-auto">
        <Dropdown
          options={dropdownOptions}
          selectedValue={selectedEventIndex}
          onChange={handleDropdownChange}
        />
      </div>
 
    </div>
  )
}