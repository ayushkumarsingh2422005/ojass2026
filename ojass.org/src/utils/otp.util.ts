/**
 * Generate a 6-digit OTP
 * @returns A 6-digit numeric OTP
 */
export const generateOTP = (): number => {
  return Math.floor(100000 + Math.random() * 900000);
};

/**
 * Check if OTP is expired
 * @param expiresAt - The expiration time of the OTP (Date or string)
 * @returns true if expired, false otherwise
 */
export const isOTPExpired = (expiresAt: Date | string): boolean => {
  if (!expiresAt) return true;
  return new Date() > new Date(expiresAt);
};

/**
 * Get OTP expiration time (10 minutes from now)
 * @returns The expiration timestamp
 */
export const getOTPExpiration = (): Date => {
  return new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
};
