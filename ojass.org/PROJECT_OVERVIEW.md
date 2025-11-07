# OJASS 2026 - Project Overview

Complete event management system with authentication, payment integration, and admin management.

---

## 🎯 Project Goals

Build a comprehensive API system for OJASS 2026 fest with:
- User registration and authentication
- Email verification
- Dynamic pricing based on college affiliation
- Razorpay payment integration
- Admin event management
- Webhook support for payment confirmation

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  (Web App / Mobile App / Third-party integrations)              │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API LAYER (Next.js)                         │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │     Auth     │  │   Payment    │  │    Admin     │          │
│  │   Endpoints  │  │  Endpoints   │  │  Endpoints   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Pricing    │  │    Events    │  │  Middleware  │          │
│  │   Endpoints  │  │  Endpoints   │  │   (Auth)     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                                 │
                    ┌────────────┼────────────┐
                    ▼            ▼            ▼
         ┌──────────────┐ ┌───────────┐ ┌──────────────┐
         │   MongoDB    │ │ Razorpay  │ │ Brevo Email  │
         │  (Database)  │ │ (Payment) │ │   Service    │
         └──────────────┘ └───────────┘ └──────────────┘
```

---

## 📁 Project Structure

```
ojass.org/
├── src/
│   ├── app/
│   │   └── api/
│   │       ├── auth/                    # User authentication
│   │       │   ├── register/
│   │       │   ├── login/
│   │       │   ├── logout/
│   │       │   ├── send-email-verification/
│   │       │   ├── verify-email/
│   │       │   ├── forgot-password/
│   │       │   └── reset-password/
│   │       ├── admin/                   # Admin operations
│   │       │   ├── auth/
│   │       │   │   ├── login/
│   │       │   │   └── logout/
│   │       │   └── events/             # Event CRUD
│   │       │       ├── [eventId]/
│   │       │       └── route.ts
│   │       ├── pricing/                # Pricing endpoints
│   │       │   └── route.ts
│   │       └── payment/                # Payment endpoints
│   │           ├── create-order/
│   │           ├── verify/
│   │           ├── status/
│   │           └── webhook/
│   ├── models/                         # Database models
│   │   ├── User.ts
│   │   ├── Event.ts
│   │   ├── Team.ts
│   │   └── ...
│   ├── lib/                            # Core utilities
│   │   ├── mongodb.ts
│   │   ├── auth.ts
│   │   └── admin.ts
│   ├── utils/                          # Helper functions
│   │   ├── razorpay.util.ts
│   │   ├── pricing.util.ts
│   │   ├── otp.util.ts
│   │   └── email.util.ts
│   └── middleware/                     # Middleware functions
│       ├── adminAuthMiddleware.ts
│       └── paymentAuthMiddleware.ts
├── API_DOCUMENTATION.md               # Complete API docs
├── SETUP_GUIDE.md                     # Setup instructions
├── README_API_ENDPOINTS.md            # Quick reference
├── QUICK_START.md                     # Quick start guide
├── IMPLEMENTATION_SUMMARY.md          # What was built
├── PROJECT_OVERVIEW.md                # This file
└── env.example                        # Environment template
```

---

## 🔐 Authentication Flow

```
┌──────────────────────────────────────────────────────────────┐
│                    USER AUTHENTICATION                        │
└──────────────────────────────────────────────────────────────┘

User Registration
─────────────────
POST /api/auth/register
  ├─ Input: name, email, phone, password
  ├─ Validate input
  ├─ Check for duplicates
  ├─ Hash password (bcrypt)
  ├─ Auto-detect NIT JSR (@nitjsr.ac.in)
  ├─ Save to database
  └─ Return JWT token (7-day expiry)

Email Verification
──────────────────
POST /api/auth/send-email-verification
  ├─ Generate 6-digit OTP
  ├─ Save OTP with 10-min expiry
  └─ Send via Brevo email

POST /api/auth/verify-email
  ├─ Validate OTP
  ├─ Check expiry
  ├─ Mark email as verified
  └─ Clear OTP

User Login
──────────
POST /api/auth/login
  ├─ Accept email OR phone
  ├─ Find user in database
  ├─ Verify password (bcrypt)
  └─ Return JWT token

Password Reset
──────────────
POST /api/auth/forgot-password
  ├─ Generate OTP
  ├─ Save with expiry
  └─ Send via email

POST /api/auth/reset-password
  ├─ Verify OTP
  ├─ Hash new password
  ├─ Update user
  └─ Clear OTP
```

---

## 💰 Pricing System

```
┌──────────────────────────────────────────────────────────────┐
│                    PRICING DETERMINATION                      │
└──────────────────────────────────────────────────────────────┘

