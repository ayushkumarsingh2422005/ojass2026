import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function adminMiddleware(request: NextRequest) {
    try {
        const adminToken = request.cookies.get("admin_token")?.value;

        if (!adminToken) {
            return NextResponse.json(
                { error: "Authentication token not found" },
                { status: 401 }
            );
        }

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is not configured");
            return NextResponse.json(
                { error: "Server configuration error" },
                { status: 500 }
            );
        }


        const decoded = jwt.verify(adminToken, process.env.JWT_SECRET);

        if (decoded?.role !== 'admin') {

            return NextResponse.json(
                { error: "Only admins can access this route!" },
                { status: 401 }
            );

        }
        const response = NextResponse.next();
        response.headers.set("x-admin-data", JSON.stringify(decoded));

        return response;

    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return NextResponse.json(
                { error: "Invalid token" },
                { status: 401 }
            );
        }

        if (error instanceof jwt.TokenExpiredError) {
            return NextResponse.json(
                { error: "Token expired" },
                { status: 401 }
            );
        }

        console.error("Middleware error:", error);

        return NextResponse.json(
            { error: "Authentication failed" },
            { status: 500 }
        );
    }
}