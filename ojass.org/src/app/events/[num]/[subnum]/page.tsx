"use client";

import React, { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import clsx from "clsx";


interface Coordinator {
  id: string | number;
  name: string;
  phone: string;
}

interface PrizeData {
  total: string;
  winner: string;
  first_runner_up?: string;
  second_runner_up?: string;
}

interface EventHead {
  name: string;
  Phone: string;
}

interface EventData {
  id: string;
  name: string;
  img: string;
  description: string;
  rulebookurl: string;
  prizes: PrizeData;
  details: string[];
  rules: string[];
  event_head: EventHead;
}

interface User {
  paid: boolean;
  events: string[];
}

export default function RedesignedEventPage({
  params,
}: {
  params: { num: string; subnum: string };
}) {
  const { theme } = useTheme();
  const router = useRouter();

  const [eventData, setEventData] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [aspectRatio, setAspectRatio] = useState(16 / 9);

  const textColor = theme === "utopia" ? "text-cyan-300" : "text-amber-400";
  const accentColor = theme === "utopia" ? "bg-cyan-500" : "bg-amber-500";
  const accentBorder =
    theme === "utopia" ? "border-cyan-400/70" : "border-amber-500/70";
  const accentHover =
    theme === "utopia" ? "hover:bg-cyan-600" : "hover:bg-amber-600";
    const huerotate=
    theme==="utopia"?"":"hue-rotate-[180deg] saturate-200 contrast-200";
    const trophyhuerotate=
    theme==="utopia"?"hue-rotate-[180deg] saturate-200 contrast-200":""
  // --- Effect to track window aspect ratio ---
  useEffect(() => {
    const handleResize = () => {
      setAspectRatio(window.innerWidth / window.innerHeight);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- Fetch data ---
  useEffect(() => {
    fetch("/event.json")
      .then((response) => response.json())
      .then((data: EventData[][]) => {
        const numIndex = parseInt(params.num);
        const subnumIndex = parseInt(params.subnum);

        if (data[numIndex] && data[numIndex][subnumIndex]) {
          setEventData(data[numIndex][subnumIndex]);
        } else {
          router.push("/bot");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching event data:", error);
        router.push("/events");
      });

    const userStr = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (userStr && token) {
      try {
        const userData = JSON.parse(userStr);
        setUser({
          paid: userData.isPaid || false,
          events: userData.events || [],
        });
      } catch (err) {
        console.error("Error parsing user data:", err);
      }
    }
  }, [params.num, params.subnum, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-cyan-400 text-xl">Loading event...</div>
      </div>
    );
  }

  if (!eventData) {
    return null;
  }

  return (
    <>
      <div className={clsx("relative min-h-screen w-full overflow-x-hidden  text-white ")}>
  <video
        autoPlay
        loop
        muted
        playsInline
        src="/events/eventbackground.mp4"
        className="absolute top-0 left-0 w-full h-full object-cover -z-10"
      />

        {/* --- DYNAMIC BACKGROUND RENDER --- */}
        {aspectRatio > 1 ? (
          <div
            className={clsx("fixed inset-0 z-0 bg-[url('/events/eventbg.png')] bg-center bg-cover    transition-transform duration-300    h-[100vh] w-[100vw] ",
              huerotate
            )} 
          />
        ) : (
          <div
            className="fixed inset-0 z-0 bg-[url('/events/eventbg.png')] bg-center bg-cover origin-top-left top-0 left-full
                       transition-transform duration-300
                       rotate-90 h-[100vw] w-[100vh]"
          />
        )}

        {/* --- MAIN CONTENT WRAPPER --- */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12 lg:py-16 h-[75vh] overflow-y-scroll mt-[12.5vh] w-[70vw]  lg:w-full">
          {/* --- PAGE TITLE --- */}
          <h1
            className={clsx(
              "text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-8 sm:mb-12 text-center lg:text-left",
              textColor
            )}
          >
            {eventData.name}
          </h1>

          {/* --- HERO SECTION --- */}
          <div className="relative w-full max-w-6xl mx-auto lg:mx-0 mb-8 sm:mb-12">
            <div className="flex flex-col lg:flex-row gap-12 bg-black/40 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-800 p-4 sm:p-6">
              {/* Event Image */}
              <div className="w-full lg:w-2/5 flex-shrink-0">
                <img
                  src={eventData.img}
                  alt={eventData.name}
                  className={clsx("w-full h-auto sm:h-full md:h-full object-cover object-center rounded-lg ",huerotate)}
                />
              </div>

              {/* Event Description */}
              <div>
                <div className="flex-1 flex flex-col justify-center">
                  <h2 className={clsx("text-xl sm:text-2xl font-bold mb-3 sm:mb-4", textColor)}>
                    Event Description
                  </h2>
                  <p className={clsx("text-base sm:text-lg leading-relaxed", textColor)}>
                    {eventData.description}
                  </p>
                </div>
                <div>
                  <div
                    className={clsx(
                      "flex flex-col  mt-11 gap-4 sm:gap-6 p-4 sm:p-6 rounded-lg bg-black/60 border backdrop-blur-sm h-auto",
                      accentBorder
                    )}
                  >
                    {/* --- Action Buttons --- */}
                    <div className="flex flex-col gap-3 sm:gap-4">
                      <DynamicRegisterButton
                        user={user}
                        eventId={eventData.id}
                        accentColor={accentColor}
                        accentHover={accentHover}
                        router={router}
                      />
                      <a
                        href={eventData.rulebookurl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 sm:px-6 rounded-lg w-full transition-colors text-sm sm:text-base"
                      >
                        Download Rulebook
                      </a>
                    </div>

                    {/* --- Coordinator Section --- */}
                    <div className="border-t border-gray-700 mt-3">
                      <h3 className="text-lg sm:text-xl font-bold mb-3 text-white">
                        Coordinator
                      </h3>
                      {eventData.event_head && (
                        <div className="text-sm sm:text-base font-light">
                          <p className="font-semibold text-white mb-1">
                            {eventData.event_head.name}
                          </p>
                          <p className={textColor}>
                            {eventData.event_head.Phone}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* --- FIRST ROW: Rules + Actions/Coordinator --- */}
          <div
            className={clsx(
              "p-4 sm:p-6 rounded-lg bg-black/60 border backdrop-blur-sm mb-20",
              accentBorder
            )}
          >
            <h3 className="text-xl sm:text-2xl font-bold mb-4 pb-2 border-b border-gray-600 text-white">
              Prizes
            </h3>
            <div
              className={clsx(
                " text-base sm:text-lg font-light space-y-3",
                textColor
              )}
            >
              <div className="bg-black/40 p-3 sm:p-4 rounded-lg">
                <p className="text-xs sm:text-sm uppercase tracking-wide text-gray-400 mb-1">
                  Total Prize Pool
                </p>
                <p className="text-xl sm:text-2xl font-bold text-white">
                  {eventData.prizes.total}
                </p>
              </div>

              <div className="flex justify-between items-end mx-auto h-auto p-0">
                {eventData.prizes.first_runner_up && (
                  <div className="flex flex-col items-center justify-end h-full flex-1">
                    <div className={clsx("flex-grow flex items-end mb-2 h-[50%] scale-75",trophyhuerotate)}>
                      <img
                        src="/events/secondposition.png"
                        className="object-contain"
                      />
                    </div>
                    <div className="flex flex-col text-center">
                      {/* <span className="font-semibold text-white">1st Runner Up:</span> */}
                      <span className="">{eventData.prizes.first_runner_up}</span>
                    </div>
                  </div>
                )}

                {/* Winner - Largest */}
                <div className="flex flex-col items-center justify-end h-full flex-1">
                  <div className={clsx("flex-grow flex items-end mb-2 scale-105",trophyhuerotate)}>
                    <img
                      src="/events/firstposition.png"
                      className="h-[80%] object-contain"
                    />
                  </div>
                  <div className="flex flex-col text-center">
                    {/* <span className="font-semibold text-white">Winner:</span> */}
                    <span className="">{eventData.prizes.winner}</span>
                  </div>
                </div>

                {eventData.prizes.second_runner_up && (
                  <div className="flex flex-col items-center justify-end h-full flex-1">
                    <div className={clsx("flex-grow flex items-end mb-2 scale-[0.6]",trophyhuerotate)}>
                      <img
                        src="/events/thirdposition.png"
                        className="h-[50%] object-contain"
                      />
                    </div>
                    <div className="flex flex-col text-center">
                      {/* <span className="font-semibold text-white">2nd Runner Up:</span> */}
                      <span className="">{eventData.prizes.second_runner_up}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* --- SECOND ROW: Additional Details + Prizes --- */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">

            {/* --- Details Section --- */}
            {eventData.details && eventData.details.length > 0 && (
              <div>
                <EventSection title="Additional Details">
                  <ul
                    className={clsx(
                      "list-disc list-inside space-y-2 sm:space-y-3 text-base sm:text-lg font-light",
                      textColor
                    )}
                  >
                    {eventData.details.map((detail, index) => (
                      <li key={index} className="leading-relaxed">{detail}</li>
                    ))}
                  </ul>
                </EventSection>
              </div>
            )}

            {/* --- Prizes Card --- */}
            {eventData.details && eventData.details.length > 0 && (
              <div>
                <EventSection title="Rules">
                  <ul
                    className={clsx(
                      "list-disc list-inside space-y-2 sm:space-y-3 text-base sm:text-lg font-light",
                      textColor
                    )}
                  >
                    {eventData.rules.map((detail, index) => (
                      <li key={index} className="leading-relaxed">{detail}</li>
                    ))}
                  </ul>
                </EventSection>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function EventSection({
  title,
  children,
  noMargin = false,
}: {
  title: string;
  children: React.ReactNode;
  noMargin?: boolean;
}) {
  return (
    <div className={clsx(!noMargin && "mb-4")}>
      <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 border-b border-gray-600 pb-2 text-white">
        {title}
      </h3>
      {children}
    </div>
  );
}

// --- Helper Component for "Smart" Button ---
function DynamicRegisterButton({
  user,
  eventId,
  accentColor,
  accentHover,
  router,
}: {
  user: User | null;
  eventId: string;
  accentColor: string;
  accentHover: string;
  router: any;
}) {
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    if (user && user.events.includes(eventId)) {
      setIsRegistered(true);
    }
  }, [user, eventId]);

  // Case 1: User is not logged in
  if (!user) {
    return (
      <button
        onClick={() => router.push("/login")}
        className={clsx(
          "flex items-center justify-center gap-2 text-black font-bold py-3 px-4 sm:px-6 rounded-lg w-full transition-colors text-sm sm:text-base",
          accentColor,
          accentHover
        )}
      >
        Login to Participate
      </button>
    );
  }

  if (!isRegistered) {
    const handleRegister = () => {
      alert("Add your registration logic here!");
    };

    return (
      <button
        onClick={handleRegister}
        className={clsx(
          "flex items-center justify-center gap-2 text-black font-bold py-3 px-4 sm:px-6 rounded-lg w-full transition-colors text-sm sm:text-base",
          accentColor,
          accentHover
        )}
      >
        Register for Event
      </button>
    );
  }

  return (
    <button
      disabled
      className="flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-3 px-4 sm:px-6 rounded-lg w-full cursor-not-allowed text-sm sm:text-base"
    >
      You are Registered
    </button>
  );
}