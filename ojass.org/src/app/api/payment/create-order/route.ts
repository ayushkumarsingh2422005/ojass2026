import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { createOrder } from '@/utils/razorpay.util';
import { getPricingForUser } from '@/utils/pricing.util';

/**
 * POST /api/payment/create-order
 * Create a Razorpay order for user registration payment
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

        // Check if user email is verified
        if (!user.isEmailVerified) {
            return NextResponse.json(
                { error: 'Please verify your email before making payment' },
                { status: 403 }
            );
        }

        // Check if user has already paid
        if (user.isPaid) {
            return NextResponse.json(
                { error: 'Payment already completed', isPaid: true },
                { status: 400 }
            );
        }

        // Get pricing for user
        const pricing = getPricingForUser(user.email);

        // Validate pricing
        if (!pricing || !pricing.amountInPaise || pricing.amountInPaise <= 0) {
            console.error('Invalid pricing:', pricing);
            return NextResponse.json(
                { error: 'Invalid pricing configuration. Please contact support.' },
                { status: 500 }
            );
        }

        // Create Razorpay order
        // Receipt must be max 40 characters (Razorpay limit)
        // Format: OJASS26 + last 12 chars of user ID + last 6 digits of timestamp
        const userIdStr = user._id.toString();
        const timestamp = Date.now().toString();
        const receipt = `OJASS26${userIdStr.slice(-12)}${timestamp.slice(-6)}`;
        
        const orderOptions = {
            receipt: receipt,
            notes: {
                userId: user._id.toString(),
                userName: user.name,
                userEmail: user.email,
                category: pricing.category,
            },
        };

        let order;
        try {
            order = await createOrder(pricing.amountInPaise, 'INR', orderOptions);
        } catch (razorpayError: any) {
            console.error('Razorpay order creation error:', razorpayError);
            return NextResponse.json(
                { 
                    error: 'Failed to create payment order',
                    details: razorpayError.message || 'Razorpay API error. Please check your Razorpay credentials and configuration.'
                },
                { status: 500 }
            );
        }

        // Save order ID to user
        user.orderId = order.id;
        user.razorpayOrderId = order.id;
        await user.save();

        return NextResponse.json({
            success: true,
            order: {
                id: order.id,
                amount: order.amount,
                currency: order.currency,
                receipt: order.receipt,
            },
            pricing: {
                amount: pricing.amount,
                amountInPaise: pricing.amountInPaise,
                category: pricing.category,
                offerActive: pricing.offerActive,
            },
            razorpayKeyId: process.env.RAZORPAY_KEY_ID,
        }, { status: 201 });

    } catch (error: any) {
        console.error('Create order error:', error);
        console.error('Error stack:', error.stack);
        
        // Check for specific error types
        let errorMessage = 'Failed to create payment order';
        let errorDetails = error.message || 'Unknown error';

        // Check if it's a Razorpay credential error
        if (error.message?.includes('Razorpay credentials') || error.message?.includes('RAZORPAY')) {
            errorMessage = 'Payment gateway configuration error';
            errorDetails = 'Razorpay credentials are not properly configured. Please contact support.';
        }
        
        // Check if it's a pricing error
        if (error.message?.includes('pricing') || error.message?.includes('amount')) {
            errorMessage = 'Pricing configuration error';
            errorDetails = error.message;
        }

        return NextResponse.json(
            { 
                error: errorMessage,
                details: errorDetails
            },
            { status: 500 }
        );
    }
}

