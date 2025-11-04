"use client";

import { motion } from "framer-motion";
import { User, Phone, Code } from "lucide-react";

interface UserCardProps {
  ojassId: string;
  name: string;
  phone: string;
  referralCode: string;
}

const UserCard = ({ ojassId, name, phone, referralCode }: UserCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
          <div className="w-12 h-12 bg-gradient-to-br from-[#FF8C00] to-[#FF6B00] rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{name}</h3>
            <p className="text-sm text-gray-500">Campus Ambassador</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Code className="w-5 h-5 text-[#FF8C00]" />
            </div>
            <div>
              <p className="text-sm text-gray-500">OJASS ID</p>
              <p className="font-semibold text-gray-900">{ojassId}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <Phone className="w-5 h-5 text-[#FF8C00]" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-semibold text-gray-900">{phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
              <Code className="w-5 h-5 text-[#FF8C00]" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Referral Code</p>
              <p className="font-semibold text-[#FF8C00]">{referralCode}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UserCard;

