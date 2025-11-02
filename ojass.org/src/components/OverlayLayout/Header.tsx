"use client";

import { useTheme } from "@/contexts/ThemeContext";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { useGSAP } from "@gsap/react";

import "swiper/css";
import "swiper/css/navigation";

interface EventCategory {
  name: string;
  slug: string;
}

export default function Header() {
  const { theme } = useTheme();
  const pathname = usePathname();
  const isDystopia = theme === "dystopia";
  const isEventPage = pathname.includes("/events");
  const headerRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<SwiperType | null>(null);

  const eventCategories: EventCategory[] = [
    { name: "Technical", slug: "technical" },
    { name: "Cultural", slug: "cultural" },
    { name: "Sports", slug: "sports" },
    { name: "Workshop", slug: "workshop" },
    { name: "Gaming", slug: "gaming" },
    { name: "Music", slug: "music" },
    { name: "Art", slug: "art" },
    { name: "Coding", slug: "coding" },
    { name: "Robotics", slug: "robotics" },
    { name: "Design", slug: "design" },
  ];

  useEffect(() => {
    if (!headerRef.current) return;
    gsap.fromTo(
      headerRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out", delay: 0.2 }
    );
  }, []);

  useGSAP(() => {
    if (!isEventPage) return;
    const slides = document.querySelectorAll(".category-slide");
    slides.forEach((slide) => {
      gsap.killTweensOf(slide);
      gsap.fromTo(
        slide,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", stagger: 0.05 }
      );
    });
  }, [isDystopia, isEventPage]);

  const handlePrev = () => swiperRef.current?.slidePrev();
  const handleNext = () => swiperRef.current?.slideNext();

  return (
    <div
      ref={headerRef}
      className="fixed top-0 left-0 w-full flex items-center justify-center z-50 px-2 sm:px-4 "
      style={{pointerEvents:"none"}}
    >
      <div
        className={`layout-panel layout-text font-bold relative px-4 sm:px-6 md:px-9 py-2 sm:py-3 ${
          isDystopia ? "is-dystopia" : ""
        }`}
        style={{
          clipPath:
            "polygon(0% 0%, 100% 0%, 97% 65%, 80% 100%, 63% 100%, 60% 95%, 40% 95%, 37% 100%, 20% 100%, 3% 65%)",
        }}
      >
        <div className="flex items-center justify-center gap-3 sm:gap-6 text-base sm:text-xl md:text-2xl whitespace-nowrap">
          {isEventPage ? (
            <div className="flex items-center justify-center overflow-hidden">
              <button
                onClick={handlePrev}
                className="hover:opacity-60 transition-opacity p-1 flex-shrink-0"
              >
                <ChevronUp size={18} className="-rotate-90 sm:w-5 sm:h-5" />
              </button>

              
              <div className="flex-1 max-w-[15vw]">
                <Swiper
                  onSwiper={(swiper) => (swiperRef.current = swiper)}
                  modules={[Navigation]}
                  slidesPerView={"auto"}
                  centeredSlides={false}
                  loop={true}
                >
                  {eventCategories.map((category) => (
                    <SwiperSlide key={category.slug}>
                      <div>
                        <p className="text-center">{category.name}</p>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              <button
                onClick={handleNext}
                className="hover:opacity-60 transition-opacity p-1 flex-shrink-0"
              >
                <ChevronDown
                  size={18}
                  className="-rotate-90 sm:w-5 sm:h-5 md:w-6 md:h-6"
                />
              </button>
            </div>
          ) : (
            <span>OJASS 2026</span>
          )}
        </div>
      </div>
    </div>

  );
}
