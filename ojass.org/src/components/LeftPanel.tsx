import { useEffect, useRef } from "react";
import gsap from "gsap";

interface LeftPanelProps {
  isDestructive: boolean;
}

export default function LeftPanel({ isDestructive }: LeftPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (panelRef.current) {
      gsap.fromTo(
        panelRef.current,
        {
          x: -100,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          delay: 0.2,
        }
      );
    }
  }, []);

  const menuItems = [
    { icon: "home", title: "Home", path: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z", href: "/" },
    { icon: "event", title: "Event", path: "M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z", href: "/event" },
    { icon: "team", title: "Our Team", path: "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z", href: "/team" },
    { icon: "sponsor", title: "Sponsor", path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z", href: "/sponsor" }
  ];

  return (
    <div
      ref={panelRef}
      className={`aircraft-panel w-[60px] h-[50vh] fixed bottom-0 left-0 flex flex-col items-center justify-center hud-grid py-10 pt-14 pr-3 ${
        isDestructive ? "warning" : ""
      }`}
      style={{
        position: "fixed",
        bottom: "0",
        left: "0",
        clipPath:
          "polygon(0% 0%, calc(100% - 30px) 0%, 100% 50px, 80% 95%, 100% 100%, 0% 100%, 0% 100%)",
      }}
    >
      <div className="flex flex-col items-center justify-between h-full py-8">
        {/* Navigation Icons */}
        {menuItems.map((item) => (
          <a
            key={item.title}
            href={item.href}
            className={`aircraft-text cursor-pointer hover:scale-110 transition-transform ${
              isDestructive ? "warning" : ""
            }`}
            title={item.title}
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
              <path d={item.path} />
            </svg>
          </a>
        ))}
      </div>
    </div>
  );
}