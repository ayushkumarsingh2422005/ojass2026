import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase, { connectPromise } from '@/lib/mongodb';
import Media from '@/models/Media';
import { uploadFilesToCloudinary } from '@/utils/cloudinary.util';

// Configure max file size (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

export async function POST(request: NextRequest) {
    try {
        // Get form data
        const formData = await request.formData();
        const files = formData.getAll('files') as File[];
        const userId = formData.get('userId') as string | null;
        const isIdCard = formData.get('isIdCard') === 'true';

        // Validate input
        if (!files || files.length === 0) {
            return NextResponse.json(
                { error: 'No files provided' },
                { status: 400 }
            );
        }

        // Note: userId is optional - files can be uploaded before user registration
        // ID card validation will be handled during registration if needed

        // Validate file size and convert to buffer format
        const fileBuffers = [];
        for (const file of files) {
            // Check file size
            if (file.size > MAX_FILE_SIZE) {
                return NextResponse.json(
                    { error: `File ${file.name} exceeds maximum size of 10MB` },
                    { status: 400 }
                );
            }

            // Convert File to buffer format expected by Cloudinary utility
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            fileBuffers.push({
                buffer: buffer,
                mimetype: file.type,
                originalname: file.name,
                size: file.size
            });
        }

        // Upload to Cloudinary
        const uploadResults = await uploadFilesToCloudinary(fileBuffers, {
            folder: 'ojass2026',
            resource_type: 'auto'
        });

    // DB connection is initialized on module import (see src/lib/mongodb.ts)

        // Ensure initial DB connection has completed to avoid buffering timeouts
        // Ensure DB connection — call connectToDatabase which will return cached.conn
        try {
            await connectToDatabase();
        } catch (connErr) {
            console.error('Upload: DB connection failed before insert', connErr);
            return NextResponse.json(
                { error: 'Database connection error' },
                { status: 500 }
            );
        }

        // Save file metadata to database
        const mediaDocuments = [];
        for (let i = 0; i < uploadResults.length; i++) {
            const result = uploadResults[i];
            const file = files[i];

            const mediaDoc = new Media({
                userId: userId || null,
                publicId: result.public_id,
                url: result.url,
                fileName: (result as any).original_filename || file.name,
                fileType: file.type,
                fileSize: (result as any).bytes || file.size,
                resourceType: (result as any).resource_type || 'image',
                folder: 'ojass2026',
                isIdCard: isIdCard || false
            });

            await mediaDoc.save();
            mediaDocuments.push(mediaDoc);
        }

        // Format response (include `imageUrl` and `cloudinaryId` for client convenience)
        const response = mediaDocuments.map(doc => ({
            fileId: doc._id.toString(),
            // legacy keys
            publicId: doc.publicId,
            url: doc.url,
            // new/explicit keys requested
            cloudinaryId: doc.publicId,
            imageUrl: doc.url,
            fileName: doc.fileName,
            fileType: doc.fileType,
            fileSize: doc.fileSize,
            resourceType: doc.resourceType,
            isIdCard: doc.isIdCard,
            createdAt: doc.createdAt
        }));

        return NextResponse.json(
            {
                message: files.length === 1 ? 'File uploaded successfully' : 'Files uploaded successfully',
                files: response
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('File upload error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

