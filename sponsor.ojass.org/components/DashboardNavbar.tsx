"use client";

import { useState, useEffect } from "react";
import { LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

const DashboardNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const { logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = () => {
    logout();
    router.push("/login");
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-md"
          : "bg-white/95 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/">
            <motion.div
              className="flex items-center space-x-2 text-2xl font-bold cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="bg-gradient-to-r from-[#FF8C00] to-[#FF6B00] bg-clip-text text-transparent">
                OJASS
              </span>
              <span className="text-gray-600">| CA</span>
            </motion.div>
          </Link>

          {/* Sign Out Button */}
          <motion.button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-gray-700 hover:text-[#FF8C00] font-medium transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-gray-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline">Sign Out</span>
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
};

export default DashboardNavbar;

