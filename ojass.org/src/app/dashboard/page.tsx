"use client";
import React, { useState } from "react";
import GlassyNeonBoard from "@/components/OverlayLayout/dashboard/GlassyNeonBorad";
import Profile from "@/components/OverlayLayout/dashboard/Profile";
import Receipt from "@/components/OverlayLayout/dashboard/Reciept";
import RegisteredEvent from "@/components/OverlayLayout/dashboard/RegisteredEvent";
import Team from "@/components/OverlayLayout/dashboard/Team";
import Certificate from "@/components/OverlayLayout/dashboard/Certificate";

export default function OjassDashboard() {
  const [activeTab, setActiveTab] = useState("profile");
  const currentUserId = "u1";

  const profileData = {
    name: "Rahul Kumar",
    email: "rahul@example.com",
    college: "NIT Patna",
    phone: "+91 9876543210",
    ojassId: "OJASS2024-1234",
    year: "3rd Year",
    branch: "Computer Science",
  };

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
    team.teamMembers.some(member => member._id == currentUserId)
  );

  const registeredEvents = [
    { id: 1, name: "Hackathon", date: "Nov 16, 2024", time: "9:00 AM", status: "Confirmed", team: "Code Warriors" },
    { id: 2, name: "Robowars", date: "Nov 15, 2024", time: "10:00 AM", status: "Confirmed", team: "Robo Titans" },
    { id: 3, name: "Tech Quiz", date: "Nov 17, 2024", time: "2:00 PM", status: "Pending", team: "Solo" },
    { id: 3, name: "Tech Quiz", date: "Nov 17, 2024", time: "2:00 PM", status: "Pending", team: "Solo" },
    { id: 3, name: "Tech Quiz", date: "Nov 17, 2024", time: "2:00 PM", status: "Pending", team: "Solo" },
  ];

  const certificates = [
    { id: 1, event: "Web Development Workshop", type: "Participation", date: "Nov 10, 2024" },
    { id: 2, event: "Coding Competition 2023", type: "Winner - 2nd Place", date: "Nov 5, 2023" },
  ];

  const stars = React.useMemo(
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

  return (
    <div className="bg-black relative overflow-hidden">
      

      <div className="relative h-full flex items-center justify-center p-4 ">
        <div className="w-full max-w-[90rem] xl:max-w-[110rem] 2xl:max-w-[130rem] 4xl:max-w-[150rem]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            

            <GlassyNeonBoard title="PROFILE">
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

            
            <GlassyNeonBoard title="DASHBOARD">
              <div className="flex gap-3 mb-8 flex-wrap">
                {["RECIEPT", "EVENTS", "TEAMS", "CERTIFICATES"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab.toLowerCase())}
                    className={`px-4 py-2 text-xs font-mono transition-all backdrop-blur-sm border ${
                      activeTab === tab.toLowerCase()
                        ? "border-cyan-400 bg-cyan-400/20 text-cyan-200"
                        : "border-cyan-400/30 text-cyan-400/60 hover:border-cyan-400/60 hover:bg-cyan-400/10"
                    }`}
                    style={{
                      clipPath:
                        "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              
              <div
                className="
                  overflow-y-auto
                  h-[55vh] sm:h-[60vh] md:h-[65vh] lg:h-[70vh]
                  xl:h-[73vh] 2xl:h-[75vh] 4xl:h-[77vh]
                  scrollbar-thin scrollbar-thumb-cyan-500/40 scrollbar-track-transparent
                "
              >
                {activeTab === "receipt" && <Receipt />}
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

     
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute w-1 h-1 bg-cyan-300 rounded-full animate-pulse"
            style={{
              top: `${star.top}%`,
              left: `${star.left}%`,
              animationDelay: `${star.delay}s`,
              opacity: star.opacity,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}
