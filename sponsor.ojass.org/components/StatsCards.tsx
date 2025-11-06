"use client";

import { motion } from "framer-motion";
import { Users, CheckCircle, XCircle, DollarSign } from "lucide-react";

interface StatsCardsProps {
  totalReferrals: number;
  totalPaid: number;
  totalUnpaid: number;
  earnings: string;
}

const StatsCards = ({
  totalReferrals,
  totalPaid,
  totalUnpaid,
  earnings,
}: StatsCardsProps) => {
  const stats = [
    {
      label: "Total Referrals",
      value: totalReferrals.toString(),
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Total Paid",
      value: totalPaid.toString(),
      icon: CheckCircle,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
    },
    {
      label: "Total Unpaid",
      value: totalUnpaid.toString(),
      icon: XCircle,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
    },
    {
      label: "Earnings",
      value: earnings,
      icon: DollarSign,
      color: "from-[#FF8C00] to-[#FF6B00]",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={`${stat.bgColor} rounded-xl p-4 sm:p-6 border border-gray-100`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
              {stat.value}
            </p>
            <p className="text-xs sm:text-sm text-gray-600 font-medium">
              {stat.label}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
};

export default StatsCards;

