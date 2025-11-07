import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { verifyPaymentSignature } from '@/utils/razorpay.util';
import { getPricingForUser } from '@/utils/pricing.util';

/**
 * POST /api/payment/verify
 * Verify Razorpay payment signature and update user payment status
 * Requires authentication
 */
export async function POST(request: NextRequest) {
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

        // Get payment details from request body
        const body = await request.json();
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

        // Validate required fields
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return NextResponse.json(
                { error: 'Missing required payment details' },
                { status: 400 }
            );
        }

        // Connect to database
        await connectToDatabase();

        // Find user
        const user = await User.findById(decoded.userId);

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Check if user has already paid
        if (user.isPaid) {
            return NextResponse.json(
                { 
                    success: true,
                    message: 'Payment already verified',
                    isPaid: true 
                },
                { status: 200 }
            );
        }

        // Verify order ID matches
        if (user.razorpayOrderId !== razorpay_order_id) {
            return NextResponse.json(
                { error: 'Order ID mismatch' },
                { status: 400 }
            );
        }

        // Verify payment signature
        const isValidSignature = verifyPaymentSignature(
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        );

        if (!isValidSignature) {
            return NextResponse.json(
                { error: 'Invalid payment signature' },
                { status: 400 }
            );
        }

        // Get pricing info
        const pricing = getPricingForUser(user.email);

        // Update user payment status
        user.isPaid = true;
        user.razorpayPaymentId = razorpay_payment_id;
        user.razorpaySignature = razorpay_signature;
        user.paymentAmount = pricing.amount;
        user.paymentDate = new Date();
        await user.save();

        return NextResponse.json({
            success: true,
            message: 'Payment verified successfully',
            isPaid: true,
            paymentDetails: {
                orderId: razorpay_order_id,
                paymentId: razorpay_payment_id,
                amount: pricing.amount,
                date: user.paymentDate,
            },
        }, { status: 200 });

    } catch (error: any) {
        console.error('Payment verification error:', error);
        return NextResponse.json(
            { 
                error: 'Failed to verify payment',
                details: error.message 
            },
            { status: 500 }
        );
    }
}

