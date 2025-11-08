import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Event from "@/models/Event";
import { requireAdmin } from "@/lib/admin";
import { cookies } from "next/headers";
import { IPrizes, IEventHead } from "@/models/Event";

// Define the correct type for the route parameters based on the file name [eventId]
interface RouteParams {
    params: Promise<{
        eventId: string; // The dynamic route segment name must match
    }>;
}

// Validation helper function for updates (basic validation only)
function validateEventUpdateData(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Basic type checks only - let Mongoose handle the rest
    if (data.name !== undefined && typeof data.name !== "string") {
        errors.push("Event name must be a string");
    }

    if (data.img !== undefined && typeof data.img !== "string") {
        errors.push("Event image must be a string");
    }

    if (data.rulebookurl !== undefined && typeof data.rulebookurl !== "string") {
        errors.push("Rulebook URL must be a string");
    }

    if (data.redirect !== undefined && typeof data.redirect !== "string") {
        errors.push("Redirect path must be a string");
    }

    if (data.description !== undefined && typeof data.description !== "string") {
        errors.push("Event description must be a string");
    }

    if (data.teamSizeMin !== undefined && typeof data.teamSizeMin !== "number") {
        errors.push("Minimum team size must be a number");
    }

    if (data.teamSizeMax !== undefined && typeof data.teamSizeMax !== "number") {
        errors.push("Maximum team size must be a number");
    }

    if (data.isTeamEvent !== undefined && typeof data.isTeamEvent !== "boolean") {
        errors.push("isTeamEvent must be a boolean");
    }

    if (data.organizer !== undefined && data.organizer !== null && typeof data.organizer !== "string") {
        errors.push("Organizer must be a string");
    }

    if (data.prizes !== undefined && typeof data.prizes !== "object") {
        errors.push("Prizes must be an object");
    }

    if (data.details !== undefined && !Array.isArray(data.details)) {
        errors.push("Details must be an array");
    }

    if (data.rules !== undefined && !Array.isArray(data.rules)) {
        errors.push("Rules must be an array");
    }

    if (data.event_head !== undefined && typeof data.event_head !== "object") {
        errors.push("Event head must be an object");
    }

    if (data.winners !== undefined && !Array.isArray(data.winners)) {
        errors.push("Winners must be an array");
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}

// Public: Get a single event by ID
export async function GET(
    req: NextRequest,
    { params }: RouteParams
) {
    try {
        await connectToDatabase();
        const { eventId } = await params;

        const event = await Event.findById(eventId);
        
        if (!event) {
            return NextResponse.json(
                { error: "Event not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(event);
    } catch (err: any) {
        return NextResponse.json(
            { error: err.message || "Failed to fetch event" },
            { status: 500 }
        );
    }
}

// Protected: Update event by ID (Admin only)
export async function PUT(
    req: NextRequest,
    { params }: RouteParams
) {
    try {
        await connectToDatabase();
        const { eventId } = await params;

        // Verify admin authentication
        const cookieStore = await cookies();
        const tokenCookie = cookieStore.get("admin_token");
        requireAdmin(tokenCookie?.value);

        const body = await req.json();

        // Fetch existing event first
        const existingEvent = await Event.findById(eventId);
        if (!existingEvent) {
            return NextResponse.json(
                { error: "Event not found" },
                { status: 404 }
            );
        }

        // Prepare update data - merge with existing event
        const updateData: any = { ...body };

        // For individual events, ensure team sizes are set to 1
        if (updateData.isTeamEvent === false) {
            updateData.teamSizeMin = 1;
            updateData.teamSizeMax = 1;
        }

        // Convert team sizes to numbers if provided (Mongoose will validate)
        if (updateData.teamSizeMin !== undefined) {
            updateData.teamSizeMin = Number(updateData.teamSizeMin);
        }
        if (updateData.teamSizeMax !== undefined) {
            updateData.teamSizeMax = Number(updateData.teamSizeMax);
        }

        // Clean up arrays first (filter out empty strings) before validation
        if (updateData.details !== undefined && Array.isArray(updateData.details)) {
            updateData.details = updateData.details.filter((item: any) => 
                item !== null && item !== undefined && typeof item === 'string' && item.trim().length > 0
            );
            // If all items were filtered out, remove the field (don't update)
            if (updateData.details.length === 0) {
                delete updateData.details;
            }
        }

        if (updateData.rules !== undefined && Array.isArray(updateData.rules)) {
            updateData.rules = updateData.rules.filter((item: any) => 
                item !== null && item !== undefined && typeof item === 'string' && item.trim().length > 0
            );
            // If all items were filtered out, remove the field (don't update)
            if (updateData.rules.length === 0) {
                delete updateData.rules;
            }
        }

        // Filter out undefined values to allow partial updates
        Object.keys(updateData).forEach(key => {
            if (updateData[key] === undefined) {
                delete updateData[key];
            }
        });

        // Basic type validation only
        const validation = validateEventUpdateData(updateData);
        if (!validation.isValid) {
            return NextResponse.json(
                { error: "Validation failed", errors: validation.errors },
                { status: 400 }
            );
        }

        // Team size validation is handled by Mongoose schema validators
        // No need for manual validation here

        // Update the event
        // For team size validation to work properly, we need to update the document
        // and save it so validators can see both values together
        Object.keys(updateData).forEach(key => {
            (existingEvent as any)[key] = updateData[key];
        });
        
        // Validate before saving (this ensures team size validators see both values)
        await existingEvent.validate();
        
        // Save the updated event
        const updatedEvent = await existingEvent.save();

        return NextResponse.json(updatedEvent);
    } catch (err: any) {
        // Handle Mongoose validation errors
        if (err.name === "ValidationError") {
            const errors = Object.values(err.errors).map((e: any) => e.message);
            return NextResponse.json(
                { error: "Validation failed", errors },
                { status: 400 }
            );
        }

        // Handle authentication errors
        if (err.message?.includes("Unauthorized") || err.message?.includes("token") || err.message?.includes("No token")) {
            return NextResponse.json(
                { error: err.message },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { error: err.message || "Failed to update event" },
            { status: 500 }
        );
    }
}

// Protected: Delete event by ID (Admin only)
export async function DELETE(
    req: NextRequest,
    { params }: RouteParams
) {
    try {
        await connectToDatabase();
        const { eventId } = await params;

        // Verify admin authentication
        const cookieStore = await cookies();
        const tokenCookie = cookieStore.get("admin_token");
        requireAdmin(tokenCookie?.value);

        const deletedEvent = await Event.findByIdAndDelete(eventId);
        
        if (!deletedEvent) {
            return NextResponse.json(
                { error: "Event not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Event deleted successfully",
        });
    } catch (err: any) {
        // Handle authentication errors
        if (err.message?.includes("Unauthorized") || err.message?.includes("token") || err.message?.includes("No token")) {
            return NextResponse.json(
                { error: err.message },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { error: err.message || "Failed to delete event" },
            { status: 500 }
        );
    }
}