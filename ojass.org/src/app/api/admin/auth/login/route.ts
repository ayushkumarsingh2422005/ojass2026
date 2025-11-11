import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
//src/app/api/admin/auth/login/route.ts

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        // Validate input
        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: "Email and password are required" },
                { status: 400 }
            );
        }

        const adminUsers = process.env.ADMIN_USER_ID?.split(",") || [];
        const adminPasswords = process.env.ADMIN_PASSWORD?.split(",") || [];
        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            throw new Error("JWT_SECRET not defined in environment");
        }

        // Validate that admin credentials are configured
        if (adminUsers.length === 0 || adminPasswords.length === 0) {
            return NextResponse.json(
                { success: false, message: "Admin credentials not configured" },
                { status: 500 }
            );
        }

        // Ensure arrays have matching lengths
        if (adminUsers.length !== adminPasswords.length) {
            console.error("Mismatch between ADMIN_USER_ID and ADMIN_PASSWORD array lengths");
            return NextResponse.json(
                { success: false, message: "Server configuration error" },
                { status: 500 }
            );
        }

        // Validate credentials
        // Trim email and password for comparison (handles whitespace in env file)
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();
        const index = adminUsers.findIndex((user) => user.trim() === trimmedEmail);
        const isValid = index !== -1 && adminPasswords[index]?.trim() === trimmedPassword;

        if (!isValid) {
            return NextResponse.json(
                { success: false, message: "Invalid email or password" },
                { status: 401 }
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

        // Get origin for SameSite cookie configuration
        const origin = req.headers.get('origin');
        const isProduction = process.env.NODE_ENV === "production";
        const isLocalhost = origin && (origin.includes('localhost') || origin.includes('127.0.0.1'));
        
        // Check if this is a cross-origin request by comparing origin with request URL
        const requestUrl = `${req.nextUrl.protocol}//${req.nextUrl.host}`;
        const isCrossOrigin = origin && origin !== requestUrl;
        
        // Cookie configuration:
        // - Cross-origin (including localhost different ports): SameSite=None
        //   - Production: Secure=true (requires HTTPS)
        //   - Development localhost: Secure=false (Chrome allows this)
        // - Same origin: SameSite=Lax, Secure based on environment
        let sameSite: "strict" | "lax" | "none" = "lax";
        let secure: boolean = isProduction;
        
        if (isCrossOrigin) {
            sameSite = "none";
            // Chrome allows Secure=false for localhost in development
            secure = isProduction || !isLocalhost;
        }

        response.cookies.set({
            name: "admin_token",
            value: token,
            httpOnly: true,
            secure: secure,
            sameSite: sameSite,
            maxAge: 2 * 60 * 60, // 2 hours
            path: "/",
        });

        return response;
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json(
                { success: false, message: error.message },
                { status: 500 }
            );
        }
        return NextResponse.json(
            { success: false, message: "Unexpected error" },
            { status: 500 }
        );
    }
}
