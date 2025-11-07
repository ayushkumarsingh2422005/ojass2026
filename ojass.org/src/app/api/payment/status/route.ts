import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

/**
 * GET /api/payment/status
 * Get payment status for authenticated user
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
        const user = await User.findById(decoded.userId).select(
            'isPaid paymentAmount paymentDate razorpayPaymentId razorpayOrderId orderId isEmailVerified'
        );

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            isPaid: user.isPaid,
            isEmailVerified: user.isEmailVerified,
            paymentAmount: user.paymentAmount,
            paymentDate: user.paymentDate,
            orderId: user.orderId,
            razorpayPaymentId: user.razorpayPaymentId,
            razorpayOrderId: user.razorpayOrderId,
            paymentDetails: user.isPaid ? {
                amount: user.paymentAmount,
                date: user.paymentDate,
                orderId: user.orderId || user.razorpayOrderId,
                paymentId: user.razorpayPaymentId,
            } : null,
        }, { status: 200 });

    } catch (error: any) {
        console.error('Get payment status error:', error);
        return NextResponse.json(
            { 
                error: 'Failed to get payment status',
                details: error.message 
            },
            { status: 500 }
        );
    }
}

