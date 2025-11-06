import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Team from "@/models/Team";
import { requireAdmin } from "@/lib/admin";
import { cookies } from "next/headers";

export async function GET(
  req: Request,
  { params }: { params: { eventId: string } }
) {
  await connectToDatabase();

  try {
    // Get the admin token from cookies
    const cookieStore = cookies(); // NO await here
    const tokenCookie =(await cookieStore).get("admin_token");
    requireAdmin(tokenCookie?.value); // Throws if invalid

    const { eventId } = params;

    // Find all teams/registrations for the event
    const registrations = await Team.find({ eventId })
      .populate("teamLeader", "name email phone")
      .populate("teamMembers", "name email phone")
      .sort({ createdAt: -1 });

    return NextResponse.json(registrations, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}
