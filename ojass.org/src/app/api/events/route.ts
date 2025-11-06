import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Event from "@/models/Event";

export async function GET() {
  await connectToDatabase();
  const events = await Event.find().sort({ createdAt: -1 });
  return NextResponse.json(events);
}

export async function POST(req: Request) {
  await connectToDatabase();
  try {
  
    const body = await req?.json()

    const newEvent = await Event.create(body);
    return NextResponse.json(newEvent, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
