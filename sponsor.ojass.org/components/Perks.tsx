"use client";

import { motion } from "framer-motion";
import {
  Gift,
  Award,
  Briefcase,
  Network,
  MessageSquare,
  FileText,
} from "lucide-react";

const Perks = () => {
  const perks = [
    {
      icon: Gift,
      title: "High-Impact Brand Visibility",
      description: "Stage mentions, logo placements, and venue branding across high-footfall zones.",
    },
    {
      icon: Award,
      title: "Flagship Stage Integrations",
      description: "Integrate with headliner events, pro-shows, and competitions for maximum recall.",
    },
    {
      icon: Briefcase,
      title: "Recruitment & Talent Access",
      description: "Run challenges, hackathons, or placement touchpoints to identify top talent.",
    },
    {
      icon: Network,
      title: "Digital Reach & Content",
      description: "Leverage multi-platform campaigns, reels, and email pushes to 5M+ impressions.",
    },
    {
      icon: MessageSquare,
      title: "Product Demos & Booths",
      description: "Engage audiences with booths, trials, and sampling during prime hours.",
    },
    {
      icon: FileText,
      title: "Customized Packages",
      description: "Tailored benefits that match your brand objectives and budget tiers.",
    },
  ];

  return (
    <section id="why-sponsor" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Why <span className="text-blue-600">Sponsor</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-700 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Drive awareness, engagement, and conversions with India’s most energetic student audience.
          </p>
        </motion.div>

        {/* Perks Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {perks.map((perk, index) => {
            const Icon = perk.icon;
            return (
              <motion.div
                key={perk.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 border border-gray-200 hover:border-blue-600 transition-all duration-300 hover:shadow-xl"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {perk.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{perk.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Perks;

