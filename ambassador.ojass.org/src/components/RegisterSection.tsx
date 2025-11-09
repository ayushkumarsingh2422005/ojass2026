"use client";

import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";

const RegisterSection = () => {
  return (
    <section id="register" className="py-20 bg-gradient-to-br from-[#FF8C00] to-[#FF6B00] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <Mail className="w-16 h-16 text-white mx-auto mb-6" />
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Ready to Join the Team?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Be a Campus Ambassador, ignite innovation, and represent OJASS
          2026 — register today!
          </p>
          <motion.a
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-white text-[#FF8C00] px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Register Now
            <ArrowRight className="w-5 h-5" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default RegisterSection;
