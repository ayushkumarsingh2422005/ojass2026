# OJASS 2026 - API Endpoints Summary

Quick reference guide for all working API endpoints.

---

## 📋 Table of Contents

- [Authentication](#authentication)
- [User Auth Endpoints](#user-auth-endpoints)
- [Admin Auth Endpoints](#admin-auth-endpoints)
- [Pricing Endpoints](#pricing-endpoints)
- [Payment Endpoints](#payment-endpoints)
- [Event Management](#event-management)

---

## 🔐 Authentication

### User Authentication
- **Type:** Bearer Token
- **Header:** `Authorization: Bearer <token>`
- **Expiry:** 7 days

### Admin Authentication
- **Type:** HTTP-only Cookie
- **Cookie Name:** `admin_token`
- **Expiry:** 2 hours

---

## 👤 User Auth Endpoints

### 1. Register User
```
POST /api/auth/register
```

**Body:**
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
  "referralCode": "OJASS26A7B2"
}
```

**Response:** User object + JWT token (includes OJASS ID)

---

### 2. Login User
```
POST /api/auth/login
```

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** User object + JWT token

---

### 3. Logout User
```
POST /api/auth/logout
Headers: Authorization: Bearer <token>
```

**Response:** Success message

---

### 4. Send Email Verification
```
POST /api/auth/send-email-verification
```

**Body:**
```json
{
  "email": "john@example.com"
}
```

**Response:** OTP sent message (OTP in console during dev)

---

### 5. Verify Email
```
POST /api/auth/verify-email
```

**Body:**
```json
{
  "email": "john@example.com",
  "otp": 123456
}
```

**Response:** Email verified + updated user object

---

### 6. Forgot Password
```
POST /api/auth/forgot-password
```

**Body:**
```json
{
  "email": "john@example.com"
}
```

**Response:** Reset OTP sent message

---

### 7. Reset Password
```
POST /api/auth/reset-password
```

**Body:**
```json
{
  "email": "john@example.com",
  "otp": 123456,
  "newPassword": "newpassword123"
}
```

**Response:** Password reset success

---

## 🔗 Referral Endpoints

### 1. Validate Referral Code
```
POST /api/referral/validate
```

**Body:**
```json
{
  "referralCode": "OJASS26A7B2"
}
```

**Response:** Validation result + referrer info

---

### 2. Get Referral Stats
```
GET /api/referral/stats
Headers: Authorization: Bearer <token>
```

**Response:** Referral count + list of referred users

---

## 🔑 Admin Auth Endpoints

### 1. Admin Login
```
POST /api/admin/auth/login
```

**Body:**
```json
{
  "email": "admin@example.com",
  "password": "admin_password"
}
```

**Response:** Success (sets HTTP-only cookie)

---

### 2. Admin Logout
```
POST /api/admin/auth/logout
```

**Response:** Success (clears cookie)

---

## 💰 Pricing Endpoints

### Get Pricing
```
GET /api/pricing
Headers (Optional): Authorization: Bearer <token>
```

**Without Auth:** Returns all pricing tiers
**With Auth:** Returns user-specific pricing

**Response (Authenticated):**
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

**Response (Unauthenticated):**
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

---

## 💳 Payment Endpoints

### 1. Create Payment Order
```
POST /api/payment/create-order
Headers: Authorization: Bearer <token>
```

**Requirements:**
- User must be authenticated
- Email must be verified
- User must not have paid already

**Response:**
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
```
POST /api/payment/verify
Headers: Authorization: Bearer <token>
```

**Body:**
```json
{
  "razorpay_order_id": "order_razorpay_id",
  "razorpay_payment_id": "pay_razorpay_id",
  "razorpay_signature": "signature_hash"
}
```

**Response:**
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
```
GET /api/payment/status
Headers: Authorization: Bearer <token>
```

**Response:**
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

### 4. Payment Webhook (Razorpay)
```
POST /api/payment/webhook
Headers: x-razorpay-signature: <signature>
```

**Note:** This is called automatically by Razorpay. Configure in Razorpay Dashboard.

**Events Handled:**
- `payment.authorized`
- `payment.captured`
- `payment.failed`

---

## 🎉 Event Management

### 1. Get All Events (Public)
```
GET /api/admin/events
```

**Response:** Array of all events

---

### 2. Get Single Event (Public)
```
GET /api/admin/events/[eventId]
```

**Response:** Single event object

---

### 3. Create Event (Admin Only)
```
POST /api/admin/events
Requires: admin_token cookie
```

**Body:**
```json
{
  "title": "Event Name",
  "bannerImage": "image_url",
  "maxTeamSize": 4,
  "isIndividual": false,
  "description": ["Description line 1"],
  "prizeWorth": {
    "Total": "10000",
    "Winner": "5000",
    "FirstRunnerUp": "3000",
    "SecondRunnerUp": "2000"
  },
  "details": ["Detail 1"],
  "rules": ["Rule 1"],
  "eventHeads": ["Head 1"],
  "contactNo": ["+919876543210"]
}
```

**Response:** Created event object

---

### 4. Update Event (Admin Only)
```
PUT /api/admin/events/[eventId]
Requires: admin_token cookie
```

**Body:** Any fields to update

**Response:** Updated event object

---

### 5. Delete Event (Admin Only)
```
DELETE /api/admin/events/[eventId]
Requires: admin_token cookie
```

**Response:** 
```json
{
  "success": true
}
```

---

## 📊 Pricing Structure

### User Categories

| Email Domain | Category | With Offer | Without Offer |
|-------------|----------|------------|---------------|
| @nitjsr.ac.in | NIT JSR | ₹200 | ₹300 |
| Others | Outside | ₹400 | ₹500 |

### Auto-Detection
- Emails ending with `@nitjsr.ac.in` are automatically categorized as NIT JSR students
- All other emails are categorized as outside students
- Offer status controlled by `OFFER_STATUS` environment variable

---

## 🔄 User Registration Flow

```
1. Register → POST /api/auth/register
2. Send Email OTP → POST /api/auth/send-email-verification
3. Verify Email → POST /api/auth/verify-email
4. Check Pricing → GET /api/pricing
5. Create Order → POST /api/payment/create-order
6. Complete Payment (Frontend Razorpay)
7. Verify Payment → POST /api/payment/verify
8. Webhook Confirmation (Automatic)
9. ✅ User Fully Registered
```

---

## 🚨 Common Response Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 402 | Payment Required |
| 403 | Forbidden (Email not verified) |
| 404 | Not Found |
| 409 | Conflict (Duplicate) |
| 500 | Server Error |

---

## 🔧 Environment Variables Required

```bash
# Database
MONGODB_URI=mongodb_connection_string

# Email
BREVO_API_KEY=brevo_api_key
SENDER_EMAIL=noreply@example.com

# JWT & Admin
JWT_SECRET=your_jwt_secret
ADMIN_USER_ID=admin@example.com
ADMIN_PASSWORD=admin_password

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=razorpay_secret
RAZORPAY_WEBHOOK_SECRET=webhook_secret

# Pricing (amounts in INR)
PRICE_NITJSR_WITH_OFFER=200
PRICE_NITJSR_WITHOUT_OFFER=300
PRICE_OUTSIDE_WITH_OFFER=400
PRICE_OUTSIDE_WITHOUT_OFFER=500
OFFER_STATUS=true
```

---

## 📚 Additional Documentation

- **Complete API Documentation:** [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- **Setup Guide:** [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- **Environment Example:** [env.example](./env.example)

---

## 🧪 Testing

### Test Cards (Razorpay Test Mode)

**Success:**
```
Card: 4111 1111 1111 1111
CVV: Any 3 digits
Expiry: Any future date
```

**Failure:**
```
Card: 4000 0000 0000 0002
CVV: Any 3 digits
Expiry: Any future date
```

---

## 📞 Support

For issues or questions, refer to the documentation files or contact the development team.

---

**Version:** 1.0  
**Last Updated:** November 7, 2025

