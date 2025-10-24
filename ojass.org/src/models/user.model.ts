import mongoose from "mongoose";
export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  idCardImage?: string;
  isEmailVerified: boolean;
  emailOtp?: number;
  emailOtpExpires?: Date;
  resetPasswordOtp?: number;
  resetPasswordOtpExpires?: Date;
  orderId?: string;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  razorpaySignature?: string;
  createdAt: Date;
  updatedAt: Date;
}
const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    idCardImage: {
      type: String, // Cloudinary URL
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    // Otp and Otp expiration for email verification
    emailOtp: {
      type: Number,
    },
    emailOtpExpires: {
      type: Date,
    },

    // Otp and Otp expiration for reset password
    resetPasswordOtp: {
      type: Number,
    },
    resetPasswordOtpExpires: {
      type: Date,
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
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
