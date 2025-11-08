/**
 * Pricing Utility
 * Handles pricing calculations based on user type and offer status
 */

export interface PricingInfo {
    amount: number; // Amount in rupees
    amountInPaise: number; // Amount in paise (for Razorpay)
    isNitJsrStudent: boolean;
    offerActive: boolean;
    category: 'NITJSR_WITH_OFFER' | 'NITJSR_WITHOUT_OFFER' | 'OUTSIDE_WITH_OFFER' | 'OUTSIDE_WITHOUT_OFFER';
}

/**
 * Check if user is from NIT JSR based on email
 * @param email - User's email address
 * @returns true if email ends with @nitjsr.ac.in
 */
export const isNitJsrEmail = (email: string): boolean => {
    const normalizedEmail = email.toLowerCase().trim();
    return normalizedEmail.endsWith('@nitjsr.ac.in');
};

/**
 * Get offer status from environment variables
 * @returns true if offer is active, false otherwise
 */
export const isOfferActive = (): boolean => {
    const offerStatus = process.env.OFFER_STATUS;
    return offerStatus === 'true' || offerStatus === '1';
};

/**
 * Get pricing for a user based on their email
 * @param email - User's email address
 * @returns Pricing information including amount, category, and flags
 */
export const getPricingForUser = (email: string): PricingInfo => {
    const isNitJsr = isNitJsrEmail(email);
    const offerActive = isOfferActive();

    let amount: number;
    let category: PricingInfo['category'];

    if (isNitJsr && offerActive) {
        amount = parseInt(process.env.PRICE_NITJSR_WITH_OFFER || '200');
        category = 'NITJSR_WITH_OFFER';
    } else if (isNitJsr && !offerActive) {
        amount = parseInt(process.env.PRICE_NITJSR_WITHOUT_OFFER || '300');
        category = 'NITJSR_WITHOUT_OFFER';
    } else if (!isNitJsr && offerActive) {
        amount = parseInt(process.env.PRICE_OUTSIDE_WITH_OFFER || '400');
        category = 'OUTSIDE_WITH_OFFER';
    } else {
        amount = parseInt(process.env.PRICE_OUTSIDE_WITHOUT_OFFER || '500');
        category = 'OUTSIDE_WITHOUT_OFFER';
    }

    return {
        amount,
        amountInPaise: amount * 100, // Convert to paise for Razorpay
        isNitJsrStudent: isNitJsr,
        offerActive,
        category,
    };
};

/**
 * Get all pricing tiers
 * @returns Object with all pricing tiers
 */
export const getAllPricing = () => {
    const offerActive = isOfferActive();

    return {
        offerActive,
        pricing: {
            nitjsr: {
                withOffer: parseInt(process.env.PRICE_NITJSR_WITH_OFFER || '200'),
                withoutOffer: parseInt(process.env.PRICE_NITJSR_WITHOUT_OFFER || '300'),
            },
            outside: {
                withOffer: parseInt(process.env.PRICE_OUTSIDE_WITH_OFFER || '400'),
                withoutOffer: parseInt(process.env.PRICE_OUTSIDE_WITHOUT_OFFER || '500'),
            },
        },
    };
};

/**
 * Validate pricing configuration
 * @throws Error if pricing environment variables are not properly configured
 */
export const validatePricingConfig = (): void => {
    const requiredVars = [
        'PRICE_NITJSR_WITH_OFFER',
        'PRICE_NITJSR_WITHOUT_OFFER',
        'PRICE_OUTSIDE_WITH_OFFER',
        'PRICE_OUTSIDE_WITHOUT_OFFER',
    ];

    const missing = requiredVars.filter(varName => !process.env[varName]);

    if (missing.length > 0) {
        throw new Error(
            `Missing required pricing environment variables: ${missing.join(', ')}`
        );
    }

    // Validate that all prices are valid numbers
    requiredVars.forEach(varName => {
        const value = parseInt(process.env[varName] || '');
        if (isNaN(value) || value < 0) {
            throw new Error(`Invalid pricing value for ${varName}: ${process.env[varName]}`);
        }
    });
};

