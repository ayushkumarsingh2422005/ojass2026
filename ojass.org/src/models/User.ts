import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    
    // Unique OJASS ID
    ojassId: {
        type: String,
        unique: true,
        required: true,
        match: /^OJASS26[A-Z0-9]{4}$/
    },
    
    // Additional User Information
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    collegeName: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    
    // Referral System
    referredBy: {
        type: String, // OJASS ID of the referrer
        match: /^OJASS26[A-Z0-9]{4}$/
    },
    referralCount: {
        type: Number,
        default: 0
    },
    
    idCardImageUrl: {
        type: String, // Cloudinary URL
    },
    idCardCloudinaryId: {
        type: String,
    },
    isNitJsrStudent: {
        type: Boolean,
        default: false
    },

    isEmailVerified: {
        type: Boolean,
        default: false
    },

    // Otp and Otp expiration for email verification
    emailOtp: {
        type: Number,
    },
    emailOtpExpires: {
        type: Date
    },

    // Otp and Otp expiration for reset password
    resetPasswordOtp: {
        type: Number
    },
    resetPasswordOtpExpires: {
        type: Date
    },

    // Transaction Related Fields
    isPaid: {
        type: Boolean,
        default: false
    },
    paymentAmount: {
        type: Number,
    },
    paymentDate: {
        type: Date,
    },
    orderId: {
        type: String,
    },
    razorpayPaymentId: {
        type: String,
    },
    razorpayOrderId: {
        type: String,
    },
    razorpaySignature: {
        type: String,
    },
    notificationToken: {
        type: String,
    }

}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;