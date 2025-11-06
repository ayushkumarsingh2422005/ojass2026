import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Team from "@/models/Team";
import { requireAdmin } from "@/lib/admin";
import { cookies } from "next/headers";

export async function POST(
  req: Request,
  { params }: { params: { registrationId: string } }
) {
  await connectToDatabase();

  try {
    // Get admin token from cookies
    const cookieStore = cookies();
    const tokenCookie = (await cookieStore).get("admin_token");
    requireAdmin(tokenCookie?.value); // throws if invalid

    const { registrationId } = params;

    // Find the team registration
    const registration = await Team.findById(registrationId);
    if (!registration) {
      return NextResponse.json(
        { error: "Registration not found" },
        { status: 404 }
      );
    }

    // Mark as verified
    registration.isVerified = true;
    await registration.save();

    return NextResponse.json({
      success: true,
      message: "Registration verified",
    });
  } catch (err: any) {
    const status = err.message.includes("Unauthorized") ? 401 : 400;
    return NextResponse.json({ error: err.message }, { status });
  }
}
