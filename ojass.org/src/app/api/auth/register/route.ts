import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateUniqueOjassId, isValidOjassId, ojassIdExists, incrementReferralCount } from "@/utils/ojassId.util";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        let {
            name,
            email,
            phone,
            password,
            gender,
            collegeName,
            city,
            state,
            referralCode, // OJASS ID of referrer
            idCardImageUrl,
            idCardCloudinaryId,
            isNitJsrStudent,
        } = body;

        // Basic normalization/coercion
        name = (name || "").trim();
        email = (email || "").toLowerCase().trim();
        phone = (phone || "").replace(/\D/g, "").trim(); // keep digits only
        gender = (gender || "").trim();
        collegeName = (collegeName || "").trim();
        city = (city || "").trim();
        state = (state || "").trim();
        referralCode = referralCode ? (referralCode || "").toUpperCase().trim() : undefined;
        isNitJsrStudent = Boolean(isNitJsrStudent);

        // Validate required fields
        if (!name || !email || !phone || !password || !gender || !city || !state) {
            return NextResponse.json(
                { error: "Name, email, phone, password, gender, city, and state are required" },
                { status: 400 },
            );
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Invalid email format" },
                { status: 400 },
            );
        }

        // Basic phone validation (at least 10 digits)
        const phoneRegex = /^\d{10,}$/;
        if (!phoneRegex.test(phone)) {
            return NextResponse.json(
                { error: "Invalid phone number format" },
                { status: 400 },
            );
        }

        // Password validation (at least 6 characters)
        if (typeof password !== "string" || password.length < 6) {
            return NextResponse.json(
                { error: "Password must be at least 6 characters long" },
                { status: 400 },
            );
        }

        // Validate gender
        if (!['Male', 'Female', 'Other'].includes(gender)) {
            return NextResponse.json(
                { error: "Gender must be Male, Female, or Other" },
                { status: 400 },
            );
        }

        // Auto-detect NIT JSR student based on email
        const isNitJsrEmail = email.endsWith('@nitjsr.ac.in');
        // Override isNitJsrStudent if provided, otherwise use auto-detected value
        isNitJsrStudent = isNitJsrStudent || isNitJsrEmail;

        // Set college name automatically for NIT JSR students
        if (isNitJsrEmail) {
            collegeName = "NIT Jamshedpur";
        } else {
            // For non-NIT JSR students, college name is required
            if (!collegeName) {
                return NextResponse.json(
                    { error: "College name is required for students outside NIT Jamshedpur" },
                    { status: 400 },
                );
            }
        }

        try {
            await connectToDatabase();
        } catch (connErr) {
            console.error("Registration: DB connection error", connErr);
            return NextResponse.json(
                { error: "Database connection error" },
                { status: 500 },
            );
        }

        // Validate referral code if provided
        if (referralCode) {
            if (!isValidOjassId(referralCode)) {
                return NextResponse.json(
                    { error: "Invalid referral code format" },
                    { status: 400 },
                );
            }

            const referrerExists = await ojassIdExists(referralCode);
            if (!referrerExists) {
                return NextResponse.json(
                    { error: "Referral code does not exist" },
                    { status: 400 },
                );
            }
        }

        // DB connection is initialized on module import (see src/lib/mongodb.ts)

        // Check if user already exists (use normalized values)
        const existingUser = await User.findOne({
            $or: [{ email: email }, { phone: phone }],
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "User with this email or phone already exists" },
                { status: 409 },
            );
        }

        // Generate unique OJASS ID
        let ojassId: string;
        try {
            ojassId = await generateUniqueOjassId();
        } catch (error) {
            console.error("Error generating OJASS ID:", error);
            return NextResponse.json(
                { error: "Failed to generate OJASS ID. Please try again." },
                { status: 500 },
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
            ojassId: ojassId,
            gender: gender,
            collegeName: collegeName,
            city: city,
            state: state,
            referredBy: referralCode || undefined,
            idCardImageUrl: idCardImageUrl || undefined,
            idCardCloudinaryId: idCardCloudinaryId || undefined,
            isNitJsrStudent: isNitJsrStudent,
            isEmailVerified: false,
        });

        await newUser.save();

        // Increment referral count for referrer if applicable
        if (referralCode) {
            try {
                await incrementReferralCount(referralCode);
            } catch (error) {
                console.error("Error incrementing referral count:", error);
                // Don't fail registration if referral count update fails
            }
        }

        // Create user object without password
        const userObject = newUser.toObject();
        delete userObject.password;

        // Create JWT
        const JWT_SECRET = process.env.JWT_SECRET;
        if (!JWT_SECRET) {
            console.error("JWT_SECRET not set");
            return NextResponse.json(
                { error: "Server configuration error" },
                { status: 500 },
            );
        }

        const token = jwt.sign(
            { userId: newUser._id.toString(), email: newUser.email },
            JWT_SECRET,
            { expiresIn: "7d" },
        );

        // Return token in response body (Authorization: Bearer <token> for clients)
        return NextResponse.json(
            {
                message: "User registered successfully",
                user: userObject,
                token,
            },
            { status: 201 },
        );
    } catch (error: any) {
        console.error("Registration error:", error);

        // Handle duplicate key error
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return NextResponse.json(
                { error: `User with this ${field} already exists` },
                { status: 409 },
            );
        }

        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
