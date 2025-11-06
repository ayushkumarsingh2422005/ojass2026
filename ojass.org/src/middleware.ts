import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { adminMiddleware } from "@/middleware/adminAuthMiddleware";

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Excluded Routes
    if (path.startsWith("/api/admin/auth")) {
        return NextResponse.next();
    }

    // Included Routes
    if (path.startsWith("/api/events") || path.startsWith("/api/admin")) {
        return adminMiddleware(request);
    }

    return NextResponse.next();
}


export const config = {
    matcher: [
        "/api/events/:path*",
        "/api/admin/:path*"
    ],
    runtime: 'nodejs'
};
