import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { generateOTP, getOTPExpiration } from '@/utils/otp.util';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        let { email } = body;

        // Normalize and validate input
        email = (email || '').toLowerCase().trim();
        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
        }

        // Ensure DB connection
        try {
            await connectToDatabase();
        } catch (connErr) {
            console.error('Send email verification: DB connection error', connErr);
            return NextResponse.json({ error: 'Database connection error' }, { status: 500 });
        }

        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Check if email is already verified
        if (user.isEmailVerified) {
            return NextResponse.json(
                { message: 'Email is already verified' },
                { status: 200 }
            );
        }

        // Generate OTP and expiration
        const otp = generateOTP();
        const otpExpires = getOTPExpiration();

        // Save OTP to user
        user.emailOtp = otp;
        user.emailOtpExpires = otpExpires;
        await user.save();

        // Send OTP via email using templates
        try {
            const { sendEmailVerification } = await import('@/utils/email.util');
            await sendEmailVerification(email, otp);
        } catch (emailError) {
            console.error('Error sending email:', emailError);
            // Still return success to prevent email enumeration
            // In development, log the OTP
            if (process.env.NODE_ENV === 'development') {
                console.log('Email verification OTP for', email, ':', otp);
            }
        }

        return NextResponse.json(
            { 
                message: 'Email verification code has been sent',
                // Only return OTP in development for testing
                ...(process.env.NODE_ENV === 'development' && { otp })
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Send email verification error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

