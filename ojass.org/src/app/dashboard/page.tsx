"use client";
import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/contexts/ThemeContext";
import GlassyNeonBoard from "@/components/OverlayLayout/dashboard/GlassyNeonBorad";
import Profile from "@/components/OverlayLayout/dashboard/Profile";
import Receipt from "@/components/OverlayLayout/dashboard/Reciept";
import RegisteredEvent from "@/components/OverlayLayout/dashboard/RegisteredEvent";
import Team from "@/components/OverlayLayout/dashboard/Team";
import Certificate from "@/components/OverlayLayout/dashboard/Certificate";
import EmailVerificationModal from "@/components/OverlayLayout/dashboard/EmailVerificationModal";

export default function OjassDashboard() {
  const router = useRouter();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("profile");
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showEmailVerificationModal, setShowEmailVerificationModal] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [pricing, setPricing] = useState<any>(null);
  const currentUserId = profileData?._id || "u1";

  // 🌗 Theme-based color mapping (same concept as StarfleetContact)
  const glow = theme === "utopia" ? "#00ffff" : "#cc7722";
  const borderColor =
    theme === "utopia" ? "border-cyan-400" : "border-amber-500";
  const accentText =
    theme === "utopia" ? "text-cyan-300" : "text-amber-400";
  const buttonActiveBg =
    theme === "utopia" ? "bg-cyan-400/20" : "bg-amber-500/20";
  const buttonInactiveBorder =
    theme === "utopia" ? "border-cyan-400/30" : "border-amber-500/30";
  const buttonInactiveHover =
    theme === "utopia"
      ? "hover:border-cyan-400/60 hover:bg-cyan-400/10"
      : "hover:border-amber-500/60 hover:bg-amber-500/10";

  useEffect(() => {
    const fetchUserData = async () => {
      const user = localStorage.getItem('user');
      if (!user) {
        router.push('/login');
        return;
      }
      
      try {
        const userData = JSON.parse(user);
        const userProfile = {
          name: userData.name,
          email: userData.email,
          college: userData.collegeName,
          phone: userData.phone,
          ojassId: userData.ojassId,
          gender: userData.gender,
          city: userData.city,
          state: userData.state,
          isPaid: userData.isPaid,
          isEmailVerified: userData.isEmailVerified,
          referralCount: userData.referralCount || 0,
          idCardImageUrl: userData.idCardImageUrl || null,
          idCardCloudinaryId: userData.idCardCloudinaryId || null,
          _id: userData._id
        };
        setProfileData(userProfile);

        // Fetch payment status and pricing
        const token = localStorage.getItem('token');
        if (token) {
          // Fetch payment status
          const paymentRes = await fetch('/api/payment/status', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (paymentRes.ok) {
            const payment = await paymentRes.json();
            setPaymentData(payment);
            // Update profile data with latest payment status
            userProfile.isPaid = payment.isPaid;
            userProfile.isEmailVerified = payment.isEmailVerified;
            setProfileData({ ...userProfile });
          }

          // Fetch pricing
          const pricingRes = await fetch('/api/pricing', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (pricingRes.ok) {
            const pricingData = await pricingRes.json();
            setPricing(pricingData);
          }
        }
      } catch (err) {
        console.error('Error parsing user data:', err);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const teamData = [
    {
      _id: "t1",
      eventId: "e1",
      eventName: "Hackathon",
      isIndividual: false,
      teamName: "Code Warriors",
      teamLeader: "u1",
      teamMembers: [
        { _id: "u1", name: "Rahul Kumar" },
        { _id: "u2", name: "Aditi" },
        { _id: "u3", name: "Rohit" },
      ],
      joinToken: "ABC123",
      status: "Active",
    },
    {
      _id: "t2",
      eventId: "e2",
      eventName: "Robowars",
      isIndividual: false,
      teamName: "Robo Titans",
      teamLeader: "u4",
      teamMembers: [
        { _id: "u4", name: "Vikram" },
        { _id: "u5", name: "Neha" },
      ],
      joinToken: "XYZ987",
      status: "Active",
    },
  ];

  const userTeams = teamData.filter(team =>
    team.teamMembers.some(member => member._id === currentUserId)
  );

  const registeredEvents = [
    { id: 1, name: "Hackathon", date: "Nov 16, 2024", time: "9:00 AM", status: "Confirmed", team: "Code Warriors" },
    { id: 2, name: "Robowars", date: "Nov 15, 2024", time: "10:00 AM", status: "Confirmed", team: "Robo Titans" },
    { id: 3, name: "Tech Quiz", date: "Nov 17, 2024", time: "2:00 PM", status: "Pending", team: "Solo" },
  ];

  const certificates = [
    { id: 1, event: "Web Development Workshop", type: "Participation", date: "Nov 10, 2024" },
    { id: 2, event: "Coding Competition 2023", type: "Winner - 2nd Place", date: "Nov 5, 2023" },
  ];

  const stars = useMemo(
    () =>
      [...Array(20)].map((_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        delay: Math.random() * 3,
        opacity: Math.random() * 0.7 + 0.3,
      })),
    []
  );

  if (loading) {
    return (
      <div className="bg-black h-screen flex items-center justify-center">
        <div className="text-cyan-400 text-2xl animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!profileData) {
    return null;
  }

  return (
    <div className="bg-black relative overflow-hidden">
      {/* ✨ Star Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute w-1 h-1 rounded-full animate-pulse"
            style={{
              backgroundColor: glow,
              top: `${star.top}%`,
              left: `${star.left}%`,
              animationDelay: `${star.delay}s`,
              opacity: star.opacity,
            }}
          />
        ))}
      </div>

      {/* 🪩 Dashboard Layout */}
      <div className="relative h-full flex items-center justify-center px-2 sm:px-6 md:px-8 lg:px-12 py-12">
        <div className="w-full max-w-[90rem] xl:max-w-[110rem] 2xl:max-w-[130rem] 4xl:max-w-[150rem]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* PROFILE CARD */}
            <GlassyNeonBoard 
              title="PROFILE" 
              isEmailVerified={profileData?.isEmailVerified || false}
              isPaid={paymentData?.isPaid || false}
              pricing={pricing}
              onPaymentClick={() => setActiveTab('receipt')}
              onEmailVerificationClick={() => setShowEmailVerificationModal(true)}
              onRegisterNow={() => {
                // Navigate to events page for registration
                setActiveTab('events');
              }}
              onDownloadReceipt={() => {
                // Set flag to trigger receipt download
                sessionStorage.setItem('downloadReceipt', 'true');
                setActiveTab('receipt');
              }}
            >
              <div
                className="
                  overflow-y-auto
                  h-[60vh] sm:h-[70vh] md:h-[70vh] lg:h-[70vh] 
                  xl:h-[78vh] 2xl:h-[80vh] 4xl:h-[82vh]
                  scrollbar-thin scrollbar-thumb-cyan-500/40 scrollbar-track-transparent
                "
              >
                <Profile profileData={profileData} />
              </div>
            </GlassyNeonBoard>

            {/* DASHBOARD CARD */}
            <GlassyNeonBoard title="DASHBOARD">
              {/* Tabs */}
              <div className="flex gap-3 mb-8 flex-wrap">
                {["RECIEPT", "EVENTS", "TEAMS", "CERTIFICATES"].map((tab) => {
                  const isActive = activeTab === tab.toLowerCase();
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab.toLowerCase())}
                      className={`px-4 py-2 text-xs font-mono transition-all backdrop-blur-sm border ${buttonInactiveBorder} ${isActive
                        ? `${buttonActiveBg} ${accentText} border-2`
                        : `${accentText} opacity-70 ${buttonInactiveHover}`
                      }`}
                      style={{
                        clipPath:
                          "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
                      }}
                    >
                      {tab}
                    </button>
                  );
                })}
              </div>

              {/* Tab Content */}
              <div
                className="
                  overflow-y-auto
                  h-[55vh] sm:h-[60vh] md:h-[65vh] lg:h-[70vh]
                  xl:h-[73vh] 2xl:h-[75vh] 4xl:h-[77vh]
                  scrollbar-thin scrollbar-thumb-cyan-500/40 scrollbar-track-transparent
                "
              >
                {activeTab === "receipt" && <Receipt userData={profileData} />}
                {activeTab === "events" && (
                  <RegisteredEvent registeredEvents={registeredEvents} />
                )}
                {activeTab === "teams" && (
                  <Team teamData={userTeams} currentUserId={currentUserId} />
                )}
                {activeTab === "certificates" && (
                  <Certificate certificates={certificates} />
                )}
              </div>
            </GlassyNeonBoard>
          </div>
        </div>
      </div>

      {/* Email Verification Modal */}
      {showEmailVerificationModal && profileData && (
        <EmailVerificationModal
          isOpen={showEmailVerificationModal}
          onClose={() => setShowEmailVerificationModal(false)}
          email={profileData.email}
          onVerificationSuccess={() => {
            // Refresh user data
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const updatedUser = { ...user, isEmailVerified: true };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setProfileData({ ...profileData, isEmailVerified: true });
            // Reload page to refresh all data
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}
