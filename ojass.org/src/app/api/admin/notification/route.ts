import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Notification from "@/models/Notification";

// ✅ Connect to MongoDB using MONGODB_URI from .env
async function connectDB() {
    if (mongoose.connection.readyState >= 1) return;

    const uri = process.env.MONGODB_URI;
    if (!uri) {
        throw new Error("MONGODB_URI is not defined in environment variables");
    }
    try {
        await mongoose.connect(uri);
        console.log("✅ MongoDB Connected");
    } catch (error) {
        console.error("❌ MongoDB connection error:", error);
        throw new Error("Database connection failed");
    }
}

// ✅ POST /api/admin/notification
// Creates a new notification
export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();
        const { title, description } = body;

        if (!title || !description) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Title and description are required",
                },
                { status: 400 },
            );
        }

        const notification = await Notification.create({ title, description });

        return NextResponse.json(
            {
                success: true,
                message: "Notification created successfully",
                data: notification,
            },
            { status: 201 },
        );
    } catch (error) {
        console.error("Error creating notification:", error);
        return NextResponse.json(
            { success: false, message: "Failed to create notification" },
            { status: 500 },
        );
    }
}

// ✅ GET /api/admin/notification
// Fetch all notifications
export async function GET() {
    try {
        await connectDB();

        const notifications = await Notification.find().sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            data: notifications,
        });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch notifications" },
            { status: 500 },
        );
    }
}
