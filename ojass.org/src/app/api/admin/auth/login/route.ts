// app/api/admin/auth/login/route.js

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        const adminUsers = process.env.ADMIN_USER_ID?.split(",") || [];
        const adminPasswords = process.env.ADMIN_PASSWORD?.split(",") || [];

        // Check if email exists and matches password
        const index = adminUsers.indexOf(email.trim());
        const isValid = index !== -1 && adminPasswords[index] === password;

        if (!isValid) {
            return Response.json(
                { success: false, message: "Invalid email or password" },
                { status: 401 },
            );
        }

        return Response.json({
            success: true,
            message: "Admin login successful",
        });
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json(
                { success: false, message: error.message },
                { status: 500 },
            );
        }
        return NextResponse.json(
            { success: false, message: "Unexpected error" },
            { status: 500 },
        );
    }
}
