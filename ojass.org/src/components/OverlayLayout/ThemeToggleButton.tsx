"use client";
import React from "react";
import { useTheme } from "@/contexts/ThemeContext";

import DystopianCoinFullToss from "../themeSwitcherCoin/DystopianCoin/DystopianCoinFullToss";
import UtopianCoinFullToss from "../themeSwitcherCoin/UtopianCoin/UtopianCoinFullToss";

const CoinSwitcher: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const handleTossComplete = () => {
    toggleTheme(); // switch between utopia ↔ dystopia
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] cursor-pointer">
      {theme === "utopia" ? (
        <UtopianCoinFullToss onTossComplete={handleTossComplete} />
      ) : (
        <DystopianCoinFullToss onTossComplete={handleTossComplete} />
      )}
    </div>
  );
};

export default CoinSwitcher;
