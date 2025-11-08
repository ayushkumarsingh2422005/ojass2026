import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Event from "@/models/Event";
import { requireAdmin } from "@/lib/admin";
import { cookies } from "next/headers";

// Define the correct type for the route parameters based on the file name [eventId]
interface RouteParams {
    params: {
        eventId: string; // The dynamic route segment name must match
    };
}

// Public: Get a single event by ID
export async function GET(
    req: Request,
    { params }: RouteParams // Using the corrected interface type
) {
    await connectToDatabase();

    // Use params.eventId to retrieve the ID from the URL
    const event = await Event.findById(params.eventId); 
    
    if (!event) {
        return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(event);
}

//-----------------------------------------------------------------------------

// Protected: Update event by ID (Admin only)
export async function PUT(
    req: Request,
    { params }: RouteParams // Using the corrected interface type
) {
    await connectToDatabase();

    try {
        // Get token from cookies
        const cookieStore = cookies();
        const tokenCookie = (await cookieStore).get("admin_token");
        requireAdmin(tokenCookie?.value); // throws if invalid

        const body = await req.json();
        
        // Use params.eventId. This line was the source of the previous runtime error.
        const updatedEvent = await Event.findByIdAndUpdate(params.eventId, body, {
            new: true,
        });

        if (!updatedEvent) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }

        return NextResponse.json(updatedEvent);
    } catch (err: any) {
        const status = err.message.includes("Unauthorized") ? 401 : 400;
        return NextResponse.json({ error: err.message }, { status });
    }
}

//-----------------------------------------------------------------------------

// Protected: Delete event by ID (Admin only)
export async function DELETE(
    req: Request,
    { params }: RouteParams // Using the corrected interface type
) {
    await connectToDatabase();

    try {
        // Get token from cookies
        const cookieStore = cookies();
        const tokenCookie =(await cookieStore).get("admin_token");
        requireAdmin(tokenCookie?.value); // throws if invalid

        // Use params.eventId to find and delete the document
        const deletedEvent = await Event.findByIdAndDelete(params.eventId);
        
        if (!deletedEvent) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        const status = err.message.includes("Unauthorized") ? 401 : 400;
        return NextResponse.json({ error: err.message }, { status });
    }
}