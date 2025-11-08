import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Media from '@/models/Media';
import mongoose from 'mongoose';

/**
 * PUT /api/media/:fileId/update
 * Update file metadata (not the actual file, just database info)
 */
export async function PUT(request: NextRequest, context: any) {
    try {
        // Get params from context
        const paramsPromise = context?.params;
        const resolvedParams = paramsPromise ? await paramsPromise : undefined;
        const fileId = resolvedParams?.fileId;

        if (!fileId) {
            return NextResponse.json(
                { error: 'File ID is required' },
                { status: 400 }
            );
        }

        // Validate fileId format
        if (!mongoose.Types.ObjectId.isValid(fileId)) {
            return NextResponse.json(
                { error: 'Invalid file ID format' },
                { status: 400 }
            );
        }

        // Get update data from request body
        const body = await request.json();
        const { fileName, isIdCard } = body;

        // Validate that at least one field is provided
        if (!fileName && isIdCard === undefined) {
            return NextResponse.json(
                { error: 'At least one field (fileName or isIdCard) must be provided' },
                { status: 400 }
            );
        }

        // Connect to database
        try {
            await connectToDatabase();
        } catch (connErr) {
            console.error('Update file: DB connection error', connErr);
            return NextResponse.json(
                { error: 'Database connection error' },
                { status: 500 }
            );
        }

        // Find and update file
        const updateData: any = {};
        if (fileName) updateData.fileName = fileName;
        if (isIdCard !== undefined) updateData.isIdCard = isIdCard;

        const updatedMedia = await Media.findByIdAndUpdate(
            fileId,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedMedia) {
            return NextResponse.json(
                { error: 'File not found' },
                { status: 404 }
            );
        }

        // Format response
        const fileDetails = {
            fileId: updatedMedia._id.toString(),
            userId: updatedMedia.userId,
            publicId: updatedMedia.publicId,
            url: updatedMedia.url,
            cloudinaryId: updatedMedia.publicId,
            imageUrl: updatedMedia.url,
            fileName: updatedMedia.fileName,
            fileType: updatedMedia.fileType,
            fileSize: updatedMedia.fileSize,
            resourceType: updatedMedia.resourceType,
            folder: updatedMedia.folder,
            isIdCard: updatedMedia.isIdCard,
            createdAt: updatedMedia.createdAt,
            updatedAt: updatedMedia.updatedAt
        };

        return NextResponse.json(
            {
                message: 'File metadata updated successfully',
                file: fileDetails
            },
            { status: 200 }
        );

    } catch (error: any) {
        console.error('Update file error:', error);
        return NextResponse.json(
            {
                error: 'Failed to update file',
                details: error.message
            },
            { status: 500 }
        );
    }
}

