/**
 * Generate a 6-digit OTP
 * @returns {number} 6-digit OTP
 */
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000);
};

/**
 * Check if OTP is expired
 * @param {Date} expiresAt - OTP expiration date
 * @returns {boolean} true if expired, false otherwise
 */
const isOTPExpired = (expiresAt) => {
    if (!expiresAt) return true;
    return new Date() > new Date(expiresAt);
};

/**
 * Get OTP expiration time (10 minutes from now)
 * @returns {Date} OTP expiration date
 */
const getOTPExpiration = () => {
    return new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
};

export { generateOTP, isOTPExpired, getOTPExpiration };

