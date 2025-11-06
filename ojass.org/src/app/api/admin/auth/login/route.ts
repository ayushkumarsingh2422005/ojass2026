import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
//src/app/api/admin/auth/login/route.ts
export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        const adminUsers = process.env.ADMIN_USER_ID?.split(",") || [];
        const adminPasswords = process.env.ADMIN_PASSWORD?.split(",") || [];
        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            throw new Error("JWT_SECRET not defined in environment");
        }

        // Validate credentials
        const index = adminUsers.indexOf(email.trim());
        const isValid = index !== -1 && adminPasswords[index] === password;

        if (!isValid) {
            return NextResponse.json(
                { success: false, message: "Invalid email or password" },
                { status: 401 },
            );
        }

        // Generate JWT token
        const token = jwt.sign(
            { email, role: "admin" },
            jwtSecret,
            { expiresIn: "2h" }, // token valid for 2 hours
        );

        // Set JWT as HttpOnly cookie
        const response = NextResponse.json({
            success: true,
            message: "Admin login successful",
        });

        response.cookies.set({
            name: "admin_token",
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 2 * 60 * 60, // 2 hours
            path: "/",
        });

        return response;
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
