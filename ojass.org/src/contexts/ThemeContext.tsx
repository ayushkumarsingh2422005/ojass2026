"use client";

import { Theme } from "@/lib/constants";
import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import { flushSync } from "react-dom";

export type AnimationType = "none" | "circle-spread" | "swipe-left" | "glitch";

interface ThemeContextType {
    theme: Theme;
    setTheme: (
        theme: Theme,
        animationType?: AnimationType,
        duration?: number,
    ) => Promise<void>;
    toggleTheme: (
        animationType?: AnimationType,
        duration?: number,
    ) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: "utopia",
    setTheme: async () => {},
    toggleTheme: async () => {},
});

// Apply theme to DOM and storage
const applyThemeToDOM = (theme: Theme) => {
    const isDystopia = theme === "dystopia";
    document.documentElement.classList.toggle("dystopia", isDystopia);
    localStorage.setItem("ojass26-theme", theme);
};

// Apply glitch effect
const applyGlitchEffect = async (duration: number = 800) => {
    const style = document.createElement("style");
    style.id = "theme-animation-style";
    const glitchKeyframes = `
        @keyframes glitch-shift {
            0% { transform: translate(0, 0); clip-path: inset(0 0 0 0); }
            10% { transform: translate(-3px, 2px); clip-path: inset(5% 0 10% 0); }
            20% { transform: translate(3px, -2px); clip-path: inset(0 10% 0 5%); }
            30% { transform: translate(-1px, 1px); clip-path: inset(10% 0 0 10%); }
            40% { transform: translate(4px, -3px); clip-path: inset(0 0 10% 0); }
            50% { transform: translate(0, 0); clip-path: inset(0 0 0 0); }
            60% { transform: translate(-2px, 3px); clip-path: inset(0 15% 0 5%); }
            70% { transform: translate(3px, -1px); clip-path: inset(5% 0 0 15%); }
            80% { transform: translate(-4px, 2px); clip-path: inset(0 0 10% 0); }
            100% { transform: translate(0, 0); clip-path: inset(0 0 0 0); }
        }

        @keyframes glitch-rgb {
            0%, 100% { filter: none; }
            25% { filter: contrast(150%) hue-rotate(10deg); }
            50% { filter: contrast(200%) hue-rotate(-10deg) saturate(2); }
            75% { filter: contrast(150%) hue-rotate(15deg); }
        }

        @keyframes glitch-noise {
            0%, 100% { opacity: 0.1; transform: translate(0,0); }
            25% { opacity: 0.3; transform: translate(-2px, 1px); }
            50% { opacity: 0.2; transform: translate(2px, -1px); }
            75% { opacity: 0.25; transform: translate(-1px, 2px); }
        }

        ::view-transition-old(root),
        ::view-transition-new(root) {
            animation: glitch-shift ${duration}ms steps(2, end) infinite,
                       glitch-rgb ${duration}ms ease-in-out infinite;
        }

        body::before {
            content: "";
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: repeating-linear-gradient(
                0deg,
                rgba(255,255,255,0.05) 0px,
                rgba(255,255,255,0.05) 1px,
                transparent 1px,
                transparent 2px
            );
            pointer-events: none;
            z-index: 9999;
            animation: glitch-noise ${duration}ms steps(2, end) infinite;
        }
    `;

    style.textContent = glitchKeyframes;
    document.head.appendChild(style);

    // Cleanup
    setTimeout(() => style.remove(), duration + 100);
};

// Apply theme animation
const applyThemeAnimation = async (
    animationType: AnimationType,
    duration: number,
) => {
    const styleId = "theme-animation-cleanup";
    const existing = document.getElementById(styleId);
    if (existing) existing.remove();

    const { innerWidth: vw, innerHeight: vh } = window;
    const maxRadius = Math.hypot(vw, vh);

    const animationOptions = {
        duration,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
    };

    switch (animationType) {
        case "circle-spread":
            document.documentElement.animate(
                {
                    clipPath: [
                        `circle(0px at 50% 50%)`,
                        `circle(${maxRadius * 2}px at 50% 50%)`,
                    ],
                },
                animationOptions,
            );
            break;

        case "swipe-left":
            document.documentElement.animate(
                { clipPath: [`inset(0 100% 0 0)`, `inset(0 0 0 0)`] },
                {
                    ...animationOptions,
                    easing: "cubic-bezier(0.2, 0, 0, 1)",
                },
            );
            break;

        case "glitch":
            await applyGlitchEffect(duration);
            break;

        default:
            break;
    }

    // Cleanup animation styles after it finishes
    setTimeout(() => {
        const cleanup = document.createElement("style");
        cleanup.id = styleId;
        cleanup.textContent = `
            ::view-transition-old(root),
            ::view-transition-new(root) {
                animation: none !important;
                clip-path: none !important;
                transform: none !important;
                opacity: 1 !important;
            }
        `;
        document.head.appendChild(cleanup);
        setTimeout(() => cleanup.remove(), 100);
    }, duration + 100);
};

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<Theme>("utopia");

    // Sync theme from localStorage & DOM on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem(
            "ojass26-theme",
        ) as Theme | null;
        const isDystopia =
            document.documentElement.classList.contains("dystopia");

        const initial: Theme =
            savedTheme === "dystopia" || isDystopia ? "dystopia" : "utopia";

        setThemeState(initial);
        applyThemeToDOM(initial);
    }, []);

    const setTheme = useCallback(
        async (
            newTheme: Theme,
            animationType: AnimationType = "none",
            duration: number = 800,
        ) => {
            if (theme === newTheme) return;

            const supportsViewTransitions = "startViewTransition" in document;

            if (supportsViewTransitions) {
                // Use View Transitions API
                await document.startViewTransition(async () => {
                    flushSync(() => {
                        setThemeState(newTheme);
                        applyThemeToDOM(newTheme);
                    });
                }).ready;

                applyThemeAnimation(animationType, duration);
            } else {
                // Fallback: no animation
                setThemeState(newTheme);
                applyThemeToDOM(newTheme);
            }
        },
        [theme],
    );

    const toggleTheme = useCallback(
        (animationType?: AnimationType, duration?: number) =>
            setTheme(
                theme === "utopia" ? "dystopia" : "utopia",
                animationType,
                duration,
            ),
        [theme, setTheme],
    );

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeContext);

    if (context === undefined)
        throw new Error("useTheme must be used within a ThemeProvider");

    return context;
};
