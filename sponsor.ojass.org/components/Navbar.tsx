"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "About", href: "#about" },
    { name: "Why Sponsor", href: "#why-sponsor" },
    { name: "FAQ", href: "#faq" },
    { name: "Contact", href: "#contact" },
  ];

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
          <motion.a
            href="#"
            className="flex items-center space-x-2 text-2xl font-bold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="bg-gradient-to-r from-[#FF8C00] to-[#FF6B00] bg-clip-text text-transparent">
              OJASS
            </span>
            <span className="text-gray-600">| Sponsorship</span>
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-gray-700 hover:text-[#FF8C00] font-medium transition-colors duration-200"
              >
                {link.name}
              </a>
            ))}
            <motion.a
              href="/SCSE_brochure.pdf"
              download
              className="bg-gradient-to-r from-[#FF8C00] to-[#FF6B00] text-white px-6 py-2.5 rounded-full font-semibold hover:shadow-lg transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Brochure
            </motion.a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-700"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t"
          >
            <div className="px-4 pt-2 pb-4 space-y-3">
              <div className="border-b border-gray-200 pb-3 mb-3">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Quick Links</p>
                <a
                  href="https://admin.ojass.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block py-2 text-gray-700 hover:text-[#FF8C00] font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admin
                </a>
                <a
                  href="https://ambassador.ojass.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block py-2 text-gray-700 hover:text-[#FF8C00] font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Campus Ambassador
                </a>
                <a
                  href="https://ojass.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block py-2 text-gray-700 hover:text-[#FF8C00] font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  OJASS Main
                </a>
              </div>
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block py-2 text-gray-700 hover:text-[#FF8C00] font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <a
                href="/SCSE_brochure.pdf"
                download
                className="block w-full text-center bg-gradient-to-r from-[#FF8C00] to-[#FF6B00] text-white px-6 py-2.5 rounded-full font-semibold mt-4"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Brochure
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;

