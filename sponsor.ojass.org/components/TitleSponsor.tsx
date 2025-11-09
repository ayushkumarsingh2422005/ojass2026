"use client";

import { motion } from "framer-motion";
import { Crown, TrendingUp, Users, Megaphone, Target, Award } from "lucide-react";

const TitleSponsor = () => {
  const benefits = [
    {
      icon: Crown,
      title: "Exclusive Naming Rights",
      description: "It’s official — “OJASS powered by [Your Brand]” steals the spotlight everywhere!",
    },
    {
      icon: Megaphone,
      title: "Maximum Brand Buzz",
      description: "Own the vibe with stage domination, LED magic, and campus-wide takeover.",
    },
    {
      icon: Users,
      title: "VIP Access",
      description: "Get the red-carpet treatment at pro-shows, ceremonies, and flagship events.",
    },
    {
      icon: Target,
      title: "Power Positioning",
      description: "Stand tall as the ultimate champion of innovation and youth energy.",
    },
    {
      icon: TrendingUp,
      title: "Media Hype",
      description: "Go viral with co-branded reels, press buzz, and influencer collabs.",
    },
    {
      icon: Award,
      title: "Legacy Vibes",
      description: "Leave your mark — forever repping in OJASS history and alumni circles.",
    },
  ];

  return (
    <section className="relative py-20 bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-300 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-2 mb-6"
          >
            <Crown className="w-5 h-5 text-blue-300" />
            <span className="text-white font-semibold">Ultimate Visibility</span>
          </motion.div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Become the <span className="text-blue-300">Title Sponsor</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-300 to-blue-400 mx-auto mb-6"></div>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
          Own the spotlight — be the leading brand behind India’s most
          awaited student festival, reaching 25K+ on-ground and 5M+ online.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-300 to-blue-400 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-blue-900" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-blue-100 text-sm leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Stats Highlight */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 mb-12"
        >
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-300 mb-2">25,000+</div>
              <div className="text-blue-100">On-ground Attendees</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-300 mb-2">5M+</div>
              <div className="text-blue-100">Digital Impressions</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-300 mb-2">100+</div>
              <div className="text-blue-100">Partner Institutions</div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <p className="text-blue-100 text-lg mb-6">
            Limited opportunity. Only one title sponsor per edition.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="mailto:sponsorship@ojass.org?subject=Title%20Sponsorship%20Inquiry"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-400 to-blue-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Crown className="w-5 h-5" />
              Claim Title Sponsorship
            </motion.a>
            <motion.a
              href="/SCSE_brochure.pdf"
              download
              className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/20 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Download Detailed Deck
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TitleSponsor;

