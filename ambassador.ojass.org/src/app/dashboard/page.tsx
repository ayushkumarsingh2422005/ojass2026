"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import DashboardNavbar from "@/components/DashboardNavbar";
import UserCard from "@/components/UserCard";
import ReferralCard from "@/components/ReferralCard";
import StatsCards from "@/components/StatsCards";
import { useAuth } from "@/contexts/AuthContext";

// Mock referrals data - In production, this would come from an API
const mockReferrals = [
  {
    id: 1,
    name: "Alice Johnson",
    phone: "+91 9876543211",
    status: "Paid" as const,
  },
  {
    id: 2,
    name: "Bob Smith",
    phone: "+91 9876543212",
    status: "Unpaid" as const,
  },
  {
    id: 3,
    name: "Carol Williams",
    phone: "+91 9876543213",
    status: "Paid" as const,
  },
  {
    id: 4,
    name: "David Brown",
    phone: "+91 9876543214",
    status: "Unpaid" as const,
  },
  {
    id: 5,
    name: "Emma Davis",
    phone: "+91 9876543215",
    status: "Paid" as const,
  },
];

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  // Protect route - redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  // Show loading state while checking authentication
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF8C00] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalReferrals = mockReferrals.length;
  const totalPaid = mockReferrals.filter((r) => r.status === "Paid").length;
  const totalUnpaid = mockReferrals.filter((r) => r.status === "Unpaid").length;
  const earnings = "₹25,000"; // Placeholder

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <DashboardNavbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        {/* Dashboard Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
            Welcome to Your <span className="text-[#FF8C00]">OJASS Dashboard</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Track your referrals, payments, and OJASS ID here.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <StatsCards
            totalReferrals={totalReferrals}
            totalPaid={totalPaid}
            totalUnpaid={totalUnpaid}
            earnings={earnings}
          />
        </motion.div>

        {/* User Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <UserCard
            ojassId={user.ojassId}
            name={user.name}
            phone={user.phone}
            referralCode={user.referralCode}
          />
        </motion.div>

        {/* Referrals Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Referrals <span className="text-[#FF8C00]">List</span>
            </h2>
            <span className="text-sm text-gray-500">
              {totalReferrals} {totalReferrals === 1 ? "referral" : "referrals"}
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            {mockReferrals.map((referral, index) => (
              <motion.div
                key={referral.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
              >
                <ReferralCard
                  name={referral.name}
                  phone={referral.phone}
                  status={referral.status}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}

