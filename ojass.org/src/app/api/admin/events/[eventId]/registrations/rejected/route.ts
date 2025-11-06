import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Team from "@/models/Team";
import { requireAdmin } from "@/lib/admin";
import { cookies } from "next/headers";

export async function GET_REJECTED(req: Request, { params }: { params: { eventId: string } }) {
  await connectToDatabase();
  try {
    const cookieStore = cookies();
    const tokenCookie = (await cookieStore).get("admin_token");
    requireAdmin(tokenCookie?.value);

    const { eventId } = params;
    const rejected = await Team.find({ eventId, isVerified: false })
      .populate("teamLeader", "name email phone")
      .populate("teamMembers", "name email phone")
      .sort({ createdAt: -1 });

    return NextResponse.json(rejected);
  } catch (err: any) {
    const status = err.message.includes("Unauthorized") ? 401 : 400;
    return NextResponse.json({ error: err.message }, { status });
  }
}
