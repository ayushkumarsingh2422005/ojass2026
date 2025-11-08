import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { isValidOjassId, ojassIdExists, getUserByOjassId } from '@/utils/ojassId.util';

/**
 * POST /api/referral/validate
 * Validate if a referral code (OJASS ID) exists
 * Public endpoint (no authentication required)
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        let { referralCode } = body;

        if (!referralCode) {
            return NextResponse.json(
                { error: 'Referral code is required' },
                { status: 400 }
            );
        }

        // Normalize referral code
        referralCode = referralCode.toUpperCase().trim();

        // Validate format
        if (!isValidOjassId(referralCode)) {
            return NextResponse.json(
                { 
                    valid: false,
                    error: 'Invalid referral code format. Format should be OJASS26XXXX' 
                },
                { status: 200 }
            );
        }

        // Connect to database
        await connectToDatabase();

        // Check if exists
        const exists = await ojassIdExists(referralCode);

        if (!exists) {
            return NextResponse.json(
                { 
                    valid: false,
                    error: 'Referral code does not exist' 
                },
                { status: 200 }
            );
        }

        // Get referrer details (name only, for display)
        const referrer = await getUserByOjassId(referralCode);

        return NextResponse.json({
            valid: true,
            message: 'Valid referral code',
            referrer: {
                name: referrer?.name,
                ojassId: referralCode
            }
        }, { status: 200 });

    } catch (error: any) {
        console.error('Validate referral code error:', error);
        return NextResponse.json(
            { 
                error: 'Failed to validate referral code',
                details: error.message 
            },
            { status: 500 }
        );
    }
}

