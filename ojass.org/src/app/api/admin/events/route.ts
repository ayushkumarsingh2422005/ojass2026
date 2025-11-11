import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Event from "@/models/Event";
import { requireAdmin } from "@/lib/admin";
import { cookies } from "next/headers";
import { IPrizes, IEventHead } from "@/models/Event";

// Validation helper function
function validateEventData(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Required string fields
  if (!data.name || typeof data.name !== "string" || data.name.trim().length === 0) {
    errors.push("Event name is required and must be a non-empty string");
  }

  if (!data.img || typeof data.img !== "string" || data.img.trim().length === 0) {
    errors.push("Event image (banner) URL is required");
  }

  if (!data.rulebookurl || typeof data.rulebookurl !== "string" || data.rulebookurl.trim().length === 0) {
    errors.push("Rulebook URL is required");
  }

  if (!data.redirect || typeof data.redirect !== "string" || data.redirect.trim().length === 0) {
    errors.push("Redirect path is required");
  }

  if (!data.description || typeof data.description !== "string" || data.description.trim().length === 0) {
    errors.push("Event description is required");
  }

  // Team size validation
  if (typeof data.teamSizeMin !== "number" || data.teamSizeMin < 1) {
    errors.push("Minimum team size must be a number and at least 1");
  }

  if (typeof data.teamSizeMax !== "number" || data.teamSizeMax < 1) {
    errors.push("Maximum team size must be a number and at least 1");
  }

  if (data.teamSizeMin && data.teamSizeMax && data.teamSizeMax < data.teamSizeMin) {
    errors.push("Maximum team size must be greater than or equal to minimum team size");
  }

  // isTeamEvent validation
  if (typeof data.isTeamEvent !== "boolean") {
    errors.push("isTeamEvent must be a boolean value");
  }

  // Optional organizer field (if provided, must be string)
  if (data.organizer !== undefined && data.organizer !== null && typeof data.organizer !== "string") {
    errors.push("Organizer must be a string if provided");
  }

  // Prizes validation
  if (!data.prizes || typeof data.prizes !== "object") {
    errors.push("Prize information is required");
  } else {
    const prizes: IPrizes = data.prizes;
    if (!prizes.total || typeof prizes.total !== "string") {
      errors.push("Total prize is required");
    }
    if (!prizes.winner || typeof prizes.winner !== "string") {
      errors.push("Winner prize is required");
    }
    if (!prizes.first_runner_up || typeof prizes.first_runner_up !== "string") {
      errors.push("First runner-up prize is required");
    }
    if (!prizes.second_runner_up || typeof prizes.second_runner_up !== "string") {
      errors.push("Second runner-up prize is required");
    }
  }

  // Details validation
  if (!Array.isArray(data.details) || data.details.length === 0) {
    errors.push("Event details must be a non-empty array of strings");
  } else {
    const invalidDetails = data.details.some((detail: any) => typeof detail !== "string");
    if (invalidDetails) {
      errors.push("All event details must be strings");
    }
  }

  // Rules validation
  if (!Array.isArray(data.rules) || data.rules.length === 0) {
    errors.push("Event rules must be a non-empty array of strings");
  } else {
    const invalidRules = data.rules.some((rule: any) => typeof rule !== "string");
    if (invalidRules) {
      errors.push("All event rules must be strings");
    }
  }

  // Event head validation
  if (!data.event_head || typeof data.event_head !== "object") {
    errors.push("Event head information is required");
  } else {
    const eventHead: IEventHead = data.event_head;
    if (!eventHead.name || typeof eventHead.name !== "string" || eventHead.name.trim().length === 0) {
      errors.push("Event head name is required");
    }
    if (!eventHead.Phone || typeof eventHead.Phone !== "string" || eventHead.Phone.trim().length === 0) {
      errors.push("Event head phone number is required");
    }
  }

  // Winners validation (optional, but if provided, must be valid)
  if (data.winners !== undefined) {
    if (!Array.isArray(data.winners)) {
      errors.push("Winners must be an array if provided");
    } else if (data.winners.length > 3) {
      errors.push("Winners array cannot have more than 3 entries");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export async function GET() {
  try {
    await connectToDatabase();
    const events = await Event.find().sort({ createdAt: -1 });
    return NextResponse.json(events);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to fetch events" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    // Verify admin authentication
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("admin_token");
    requireAdmin(tokenCookie?.value);

    const body = await req.json();

    // Validate event data
    const validation = validateEventData(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: "Validation failed", errors: validation.errors },
        { status: 400 }
      );
    }

    // Create the event
    const newEvent = await Event.create(body);
    return NextResponse.json(newEvent, { status: 201 });
  } catch (err: any) {
    // Handle Mongoose validation errors
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((e: any) => e.message);
      return NextResponse.json(
        { error: "Validation failed", errors },
        { status: 400 }
      );
    }

    // Handle duplicate key errors
    if (err.code === 11000) {
      return NextResponse.json(
        { error: "Event with this name already exists" },
        { status: 409 }
      );
    }

    // Handle authentication errors
    if (err.message?.includes("Unauthorized") || err.message?.includes("token")) {
      return NextResponse.json(
        { error: err.message },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: err.message || "Failed to create event" },
      { status: 500 }
    );
  }
}
