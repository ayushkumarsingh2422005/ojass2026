import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Media from '@/models/Media';
import '@/models/User'
import { getFileDetailsFromCloudinary } from '@/utils/cloudinary.util';
import mongoose from 'mongoose';

// GET /api/media/:fileId - Get file details
export async function GET(request: NextRequest, context: any) {
    try {
        // `context.params` may be a promise in Next.js; await it first
        const paramsPromise = context?.params;
        const resolvedParams = paramsPromise ? await paramsPromise : undefined;
        const fileId = resolvedParams?.fileId;

        if (!fileId) {
            return NextResponse.json({ error: 'File ID is required' }, { status: 400 });
        }

        // Validate fileId format
        if (!mongoose.Types.ObjectId.isValid(fileId)) {
            return NextResponse.json(
                { error: 'Invalid file ID format' },
                { status: 400 }
            );
        }

        // Ensure DB connection
        try {
            await connectToDatabase();
        } catch (connErr) {
            console.error('Get file details: DB connection error', connErr);
            return NextResponse.json({ error: 'Database connection error' }, { status: 500 });
        }

        // Find file in database
        const media = await Media.findById(fileId).populate('userId', 'name email');

        if (!media) {
            return NextResponse.json(
                { error: 'File not found' },
                { status: 404 }
            );
        }

        // Get additional details from Cloudinary
        let cloudinaryDetails = null;
        try {
            cloudinaryDetails = await getFileDetailsFromCloudinary(media.publicId);
        } catch (error) {
            console.warn('Could not fetch Cloudinary details:', error);
            // Continue without Cloudinary details if file is not found there
        }

        // Format response (include cloudinaryId/imageUrl for consistency)
        const fileDetails = {
            fileId: media._id.toString(),
            userId: media.userId,
            publicId: media.publicId,
            url: media.url,
            cloudinaryId: media.publicId,
            imageUrl: media.url,
            fileName: media.fileName,
            fileType: media.fileType,
            fileSize: media.fileSize,
            resourceType: media.resourceType,
            folder: media.folder,
            isIdCard: media.isIdCard,
            createdAt: media.createdAt,
            updatedAt: media.updatedAt,
            cloudinaryDetails: cloudinaryDetails
        };

        return NextResponse.json({ file: fileDetails }, { status: 200 });
    } catch (error) {
        console.error('Get file details error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE /api/media/:fileId - Delete uploaded file
export async function DELETE(request: NextRequest, context: any) {
    try {
        // `context.params` may be a promise in Next.js; await it first
        const paramsPromise = context?.params;
        const resolvedParams = paramsPromise ? await paramsPromise : undefined;
        const fileId = resolvedParams?.fileId;

        if (!fileId) {
            return NextResponse.json({ error: 'File ID is required' }, { status: 400 });
        }

        // Validate fileId format
        if (!mongoose.Types.ObjectId.isValid(fileId)) {
            return NextResponse.json(
                { error: 'Invalid file ID format' },
                { status: 400 }
            );
        }

        // Ensure DB connection
        try {
            await connectToDatabase();
        } catch (connErr) {
            console.error('Delete file: DB connection error', connErr);
            return NextResponse.json({ error: 'Database connection error' }, { status: 500 });
        }

        // Find file in database
        const media = await Media.findById(fileId);

        if (!media) {
            return NextResponse.json(
                { error: 'File not found' },
                { status: 404 }
            );
        }

        // Delete from Cloudinary
        const { deleteFilesFromCloudinary } = await import('@/utils/cloudinary.util');
        try {
            await deleteFilesFromCloudinary([media.publicId]);
        } catch (error) {
            console.error('Error deleting from Cloudinary:', error);
            // Continue to delete from database even if Cloudinary deletion fails
        }

        // Delete from database
        await Media.findByIdAndDelete(fileId);

        return NextResponse.json({ message: 'File deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Delete file error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

