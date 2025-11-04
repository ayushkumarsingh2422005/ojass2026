import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { isOTPExpired } from '@/utils/otp.util';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        let { email, otp, newPassword } = body;

        email = (email || '').toLowerCase().trim();

        // Validate input
        if (!email || !otp || !newPassword) {
            return NextResponse.json({ error: 'Email, OTP, and new password are required' }, { status: 400 });
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
        }

        // Password validation (at least 6 characters)
        if (typeof newPassword !== 'string' || newPassword.length < 6) {
            return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
        }

        // Validate OTP format (6 digits)
        if (!/^\d{6}$/.test(otp.toString())) {
            return NextResponse.json({ error: 'Invalid OTP format' }, { status: 400 });
        }

        // Ensure DB connection is ready
        try {
            await connectToDatabase();
        } catch (connErr) {
            console.error('Reset password: DB connection error', connErr);
            return NextResponse.json({ error: 'Database connection error' }, { status: 500 });
        }

        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            // Avoid exposing whether the email exists; generic error
            return NextResponse.json({ error: 'Invalid or expired reset code' }, { status: 400 });
        }

        // Check if OTP exists
        if (!user.resetPasswordOtp || !user.resetPasswordOtpExpires) {
            return NextResponse.json(
                { error: 'No password reset request found. Please request a new one' },
                { status: 400 }
            );
        }

        // Check if OTP is expired
        if (isOTPExpired(user.resetPasswordOtpExpires)) {
            // Clear expired OTP
            user.resetPasswordOtp = undefined;
            user.resetPasswordOtpExpires = undefined;
            await user.save();

            return NextResponse.json({ error: 'OTP has expired. Please request a new one' }, { status: 400 });
        }

        // Verify OTP
        if (user.resetPasswordOtp !== parseInt(otp)) {
            return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password and clear OTP fields
        user.password = hashedPassword;
        user.resetPasswordOtp = undefined;
        user.resetPasswordOtpExpires = undefined;
        await user.save();

        return NextResponse.json(
            { message: 'Password reset successful' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