Email Domain Check
──────────────────
email.endsWith('@nitjsr.ac.in')
  ├─ YES → NIT JSR Student
  └─ NO  → Outside Student

Offer Status Check
──────────────────
OFFER_STATUS environment variable
  ├─ 'true'  → Offer pricing
  └─ 'false' → Regular pricing

Pricing Matrix
──────────────
┌─────────────┬──────────────┬─────────────────┐
│  User Type  │ Offer Active │  Price (₹)     │
├─────────────┼──────────────┼─────────────────┤
│  NIT JSR    │     Yes      │     200        │
│  NIT JSR    │     No       │     300        │
│  Outside    │     Yes      │     400        │
│  Outside    │     No       │     500        │
└─────────────┴──────────────┴─────────────────┘

Configuration
─────────────
Environment Variables:
  • PRICE_NITJSR_WITH_OFFER
  • PRICE_NITJSR_WITHOUT_OFFER
  • PRICE_OUTSIDE_WITH_OFFER
  • PRICE_OUTSIDE_WITHOUT_OFFER
  • OFFER_STATUS (true/false)
```

---

## 💳 Payment Flow

```
┌──────────────────────────────────────────────────────────────┐
│                     PAYMENT INTEGRATION                       │
└──────────────────────────────────────────────────────────────┘

Step 1: Create Order
────────────────────
POST /api/payment/create-order
  ├─ Verify JWT token
  ├─ Check email verified
  ├─ Check not already paid
  ├─ Calculate user pricing
  ├─ Create Razorpay order
  ├─ Save orderId to user
  └─ Return order details + Razorpay key

Step 2: Frontend Payment
─────────────────────────
  ├─ Open Razorpay checkout
  ├─ User enters card details
  ├─ Razorpay processes payment
  └─ Return payment details

Step 3: Verify Payment
──────────────────────
POST /api/payment/verify
  ├─ Verify JWT token
  ├─ Check orderId matches
  ├─ Verify Razorpay signature
  ├─ Update user.isPaid = true
  ├─ Record payment amount & date
  └─ Return success

Step 4: Webhook (Background)
─────────────────────────────
POST /api/payment/webhook
  ├─ Verify webhook signature
  ├─ Parse payment event
  ├─ Find user by orderId
  ├─ Update payment status
  └─ Log confirmation

Payment Status Check
────────────────────
GET /api/payment/status
  ├─ Verify JWT token
  └─ Return isPaid + payment details
```

---

## 👨‍💼 Admin System

```
┌──────────────────────────────────────────────────────────────┐
│                    ADMIN OPERATIONS                           │
└──────────────────────────────────────────────────────────────┘

Admin Authentication
────────────────────
POST /api/admin/auth/login
  ├─ Credentials from environment
  ├─ ADMIN_USER_ID (comma-separated)
  ├─ ADMIN_PASSWORD (comma-separated)
  ├─ Validate credentials
  ├─ Generate JWT token
  └─ Set HTTP-only cookie (2-hour expiry)

Event Management (CRUD)
────────────────────────
GET /api/admin/events
  └─ Public: Get all events

POST /api/admin/events
  ├─ Admin only
  └─ Create new event

PUT /api/admin/events/[eventId]
  ├─ Admin only
  └─ Update event

DELETE /api/admin/events/[eventId]
  ├─ Admin only
  └─ Delete event
```

---

## 📊 Data Models

### User Model
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  phone: String (unique),
  password: String (hashed),
  
  // Email Verification
  isEmailVerified: Boolean,
  emailOtp: Number,
  emailOtpExpires: Date,
  
  // Password Reset
  resetPasswordOtp: Number,
  resetPasswordOtpExpires: Date,
  
  // Payment
  isPaid: Boolean,
  paymentAmount: Number,
  paymentDate: Date,
  orderId: String,
  razorpayPaymentId: String,
  razorpayOrderId: String,
  razorpaySignature: String,
  
  // Profile
  isNitJsrStudent: Boolean,
  idCardImageUrl: String,
  idCardCloudinaryId: String,
  
  timestamps: true
}
```

### Event Model
```javascript
{
  _id: ObjectId,
  title: String,
  bannerImage: String,
  maxTeamSize: Number,
  isIndividual: Boolean,
  description: [String],
  prizeWorth: {
    Total: String,
    Winner: String,
    FirstRunnerUp: String,
    SecondRunnerUp: String
  },
  details: [String],
  rules: [String],
  eventHeads: [String],
  contactNo: [String],
  winners: [ObjectId],
  timestamps: true
}
```

---

## 🔧 Technology Stack

### Backend
- **Framework:** Next.js 14+ (App Router)
- **Runtime:** Node.js 18+
- **Language:** TypeScript

### Database
- **Database:** MongoDB
- **ODM:** Mongoose

