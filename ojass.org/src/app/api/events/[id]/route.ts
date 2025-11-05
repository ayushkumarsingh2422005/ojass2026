import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Event from "@/models/Event";
import { verifyAdminToken } from "../../../../lib/auth";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();
  const event = await Event.findById(params.id);
  if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });
  return NextResponse.json(event);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    verifyAdminToken(token);

    const body = await req.json();
    const updatedEvent = await Event.findByIdAndUpdate(params.id, body, { new: true });
    return NextResponse.json(updatedEvent);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await connectToDatabase();
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    verifyAdminToken(token);

    await Event.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
