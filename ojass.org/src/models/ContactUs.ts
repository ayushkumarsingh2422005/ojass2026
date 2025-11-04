// ...existing code...
import mongoose, { Document, Schema } from 'mongoose';

export interface ContactUsDocument extends Document {
    fullName: string;
    email: string;
    phone?: string;
    college: string;
    year?: string;
    eventName: mongoose.Types.ObjectId;
    doubt: string;
}

const ContactUsSchema = new Schema<ContactUsDocument>(
    {
        fullName: { type: String, required: true, trim: true },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, 'Invalid email address']
        },
        phone: { type: String, trim: true },
        college: { type: String, required: true, trim: true },
        year: { type: String, trim: true },
        eventName: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
        doubt: { type: String, required: true, trim: true }
    }
);

export default mongoose.model<ContactUsDocument>('ContactUs', ContactUsSchema);