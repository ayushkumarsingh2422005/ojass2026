"use client";

import Footer from "@/components/OverlayLayout/Footer";
import Header from "@/components/OverlayLayout/Header";
import "@/components/OverlayLayout/layout.css";
import LeftPanel from "@/components/OverlayLayout/LeftPanel";
import RightPanel from "@/components/OverlayLayout/RightPanel";
import ThemeToggleButton from "@/components/OverlayLayout/ThemeToggleButton";
import { useTheme } from "@/contexts/ThemeContext";
import CursorEffect from "@/components/cursor/CursorEffect";
import { NavItems } from "@/lib/constants";
import { usePathname } from "next/navigation";
// import CursorEffect from "../cursor/CursorEffect";

// ------------------------------------------------------------
// import { useState } from "react";
// import GlitchTransition from "@/components/OverlayLayout/GlitchTransition";
// ------------------------------------------------------------

export default function OverlayLayout() {
    const { toggleTheme } = useTheme();
    const path = usePathname();

    // ------------------------------------------------------------
    // const [showGlitch, setShowGlitch] = useState(false);
    // ------------------------------------------------------------
    const handleThemeChange = async () => {
        // ------------------------------------------------------------
        // setShowGlitch(true);
        // setTimeout(async () => {
        //     setShowGlitch(false);
        //     await toggleTheme();
        // }, 2000);
        // ------------------------------------------------------------
        await toggleTheme("glitch");
    };

    const matched = NavItems.find((item) => item.title.toLowerCase() == path || path == "/");
    console.log(matched);
    return (
        <>

            {matched && <Header />}
            <RightPanel />
            <LeftPanel />
            {matched && <Footer />}

            {/* ThemeToggle Button */}
            <ThemeToggleButton onToggle={handleThemeChange} />

            {/*
                <GlitchTransition
                    isVisible={showGlitch}
                    src={"glitch-effect.mov"}
                    /> 
                    */}
            {/* Cursor Effect */}
        </>
    );
}
