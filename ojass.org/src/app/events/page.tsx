"use client"
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Swiper, SwiperSlide } from 'swiper/react';

import { Navigation } from 'swiper/modules';
// @ts-ignore: allow side-effect CSS import without type declarations
import 'swiper/css';
// @ts-ignore: allow side-effect CSS import without type declarations
import 'swiper/css/pagination';
// @ts-ignore: allow side-effect CSS import without type declarations
import 'swiper/css/navigation';
import EventCard from '@/components/OverlayLayout/EventCard';
import Link from 'next/link';
import Dropdown from '@/components/OverlayLayout/Dropdown';

import { EventModal } from './[num]/[subnum]/page';
import { useTheme } from '@/contexts/ThemeContext';

interface CardData {
  id: string;
  name: string;
  description: string;
  img: string;
  redirect:string;
  cardposition:string
}
type Props = {}

export default function Page({ }: Props) {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null)
  const [allEvents, setAllEvents] = useState<CardData[][]>([]);
  const [selectedEventIndex, setSelectedEventIndex] = useState<number>(0);
  const [swiperInstance, setSwiperInstance] = useState<any>(null);
const [selectedEvent, setSelectedEvent] = useState<CardData | null>(null);
const [user, setUser] = useState<any>(null);
  const [cardPosition, setCardPosition] = useState<{ x: number; y: number; width: number; height: number } | undefined>();
  const [animationType, setAnimationType] = useState<'fade' | 'slide' | 'flip'>('fade');
