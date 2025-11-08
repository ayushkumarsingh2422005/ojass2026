import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { adminMiddleware } from "@/middleware/adminAuthMiddleware";

// Allowed origins for CORS
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',') || [
  'http://localhost:3001',
  'http://localhost:3000',
  'http://localhost:3002',
  'https://admin.ojass.org',
  'https://ojass.org',
];

/**
 * Add CORS headers to a NextResponse
 */
function addCorsHeaders(response: NextResponse, request: NextRequest): NextResponse {
  const origin = request.headers.get('origin');

  // Check if origin is allowed
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  } else if (origin && process.env.NODE_ENV === 'development' && origin.includes('localhost')) {
    // In development, allow any localhost origin
    response.headers.set('Access-Control-Allow-Origin', origin);
  } else if (!origin && process.env.NODE_ENV === 'development') {
    // Allow requests without origin in development (e.g., Postman, curl)
    response.headers.set('Access-Control-Allow-Origin', '*');
  }

  response.headers.set(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS, PATCH'
  );
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With'
  );
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Max-Age', '86400'); // 24 hours

  return response;
}

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Helper function to create CORS response
    const createCorsResponse = (response: NextResponse): NextResponse => {
        return addCorsHeaders(response, request);
    };

    // Handle CORS for all API routes
    // Handle OPTIONS preflight requests
    if (request.method === 'OPTIONS') {
        const response = new NextResponse(null, { status: 200 });
        return addCorsHeaders(response, request);
    }

    // Excluded Routes (don't require admin auth but need CORS)
    if (path.startsWith("/api/admin/auth")) {
        const response = NextResponse.next();
        return createCorsResponse(response);
    }

    // Public routes that don't need admin auth
    if (path === "/api/admin/events" && request.method === "GET") {
        const response = NextResponse.next();
        return createCorsResponse(response);
    }

    // Routes that need admin auth
    // Exclude public GET /api/admin/events from admin auth check
    const needsAdminAuth = (path.startsWith("/api/admin") || path.startsWith("/api/events")) 
        && !(path === "/api/admin/events" && request.method === "GET");
    
    if (needsAdminAuth) {
        // Check admin authentication
        const adminResponse = adminMiddleware(request);
        
        // If admin middleware returns an error response (status >= 400), add CORS and return it
        if (adminResponse && adminResponse.status >= 400) {
            return createCorsResponse(adminResponse);
        }
        
        // If authentication passes, continue with CORS headers
        // adminResponse will be NextResponse.next() when auth passes
        const response = adminResponse || NextResponse.next();
        return createCorsResponse(response);
    }

    // For all other API routes, just add CORS headers
    const response = NextResponse.next();
    return createCorsResponse(response);
}


export const config = {
    matcher: [
        "/api/:path*"
    ],
    runtime: 'nodejs'
};
