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
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
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

            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-full px-4 py-2"
            >
              <Award className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-600">
                Partner with India's premier tech fest
              </span>
            </motion.div>

            {/* Headline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-blue-600 font-bold text-lg tracking-wide uppercase"
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
              Sponsorship
              <span className="block bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              Opportunities
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-xl"
            >
              Amplify your brand with OJASS 2026 through national student reach,
              on-ground activations, digital campaigns, and recruitment touchpoints.
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Link
                href="/SCSE_brochure.pdf"
                download
                className="group inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl transition-all duration-300"
              >
                Download Brochure
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="flex flex-wrap gap-6 pt-4"
            >
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">
                  <span className="font-bold text-gray-900">25,000+</span> on-ground footfall
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* SVG Illustration */}
              <Image src="/hero-illustration.svg" alt="Hero Illustration" width={1000} height={1000} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

