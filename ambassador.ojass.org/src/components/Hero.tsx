"use client";

import { motion } from "framer-motion";
import { ArrowRight, Award, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-white via-blue-50/30 to-blue-50 pt-10">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#FF8C00]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF8C00]/10 to-[#FF6B00]/10 border border-[#FF8C00]/20 rounded-full px-4 py-2"
            >
              <Award className="w-4 h-4 text-[#FF8C00]" />
              <span className="text-sm font-semibold text-[#FF8C00]">
                ₹500 cashback on every 5 referrals
              </span>
            </motion.div>

            {/* Headline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-[#FF8C00] font-bold text-lg tracking-wide uppercase"
            >
              OJASS 2026 Presents
            </motion.p>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
            >
              Campus Ambassador
              <span className="block bg-gradient-to-r from-[#FF8C00] to-[#FF6B00] bg-clip-text text-transparent">
                Program
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-xl"
            >
              Join the OJASS team and help us spread innovation across campuses.
              Be the bridge between your college and India&apos;s premier tech fest.
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Link
                href="/dashboard"
                className="group inline-flex items-center gap-2 bg-gradient-to-r from-[#FF8C00] to-[#FF6B00] text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl transition-all duration-300"
              >
                Login for CA
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* Stats */}
            {/* <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="flex flex-wrap gap-6 pt-4"
            >
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#FF8C00]" />
                <span className="text-gray-700">
                  <span className="font-bold text-gray-900">2000+</span> CAs in 2024
                </span>
              </div>
            </motion.div> */}
          </motion.div>

          {/* Right Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <Image src="/sponsor.svg" alt="Sponsor" width={1000} height={1000} />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

