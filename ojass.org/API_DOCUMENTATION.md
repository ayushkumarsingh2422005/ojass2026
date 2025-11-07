# OJASS 2026 - API Documentation

Complete API documentation for the OJASS 2026 event management system.

## Table of Contents

1. [Authentication & Authorization](#authentication--authorization)
2. [User Authentication Endpoints](#user-authentication-endpoints)
3. [Admin Authentication Endpoints](#admin-authentication-endpoints)
4. [Pricing Endpoints](#pricing-endpoints)
5. [Payment Endpoints](#payment-endpoints)
6. [Event Management Endpoints](#event-management-endpoints)
7. [Error Codes](#error-codes)
8. [Environment Setup](#environment-setup)

---

## Authentication & Authorization

### User Authentication
- Uses JWT (JSON Web Tokens)
- Token should be included in the `Authorization` header as: `Bearer <token>`
- Token expires in 7 days

### Admin Authentication
- Uses JWT stored in HTTP-only cookies
- Cookie name: `admin_token`
- Token expires in 2 hours

---

## User Authentication Endpoints

### 1. Register User

**Endpoint:** `POST /api/auth/register`

**Description:** Register a new user with email, phone, and password.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "password123",
  "gender": "Male",
  "city": "Mumbai",
  "state": "Maharashtra",
  "collegeName": "ABC College",
  "referralCode": "OJASS26A7B2",
  "idCardImageUrl": "https://cloudinary.com/image.jpg",
  "idCardCloudinaryId": "cloudinary_id"
}
```

**Required Fields:**
- `name` (string)
- `email` (string, valid email format)
- `phone` (string, at least 10 digits)
- `password` (string, minimum 6 characters)
- `gender` (string, must be: Male, Female, or Other)
- `city` (string)
- `state` (string)
- `collegeName` (string, required only for non-NIT JSR students)

**Optional Fields:**
- `referralCode` (string, valid OJASS ID format)
- `idCardImageUrl` (string)
- `idCardCloudinaryId` (string)

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "ojassId": "OJASS26X1Y2",
    "gender": "Male",
    "collegeName": "ABC College",
    "city": "Mumbai",
    "state": "Maharashtra",
    "referredBy": "OJASS26A7B2",
    "referralCount": 0,
    "isNitJsrStudent": false,
    "isEmailVerified": false,
    "isPaid": false
  },
  "token": "jwt_token"
}
```

**Validation:**
- Name, email, phone, password, gender, city, and state are required
- Email must be valid format
- Phone must be at least 10 digits
- Password must be at least 6 characters
- Gender must be Male, Female, or Other
- College name is auto-set to "NIT Jamshedpur" for @nitjsr.ac.in emails
- College name is required for non-NIT JSR students
- Referral code must be valid OJASS ID format if provided

---

### 2. Login User

**Endpoint:** `POST /api/auth/login`

**Description:** Login with email or phone and password.

**Request Body:**
```json
{
  "email": "john@example.com",  // email OR phone required
  "phone": "9876543210",        // email OR phone required
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "isEmailVerified": true,
    "isPaid": false
  },
  "token": "jwt_token"
}
```

---

### 3. Logout User

**Endpoint:** `POST /api/auth/logout`

**Description:** Logout user (client should discard the token).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Logout successful"
}
```

---

### 4. Send Email Verification OTP

**Endpoint:** `POST /api/auth/send-email-verification`

**Description:** Send OTP to user's email for verification.

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response (200):**
```json
{
  "message": "Email verification code has been sent",
  "otp": 123456  // Only in development mode
}
```

---

### 5. Verify Email

**Endpoint:** `POST /api/auth/verify-email`

**Description:** Verify email with OTP.

**Request Body:**
```json
{
  "email": "john@example.com",
  "otp": 123456
}
```

**Response (200):**
```json
{
  "message": "Email verified successfully",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "isEmailVerified": true
  }
}
```

---

### 6. Forgot Password

**Endpoint:** `POST /api/auth/forgot-password`

**Description:** Request password reset OTP.

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response (200):**
```json
{
  "message": "If an account exists with this email, a password reset code has been sent",
  "otp": 123456  // Only in development mode
}
```

---

### 7. Reset Password

**Endpoint:** `POST /api/auth/reset-password`

**Description:** Reset password using OTP.

**Request Body:**
```json
{
  "email": "john@example.com",
  "otp": 123456,
  "newPassword": "newpassword123"
}
```

**Response (200):**
```json
{
  "message": "Password reset successful"
}
```

---

## Referral System Endpoints

### 1. Validate Referral Code

**Endpoint:** `POST /api/referral/validate`

**Description:** Validate if a referral code (OJASS ID) exists (public endpoint).

**Request Body:**
```json
{
  "referralCode": "OJASS26A7B2"
}
```

**Response (200) - Valid:**
```json
{
  "valid": true,
  "message": "Valid referral code",
  "referrer": {
    "name": "Jane Smith",
    "ojassId": "OJASS26A7B2"
  }
}
```

**Response (200) - Invalid:**
```json
{
  "valid": false,
  "error": "Referral code does not exist"
}
```

---

### 2. Get Referral Statistics

**Endpoint:** `GET /api/referral/stats`

**Description:** Get referral statistics for authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "ojassId": "OJASS26A7B2",
  "referralCount": 5,
  "referredUsers": [
    {
      "name": "John Doe",
      "email": "john@example.com",
      "ojassId": "OJASS26X1Y2",
      "registeredAt": "2025-11-07T10:30:00.000Z"
    }
  ]
}
```

---

## Admin Authentication Endpoints

### 1. Admin Login

**Endpoint:** `POST /api/admin/auth/login`

**Description:** Login as admin (credentials stored in environment variables).

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "admin_password"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Admin login successful"
}
```

**Note:** JWT token is set as HTTP-only cookie named `admin_token`.

---

### 2. Admin Logout

**Endpoint:** `POST /api/admin/auth/logout`

**Description:** Logout admin.

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Pricing Endpoints

### 1. Get Pricing

**Endpoint:** `GET /api/pricing`

**Description:** Get pricing information. Returns user-specific pricing if authenticated, otherwise returns all pricing tiers.

**Headers (Optional):**
```
Authorization: Bearer <token>
```

**Response (200) - Authenticated:**
```json
{
  "amount": 200,
  "amountInPaise": 20000,
  "isNitJsrStudent": true,
  "offerActive": true,
  "category": "NITJSR_WITH_OFFER",
  "isPaid": false,
  "message": "Payment pending"
}
```

**Response (200) - Unauthenticated:**
```json
{
  "offerActive": true,
  "pricing": {
    "nitjsr": {
      "withOffer": 200,
      "withoutOffer": 300
    },
    "outside": {
      "withOffer": 400,
      "withoutOffer": 500
    }
  }
}
```

**Pricing Categories:**
- `NITJSR_WITH_OFFER`: NIT JSR students when offer is active
- `NITJSR_WITHOUT_OFFER`: NIT JSR students when offer is not active
- `OUTSIDE_WITH_OFFER`: Outside students when offer is active
- `OUTSIDE_WITHOUT_OFFER`: Outside students when offer is not active

**Email Determination:**
- Emails ending with `@nitjsr.ac.in` are considered NIT JSR students
- All other emails are considered outside students

---

## Payment Endpoints

### 1. Create Payment Order

**Endpoint:** `POST /api/payment/create-order`

**Description:** Create a Razorpay order for registration payment.

**Headers:**
```
Authorization: Bearer <token>
```

**Requirements:**
- User must be authenticated
- User email must be verified
- User must not have already paid

**Response (201):**
```json
{
  "success": true,
  "order": {
    "id": "order_razorpay_id",
    "amount": 20000,
    "currency": "INR",
    "receipt": "receipt_userid_timestamp"
  },
  "pricing": {
    "amount": 200,
    "amountInPaise": 20000,
    "category": "NITJSR_WITH_OFFER",
    "offerActive": true
  },
  "razorpayKeyId": "rzp_test_xxxxx"
}
```

---

### 2. Verify Payment

**Endpoint:** `POST /api/payment/verify`

**Description:** Verify Razorpay payment signature and update user payment status.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "razorpay_order_id": "order_razorpay_id",
  "razorpay_payment_id": "pay_razorpay_id",
  "razorpay_signature": "signature_hash"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "isPaid": true,
  "paymentDetails": {
    "orderId": "order_razorpay_id",
    "paymentId": "pay_razorpay_id",
    "amount": 200,
    "date": "2025-11-07T10:30:00.000Z"
  }
}
```

---

### 3. Payment Status

**Endpoint:** `GET /api/payment/status`

**Description:** Get payment status for authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "isPaid": true,
  "paymentDetails": {
    "amount": 200,
    "date": "2025-11-07T10:30:00.000Z",
    "orderId": "order_razorpay_id",
    "paymentId": "pay_razorpay_id"
  }
}
```

---

### 4. Payment Webhook

**Endpoint:** `POST /api/payment/webhook`

**Description:** Razorpay webhook endpoint for payment events (called by Razorpay).

**Headers:**
```
x-razorpay-signature: <webhook_signature>
```

**Events Handled:**
- `payment.authorized`
- `payment.captured`
- `payment.failed`

**Response (200):**
```json
{
  "success": true,
  "message": "Payment recorded successfully"
}
```

**Note:** This endpoint is automatically called by Razorpay. Configure webhook URL in Razorpay Dashboard.

---

## Media/File Upload Endpoints

### 1. Upload Files

**Endpoint:** `POST /api/media/upload`

**Description:** Upload one or multiple files to Cloudinary.

**Content-Type:** `multipart/form-data`

**Form Fields:**
- `files` (File or File[]) - Required - One or more files
- `userId` (string) - Optional - User ID
- `isIdCard` (boolean) - Optional - Flag as ID card

**Response (201):**
```json
{
  "message": "Files uploaded successfully",
  "files": [
    {
      "fileId": "673c98a1b2c3d4e5f6789012",
      "publicId": "ojass2026/uuid-id",
      "url": "https://res.cloudinary.com/...",
      "cloudinaryId": "ojass2026/uuid-id",
      "imageUrl": "https://res.cloudinary.com/...",
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

---

### 2. Get File Details

**Endpoint:** `GET /api/media/[fileId]`

**Description:** Get detailed information about a file.

**Response (200):**
```json
{
  "file": {
    "fileId": "673c98a1b2c3d4e5f6789012",
    "url": "https://res.cloudinary.com/...",
    "fileName": "profile-photo.jpg",
    "fileSize": 245678,
    "isIdCard": false,
    "cloudinaryDetails": {
      "width": 1920,
      "height": 1080
    }
  }
}
```

---

### 3. Update File Metadata

**Endpoint:** `PUT /api/media/[fileId]/update`

**Description:** Update file metadata (database only).

**Request Body:**
```json
{
  "fileName": "new-name.jpg",
  "isIdCard": true
}
```

**Response (200):**
```json
{
  "message": "File metadata updated successfully",
  "file": {
    "fileId": "673c98a1b2c3d4e5f6789012",
    "fileName": "new-name.jpg",
    "isIdCard": true
  }
}
```

---

### 4. Delete File

**Endpoint:** `DELETE /api/media/[fileId]`

**Description:** Delete file from Cloudinary and database.

**Response (200):**
```json
{
  "message": "File deleted successfully"
}
```

---

### 5. Get User Files

**Endpoint:** `GET /api/media/user/[userId]`

**Description:** Get all files uploaded by a user.

**Query Parameters:**
- `isIdCard` (boolean) - Filter by ID card flag
- `resourceType` (string) - Filter by type (image/video)

**Response (200):**
```json
{
  "userId": "673c98a1b2c3d4e5f6789999",
  "totalFiles": 5,
  "files": [
    {
      "fileId": "673c98a1b2c3d4e5f6789012",
      "url": "https://res.cloudinary.com/...",
      "fileName": "profile-photo.jpg"
    }
  ]
}
```

---

## Event Management Endpoints

### 1. Get All Events (Public)

**Endpoint:** `GET /api/admin/events`

**Description:** Get all events (public access).

**Response (200):**
```json
[
  {
    "_id": "event_id",
    "title": "Event Name",
    "bannerImage": "image_url",
    "maxTeamSize": 4,
    "isIndividual": false,
    "description": ["Description line 1", "Description line 2"],
    "prizeWorth": {
      "Total": "10000",
      "Winner": "5000",
      "FirstRunnerUp": "3000",
      "SecondRunnerUp": "2000"
    },
    "details": ["Detail 1", "Detail 2"],
    "rules": ["Rule 1", "Rule 2"],
    "eventHeads": ["Head 1", "Head 2"],
    "contactNo": ["+919876543210"],
    "winners": [],
    "createdAt": "2025-11-07T10:30:00.000Z",
    "updatedAt": "2025-11-07T10:30:00.000Z"
  }
]
```

---

### 2. Create Event (Admin Only)

**Endpoint:** `POST /api/admin/events`

**Description:** Create a new event (admin only).

**Authentication:** Requires admin token in cookies.

**Request Body:**
```json
{
  "title": "Event Name",
  "bannerImage": "image_url",
  "maxTeamSize": 4,
  "isIndividual": false,
  "description": ["Description line 1", "Description line 2"],
  "prizeWorth": {
    "Total": "10000",
    "Winner": "5000",
    "FirstRunnerUp": "3000",
    "SecondRunnerUp": "2000"
  },
  "details": ["Detail 1", "Detail 2"],
  "rules": ["Rule 1", "Rule 2"],
  "eventHeads": ["Head 1", "Head 2"],
  "contactNo": ["+919876543210"]
}
```

**Response (201):**
```json
{
  "_id": "event_id",
  "title": "Event Name",
  // ... full event object
}
```

---

### 3. Get Single Event (Public)

**Endpoint:** `GET /api/admin/events/[eventId]`

**Description:** Get single event by ID (public access).

**Response (200):**
```json
{
  "_id": "event_id",
  "title": "Event Name",
  // ... full event object
}
```

---

### 4. Update Event (Admin Only)

**Endpoint:** `PUT /api/admin/events/[eventId]`

**Description:** Update an event (admin only).

**Authentication:** Requires admin token in cookies.

**Request Body:** (Any fields to update)
```json
{
  "title": "Updated Event Name",
  "maxTeamSize": 5
}
```

**Response (200):**
```json
{
  "_id": "event_id",
  "title": "Updated Event Name",
  // ... full updated event object
}
```

---

### 5. Delete Event (Admin Only)

**Endpoint:** `DELETE /api/admin/events/[eventId]`

**Description:** Delete an event (admin only).

**Authentication:** Requires admin token in cookies.

**Response (200):**
```json
{
  "success": true
}
```

---

## Error Codes

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error, invalid data)
- `401` - Unauthorized (authentication required or invalid token)
- `402` - Payment Required
- `403` - Forbidden (email not verified, etc.)
- `404` - Not Found
- `409` - Conflict (duplicate email/phone)
- `500` - Internal Server Error

### Common Error Response Format

```json
{
  "error": "Error message description"
}
```

---

## Environment Setup

### Required Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Database
MONGODB_URI=your_mongodb_connection_string

# Email (Brevo)
BREVO_API_KEY=your_brevo_api_key
SENDER_EMAIL=your_sender_email@example.com
SENDER_NAME=OJASS 2026

# JWT & Admin
JWT_SECRET=your_jwt_secret_key
ADMIN_USER_ID=admin1@example.com,admin2@example.com
ADMIN_PASSWORD=password1,password2

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret

# Pricing (amounts in INR)
PRICE_NITJSR_WITH_OFFER=200
PRICE_NITJSR_WITHOUT_OFFER=300
PRICE_OUTSIDE_WITH_OFFER=400
PRICE_OUTSIDE_WITHOUT_OFFER=500
OFFER_STATUS=true

# Cloudinary (optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## User Registration Flow

### Complete Flow with Payment

1. **Register** - `POST /api/auth/register`
   - User provides name, email, phone, password
   - System creates user account (email not verified, payment not done)
   - Returns JWT token

2. **Send Email Verification** - `POST /api/auth/send-email-verification`
   - User requests email verification
   - System sends OTP to email

3. **Verify Email** - `POST /api/auth/verify-email`
   - User submits OTP
   - Email is marked as verified

4. **Get Pricing** - `GET /api/pricing` (with token)
   - User checks their pricing
   - System returns pricing based on email domain and offer status

5. **Create Payment Order** - `POST /api/payment/create-order`
   - User initiates payment
   - System creates Razorpay order
   - Returns order details and Razorpay key

6. **Complete Payment on Frontend**
   - User completes payment via Razorpay checkout
   - Razorpay returns payment details

7. **Verify Payment** - `POST /api/payment/verify`
   - Frontend sends payment details for verification
   - System verifies signature and updates user status
   - User is now fully registered and can access events

8. **Webhook Confirmation** (Optional)
   - Razorpay sends webhook to `/api/payment/webhook`
   - System double-checks and records payment

---

## Razorpay Integration Guide

### Setup

1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Get API Keys from Settings > API Keys
3. Create Webhook from Settings > Webhooks
   - URL: `https://yourdomain.com/api/payment/webhook`
   - Events: `payment.authorized`, `payment.captured`, `payment.failed`
   - Get webhook secret

### Frontend Integration Example

```javascript
const createOrder = async () => {
  // 1. Create order
  const response = await fetch('/api/payment/create-order', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  const data = await response.json();
  
  // 2. Open Razorpay checkout
  const options = {
    key: data.razorpayKeyId,
    amount: data.order.amount,
    currency: data.order.currency,
    order_id: data.order.id,
    name: 'OJASS 2026',
    description: 'Registration Fee',
    handler: async (response) => {
      // 3. Verify payment
      const verifyResponse = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature
        })
      });
      
      const verifyData = await verifyResponse.json();
      
      if (verifyData.success) {
        alert('Payment successful!');
      }
    }
  };
  
  const razorpay = new window.Razorpay(options);
  razorpay.open();
};
```

---

## Security Considerations

1. **JWT Tokens**
   - Store tokens securely (localStorage or secure cookie)
   - Include token in Authorization header for protected routes
   - Handle token expiration gracefully

2. **Payment Verification**
   - Always verify payment signature on backend
   - Never trust payment status from frontend alone
   - Use webhook as backup verification

3. **Admin Authentication**
   - Admin credentials stored in environment variables
   - JWT stored in HTTP-only cookies
   - 2-hour token expiration

4. **Email Verification**
   - Users must verify email before payment
   - OTP expires in 10 minutes

5. **Payment Security**
   - Razorpay handles PCI compliance
   - Webhook signature verification
   - Double verification (frontend + webhook)

---

## Support & Contact

For API issues or questions, contact the development team.

---

**Last Updated:** November 7, 2025  
**API Version:** 1.0

