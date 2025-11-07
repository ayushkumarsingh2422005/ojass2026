# Media/Image Upload System Documentation

Complete guide for uploading, managing, and retrieving images and files in OJASS 2026.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Setup Requirements](#setup-requirements)
3. [API Endpoints](#api-endpoints)
4. [Upload Files](#upload-files)
5. [Get File Details](#get-file-details)
6. [Update File Metadata](#update-file-metadata)
7. [Delete Files](#delete-files)
8. [Get User Files](#get-user-files)
9. [Examples](#examples)
10. [Error Handling](#error-handling)

---

## 🎯 Overview

The media upload system provides:
- ✅ **File upload** to Cloudinary
- ✅ **Metadata storage** in MongoDB
- ✅ **Multiple file support** (batch upload)
- ✅ **File size validation** (max 10MB per file)
- ✅ **CRUD operations** (Create, Read, Update, Delete)
- ✅ **User-based file organization**
- ✅ **ID card flagging** for registration
- ✅ **Automatic format detection**

---

## 🔧 Setup Requirements

### Environment Variables

Add these to your `.env.local`:

```bash
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Get Cloudinary Credentials

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Go to Dashboard
3. Copy your Cloud Name, API Key, and API Secret
4. Add to `.env.local`

---

## 🔌 API Endpoints

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/media/upload` | POST | No* | Upload files |
| `/api/media/[fileId]` | GET | No | Get file details |
| `/api/media/[fileId]` | DELETE | No* | Delete file |
| `/api/media/[fileId]/update` | PUT | No* | Update metadata |
| `/api/media/user/[userId]` | GET | No | Get user's files |

*Authentication recommended but not enforced (implement as needed)

---

## 📤 Upload Files

### Endpoint

**POST** `/api/media/upload`

### Description

Upload one or multiple files to Cloudinary and store metadata in database.

### Request

**Content-Type:** `multipart/form-data`

**Form Fields:**
- `files` (File or File[]) - **Required** - One or more files
- `userId` (string) - **Optional** - User ID (can upload before registration)
- `isIdCard` (boolean) - **Optional** - Flag as ID card (default: false)

### File Constraints

- **Max size:** 10MB per file
- **Supported types:** Images, videos, documents (auto-detected)
- **Multiple files:** Yes (batch upload supported)

### Response (201)

```json
{
  "message": "Files uploaded successfully",
  "files": [
    {
      "fileId": "673c98a1b2c3d4e5f6789012",
      "publicId": "ojass2026/uuid-generated-id",
      "url": "https://res.cloudinary.com/cloud/image/upload/v1234567890/ojass2026/file.jpg",
      "cloudinaryId": "ojass2026/uuid-generated-id",
      "imageUrl": "https://res.cloudinary.com/cloud/image/upload/v1234567890/ojass2026/file.jpg",
      "fileName": "profile-photo.jpg",
      "fileType": "image/jpeg",
      "fileSize": 245678,
      "resourceType": "image",
      "isIdCard": false,
      "createdAt": "2025-11-07T10:30:00.000Z"
    }
  ]
}
```

### Key Response Fields

- `fileId` - MongoDB document ID (use for CRUD operations)
- `publicId` / `cloudinaryId` - Cloudinary identifier (same value)
- `url` / `imageUrl` - File URL (same value, use to display)
- `fileName` - Original file name
- `fileType` - MIME type (e.g., image/jpeg)
- `fileSize` - Size in bytes
- `resourceType` - Resource type (image, video, raw)
- `isIdCard` - ID card flag
- `createdAt` - Upload timestamp

---

## 📥 Get File Details

### Endpoint

**GET** `/api/media/[fileId]`

### Description

Retrieve detailed information about a specific file.

### Parameters

- `fileId` (path parameter) - **Required** - MongoDB file ID

### Response (200)

```json
{
  "file": {
    "fileId": "673c98a1b2c3d4e5f6789012",
    "userId": {
      "_id": "673c98a1b2c3d4e5f6789999",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "publicId": "ojass2026/uuid-id",
    "url": "https://res.cloudinary.com/...",
    "cloudinaryId": "ojass2026/uuid-id",
    "imageUrl": "https://res.cloudinary.com/...",
    "fileName": "profile-photo.jpg",
    "fileType": "image/jpeg",
    "fileSize": 245678,
    "resourceType": "image",
    "folder": "ojass2026",
    "isIdCard": false,
    "createdAt": "2025-11-07T10:30:00.000Z",
    "updatedAt": "2025-11-07T10:30:00.000Z",
    "cloudinaryDetails": {
      "width": 1920,
      "height": 1080,
      "format": "jpg"
    }
  }
}
```

### Features

- ✅ Includes user information (if userId exists)
- ✅ Fetches additional Cloudinary metadata
- ✅ Returns full file details

---

## ✏️ Update File Metadata

### Endpoint

**PUT** `/api/media/[fileId]/update`

### Description

Update file metadata (database only, not the actual file).

### Parameters

- `fileId` (path parameter) - **Required** - MongoDB file ID

### Request Body

```json
{
  "fileName": "new-file-name.jpg",
  "isIdCard": true
}
```

**Updatable Fields:**
- `fileName` (string) - New file name
- `isIdCard` (boolean) - Update ID card flag

**Note:** At least one field must be provided

### Response (200)

```json
{
  "message": "File metadata updated successfully",
  "file": {
    "fileId": "673c98a1b2c3d4e5f6789012",
    "fileName": "new-file-name.jpg",
    "isIdCard": true,
    "updatedAt": "2025-11-07T11:00:00.000Z"
  }
}
```

### Use Cases

- Rename files
- Mark/unmark as ID card
- Update file categorization

---

## 🗑️ Delete Files

### Endpoint

**DELETE** `/api/media/[fileId]`

### Description

Delete a file from both Cloudinary and database.

### Parameters

- `fileId` (path parameter) - **Required** - MongoDB file ID

### Response (200)

```json
{
  "message": "File deleted successfully"
}
```

### Behavior

1. Deletes file from Cloudinary
2. Removes metadata from MongoDB
3. Continues even if Cloudinary deletion fails (logs error)

---

## 📂 Get User Files

### Endpoint

**GET** `/api/media/user/[userId]`

### Description

Get all files uploaded by a specific user.

### Parameters

- `userId` (path parameter) - **Required** - User MongoDB ID

### Query Parameters (Optional)

- `isIdCard` (boolean) - Filter by ID card flag
  - `?isIdCard=true` - Only ID cards
  - `?isIdCard=false` - Non-ID cards only
- `resourceType` (string) - Filter by resource type
  - `?resourceType=image` - Only images
  - `?resourceType=video` - Only videos

### Response (200)

```json
{
  "userId": "673c98a1b2c3d4e5f6789999",
  "totalFiles": 5,
  "files": [
    {
      "fileId": "673c98a1b2c3d4e5f6789012",
      "publicId": "ojass2026/uuid-id-1",
      "url": "https://res.cloudinary.com/...",
      "fileName": "profile-photo.jpg",
      "fileType": "image/jpeg",
      "fileSize": 245678,
      "resourceType": "image",
      "isIdCard": true,
      "createdAt": "2025-11-07T10:30:00.000Z",
      "updatedAt": "2025-11-07T10:30:00.000Z"
    }
  ]
}
```

### Features

- ✅ Sorted by newest first
- ✅ Supports filtering
- ✅ Returns count of total files

---

## 📝 Examples

### Example 1: Upload Single File (JavaScript/Fetch)

```javascript
const uploadFile = async (file, userId = null, isIdCard = false) => {
  const formData = new FormData();
  formData.append('files', file);
  
  if (userId) {
    formData.append('userId', userId);
  }
  
  if (isIdCard) {
    formData.append('isIdCard', 'true');
  }

  const response = await fetch('/api/media/upload', {
    method: 'POST',
    body: formData
  });

  const data = await response.json();
  return data;
};

// Usage
const fileInput = document.getElementById('file-input');
const file = fileInput.files[0];

const result = await uploadFile(file, 'user_id_here', true);
console.log('Uploaded:', result.files[0]);
```

---

### Example 2: Upload Multiple Files

```javascript
const uploadMultipleFiles = async (files, userId) => {
  const formData = new FormData();
  
  // Add all files
  files.forEach(file => {
    formData.append('files', file);
  });
  
  formData.append('userId', userId);

  const response = await fetch('/api/media/upload', {
    method: 'POST',
    body: formData
  });

  return await response.json();
};

// Usage
const fileInput = document.getElementById('file-input');
const files = Array.from(fileInput.files);

const result = await uploadMultipleFiles(files, 'user_id_here');
console.log(`Uploaded ${result.files.length} files`);
```

---

### Example 3: Upload with cURL

```bash
# Upload single file
curl -X POST http://localhost:3000/api/media/upload \
  -F "files=@/path/to/image.jpg" \
  -F "userId=673c98a1b2c3d4e5f6789999" \
  -F "isIdCard=true"

# Upload multiple files
curl -X POST http://localhost:3000/api/media/upload \
  -F "files=@/path/to/image1.jpg" \
  -F "files=@/path/to/image2.jpg" \
  -F "userId=673c98a1b2c3d4e5f6789999"
```

---

### Example 4: Get File Details

```javascript
const getFileDetails = async (fileId) => {
  const response = await fetch(`/api/media/${fileId}`);
  const data = await response.json();
  return data.file;
};

// Usage
const fileDetails = await getFileDetails('673c98a1b2c3d4e5f6789012');
console.log('File URL:', fileDetails.url);
console.log('File Name:', fileDetails.fileName);
```

---

### Example 5: Update File Metadata

```javascript
const updateFile = async (fileId, updates) => {
  const response = await fetch(`/api/media/${fileId}/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updates)
  });

  return await response.json();
};

// Usage
const result = await updateFile('673c98a1b2c3d4e5f6789012', {
  fileName: 'updated-name.jpg',
  isIdCard: true
});
console.log('Updated:', result.file);
```

---

### Example 6: Delete File

```javascript
const deleteFile = async (fileId) => {
  const response = await fetch(`/api/media/${fileId}`, {
    method: 'DELETE'
  });

  return await response.json();
};

// Usage
const result = await deleteFile('673c98a1b2c3d4e5f6789012');
console.log(result.message); // "File deleted successfully"
```

---

### Example 7: Get All User Files

```javascript
const getUserFiles = async (userId, filters = {}) => {
  const params = new URLSearchParams(filters);
  const url = `/api/media/user/${userId}?${params}`;
  
  const response = await fetch(url);
  const data = await response.json();
  return data.files;
};

// Usage - Get all files
const allFiles = await getUserFiles('673c98a1b2c3d4e5f6789999');

// Usage - Get only ID cards
const idCards = await getUserFiles('673c98a1b2c3d4e5f6789999', {
  isIdCard: 'true'
});

// Usage - Get only images
const images = await getUserFiles('673c98a1b2c3d4e5f6789999', {
  resourceType: 'image'
});
```

---

### Example 8: React Upload Component

```jsx
import { useState } from 'react';

const FileUploader = ({ userId, onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));
      formData.append('userId', userId);

      const response = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      onUploadComplete(data.files);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        multiple
        onChange={handleUpload}
        disabled={uploading}
      />
      {uploading && <p>Uploading...</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default FileUploader;
```

---

## ⚠️ Error Handling

### Common Errors

#### No Files Provided
```json
{
  "error": "No files provided"
}
```
**Status:** 400

---

#### File Too Large
```json
{
  "error": "File example.jpg exceeds maximum size of 10MB"
}
```
**Status:** 400

---

#### Invalid File ID
```json
{
  "error": "Invalid file ID format"
}
```
**Status:** 400

---

#### File Not Found
```json
{
  "error": "File not found"
}
```
**Status:** 404

---

#### Cloudinary Not Configured
```json
{
  "error": "Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in environment variables."
}
```
**Status:** 500

---

#### Database Connection Error
```json
{
  "error": "Database connection error"
}
```
**Status:** 500

---

## 🗄️ Database Schema

### Media Model

```javascript
{
  userId: ObjectId (ref: User, optional),
  publicId: String (unique, Cloudinary ID),
  url: String (file URL),
  fileName: String,
  fileType: String (MIME type),
  fileSize: Number (bytes),
  resourceType: String (image/video/raw),
  folder: String (Cloudinary folder),
  isIdCard: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### Indexes

```javascript
// Composite index for user queries
{ userId: 1, createdAt: -1 }

// Unique index for Cloudinary ID
{ publicId: 1 }
```

---

## 🔒 Security Considerations

### Current Implementation

- ✅ File size validation (10MB limit)
- ✅ MIME type detection
- ✅ Secure Cloudinary URLs
- ✅ MongoDB ObjectId validation

### Recommended Enhancements

1. **Authentication**
   - Add JWT authentication to upload endpoint
   - Verify userId matches authenticated user
   - Protect delete/update operations

2. **File Type Validation**
   - Whitelist allowed file types
   - Validate file content (not just extension)
   - Reject potentially harmful files

3. **Rate Limiting**
   - Limit uploads per user per hour
   - Prevent abuse

4. **Access Control**
   - Users can only delete their own files
   - Admin override capabilities

---

## 💡 Best Practices

### For Registration Flow

1. **Upload ID Card:**
```javascript
const uploadIDCard = async (file, userId) => {
  const formData = new FormData();
  formData.append('files', file);
  formData.append('userId', userId);
  formData.append('isIdCard', 'true');

  const response = await fetch('/api/media/upload', {
    method: 'POST',
    body: formData
  });

  const data = await response.json();
  return {
    idCardImageUrl: data.files[0].url,
    idCardCloudinaryId: data.files[0].publicId
  };
};
```

2. **Use in Registration:**
```javascript
const registerUser = async (userData, idCardFile) => {
  // First upload ID card
  const idCardData = await uploadIDCard(idCardFile, null);

  // Then register with ID card info
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...userData,
      ...idCardData
    })
  });

  return await response.json();
};
```

---

## 📊 Usage Statistics

### Query Examples

```javascript
// Count total files
await Media.countDocuments();

// Count files by user
await Media.countDocuments({ userId: 'user_id' });

// Count ID cards
await Media.countDocuments({ isIdCard: true });

// Total storage used (in bytes)
const result = await Media.aggregate([
  { $group: { _id: null, total: { $sum: '$fileSize' } } }
]);

// Files by resource type
await Media.aggregate([
  { $group: { _id: '$resourceType', count: { $sum: 1 } } }
]);
```

---

## 🚀 Performance Tips

1. **Batch Uploads**
   - Upload multiple files in one request
   - Reduces API calls

2. **Lazy Loading**
   - Load file details only when needed
   - Use pagination for user files list

3. **Caching**
   - Cache Cloudinary URLs (they're permanent)
   - Reduce database queries

4. **Image Optimization**
   - Use Cloudinary transformations
   - Resize images on the fly
   - Example: `${url.replace('/upload/', '/upload/w_500,h_500,c_fill/')}`

---

## 📚 Additional Resources

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Cloudinary Node.js SDK](https://cloudinary.com/documentation/node_integration)
- [Image Transformations](https://cloudinary.com/documentation/image_transformations)

---

## ✅ Testing Checklist

- [ ] Upload single file
- [ ] Upload multiple files
- [ ] Upload with userId
- [ ] Upload without userId
- [ ] Upload ID card (isIdCard=true)
- [ ] Get file details
- [ ] Update file metadata
- [ ] Delete file
- [ ] Get user files (all)
- [ ] Get user files (filtered by isIdCard)
- [ ] Get user files (filtered by resourceType)
- [ ] Handle file size limit
- [ ] Handle invalid file ID
- [ ] Handle missing files error

---

**Last Updated:** November 7, 2025  
**Version:** 1.0 (Media Upload System)

