"use client";

import { motion } from "framer-motion";
import { User, Phone, CheckCircle, XCircle } from "lucide-react";

interface ReferralCardProps {
  name: string;
  phone: string;
  status: "Paid" | "Unpaid";
}

const ReferralCard = ({ name, phone, status }: ReferralCardProps) => {
  const isPaid = status === "Paid";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4, shadow: "lg" }}
      className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#FF8C00]/20 to-[#FF6B00]/20 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-[#FF8C00]" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">{name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Phone className="w-4 h-4 text-gray-400" />
              <p className="text-sm text-gray-600">{phone}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <span className="text-sm text-gray-500">Status</span>
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
            isPaid
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {isPaid ? (
            <CheckCircle className="w-3.5 h-3.5" />
          ) : (
            <XCircle className="w-3.5 h-3.5" />
          )}
          {status}
        </span>
      </div>
    </motion.div>
  );
};

export default ReferralCard;

