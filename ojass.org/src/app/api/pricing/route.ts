import { NextRequest, NextResponse } from 'next/server';
import { getPricingForUser, getAllPricing } from '@/utils/pricing.util';
import jwt from 'jsonwebtoken';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

/**
 * GET /api/pricing
 * Get pricing information for authenticated user or all pricing tiers
 */
export async function GET(request: NextRequest) {
    try {
        // Check if user is authenticated
        const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            // Return all pricing tiers if not authenticated
            const allPricing = getAllPricing();
            return NextResponse.json(allPricing, { status: 200 });
        }

        const token = authHeader.slice(7).trim();
        const JWT_SECRET = process.env.JWT_SECRET;

        if (!JWT_SECRET) {
            console.error('JWT_SECRET not configured');
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };

            // Connect to database
            await connectToDatabase();

            // Find user to get their email
            const user = await User.findById(decoded.userId).select('email isNitJsrStudent isPaid');

            if (!user) {
                return NextResponse.json(
                    { error: 'User not found' },
                    { status: 404 }
                );
            }

            // Get pricing for this user
            const pricing = getPricingForUser(user.email);

            return NextResponse.json({
                ...pricing,
                isPaid: user.isPaid,
                message: user.isPaid ? 'User has already paid' : 'Payment pending',
            }, { status: 200 });

        } catch (jwtError) {
            console.error('JWT verification error:', jwtError);
            return NextResponse.json(
                { error: 'Invalid or expired token' },
                { status: 401 }
            );
        }

    } catch (error) {
        console.error('Get pricing error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

