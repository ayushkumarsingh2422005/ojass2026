import User from '@/models/User';

/**
 * Generate a random 4-character alphanumeric string (uppercase)
 * @returns 4-character string with uppercase letters and numbers
 */
const generateRandomSuffix = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 4; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

/**
 * Generate a unique OJASS ID in format OJASS26XXXX
 * where XXXX is 4 uppercase alphanumeric characters
 * @returns Unique OJASS ID
 */
export const generateUniqueOjassId = async (): Promise<string> => {
    let ojassId: string;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    while (!isUnique && attempts < maxAttempts) {
        const suffix = generateRandomSuffix();
        ojassId = `OJASS26${suffix}`;

        // Check if this ID already exists
        const existingUser = await User.findOne({ ojassId });
        
        if (!existingUser) {
            isUnique = true;
            return ojassId;
        }

        attempts++;
    }

    // If we couldn't generate a unique ID after max attempts, throw error
    throw new Error('Unable to generate unique OJASS ID. Please try again.');
};

/**
 * Validate OJASS ID format
 * @param ojassId - OJASS ID to validate
 * @returns true if valid, false otherwise
 */
export const isValidOjassId = (ojassId: string): boolean => {
    const regex = /^OJASS26[A-Z0-9]{4}$/;
    return regex.test(ojassId);
};

/**
 * Check if OJASS ID exists in database
 * @param ojassId - OJASS ID to check
 * @returns true if exists, false otherwise
 */
export const ojassIdExists = async (ojassId: string): Promise<boolean> => {
    const user = await User.findOne({ ojassId });
    return !!user;
};

/**
 * Get user by OJASS ID
 * @param ojassId - OJASS ID to search for
 * @returns User object or null
 */
export const getUserByOjassId = async (ojassId: string) => {
    return await User.findOne({ ojassId });
};

/**
 * Increment referral count for a user
 * @param ojassId - OJASS ID of the referrer
 * @returns Updated user or null if not found
 */
export const incrementReferralCount = async (ojassId: string) => {
    return await User.findOneAndUpdate(
        { ojassId },
        { $inc: { referralCount: 1 } },
        { new: true }
    );
};

/**
 * Get referral statistics for a user
 * @param ojassId - OJASS ID of the user
 * @returns Referral stats including count and referred users
 */
export const getReferralStats = async (ojassId: string) => {
    const user = await User.findOne({ ojassId }).select('ojassId referralCount');
    
    if (!user) {
        throw new Error('User not found');
    }

    const referredUsers = await User.find({ referredBy: ojassId })
        .select('name email ojassId createdAt')
        .sort({ createdAt: -1 });

    return {
        ojassId: user.ojassId,
        referralCount: user.referralCount,
        referredUsers: referredUsers.map(u => ({
            name: u.name,
            email: u.email,
            ojassId: u.ojassId,
            registeredAt: u.createdAt
        }))
    };
};

