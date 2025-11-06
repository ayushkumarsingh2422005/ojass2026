import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Team from "@/models/Team";
import { requireAdmin } from "@/lib/admin";
import { cookies } from "next/headers";

export async function GET(
  req: Request,
  { params }: { params: { eventId: string; registrationId: string } }
) {
  await connectToDatabase();

  try {
    // Get token from admin cookie
    const cookieStore = cookies(); // no await here
    const tokenCookie = (await cookieStore).get("admin_token"); // directly get the cookie
    requireAdmin(tokenCookie?.value);

    const { registrationId } = params;

    // Find the team registration
    const registration = await Team.findById(registrationId)
      .populate("teamLeader", "name email phone")
      .populate("teamMembers", "name email phone");

    if (!registration) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 });
    }

    return NextResponse.json(registration, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }
}
