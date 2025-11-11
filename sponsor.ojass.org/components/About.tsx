"use client";

import { motion } from "framer-motion";
import { Users, TrendingUp, Award } from "lucide-react";
import Image from "next/image";

const About = () => {
  const stats = [
    { year: "On-ground", count: "25,000+", label: "Attendees", icon: Users },
    { year: "Digital", count: "5M+", label: "Impressions", icon: TrendingUp },
    { year: "Campus", count: "100+", label: "Institutions", icon: Award },
  ];

  return (
    <section id="about" className="relative py-12 md:py-20 bg-gradient-to-b from-blue-50 to-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-16"
        >
          <div className="flex items-center justify-center gap-2 md:gap-4 mb-3 md:mb-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">
              ABOUT <span className="text-blue-600">OJASS</span>
            </h2>
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-700 mx-auto"></div>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto mb-8 md:mb-16"
        >
          <p className="text-base md:text-lg text-gray-700 leading-relaxed text-center mb-4 md:mb-6">
          OJASS — India's premier techno-management festival, where
innovation meets celebration — unites brilliant minds, creators, and
innovators through electrifying competitions, immersive workshops,
vibrant exhibitions, and spectacular pro-shows.

          </p>
          <p className="text-base md:text-lg text-gray-700 leading-relaxed text-center">
          Put your brand in the spotlight — engage high-intent students
through on-ground buzz, digital reach, stage presence, product
showcases, and recruitment touchpoints.

          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 max-w-5xl mx-auto">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.year}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-5 md:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
              >
                <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl mb-3 md:mb-4 mx-auto">
                  <Icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <div className="text-center">
                  <p className="text-xs md:text-sm text-gray-600 mb-1 md:mb-2">{stat.year}</p>
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">{stat.count}</h3>
                  <p className="text-sm md:text-base text-gray-600">{stat.label}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default About;

