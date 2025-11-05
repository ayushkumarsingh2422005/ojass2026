import CoinToss from "@/components/OverlayLayout/ThemeToggle/CoinToss";

const ThemeToggleButton = ({ onToggle }: { onToggle: () => Promise<void> }) => {
    return (
        <div className="fixed bottom-6 right-6 z-[9999] cursor-pointer">
            <CoinToss onToggle={onToggle} />
        </div>
    );
};

export default ThemeToggleButton;
