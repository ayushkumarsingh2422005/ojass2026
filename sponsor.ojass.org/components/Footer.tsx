"use client";

import { motion } from "framer-motion";
import { Linkedin, Instagram, Twitter, Youtube } from "lucide-react";

const Footer = () => {
  const socialLinks = [
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Twitter, href: "#", label: "Twitter/X" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  return (
    <footer id="contact" className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Logo & Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-4">
              <span className="bg-gradient-to-r from-[#FF8C00] to-[#FF6B00] bg-clip-text text-transparent">
                OJASS
              </span>
              <span className="text-gray-400"> | Sponsorship</span>
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Partner with OJASS 2026 to reach an engaged student audience with on-ground and digital visibility.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="text-gray-400 hover:text-[#FF8C00] transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#why-sponsor" className="text-gray-400 hover:text-[#FF8C00] transition-colors">
                  Why Sponsor
                </a>
              </li>
              <li>
                <a href="#faq" className="text-gray-400 hover:text-[#FF8C00] transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-400 hover:text-[#FF8C00] transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-[#FF8C00] hover:bg-gray-700 transition-all duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400">
            © OJASS 2026 | All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

