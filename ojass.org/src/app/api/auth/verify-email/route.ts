import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { isOTPExpired } from '@/utils/otp.util';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        let { email, otp } = body;

        email = (email || '').toLowerCase().trim();

        // Validate input
        if (!email || !otp) {
            return NextResponse.json({ error: 'Email and verification code are required' }, { status: 400 });
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
        }

        // Validate OTP format (6 digits)
        if (!/^\d{6}$/.test(otp.toString())) {
            return NextResponse.json({ error: 'Invalid verification code format' }, { status: 400 });
        }

        // Ensure DB connection
        try {
            await connectToDatabase();
        } catch (connErr) {
            console.error('Verify email: DB connection error', connErr);
            return NextResponse.json({ error: 'Database connection error' }, { status: 500 });
        }

        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Check if email is already verified
        if (user.isEmailVerified) {
            return NextResponse.json(
                { message: 'Email is already verified' },
                { status: 200 }
            );
        }

        // Check if OTP exists
        if (!user.emailOtp || !user.emailOtpExpires) {
            return NextResponse.json(
                { error: 'No verification code found. Please request a new one' },
                { status: 400 }
            );
        }

        // Check if OTP is expired
        if (isOTPExpired(user.emailOtpExpires)) {
            // Clear expired OTP
            user.emailOtp = undefined;
            user.emailOtpExpires = undefined;
            await user.save();

            return NextResponse.json(
                { error: 'Verification code has expired. Please request a new one' },
                { status: 400 }
            );
        }

        // Verify OTP
        if (user.emailOtp !== parseInt(otp)) {
            return NextResponse.json(
                { error: 'Invalid verification code' },
                { status: 400 }
            );
        }

        // Mark email as verified and clear OTP fields
        user.isEmailVerified = true;
        user.emailOtp = undefined;
        user.emailOtpExpires = undefined;
        await user.save();

        // Create user object without password
        const userObject = user.toObject();
        delete userObject.password;

        return NextResponse.json(
            { 
                message: 'Email verified successfully',
                user: userObject
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Verify email error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

