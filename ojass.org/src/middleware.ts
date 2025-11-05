import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { adminMiddleware } from "@/middleware/adminAuthMiddleware";

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    if (path.startsWith("/api/events")) {
        return adminMiddleware(request);
    }

    return NextResponse.next();
}


export const config = {
    matcher: [
        "/api/events/:path*",
        "/admin/:path*",
        "/api/admin/:path*"
    ],
};
