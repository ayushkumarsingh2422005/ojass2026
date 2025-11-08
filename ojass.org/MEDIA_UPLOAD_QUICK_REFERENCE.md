# Media Upload - Quick Reference

## 🚀 Quick Start

### Upload File (JavaScript)

```javascript
const formData = new FormData();
formData.append('files', file);
formData.append('userId', userId); // optional
formData.append('isIdCard', 'true'); // optional

const response = await fetch('/api/media/upload', {
  method: 'POST',
  body: formData
});

const { files } = await response.json();
console.log('Uploaded:', files[0].url);
```

---

## 📋 API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/media/upload` | POST | Upload files |
| `/api/media/[fileId]` | GET | Get file info |
| `/api/media/[fileId]/update` | PUT | Update metadata |
| `/api/media/[fileId]` | DELETE | Delete file |
| `/api/media/user/[userId]` | GET | Get user's files |

---

## 📤 Upload Response

```json
{
  "files": [{
    "fileId": "mongo_id",
    "url": "https://cloudinary.com/...",
    "cloudinaryId": "cloudinary_public_id",
    "imageUrl": "https://cloudinary.com/...",
    "fileName": "image.jpg",
    "fileType": "image/jpeg",
    "fileSize": 245678
  }]
}
```

**Use `fileId` for CRUD operations**  
**Use `url` or `imageUrl` to display**

---

## 💾 Store in User Registration

```javascript
// 1. Upload ID card
const { files } = await uploadFile(idCardFile);

// 2. Use in registration
await fetch('/api/auth/register', {
  method: 'POST',
  body: JSON.stringify({
    ...userData,
    idCardImageUrl: files[0].url,
    idCardCloudinaryId: files[0].cloudinaryId
  })
});
```

---

## 🔍 Get File Info

```javascript
const response = await fetch(`/api/media/${fileId}`);
const { file } = await response.json();
console.log(file.url, file.fileName);
```

---

## ✏️ Update Metadata

```javascript
await fetch(`/api/media/${fileId}/update`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    fileName: 'new-name.jpg',
    isIdCard: true
  })
});
```

---

## 🗑️ Delete File

```javascript
await fetch(`/api/media/${fileId}`, {
  method: 'DELETE'
});
```

---

## 📂 Get User Files

```javascript
// All files
const response = await fetch(`/api/media/user/${userId}`);

// Only ID cards
const response = await fetch(`/api/media/user/${userId}?isIdCard=true`);

// Only images
const response = await fetch(`/api/media/user/${userId}?resourceType=image`);

const { files, totalFiles } = await response.json();
```

---

## ⚙️ Environment Setup

```bash
# .env.local
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Get from: [cloudinary.com/console](https://cloudinary.com/console)

---

## ⚠️ Constraints

- **Max file size:** 10MB per file
- **Multiple files:** Supported
- **File types:** Auto-detected (images, videos, docs)

---

## 🎨 React Component Example

```jsx
function FileUpload({ userId }) {
  const [url, setUrl] = useState(null);
  
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('files', file);
    formData.append('userId', userId);
    
    const response = await fetch('/api/media/upload', {
      method: 'POST',
      body: formData
    });
    
    const { files } = await response.json();
    setUrl(files[0].url);
  };
  
  return (
    <>
      <input type="file" onChange={handleUpload} />
      {url && <img src={url} alt="Uploaded" />}
    </>
  );
}
```

---

## 📖 Full Documentation

See **MEDIA_UPLOAD_SYSTEM.md** for complete guide with all examples and error handling.

---

**Last Updated:** November 7, 2025

