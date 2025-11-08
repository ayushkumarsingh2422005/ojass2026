import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectToDatabase from '@/lib/mongodb';
import { getReferralStats } from '@/utils/ojassId.util';
import User from '@/models/User';

/**
 * GET /api/referral/stats
 * Get referral statistics for authenticated user
 * Requires authentication
 */
export async function GET(request: NextRequest) {
    try {
        // Check authentication
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
            console.error('JWT_SECRET not configured');
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        let decoded: { userId: string; email: string };
        try {
            decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
        } catch (jwtError) {
            console.error('JWT verification error:', jwtError);
            return NextResponse.json(
                { error: 'Invalid or expired token' },
                { status: 401 }
            );
        }

        // Connect to database
        await connectToDatabase();

        // Find user and get their OJASS ID
        const user = await User.findById(decoded.userId).select('ojassId');

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Get referral statistics
        const stats = await getReferralStats(user.ojassId);

        return NextResponse.json({
            success: true,
            ...stats,
        }, { status: 200 });

    } catch (error: any) {
        console.error('Get referral stats error:', error);
        return NextResponse.json(
            { 
                error: 'Failed to get referral statistics',
                details: error.message 
            },
            { status: 500 }
        );
    }
}

