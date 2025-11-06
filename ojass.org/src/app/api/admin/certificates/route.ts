import { NextResponse } from "next/server";
import mongoose, { Types } from 'mongoose'; 
import connectToDatabase from "@/lib/mongodb";
import Team from "@/models/Team"; 
import Event from "@/models/Event"; 

// --- Interface Definitions for Type Safety ---

// FIX: Updated to match your actual User schema: uses 'name' and 'isNitJsrStudent', removes 'fullName' and 'college'.
interface PopulatedTeam {
    _id: Types.ObjectId;
    eventId: {
        _id: Types.ObjectId;
        title: string;
        winners: Types.ObjectId[];
    };
    teamName?: string;
    isIndividual: boolean;
    // User fields: name (full name), email, isNitJsrStudent
    teamLeader: { _id: Types.ObjectId, name: string; email: string; isNitJsrStudent: boolean; };
    teamMembers: { _id: Types.ObjectId, name: string; email: string; isNitJsrStudent: boolean; }[];
}

// --- Helper Function ---

/**
 * Checks if a specific team ID exists in the event's winners array.
 */
const isWinner = (
    teamId: Types.ObjectId, 
    eventWinners: Types.ObjectId[]
): boolean => {
    // Uses Mongoose's .equals() for robust ObjectId comparison
    return eventWinners.some(winnerId => winnerId.equals(teamId));
};

// --- API Route Handler ---

/**
 * GET handler to fetch data for all verified participating teams and winners 
 * for certificate generation.
 */
export async function GET(req: Request) {
    await connectToDatabase();
    
    try {
        // 1. Fetch all verified teams (participants)
        const teams = await Team.find({ isVerified: true })
            .select('eventId teamName teamLeader teamMembers isIndividual') 
            .populate([
                // Populate event details (Title and Winners list)
                { 
                    path: 'eventId', 
                    select: 'title winners',
                    model: Event 
                },
                // Populate team leader details
                { 
                    path: 'teamLeader', 
                    // FIX: Use 'name' instead of 'fullName', remove 'college', add 'isNitJsrStudent'
                    select: 'name email isNitJsrStudent', 
                    model: 'User' 
                },
                // Populate team member details
                { 
                    path: 'teamMembers', 
                    // FIX: Use 'name' instead of 'fullName', remove 'college', add 'isNitJsrStudent'
                    select: 'name email isNitJsrStudent', 
                    model: 'User' 
                }
            ])
            // FINAL FIX: Cast to 'unknown' first to resolve the Mongoose FlattenMaps error
            .lean() as unknown as PopulatedTeam[]; 

        if (teams.length === 0) {
            return NextResponse.json({ message: "No verified teams or participants found." }, { status: 200 });
        }

        // 2. Process the data into individual certificate entries
        const certificateData: any[] = [];

        for (const team of teams) {
            // Safety check for successful population
            if (!team.eventId || !Array.isArray(team.teamMembers)) continue;

            const eventWinners = team.eventId.winners || [];
            const isTeamWinner = isWinner(team._id, eventWinners);
            
            const certificateType = isTeamWinner ? 'Winner' : 'Participation';
            const eventTitle = team.eventId.title;
            
            // Iterate over all populated members to create an entry for each certificate
            for (const member of team.teamMembers) {
                // Ensure the member object is populated and has an ID
                if (!member || !member._id) continue;
                
                // Determine if this specific member is the leader
                // Using .equals() on the populated leader's ID and the member's ID
                const isLeader = team.teamLeader._id.equals(member._id);
                
                // Use the member's name (which is the full name) as the "Team Name" for individual events
                const displayTeamName = team.isIndividual ? member.name : (team.teamName || 'N/A');

                certificateData.push({
                    eventId: team.eventId._id.toHexString(), 
                    teamId: team._id.toHexString(),
                    memberId: member._id.toHexString(),
                    eventTitle: eventTitle,
                    teamName: displayTeamName,
                    memberFullName: member.name, // FIX: Use member.name
                    memberEmail: member.email,
                    isNitJsrStudent: member.isNitJsrStudent, // FIX: Include available User field
                    certificateType: certificateType, 
                    isLeader: isLeader,
                });
            }
        }

        return NextResponse.json(certificateData);

    } catch (error) {
        console.error("Error fetching certificate data:", error);
        return NextResponse.json({ error: "Failed to fetch event data." }, { status: 500 });
    }
}