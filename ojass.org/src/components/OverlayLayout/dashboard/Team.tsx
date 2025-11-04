"use client";

import React, { useState } from "react";
import { FaPlus, FaTimes, FaEdit, FaCopy, FaCheck, FaUsers, FaTrash, FaSave } from "react-icons/fa";

type Member = {
  _id: string;
  name: string;
};

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
  const [openTeams, setOpenTeams] = useState<Record<string, boolean>>({});
  const [editingTeam, setEditingTeam] = useState<string | null>(null);
  const [editedTeamName, setEditedTeamName] = useState("");
  const [showAddMemberModal, setShowAddMemberModal] = useState<string | null>(null);
  const [newMemberName, setNewMemberName] = useState("");
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [teams, setTeams] = useState<Team[]>(teamData);

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

  const handleCancelEdit = () => {
    setEditingTeam(null);
    setEditedTeamName("");
  };

  const handleAddMember = (teamId: string) => {
    setShowAddMemberModal(teamId);
    setNewMemberName("");
  };

  const handleConfirmAddMember = (teamId: string) => {
    if (newMemberName.trim()) {
      const newMember: Member = {
        _id: `member_${Date.now()}`,
        name: newMemberName.trim(),
      };
      
      setTeams((prev) =>
        prev.map((team) =>
          team._id === teamId
            ? { ...team, teamMembers: [...team.teamMembers, newMember] }
            : team
        )
      );
      
      console.log("Added member:", newMember, "to team:", teamId);
    }
    setShowAddMemberModal(null);
    setNewMemberName("");
  };

  const handleRemoveMember = (teamId: string, memberId: string) => {
    if (confirm("Are you sure you want to remove this member?")) {
      setTeams((prev) =>
        prev.map((team) =>
          team._id === teamId
            ? {
                ...team,
                teamMembers: team.teamMembers.filter((m) => m._id !== memberId),
              }
            : team
        )
      );
      console.log("Removed member:", memberId, "from team:", teamId);
    }
  };

  const handleDeleteTeam = (teamId: string) => {
    if (confirm("Are you sure you want to delete this team? This action cannot be undone.")) {
      setTeams((prev) => prev.filter((team) => team._id !== teamId));
      console.log("Deleted team:", teamId);
    }
  };

  const handleCopyToken = (token: string, teamId: string) => {
    navigator.clipboard.writeText(token);
    setCopiedToken(teamId);
    setTimeout(() => setCopiedToken(null), 2000);
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
            className="p-4 border border-cyan-400/20 bg-gradient-to-r from-cyan-500/10 to-blue-500/5 hover:from-cyan-500/20 hover:to-blue-500/10 transition-all backdrop-blur-sm"
            style={{
              clipPath:
                "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
              boxShadow: "0 0 15px rgba(0, 255, 255, 0.1)",
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
                      className="text-sm font-semibold bg-cyan-500/20 border border-cyan-400/50 rounded px-2 py-1 text-white focus:outline-none focus:border-cyan-400"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveTeamName(team._id)}
                      className="text-green-400 hover:text-green-300 transition-colors"
                      title="Save"
                    >
                      <FaSave size={14} />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="text-red-400 hover:text-red-300 transition-colors"
                      title="Cancel"
                    >
                      <FaTimes size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mb-1">
                    <div className="text-sm font-semibold text-white">{team.teamName}</div>
                    {isLeader && (
                      <button
                        onClick={() => handleEditTeam(team._id, team.teamName)}
                        className="text-cyan-400 hover:text-cyan-300 transition-colors"
                        title="Edit team name"
                      >
                        <FaEdit size={13} />
                      </button>
                    )}
                  </div>
                )}
                <div className="text-xs text-cyan-400 mt-1">Event: {team.eventName}</div>
                <p className="text-sm text-cyan-200/70">Team Leader: {team.teamLeader}</p>
              
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-xs font-mono px-2 py-1 rounded bg-green-500/20 text-green-300">
                  {team.status}
                </span>
                {isLeader && (
                  <button
                    onClick={() => handleDeleteTeam(team._id)}
                    className="text-xs px-2 py-1 bg-red-500/20 border border-red-400/50 rounded text-red-400 hover:bg-red-500/30 transition-colors flex items-center gap-1 justify-center"
                    title="Delete team"
                  >
                    <FaTrash size={11} /> Delete
                  </button>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => toggleMembers(team._id)}
                className="text-xs px-2 py-1 border border-cyan-400/50 rounded text-cyan-300 hover:bg-cyan-400/10 transition-colors flex items-center gap-1"
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
                    className="px-2 py-0.5 rounded bg-cyan-500/10 flex items-center gap-1"
                  >
                    {member.name}
                    {isLeader && (
                      <button
                        className="text-red-400 hover:text-red-300 transition-colors"
                        onClick={() => handleRemoveMember(team._id, member._id)}
                        title="Remove member"
                      >
                        <FaTimes size={10} />
                      </button>
                    )}
                  </span>
                ))}

                {isLeader && (
                  <button
                    onClick={() => handleAddMember(team._id)}
                    className="flex items-center gap-1 px-2 py-1 text-cyan-300 border border-cyan-500/50 rounded hover:bg-cyan-500/20 transition-colors"
                  >
                    <FaPlus size={10} /> Add Member
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}

      
      {showAddMemberModal && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center " onClick={() => setShowAddMemberModal(null)}>
          <div
            className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 border border-cyan-400/30 max-w-md w-full mx-4"
            style={{
              clipPath:
                "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
              boxShadow: "0 0 30px rgba(0, 255, 255, 0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FaPlus className="text-cyan-400" /> Add Team Member
            </h3>
            <input
              type="text"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              placeholder="Enter member name"
              className="w-full bg-cyan-500/10 border border-cyan-400/50 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 mb-4"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleConfirmAddMember(showAddMemberModal);
                }
              }}
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowAddMemberModal(null)}
                className="px-4 py-2 border border-gray-500/50 rounded text-gray-300 hover:bg-gray-500/10 transition-colors flex items-center gap-2"
              >
                <FaTimes size={12} /> Cancel
              </button>
              <button
                onClick={() => handleConfirmAddMember(showAddMemberModal)}
                className="px-4 py-2 bg-cyan-500/20 border border-cyan-400/50 rounded text-cyan-300 hover:bg-cyan-500/30 transition-colors flex items-center gap-2"
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