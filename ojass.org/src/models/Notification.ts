import mongoose, { Schema, Document, models } from "mongoose";

// Define TypeScript interface for Notification
export interface INotification extends Document {
    title: string;
    description: string;
    createdAt?: Date;
    updatedAt?: Date;
}

// Define Mongoose schema
const NotificationSchema = new Schema<INotification>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { timestamps: true }, // auto adds createdAt and updatedAt
);

// Avoid recompilation errors in Next.js (hot reload issue)
const Notification =
    models.Notification ||
    mongoose.model<INotification>("Notification", NotificationSchema);

export default Notification;
