"use client";

import Footer from "@/components/OverlayLayout/Footer";
import Header from "@/components/OverlayLayout/Header";
import "@/components/OverlayLayout/layout.css";
import LeftPanel from "@/components/OverlayLayout/LeftPanel";
import RightPanel from "@/components/OverlayLayout/RightPanel";
import ThemeToggleButton from "@/components/OverlayLayout/ThemeToggleButton";
import { useTheme } from "@/contexts/ThemeContext";
// ------------------------------------------------------------
// import { useState } from "react";
// import GlitchTransition from "@/components/OverlayLayout/GlitchTransition";
// ------------------------------------------------------------

export default function OverlayLayout() {
    const { toggleTheme } = useTheme();

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

    return (
        <>
            {/* Top Hud */}
            <Header />

            {/* Right Flap */}
            <RightPanel />

            {/* Left Flap */}
            <LeftPanel />

            {/* Footer */}
            <Footer />

            {/* ThemeToggle Button */}
            <ThemeToggleButton onToggle={handleThemeChange} />

            {/*
                <GlitchTransition
                    isVisible={showGlitch}
                    src={"glitch-effect.mov"}
                /> 
            */}
        </>
    );
}
