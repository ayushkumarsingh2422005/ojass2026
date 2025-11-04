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