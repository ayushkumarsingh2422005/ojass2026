import { useTheme } from "@/contexts/ThemeContext";
import { FaMoon, FaSun } from "react-icons/fa";

export default function ThemeToggleButton({
    onToggle,
}: {
    onToggle: () => Promise<void>;
}) {
    const { theme } = useTheme();
    const isDystopia = theme === "dystopia";

    return (
        <button
            onClick={onToggle}
            className={`fixed top-4 right-4 px-4 py-2 text-white rounded-md shadow-lg transition-all duration-200 hover:scale-110 z-[9999] cursor-pointer ${
                isDystopia
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
            }`}>
            {!isDystopia ? <FaMoon /> : <FaSun />}
        </button>
    );
}