### Authentication
- **JWT:** jsonwebtoken
- **Password Hashing:** bcrypt.js

### Payment
- **Gateway:** Razorpay
- **Integration:** razorpay npm package

### Email
- **Service:** Brevo (formerly Sendinblue)
- **Purpose:** OTP delivery

### File Storage
- **Service:** Cloudinary (optional)
- **Purpose:** ID card uploads

---

## 🔒 Security Features

### Authentication Security
- ✅ Password hashing (bcrypt, 10 rounds)
- ✅ JWT tokens with expiration
- ✅ HTTP-only cookies for admin
- ✅ Email verification required before payment
- ✅ OTP expiration (10 minutes)

### Payment Security
- ✅ Razorpay signature verification
- ✅ Webhook signature verification
- ✅ Duplicate payment prevention
- ✅ Server-side price calculation
- ✅ Order ID validation

### API Security
- ✅ Input validation
- ✅ Email enumeration prevention
- ✅ CORS configuration
- ✅ Rate limiting (recommended)
- ✅ Environment variable security

---

## 📈 API Performance

### Optimization Features
- MongoDB connection pooling
- Cached database connections
- JWT stateless authentication
- Indexed database queries
- Efficient data validation

---

## 🧪 Testing Strategy

### Manual Testing
1. User registration flow
2. Email verification
3. Login/logout
4. Password reset
5. Pricing calculation
6. Payment creation
7. Payment verification
8. Webhook handling
9. Admin operations
10. Event CRUD

### Test Cards (Razorpay)
- Success: `4111 1111 1111 1111`
- Failure: `4000 0000 0000 0002`

---

## 📦 Environment Configuration

### Development
```bash
# Use test credentials
MONGODB_URI=local_or_test_db
RAZORPAY_KEY_ID=rzp_test_xxxxx
OFFER_STATUS=true
```

### Production
```bash
# Use production credentials
MONGODB_URI=production_db_uri
RAZORPAY_KEY_ID=rzp_live_xxxxx
JWT_SECRET=strong_random_string
OFFER_STATUS=false  # Control offers
```

---

## 🚀 Deployment Platforms

### Recommended: Vercel
- ✅ Easy Next.js deployment
- ✅ Environment variables support
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Serverless functions

### Alternatives
- Netlify
- Railway
- Render
- AWS (EC2/Lambda)
- DigitalOcean

---

## 📊 Feature Checklist

### Core Features
- ✅ User registration
- ✅ User login/logout
- ✅ Email verification
- ✅ Password reset
- ✅ Admin authentication
- ✅ Dynamic pricing
- ✅ Payment integration
- ✅ Webhook support
- ✅ Event management (CRUD)

### Security Features
- ✅ JWT authentication
- ✅ Password hashing
- ✅ Payment verification
- ✅ Webhook verification
- ✅ Email enumeration prevention

### Documentation
- ✅ API documentation
- ✅ Setup guide
- ✅ Quick start guide
- ✅ Implementation summary
- ✅ Environment template

---

## 📚 Documentation Index

| Document | Purpose |
|----------|---------|
| **API_DOCUMENTATION.md** | Complete API reference with examples |
| **SETUP_GUIDE.md** | Step-by-step setup and deployment |
| **README_API_ENDPOINTS.md** | Quick endpoint reference |
| **QUICK_START.md** | Get started in 5 minutes |
| **IMPLEMENTATION_SUMMARY.md** | What was implemented |
| **PROJECT_OVERVIEW.md** | This file - high-level overview |
| **env.example** | Environment variables template |

---

## 🎯 Key Achievements

1. ✅ **Complete Authentication System**
   - Registration, login, logout
   - Email verification with OTP
   - Password reset functionality

2. ✅ **Smart Pricing System**
   - Auto-detection of NIT JSR students
   - Dynamic pricing based on offers
   - Configurable via environment

3. ✅ **Secure Payment Integration**
   - Razorpay integration
   - Signature verification
   - Webhook support
   - Duplicate prevention

4. ✅ **Admin Management**
   - Secure admin authentication
   - Event CRUD operations
   - Cookie-based sessions

5. ✅ **Comprehensive Documentation**
   - API documentation
   - Setup guides
   - Testing instructions

---

## 🎉 Success Metrics

- ✅ All endpoints working
- ✅ No linting errors
- ✅ Security best practices followed
- ✅ Production-ready code
- ✅ Complete documentation
- ✅ Easy deployment process

---

## 📞 Support Resources

1. **Documentation Files** - Start here
2. **API Testing** - Use provided curl commands
3. **Environment Setup** - Follow SETUP_GUIDE.md
4. **Troubleshooting** - Check common issues in docs

---

**Project Status:** ✅ Complete & Production Ready

**Last Updated:** November 7, 2025  
**Version:** 1.0

