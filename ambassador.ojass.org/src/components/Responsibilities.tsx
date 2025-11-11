"use client";

import { motion } from "framer-motion";
import { Megaphone, Users, Building2, Database } from "lucide-react";

const Responsibilities = () => {
  const responsibilities = [
    {
      icon: Megaphone,
      title: "Promote OJASS in your Campus",
      description: "Spread awareness about OJASS events, competitions, and opportunities.",
    },
    {
      icon: Users,
      title: "Be Our Campus Extension",
      description: "Act as the official OJASS representative at your college.",
    },
    {
      icon: Building2,
      title: "Coordinate with Administration",
      description: "Work with your college authorities and student bodies to facilitate events.",
    },
    {
      icon: Database,
      title: "Provide Data & Feedback",
      description: "Share insights and feedback to help us reach more students effectively.",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-blue-50">
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
            Your <span className="text-[#FF8C00]">Responsibilities</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#FF8C00] to-[#FF6B00] mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Be the link between our college and OJASS — driving innovation
and engagement!
          </p>
        </motion.div>

        {/* Responsibilities Grid */}
        <div className="grid sm:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {responsibilities.map((responsibility, index) => {
            const Icon = responsibility.icon;
            return (
              <motion.div
                key={responsibility.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#FF8C00] transition-colors">
                    {responsibility.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {responsibility.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Responsibilities;

