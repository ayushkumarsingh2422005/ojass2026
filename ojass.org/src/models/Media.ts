import mongoose, { Document, Schema } from 'mongoose';

export interface IMedia extends Document {
    userId?: mongoose.Types.ObjectId | null; // Optional - can be null if uploaded before registration
    publicId: string; // Cloudinary public_id
    url: string; // Cloudinary secure_url
    fileName: string;
    fileType: string; // MIME type
    fileSize: number; // File size in bytes
    resourceType: string; // image, video, raw, etc.
    folder?: string; // Optional folder path in Cloudinary
    isIdCard: boolean; // Flag for ID card upload (one-time)
    createdAt: Date;
    updatedAt: Date;
}

const mediaSchema = new Schema<IMedia>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: false,
            default: null,
            index: true
        },
        publicId: {
            type: String,
            required: true,
            unique: true
        },
        url: {
            type: String,
            required: true
        },
        fileName: {
            type: String,
            required: true
        },
        fileType: {
            type: String,
            required: true
        },
        fileSize: {
            type: Number,
            required: true
        },
        resourceType: {
            type: String,
            default: 'image'
        },
        folder: {
            type: String,
            default: 'ojass2026'
        },
        isIdCard: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

// Index for faster queries
mediaSchema.index({ userId: 1, createdAt: -1 });
mediaSchema.index({ publicId: 1 });

const Media = mongoose.models.Media || mongoose.model<IMedia>('Media', mediaSchema);

export default Media;

