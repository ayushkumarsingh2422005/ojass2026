"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const QuickLinksMenu = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="pt-24 pb-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="relative inline-block">
          <motion.button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 bg-gradient-to-r from-[#FF8C00] to-[#FF6B00] text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Menu
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </motion.button>
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50"
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <a
                  href="https://admin.ojass.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-3 text-gray-700 hover:bg-[#FF8C00]/10 hover:text-[#FF8C00] transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Admin
                </a>
                <a
                  href="https://ambassador.ojass.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-3 text-gray-700 hover:bg-[#FF8C00]/10 hover:text-[#FF8C00] transition-colors border-t border-gray-100"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Campus Ambassador
                </a>
                <a
                  href="https://ojass.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-3 text-gray-700 hover:bg-[#FF8C00]/10 hover:text-[#FF8C00] transition-colors border-t border-gray-100"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  OJASS Main
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default QuickLinksMenu;

