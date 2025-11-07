import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

/**
 * PUT /api/user/id-card
 * Update user's ID card information
 * Requires authentication
 */
export async function PUT(request: NextRequest) {
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

        // Get request body
        const body = await request.json();
        const { idCardImageUrl, idCardCloudinaryId } = body;

        // Validate input
        if (!idCardImageUrl || !idCardCloudinaryId) {
            return NextResponse.json(
                { error: 'ID card image URL and Cloudinary ID are required' },
                { status: 400 }
            );
        }

        // Connect to database
        await connectToDatabase();

        // Find and update user
        const user = await User.findById(decoded.userId);

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Update ID card fields
        user.idCardImageUrl = idCardImageUrl;
        user.idCardCloudinaryId = idCardCloudinaryId;
        await user.save();

        // Return updated user (without password)
        const userObject = user.toObject();
        delete userObject.password;

        return NextResponse.json({
            message: 'ID card updated successfully',
            user: userObject
        }, { status: 200 });

    } catch (error: any) {
        console.error('Update ID card error:', error);
        return NextResponse.json(
            { 
                error: 'Failed to update ID card',
                details: error.message 
            },
            { status: 500 }
        );
    }
}

/**
 * GET /api/user/id-card
 * Get user's ID card information
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

        // Find user
        const user = await User.findById(decoded.userId).select('idCardImageUrl idCardCloudinaryId');

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            idCardImageUrl: user.idCardImageUrl || null,
            idCardCloudinaryId: user.idCardCloudinaryId || null,
            hasIdCard: !!user.idCardImageUrl
        }, { status: 200 });

    } catch (error: any) {
        console.error('Get ID card error:', error);
        return NextResponse.json(
            { 
                error: 'Failed to get ID card',
                details: error.message 
            },
            { status: 500 }
        );
    }
}

