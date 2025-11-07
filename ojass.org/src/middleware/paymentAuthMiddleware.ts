import { NextResponse, NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

/**
 * Middleware to check if user has completed payment
 * This can be used to protect routes that require payment
 */
export async function requirePayment(request: NextRequest) {
    try {
        // Check authentication first
        const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        const token = authHeader.slice(7).trim();
        const JWT_SECRET = process.env.JWT_SECRET;

        if (!JWT_SECRET) {
            console.error('JWT_SECRET is not configured');
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        let decoded: { userId: string; email: string };
        try {
            decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
        } catch (jwtError) {
            return NextResponse.json(
                { error: 'Invalid or expired token' },
                { status: 401 }
            );
        }

        // Connect to database
        await connectToDatabase();

        // Find user and check payment status
        const user = await User.findById(decoded.userId).select('isPaid isEmailVerified');

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        if (!user.isEmailVerified) {
            return NextResponse.json(
                { error: 'Email verification required' },
                { status: 403 }
            );
        }

        if (!user.isPaid) {
            return NextResponse.json(
                { error: 'Payment required to access this resource' },
                { status: 402 } // 402 Payment Required
            );
        }

        // Payment verified, allow request to proceed
        const response = NextResponse.next();
        response.headers.set('x-user-id', decoded.userId);
        return response;

    } catch (error) {
        console.error('Payment middleware error:', error);
        return NextResponse.json(
            { error: 'Authentication failed' },
            { status: 500 }
        );
    }
}

/**
 * Helper function to verify user authentication and payment status
 * Can be used in API routes
 */
export async function verifyUserPayment(token: string): Promise<{ 
    success: boolean; 
    userId?: string; 
    error?: string; 
}> {
    try {
        const JWT_SECRET = process.env.JWT_SECRET;

        if (!JWT_SECRET) {
            return { success: false, error: 'Server configuration error' };
        }

        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };

        await connectToDatabase();

        const user = await User.findById(decoded.userId).select('isPaid isEmailVerified');

        if (!user) {
            return { success: false, error: 'User not found' };
        }

        if (!user.isEmailVerified) {
            return { success: false, error: 'Email verification required' };
        }

        if (!user.isPaid) {
            return { success: false, error: 'Payment required' };
        }

        return { success: true, userId: decoded.userId };

    } catch (error) {
        return { success: false, error: 'Invalid or expired token' };
    }
}

