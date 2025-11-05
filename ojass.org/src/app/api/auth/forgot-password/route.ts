import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { generateOTP, getOTPExpiration } from '@/utils/otp.util';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        let { email } = body;

        // Basic normalization
        email = (email || '').toLowerCase().trim();

        // Validate input
        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
        }

        // Ensure DB connection is ready
        try {
            await connectToDatabase();
        } catch (connErr) {
            console.error('Forgot password: DB connection error', connErr);
            return NextResponse.json({ error: 'Database connection error' }, { status: 500 });
        }

        // Find user by email
        const user = await User.findOne({ email });

        // For security, always return the same message so callers cannot enumerate emails
        if (!user) {
            return NextResponse.json(
                { message: 'If an account exists with this email, a password reset code has been sent' },
                { status: 200 }
            );
        }

        // Generate OTP and expiration
        const otp = generateOTP();
        const otpExpires = getOTPExpiration();

    // Save OTP to user
    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpires = otpExpires;
    await user.save();

        // Send OTP via email using templates
        try {
            const { sendPasswordReset } = await import('@/utils/email.util');
            await sendPasswordReset(email, otp);
        } catch (emailError) {
            console.error('Error sending email:', emailError);
            // Still return success to prevent email enumeration
            // In development, log the OTP
            if (process.env.NODE_ENV === 'development') {
                console.log('Password reset OTP for', email, ':', otp);
            }
        }

        return NextResponse.json(
            { 
                message: 'If an account exists with this email, a password reset code has been sent',
                // Only return OTP in development for testing
                ...(process.env.NODE_ENV === 'development' && { otp })
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

