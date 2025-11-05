import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Media from '@/models/Media';
import mongoose from 'mongoose';

// GET /api/media/user/:userId - Get all user's uploaded files
export async function GET(
    request: NextRequest,
    { params }: { params: { userId: string } }
) {
    try {
        const { userId } = params;

        // Validate userId format
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return NextResponse.json(
                { error: 'Invalid user ID format' },
                { status: 400 }
            );
        }

    // DB connection is initialized on module import (see src/lib/mongodb.ts)

        // Get query parameters for filtering
        const { searchParams } = new URL(request.url);
        const isIdCard = searchParams.get('isIdCard');
        const resourceType = searchParams.get('resourceType');

        // Build query
        const query: any = { userId: userId };
        
        if (isIdCard !== null) {
            query.isIdCard = isIdCard === 'true';
        }
        
        if (resourceType) {
            query.resourceType = resourceType;
        }

        // Find all files for the user
        const files = await Media.find(query)
            .sort({ createdAt: -1 }) // Newest first
            .select('-__v');

        // Format response
        const filesList = files.map(file => ({
            fileId: file._id.toString(),
            publicId: file.publicId,
            url: file.url,
            fileName: file.fileName,
            fileType: file.fileType,
            fileSize: file.fileSize,
            resourceType: file.resourceType,
            folder: file.folder,
            isIdCard: file.isIdCard,
            createdAt: file.createdAt,
            updatedAt: file.updatedAt
        }));

        return NextResponse.json(
            {
                userId: userId,
                totalFiles: filesList.length,
                files: filesList
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Get user files error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

