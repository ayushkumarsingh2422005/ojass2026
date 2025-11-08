"use client";

import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";

const RegisterSection = () => {
  return (
    <section id="register" className="py-20 bg-gradient-to-br from-blue-600 to-blue-700 relative overflow-hidden">
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
            Interested in Sponsoring?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Partner with OJASS 2026. Get the sponsorship deck, packages, and available integrations.
          </p>
          <motion.a
            href="mailto:sponsorship@ojass.org"
            className="inline-flex items-center gap-2 bg-white text-blue-700 px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Contact Sponsorship Team
            <ArrowRight className="w-5 h-5" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default RegisterSection;
