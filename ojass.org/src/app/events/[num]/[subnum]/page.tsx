
"use client";

import { useEffect } from "react";
import { motion, AnimatePresence, Transition } from "framer-motion";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import clsx from "clsx";
import { useTheme } from "@/contexts/ThemeContext";
import button from '@/components/general/button'
import Button from "@/components/general/button";
// ... (Interface definitions: PrizeData, EventHead, EventData, User, etc. - कोई बदलाव नहीं)
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
  teamSizeMin: string;
  event_head: EventHead;
}

interface User {
  paid: boolean;
  events: string[];
}

type AnimationType = "scale" | "slide" | "flip" | "zoom" | "fade" | "rotate3d";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventData: EventData;
  user: User | null;
  cardPosition?: { x: number; y: number; width: number; height: number };
  animationType?: AnimationType;
}

// ... (animations object - कोई बदलाव नहीं)
const animations: Record<AnimationType, any> = {
  scale: {
    initial: (props: { cardPosition?: EventModalProps["cardPosition"] }) =>
      props.cardPosition
        ? {
            position: "fixed" as const,
            left: props.cardPosition.x,
            top: props.cardPosition.y,
            width: props.cardPosition.width,
            height: props.cardPosition.height,
            opacity: 1,
          }
        : { scale: 0, opacity: 0 },
    animate: {
      position: "fixed" as const,
      left: "50%",
      top: "50%",
      x: "-50%",
      y: "-50%",
      width: "90vw",
      maxWidth: "1100px",
      height: "auto",
      maxHeight: "95vh",
      opacity: 1,
    },
    exit: (props: { cardPosition?: EventModalProps["cardPosition"] }) =>
      props.cardPosition
        ? {
            position: "fixed" as const,
            left: props.cardPosition.x,
            top: props.cardPosition.y,
            width: props.cardPosition.width,
            height: props.cardPosition.height,
            x: 0,
            y: 0,
            opacity: 0,
          }
        : { scale: 0, opacity: 0 },
    transition: {
      type: "spring",
      damping: 30,
      stiffness: 300,
    } as Transition,
  },
  slide: {
    initial: { y: "100vh", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: "100vh", opacity: 0 },
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 200,
    } as Transition,
  },
  flip: {
    initial: { rotateY: 90, opacity: 0, scale: 0.8 },
    animate: { rotateY: 0, opacity: 1, scale: 1 },
    exit: { rotateY: -90, opacity: 0, scale: 0.8 },
    transition: {
      duration: 0.6,
      ease: "easeInOut",
    } as Transition,
  },
  zoom: {
    initial: { scale: 0.5, opacity: 0, filter: "blur(10px)" },
    animate: { scale: 1, opacity: 1, filter: "blur(0px)" },
    exit: { scale: 0.5, opacity: 0, filter: "blur(10px)" },
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 200,
    } as Transition,
  },
  fade: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: {
      duration: 0.3,
      ease: "easeOut",
    } as Transition,
  },
  rotate3d: {
    initial: {
      rotateX: -90,
      opacity: 0,
      scale: 0.8,
      transformPerspective: 1000,
    },
    animate: {
      rotateX: 0,
      opacity: 1,
      scale: 1,
      transformPerspective: 1000,
    },
    exit: {
      rotateX: 90,
      opacity: 0,
      scale: 0.8,
      transformPerspective: 1000,
    },
    transition: {
      duration: 0.6,
      ease: [0.43, 0.13, 0.23, 0.96],
    } as Transition,
  },
};

