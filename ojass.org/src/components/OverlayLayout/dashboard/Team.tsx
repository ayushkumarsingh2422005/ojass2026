"use client";

import React, { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import {
  FaPlus,
  FaTimes,
  FaEdit,
  FaCheck,
  FaUsers,
  FaTrash,
  FaSave,
} from "react-icons/fa";

type Member = { _id: string; name: string };
type Team = {
  _id: string;
  eventId: string;
  eventName: string;
  isIndividual: boolean;
  teamName: string;
  teamLeader: string;
  teamMembers: Member[];
  joinToken: string;
  status: string;
};

type TeamProps = {
  teamData: Team[];
  currentUserId: string;
};

export default function Team({ teamData, currentUserId }: TeamProps) {
  const { theme } = useTheme();
  const [openTeams, setOpenTeams] = useState<Record<string, boolean>>({});
  const [editingTeam, setEditingTeam] = useState<string | null>(null);
  const [editedTeamName, setEditedTeamName] = useState("");
  const [showAddMemberModal, setShowAddMemberModal] = useState<string | null>(null);
  const [newMemberName, setNewMemberName] = useState("");
  const [teams, setTeams] = useState<Team[]>(teamData);

  // 🎨 Theme-based colors
  const isUtopia = theme === "utopia";
  const glow = isUtopia ? "#00ffff" : "#cc7722";
  const borderColor = isUtopia ? "border-cyan-400" : "border-amber-500";
  const textPrimary = isUtopia ? "text-cyan-300" : "text-amber-400";
  const textSecondary = isUtopia ? "text-cyan-200/70" : "text-amber-200/70";
  const bgMain = isUtopia
    ? "from-cyan-500/10 to-blue-500/5 hover:from-cyan-500/20 hover:to-blue-500/10"
    : "from-amber-500/10 to-orange-500/5 hover:from-amber-500/20 hover:to-orange-500/10";
  const borderSoft = isUtopia ? "border-cyan-400/20" : "border-amber-500/20";
  const buttonBorder = isUtopia ? "border-cyan-400/50" : "border-amber-500/50";
  const buttonHover = isUtopia ? "hover:bg-cyan-500/10" : "hover:bg-amber-500/10";
  const accentBg = isUtopia ? "bg-cyan-500/10" : "bg-amber-500/10";

  const toggleMembers = (teamId: string) => {
    setOpenTeams((prev) => ({ ...prev, [teamId]: !prev[teamId] }));
  };

  const handleEditTeam = (teamId: string, currentName: string) => {
    setEditingTeam(teamId);
    setEditedTeamName(currentName);
  };

  const handleSaveTeamName = (teamId: string) => {
    if (editedTeamName.trim()) {
      setTeams((prev) =>
        prev.map((team) =>
          team._id === teamId ? { ...team, teamName: editedTeamName.trim() } : team
        )
      );
      console.log("Updated team name:", teamId, editedTeamName);
    }
    setEditingTeam(null);
    setEditedTeamName("");
  };

  const handleAddMember = (teamId: string) => {
    setShowAddMemberModal(teamId);
    setNewMemberName("");
  };

  const handleConfirmAddMember = (teamId: string) => {
    if (newMemberName.trim()) {
      const newMember: Member = { _id: `member_${Date.now()}`, name: newMemberName.trim() };
      setTeams((prev) =>
        prev.map((team) =>
          team._id === teamId
            ? { ...team, teamMembers: [...team.teamMembers, newMember] }
            : team
        )
      );
    }
    setShowAddMemberModal(null);
    setNewMemberName("");
  };

  const handleRemoveMember = (teamId: string, memberId: string) => {
    if (confirm("Are you sure you want to remove this member?")) {
      setTeams((prev) =>
        prev.map((team) =>
          team._id === teamId
            ? { ...team, teamMembers: team.teamMembers.filter((m) => m._id !== memberId) }
            : team
        )
      );
    }
  };

  const handleDeleteTeam = (teamId: string) => {
    if (confirm("Are you sure you want to delete this team?")) {
      setTeams((prev) => prev.filter((team) => team._id !== teamId));
    }
  };

  return (
    <div className="space-y-3">
      {teams.map((team) => {
        const isLeader = team.teamLeader === currentUserId;
        const isOpen = openTeams[team._id];
        const isEditing = editingTeam === team._id;

        return (
          <div
            key={team._id}
            className={`p-4 border ${borderSoft} bg-gradient-to-r ${bgMain} transition-all backdrop-blur-sm`}
            style={{
              clipPath:
                "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
              boxShadow: `0 0 15px ${glow}40`,
            }}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1">
                {isEditing ? (
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={editedTeamName}
                      onChange={(e) => setEditedTeamName(e.target.value)}
                      className={`text-sm font-semibold ${accentBg} border ${buttonBorder} rounded px-2 py-1 text-white focus:outline-none focus:border-[${glow}]`}
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveTeamName(team._id)}
                      className="text-green-400 hover:text-green-300"
                    >
                      <FaSave size={14} />
                    </button>
                    <button
                      onClick={() => setEditingTeam(null)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <FaTimes size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`text-sm font-semibold text-white`}>
                      {team.teamName}
                    </div>
                    {isLeader && (
                      <button
                        onClick={() => handleEditTeam(team._id, team.teamName)}
                        className={`${textPrimary} hover:opacity-80`}
                      >
                        <FaEdit size={13} />
                      </button>
                    )}
                  </div>
                )}

                <div className={`text-xs ${textPrimary} mt-1`}>
                  Event: {team.eventName}
                </div>
                <p className={`text-sm ${textSecondary}`}>
                  Team Leader: {team.teamLeader}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <span
                  className={`text-xs font-mono px-2 py-1 rounded ${
                    isUtopia ? "bg-green-500/20 text-green-300" : "bg-lime-600/20 text-lime-300"
                  }`}
                >
                  {team.status}
                </span>
                {isLeader && (
                  <button
                    onClick={() => handleDeleteTeam(team._id)}
                    className="text-xs px-2 py-1 bg-red-500/20 border border-red-400/50 rounded text-red-400 hover:bg-red-500/30 flex items-center gap-1 justify-center"
                  >
                    <FaTrash size={11} /> Delete
                  </button>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => toggleMembers(team._id)}
                className={`text-xs px-2 py-1 border ${buttonBorder} rounded ${textPrimary} ${buttonHover} flex items-center gap-1`}
              >
                {isOpen ? (
                  <>
                    <FaTimes size={12} /> Hide
                  </>
                ) : (
                  <>
                    <FaUsers size={12} /> Members
                  </>
                )}
              </button>
            </div>

            {isOpen && (
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-300">
                {team.teamMembers.map((member) => (
                  <span
                    key={member._id}
                    className={`px-2 py-0.5 rounded ${accentBg} flex items-center gap-1`}
                  >
                    {member.name}
                    {isLeader && (
                      <button
                        onClick={() => handleRemoveMember(team._id, member._id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <FaTimes size={10} />
                      </button>
                    )}
                  </span>
                ))}
                {isLeader && (
                  <button
                    onClick={() => handleAddMember(team._id)}
                    className={`flex items-center gap-1 px-2 py-1 ${textPrimary} border ${buttonBorder} rounded hover:bg-opacity-10 ${buttonHover}`}
                  >
                    <FaPlus size={10} /> Add Member
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <div
          className="absolute inset-0 bg-black/60 flex items-center justify-center"
          onClick={() => setShowAddMemberModal(null)}
        >
          <div
            className={`bg-gradient-to-br ${
              isUtopia ? "from-gray-900 to-gray-800" : "from-[#1e130c] to-[#9a8478]"
            } p-6 border ${buttonBorder} max-w-md w-full mx-4`}
            style={{
              clipPath:
                "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
              boxShadow: `0 0 30px ${glow}40`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FaPlus className={textPrimary} /> Add Team Member
            </h3>
            <input
              type="text"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              placeholder="Enter member name"
              className={`w-full ${accentBg} border ${buttonBorder} rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-[${glow}] mb-4`}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleConfirmAddMember(showAddMemberModal);
              }}
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowAddMemberModal(null)}
                className="px-4 py-2 border border-gray-500/50 rounded text-gray-300 hover:bg-gray-500/10 flex items-center gap-2"
              >
                <FaTimes size={12} /> Cancel
              </button>
              <button
                onClick={() => handleConfirmAddMember(showAddMemberModal)}
                className={`px-4 py-2 ${accentBg} border ${buttonBorder} rounded ${textPrimary} hover:opacity-80 flex items-center gap-2`}
              >
                <FaCheck size={12} /> Add Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
