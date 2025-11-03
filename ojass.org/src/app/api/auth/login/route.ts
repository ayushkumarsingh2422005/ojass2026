import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, phone, password } = body;

        // Validate input
        if (!password) {
            return NextResponse.json(
                { error: 'Password is required' },
                { status: 400 }
            );
        }

        if (!email && !phone) {
            return NextResponse.json(
                { error: 'Either email or phone number is required' },
                { status: 400 }
            );
        }

    // DB connection is initialized on module import (see src/lib/mongodb.ts)

        // Find user by email or phone
        let user;
        if (email) {
            user = await User.findOne({ email: email.toLowerCase().trim() });
        } else if (phone) {
            user = await User.findOne({ phone: phone.trim() });
        }

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Create user object without password
        const userObject = user.toObject();
        delete userObject.password;

        // Create JWT
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            console.error('JWT_SECRET not set');
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        const token = jwt.sign({ userId: user._id.toString(), email: user.email }, JWT_SECRET, { expiresIn: '7d' });

        // Return token in response body (client should store it and send in Authorization header)
        return NextResponse.json(
            {
                message: 'Login successful',
                user: userObject,
                token
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