useEffect(() => {
  let styleElement = document.getElementById('events-swiper-styles') as HTMLStyleElement;
  
  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.id = 'events-swiper-styles';
    document.head.appendChild(styleElement);
  }
  
  const activeScale = 1.1;

  styleElement.textContent = `
    .events-swiper .swiper-slide {
      transition: transform 300ms ease, opacity 300ms ease;
      transform: scale(0.6) !important;
      opacity: 0.9 !important;
    }
    .events-swiper .swiper-slide-prev,
    .events-swiper .swiper-slide-next {
      transform: scale(0.6) !important;
      opacity: 0.9 !important;
    }
    .events-swiper .swiper-slide-active {
      transform: scale(${activeScale}) !important;
      opacity: 1 !important;
      z-index: 2;
    }
  `;
   
  return () => {
    styleElement?.remove();
  };
}, [selectedEventIndex]);

  useEffect(() => {
    fetch('/event.json')
      .then(response => response.json())
      .then((data: CardData[][]) => {
        setAllEvents(data);
        console.log('Event data loaded!', data);
      })
      .catch(error => console.error("Error fetching event data:", error));
  }, []);

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height
      const normalizedX = (x - 0.5) * 2
      const normalizedY = (y - 0.5) * 2

      const maxX = 40
      const maxY = 20
      const targetX = -normalizedX * maxX
      const targetY = -normalizedY * maxY

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

  const dropdownOptions = allEvents.map((_, index) => ({
    value: index,
    label: `Event ${index + 1}`
  }));

  const currentEventCards = allEvents[selectedEventIndex] || [];

  const handleDropdownChange = (newValue: string | number) => {
    setSelectedEventIndex(Number(newValue));
  };


  return (
    <div ref={containerRef} className='w-full h-screen relative overflow-hidden'>

      <div id="events-bg" className="w-full h-full absolute bottom-10 left-0" style={{
        pointerEvents: 'none',
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
        
        <div  className='absolute inset-0 flex items-center justify-center w-full md:w-1/2 -top-[10vh] pointer-events-auto left-4 md:left-[calc(50%+65px)] md:-translate-x-1/2 z-20'>

          <div  className="swiper-3d-container w-full h-full">
        <Swiper
          key={`swiper-${selectedEventIndex}-${currentEventCards.length}`}
          spaceBetween={80}
          slidesPerView={3}
          centeredSlides={true}
          initialSlide={1}
          watchSlidesProgress={true}
          onSwiper={(swiper) => {
            setSwiperInstance(swiper);
            console.log('✅ Swiper mounted! Active:', swiper.activeIndex);
            
            requestAnimationFrame(() => {
              swiper.update();
              swiper.updateSlides();
              swiper.updateProgress();
              swiper.updateSlidesClasses();
              console.log('✅ Classes updated!');
            });
          }}
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
        0: { slidesPerView: 1, spaceBetween: 20 },
        640: { slidesPerView: 1, spaceBetween: 40 },
        1024: { slidesPerView: 3, spaceBetween: 80 },
          }}
          modules={[Navigation]}
          navigation={{ nextEl: '.events-next', prevEl: '.events-prev' }}
        >

          {currentEventCards.map((card) => (
        <SwiperSlide key={card.id}>
          <div className="w-full h-full flex items-center justify-center">
        <div   onClick={(e) => {
          // Card ki position capture karo
          const rect = e.currentTarget.getBoundingClientRect();
          setCardPosition({
            x: rect.left,
            y: rect.top,
            width: rect.width,
            height: rect.height,
          });
          setSelectedEvent(card);}}>
          <div className="card-wrap w-[260px] md:w-[320px] lg:w-[360px] h-full">
        <EventCard
          id={card.id}
          name={card.name}
          description={card.description}
          img={card.img}
        />
          </div>
        </div>
          </div>
        </SwiperSlide>
          ))}

        </Swiper>
          </div>

        </div>

       {theme === "utopia" ? (
  <>
    {/* 🌤 UTOPIA BUTTONS */}
    <button
      className="events-prev absolute left-60 top-1/2 -translate-y-1/2 z-30 
                 pointer-events-auto text-white 
                 px-3 py-2 rounded-full 
                 bg-cyan-500/20 backdrop-blur-sm
                 transition-all duration-300 ease-in-out
                 hover:bg-cyan-500/40 hover:scale-105 active:scale-95"
      aria-label="Previous"
    >
      <Image
        width={40}
        height={40}
        src="/events/previousArrowButtonUtopia.svg"
        alt="previous"
      />
    </button>

    <button
      className="events-next absolute right-50 top-1/2 -translate-y-1/2 z-30 
                 pointer-events-auto text-white 
                 px-3 py-2 rounded-full 
                 bg-cyan-500/20 backdrop-blur-sm
                 transition-all duration-300 ease-in-out
                 hover:bg-cyan-500/40 hover:scale-105 active:scale-95"
      aria-label="Next"
    >
      <Image
        width={40}
        height={40}
        src="/events/nextArrowButtonUtopia.svg"
        alt="next"
      />
    </button>
  </>
) : (
  <>
    {/* 🌒 DYSTOPIA BUTTONS */}
    <button
      className="events-prev absolute left-60 top-1/2 -translate-y-1/2 z-30 
                 pointer-events-auto text-white 
                 px-3 py-2 rounded-full 
                 bg-[#ee8f59]/10 backdrop-blur-sm
                 transition-all duration-300 ease-in-out
                 hover:bg-[#ee8f59]/30 hover:scale-105 active:scale-95"
      aria-label="Previous"
    >
      <Image
        width={40}
        height={40}
        src="/events/previousArrowButtonDystopia.svg"
        alt="previous"
      />
    </button>

    <button
      className="events-next absolute right-50 top-1/2 -translate-y-1/2 z-30 
                 pointer-events-auto text-white 
                 px-3 py-2 rounded-full 
                 bg-[#ee8f59]/10 backdrop-blur-sm
                 transition-all duration-300 ease-in-out
                 hover:bg-[#ee8f59]/30 hover:scale-105 active:scale-95"
      aria-label="Next"
    >
      <Image
        width={40}
        height={40}
        src="/events/nextArrowButtonDystopia.svg"
        alt="next"
      />
    </button>
  </>
)}


        
        
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
      {selectedEvent && (
  <EventModal
    isOpen={!!selectedEvent}
    onClose={() => setSelectedEvent(null)}
    eventData={selectedEvent as any} // Your event.json should have full data
    user={user}
        cardPosition={cardPosition}
         animationType="flip"
  />
)}
    </div>
  )
}