import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { adminMiddleware } from "./middleware/adminAuthMiddleware";

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    if (path.startsWith("/events")) {
        return adminMiddleware(request);
    }

    // Default allow
    return NextResponse.next();
}


export const config = {
    matcher: [
        "/events/:path*", // admin can access
        "/admin/:path*", // admin can access
    ],
};
