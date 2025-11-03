import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        let { name, email, phone, password, idCardImageUrl, idCardCloudinaryId, isNitJsrStudent } = body;

        // Basic normalization/coercion
        name = (name || '').trim();
        email = (email || '').toLowerCase().trim();
        phone = (phone || '').replace(/\D/g, '').trim(); // keep digits only
        isNitJsrStudent = Boolean(isNitJsrStudent);

        // Validate required fields
        if (!name || !email || !phone || !password) {
            return NextResponse.json(
                { error: 'Name, email, phone, and password are required' },
                { status: 400 }
            );
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            );
        }

        // Basic phone validation (at least 10 digits)
        const phoneRegex = /^\d{10,}$/;
        if (!phoneRegex.test(phone)) {
            return NextResponse.json(
                { error: 'Invalid phone number format' },
                { status: 400 }
            );
        }

        // Password validation (at least 6 characters)
        if (typeof password !== 'string' || password.length < 6) {
            return NextResponse.json(
                { error: 'Password must be at least 6 characters long' },
                { status: 400 }
            );
        }

    // DB connection is initialized on module import (see src/lib/mongodb.ts)

        // Check if user already exists (use normalized values)
        const existingUser = await User.findOne({
            $or: [
                { email: email },
                { phone: phone }
            ]
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email or phone already exists' },
                { status: 409 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            name: name,
            email: email,
            phone: phone,
            password: hashedPassword,
            idCardImageUrl: idCardImageUrl || undefined,
            idCardCloudinaryId: idCardCloudinaryId || undefined,
            isNitJsrStudent: isNitJsrStudent,
            isEmailVerified: false
        });

        await newUser.save();

        // Create user object without password
        const userObject = newUser.toObject();
        delete userObject.password;

        // Create JWT
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            console.error('JWT_SECRET not set');
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        const token = jwt.sign({ userId: newUser._id.toString(), email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });

        // Return token in response body (Authorization: Bearer <token> for clients)
        return NextResponse.json(
            {
                message: 'User registered successfully',
                user: userObject,
                token
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Registration error:', error);
        
        // Handle duplicate key error
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return NextResponse.json(
                { error: `User with this ${field} already exists` },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