export function EventModal({
  isOpen,
  onClose,
  eventData,
  user,
  cardPosition,
  animationType = "scale",
}: EventModalProps) {
  const router = useRouter();
  const { theme } = useTheme();

  // [FIX] क्लिप-पाथ स्टाइल बनी रहेगी
  const cornerCutStyle = {
    boxShadow:
      theme === "utopia"
        ? "0 0 30px rgba(34, 211, 238, 0.2), inset 0 0 30px rgba(34, 211, 238, 0.03)"
        : "0 0 30px rgba(239, 68, 68, 0.2), inset 0 0 30px rgba(239, 68, 68, 0.03)",
    clipPath: "polygon(8% 0, 92% 0, 100% 8%, 100% 100%, 0 100%, 0 8%)",
  };

  // ... (useEffect and handleRegister - कोई बदलाव नहीं)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };

    window.addEventListener("keydown", handleEsc);
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  const handleRegister = () => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (!user.paid) {
      toast.error("Please complete your registration payment first");
      return;
    }

    router.push("/dashboard/events");
    toast.success("Please complete your registration in the Events section");
  };

  const isRegistered = user?.events?.includes(eventData.id);
  const isTeamEvent = parseInt(eventData.teamSizeMin) > 1;

  const getRegistrationButton = () => {
    if (!user) {
      return (
        <Button content="Login to Register" onClick={()=>router.push("/login")}></Button>
      );
    }

    if (isRegistered) {
      return (
        <div
          className={clsx(
            "px-7 py-3.5 text-base rounded-2xl border-2 shadow-xl",
            theme === "utopia"
              ? "bg-gradient-to-r from-cyan-500/30 to-blue-500/30 text-cyan-200 border-cyan-300 shadow-cyan-400/50" // Was emerald
              : "bg-gradient-to-r from-yellow-900/40 to-amber-800/40 text-amber-200 border-amber-500 shadow-amber-600/50"
          )}
        >
          Registered
        </div>
      );
    }

    return (
      <button
        onClick={handleRegister}
        disabled={!user || !user.paid}
        className={clsx(
          "px-7 py-3.5 text-base rounded-2xl border-2 transition-all duration-300 shadow-xl relative overflow-hidden",
          user && user.paid
            ? theme === "utopia"
              ? "bg-gradient-to-r from-cyan-500/30 to-blue-500/30 border-cyan-400/70 text-cyan-50 hover:from-cyan-400 hover:to-blue-500 hover:border-cyan-200 hover:shadow-2xl hover:shadow-cyan-400/60 hover:-translate-y-0.5"
              : "bg-gradient-to-r from-red-950/60 to-orange-900/60 border-red-600/70 text-red-100 hover:from-red-700 hover:to-orange-600 hover:border-red-400 hover:shadow-2xl hover:shadow-red-600/60 hover:-translate-y-0.5"
            : "bg-gray-800/40 text-gray-500 cursor-not-allowed border-gray-700 opacity-50"
        )}
      >
        {user && user.paid
          ? theme === "utopia"
            ? `Register ${isTeamEvent ? "Your Team" : "Now"}`
            : `Register ${isTeamEvent ? "Your Squad" : "Now"}`
          : "Payment Required"}
      </button>
    );
  };

  const selectedAnimation = animations[animationType];
  const customProps = { cardPosition };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 z-[100]"
          />

          {/* Modal Content */}
          <motion.div
            custom={customProps}
            initial={
              typeof selectedAnimation.initial === "function"
                ? selectedAnimation.initial(customProps)
                : selectedAnimation.initial
            }
            animate={selectedAnimation.animate}
            exit={
              typeof selectedAnimation.exit === "function"
                ? selectedAnimation.exit(customProps)
                : selectedAnimation.exit
            }
            transition={selectedAnimation.transition}
            onClick={(e) => e.stopPropagation()}
            className={clsx(
              "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[1100px] max-h-[95vh] rounded-[2rem] shadow-2xl overflow-hidden z-[101]",
              
              theme === "utopia"
                ? "bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 border-4 border-cyan-400/50 shadow-cyan-500/30"
                : "bg-gradient-to-br from-black via-red-950/80 to-zinc-950 border-4 border-red-600/70 shadow-red-900/50"
            )}
            style={{
              transformStyle: "preserve-3d",
              perspective: 1000,
            }}
          >
            {/* Decorative corner accents */}
            <div
              className={clsx(
                "absolute top-0 left-0 w-32 h-32 opacity-30",
                theme === "utopia"
                  ? "bg-gradient-to-br from-cyan-400 to-transparent"
                  : "bg-gradient-to-br from-red-600 to-transparent"
              )}
            />
            <div
              className={clsx(
                "absolute bottom-0 right-0 w-32 h-32 opacity-30",
                theme === "utopia"
                  ? "bg-gradient-to-tl from-blue-400 to-transparent" // Was purple
                  : "bg-gradient-to-tl from-orange-600 to-transparent"
              )}
            />

            {/* Scrollable Content */}
            <div className="max-h-[95vh] overflow-y-auto">
              {/* Close Button */}
              <motion.button
                initial={{ opacity: 0, rotate: -180 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.15, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className={clsx(
                  "sticky top-6 right-6 ml-auto mr-6 z-10 text-4xl leading-none transition-all duration-300 w-12 h-12 flex items-center justify-center rounded-full border-2",
                  theme === "utopia"
                    ? "text-cyan-200 border-cyan-400 bg-indigo-900/80 hover:text-white hover:bg-cyan-500 hover:border-cyan-300 hover:shadow-lg hover:shadow-cyan-400/60"
                    : "text-red-300 border-red-500 bg-red-950/80 hover:text-white hover:bg-red-600 hover:border-red-400 hover:shadow-lg hover:shadow-red-600/60"
                )}
              >
                ×
              </motion.button>

              {/* Content */}
              <div className="px-8 md:px-12 pb-12">
                {/* Title */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-center mb-12 mt-4"
                >
                  <h2
                    className={clsx(
                      "text-4xl md:text-5xl font-black tracking-tight",
                      
                      theme === "utopia"
                        ? "text-cyan-300"
                        : "text-red-400"
                    )}
                  >
                    {eventData.name}
                  </h2>
                  {theme === "dystopia" && (
                    <div className="mt-2 text-orange-400 text-sm font-mono tracking-widest uppercase">
                      ▸ Mission Briefing ◂
                    </div>
                  )}
                </motion.div>

                {/* Image & Description */}
                <div
                  className={clsx(
                    "flex flex-wrap items-start justify-center gap-10 mb-14 relative border-2 p-6 backdrop-blur-md overflow-hidden",
                    theme === "utopia"
                      ? "border-cyan-400/70 bg-gradient-to-br from-slate-800/40 to-slate-900/40"
                      : "border-red-600/70 bg-gradient-to-br from-red-950/40 to-zinc-900/40"
                  )}
                  style={cornerCutStyle} 
                >
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="w-full lg:w-5/12 flex justify-center"
                  >
                    <div
                      className={clsx(
                        "w-full max-w-[420px] h-[340px] md:h-[450px] rounded-3xl overflow-hidden relative group border-2 backdrop-blur-md",
                        theme === "utopia"
                          ? "border-cyan-400/60 shadow-2xl shadow-cyan-500/40 bg-gradient-to-br from-slate-800/40 to-slate-900/40"
                          : "border-red-700/80 shadow-2xl shadow-red-800/60 bg-gradient-to-br from-red-950/40 to-zinc-900/40"
                      )}
                      style={cornerCutStyle} // Applied here
                    >
                      <img
                        src={eventData.img}
                        alt={eventData.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div
                        className={clsx(
                          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                          theme === "utopia"
                            ? "bg-gradient-to-t from-cyan-500/30 to-transparent"
                            : "bg-gradient-to-t from-red-900/50 to-transparent"
                        )}
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="w-full lg:w-6/12"
                  >
                    <div
                      className={clsx(
                        "relative border-2 p-6 backdrop-blur-md overflow-hidden mb-6",
                        theme === "utopia"
                          ? "bg-gradient-to-r from-indigo-900/40 to-transparent border-cyan-400/70"
                          : "bg-gradient-to-r from-red-950/50 to-transparent border-red-600/70"
                      )}
                      style={cornerCutStyle} // Applied here
                    >
                      <h3
                        className={clsx(
                          "text-3xl md:text-4xl font-black mb-3 tracking-wide", // Standardized
                          theme === "utopia"
                            ? "text-cyan-200"
                            : "text-red-400"
                        )}
                      >
                        DESCRIPTION
                      </h3>
                      <p
                        className={clsx(
                          "text-lg leading-relaxed font-medium",
                          theme === "utopia" ? "text-blue-100" : "text-red-50"
                        )}
                      >
                        {eventData.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      {getRegistrationButton()}
                      <a
                        href={eventData.rulebookurl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button content="View Rulebook"/>
                      </a>
                    </div>
                  </motion.div>
                </div>

                {/* Prize Section */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col justify-center items-center mb-14"
                >
                  <h3
                    className={clsx(
                      "text-3xl md:text-4xl font-black mb-8 tracking-tight", // Standardized
                      // [FIX] ग्रेडिएंट और शैडो हटा दिए गए
                      theme === "utopia"
                        ? "text-yellow-300"
                        : "text-amber-500"
                    )}
                  >
                    PRIZE POOL
                  </h3>
                  <div
                    className={clsx(
                      "flex flex-col justify-center items-center gap-4 text-xl p-10 rounded-3xl md:w-[450px] w-full border-4 relative overflow-hidden backdrop-blur-md",
                      theme === "utopia"
                        ? "bg-gradient-to-br from-blue-950/60 via-indigo-900/60 to-blue-950/60 border-cyan-400/60 shadow-2xl shadow-cyan-500/30" // Was purple
                        : "bg-gradient-to-br from-red-950/70 via-zinc-900/70 to-black/70 border-red-600/70 shadow-2xl shadow-red-900/40"
                    )}
                    style={cornerCutStyle} // Applied here
                  >
                    <div
                      className={clsx(
                        "absolute inset-0 opacity-10",
                        theme === "utopia"
                          ? "bg-[radial-gradient(circle_at_50%_50%,_rgba(6,182,212,0.3),transparent_50%)]"
                          : "bg-[radial-gradient(circle_at_50%_50%,_rgba(239,68,68,0.3),transparent_50%)]"
                      )}
                    />

                    <p
                      className={clsx(
                        "text-2xl relative z-10",
                        theme === "utopia" ? "text-cyan-100" : "text-amber-200"
                      )}
                    >
                      <span className="opacity-70">Total:</span>{" "}
                      {eventData.prizes.total}
                    </p>
                    <div
                      className={clsx(
                        "w-full h-0.5 my-2",
                        theme === "utopia"
                          ? "bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                          : "bg-gradient-to-r from-transparent via-red-500 to-transparent"
                      )}
                    />
                    <p
                      className={clsx(
                        "relative z-10",
                        theme === "utopia"
                          ? "text-yellow-200" // Was emerald
                          : "text-amber-200" // Was orange-200
                      )}
                    >
                      Winner: {eventData.prizes.winner}
                    </p>
                    {eventData.prizes.first_runner_up && (
                      <p
                        className={clsx(
                          "relative z-10",
                          theme === "utopia"
                            ? "text-gray-200" // Was blue
                            : "text-orange-300" // Was red
                        )}
                      >
                        1st Runner Up: {eventData.prizes.first_runner_up}
                      </p>
                    )}
                    {eventData.prizes.second_runner_up && (
                      <p
                        className={clsx(
                          "relative z-10",
                          theme === "utopia"
                            ? "text-gray-300" // Was purple
                            : "text-orange-400" // Was orange-300
                        )}
                      >
                        2nd Runner Up: {eventData.prizes.second_runner_up}
                      </p>
                    )}
                    <div
                      className={clsx(
                        "w-full h-0.5 my-2",
                        theme === "utopia"
                          ? "bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                          : "bg-gradient-to-r from-transparent via-red-500 to-transparent"
                      )}
                    />
                <Button content="Certificates for all participants"></Button>
                  </div>
                </motion.div>

                {/* Details Section */}
                {eventData.details && eventData.details.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex flex-col mb-14"
                  >
                    <h3
                      className={clsx(
                        "text-3xl md:text-4xl text-center font-black mb-8 tracking-tight",
                        // [FIX] शैडो हटा दिया गया
                        theme === "utopia"
                          ? "text-cyan-200"
                          : "text-red-400"
                      )}
                    >
                      EVENT DETAILS
                    </h3>
                    <div className="space-y-4">
                      {eventData.details.map((detail, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 + idx * 0.05 }}
                          className={clsx(
                            "px-8 py-5 rounded-2xl border-2 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300 backdrop-blur-md",
                            theme === "utopia"
                              ? "bg-gradient-to-r from-blue-950/50 to-indigo-900/30 border-cyan-400/70 shadow-lg shadow-blue-500/20"
                              : "bg-gradient-to-r from-red-950/60 to-zinc-900/50 border-red-600/70 shadow-lg shadow-red-900/30"
                          )}
                          style={cornerCutStyle} // Applied here (replaces 4% cut)
                        >
                          <div
                            className={clsx(
                              "absolute left-0 top-0 h-full w-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                              theme === "utopia" ? "bg-cyan-400" : "bg-red-500"
                            )}
                          />
                          <p
                            className={clsx(
                              "text-xl",
                              theme === "utopia" ? "text-blue-50" : "text-red-50"
                            )}
                          >
                            <span
                              className={clsx(
                                "mr-3 text-2xl",
                                theme === "utopia"
                                  ? "text-cyan-400"
                                  : "text-red-500"
                              )}
                            >
                              {theme === "utopia" ? "▸" : "►"}
                            </span>
                            {detail}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Rules Section */}
                {eventData.rules && eventData.rules.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-col justify-center items-center mb-14"
                  >
                    <div
                      className={clsx(
                        "w-full md:w-4/5 flex flex-col justify-center items-center p-10 rounded-3xl border-4 relative overflow-hidden",
                        theme === "utopia"
                          ? "bg-gradient-to-br from-blue-950/50 via-indigo-900/50 to-blue-950/50 border-cyan-400/60 shadow-2xl shadow-blue-500/20" // Was purple
                          : "bg-gradient-to-br from-black/80 via-red-950/70 to-zinc-950/80 border-red-700/70 shadow-2xl shadow-red-800/30"
                      )}
                      style={cornerCutStyle} // Applied to main rules container
                    >
                      <div
                        className={clsx(
                          "absolute inset-0 opacity-5",
                          theme === "utopia"
                            ? "bg-[radial-gradient(circle_at_30%_30%,_rgba(6,182,212,0.4),transparent_70%)]" // Was purple
                            : "bg-[radial-gradient(circle_at_30%_30%,_rgba(239,68,68,0.4),transparent_70%)]"
                        )}
                      />

                      <h3
                        className={clsx(
                          "text-3xl md:text-4xl font-black mb-10 tracking-tight relative z-10",
                          // [FIX] शैडो हटा दिया गया
                          theme === "utopia"
                            ? "text-cyan-200"
                            : "text-red-400"
                        )}
                      >
                        RULES & REGULATIONS
                      </h3>
                      <div className="flex flex-col justify-start w-full gap-5 font-semibold text-lg relative z-10">
                        {eventData.rules.map((rule, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.9 + idx * 0.05 }}
                            className={clsx(
                              "p-5 rounded-2xl border-2 hover:scale-[1.02] transition-all duration-300",
                              theme === "utopia"
                                ? "text-blue-50 bg-blue-950/40 border-blue-400/30 hover:border-blue-400/60 hover:shadow-lg hover:shadow-blue-400/30" // Was purple
                                : "text-red-50 bg-red-950/50 border-red-700/50 hover:border-red-600 hover:shadow-lg hover:shadow-red-700/40"
                            )}
                            style={cornerCutStyle} // Applied to individual rule items
                          >
                            <span
                              className={clsx(
                                "font-black text-2xl mr-4",
                                theme === "utopia"
                                  ? "text-cyan-300"
                                  : "text-orange-400"
                              )}
                            >
                              {theme === "utopia" ? `${idx + 1}.` : `[${idx + 1}]`}
                            </span>
                            {rule}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Contact Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className={clsx(
                    "flex flex-col justify-center items-center gap-6 p-10 rounded-3xl border-4 relative overflow-hidden",
                    theme === "utopia"
                      ? "bg-gradient-to-r from-indigo-950/60 via-blue-900/60 to-blue-950/60 border-cyan-400/50 shadow-2xl shadow-cyan-500/20"
                      : "bg-gradient-to-r from-red-950/70 via-zinc-900/70 to-black/70 border-red-700/60 shadow-2xl shadow-red-900/30"
                  )}
                  style={cornerCutStyle} // Applied to contact container
                >
                  <div
                    className={clsx(
                      "absolute inset-0 opacity-10",
                      theme === "utopia"
                        ? "bg-[radial-gradient(circle_at_70%_70%,_rgba(6,182,212,0.3),transparent_60%)]"
                        : "bg-[radial-gradient(circle_at_70%_70%,_rgba(239,68,68,0.3),transparent_60%)]"
                    )}
                  />

                  <div
                    className={clsx(
                      "text-center font-black text-3xl md:text-4xl mb-2 relative z-10",
                      theme === "utopia" ? "text-cyan-200" : "text-red-400"
                    )}
                  >
                    CONTACT INFORMATION
                  </div>

                  <div
                    className={clsx(
                      "w-32 h-1 mb-4 rounded-full",
                      theme === "utopia"
                        ? "bg-gradient-to-r from-cyan-400 to-blue-400" // Was purple
                        : "bg-gradient-to-r from-red-500 to-orange-500"
                    )}
                  />

                  <div className="text-center relative z-10">
                    <p
                      className={clsx(
                        "mb-2 text-lg",
                        theme === "utopia"
                          ? "text-blue-300"
                          : "text-orange-400"
                      )}
                    >
                      {theme === "utopia"
                        ? "Event Coordinator"
                        : "Mission Commander"}
                    </p>
                    <p className={clsx(
                        "text-2xl md:text-3xl mb-6",
                        theme === "utopia" ? "text-white" : "text-white"
                      )}>
                      {eventData.event_head.name}
                    </p>
                  </div>

                  <div className="text-center relative z-10">
                    <p
                      className={clsx(
                        "mb-2 text-lg",
                        theme === "utopia"
                          ? "text-blue-300"
                          : "text-orange-400"
                      )}
                    >
                      {theme === "utopia"
                        ? "Contact Number"
                        : "Comm Link"}
                    </p>
                    <p
                      className={clsx(
                        
                        theme === "utopia"
                          ? " text-cyan-100"
                          : " text-red-100"
                      )}
                    >
                     <Button content= {eventData.event_head.Phone}></Button>
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}