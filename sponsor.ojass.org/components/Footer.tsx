"use client";

import { motion } from "framer-motion";
import { Linkedin, Instagram, Facebook, Youtube } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const socialLinks = [
    { icon: Instagram, href: "https://www.instagram.com/ojass.nitjsr/", label: "Instagram" },
    { icon: Facebook, href: "https://www.facebook.com/Ojassnitjamshedpur/", label: "Facebook" },
    { icon: Linkedin, href: "https://www.linkedin.com/company/ojassnitjsr/", label: "LinkedIn" },
    { icon: Youtube, href: "https://www.youtube.com/@OJASS.NITJSR", label: "YouTube" },
  ];

  
  return (
    <footer id="contact" className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Logo & Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image 
                src="/logo.webp" 
                alt="OJASS Logo" 
                width={40} 
                height={40}
                className="object-contain"
              />
              <h3 className="text-2xl font-bold">
                <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                  OJASS
                </span>
                <span className="text-gray-400"> | Sponsorship</span>
              </h3>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Partner with OJASS 2026 to reach an engaged student audience with on-ground and digital visibility.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="text-gray-400 hover:text-blue-400 transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#why-sponsor" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Why Sponsor
                </a>
              </li>
              <li>
                <a href="#packages" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Packages
                </a>
              </li>
              <li>
                <a href="#past-sponsors" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Past Sponsors
                </a>
              </li>
              <li>
                <a href="#faq" className="text-gray-400 hover:text-blue-400 transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-400 hover:text-blue-400 transition-colors">
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
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-blue-400 hover:bg-gray-700 transition-all duration-200"
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
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © OJASS 2026 | All rights reserved.
            </p>
            <p className="text-gray-400 text-sm">
              Designed and Developed by <span className="text-blue-400 font-semibold"><Link href="https://digicraft.one" target="_blank">Digicraft</Link></span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

