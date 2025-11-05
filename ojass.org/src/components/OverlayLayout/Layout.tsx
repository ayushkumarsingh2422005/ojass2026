"use client";

import Footer from "@/components/OverlayLayout/Footer";
import GlitchTransition from "@/components/OverlayLayout/GlitchTransition";
import Header from "@/components/OverlayLayout/Header";
import "@/components/OverlayLayout/layout.css";
import LeftPanel from "@/components/OverlayLayout/LeftPanel";
import RightPanel from "@/components/OverlayLayout/RightPanel";
import ThemeToggleButton from "@/components/OverlayLayout/ThemeToggle/ThemeToggleButton";
import { useTheme } from "@/contexts/ThemeContext";
import { NavItems } from "@/lib/constants";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function OverlayLayout() {
    const { toggleTheme } = useTheme();
    const path = usePathname();

    const [showGlitch, setShowGlitch] = useState(false);
    const handleThemeChange = async () => {
        setShowGlitch(true);
        setTimeout(async () => {
            setShowGlitch(false);
            await toggleTheme("glitch");
        }, 2000);
    };

    const matched = NavItems.find(
        (item) =>
            item.title.toLowerCase() === path ||
            path === "/" ||
            path === "/login",
    );

    return (
        <>

            {matched && <><Header /> <RightPanel />
                <LeftPanel /> <Footer /></>}



            <ThemeToggleButton onToggle={handleThemeChange} />

            <GlitchTransition
                isVisible={showGlitch}
                src={"glitch-effect.mov"}
            />
        </>
    );
}
