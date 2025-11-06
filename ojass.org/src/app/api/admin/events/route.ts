import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Event from "@/models/Event";
import { verifyAdminToken } from "../../../../lib/auth";
import {cookies} from "next/headers";

export async function GET() {
  await connectToDatabase();
  const events = await Event.find().sort({ createdAt: -1 });
  return NextResponse.json(events);
}

export async function POST(req: Request) {
  await connectToDatabase();
  try {
    const cookieStore = cookies();
    const tokenCookie  = (await cookieStore).get('admin_token');

    verifyAdminToken(tokenCookie?.value);
  
    const body = await req?.json()

    const newEvent = await Event.create(body);
    return NextResponse.json(newEvent, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
