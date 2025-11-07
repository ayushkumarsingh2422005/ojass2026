# OJASS ID and Referral System Documentation

Complete documentation for the OJASS ID generation and referral system.

---

## 📋 Table of Contents

1. [OJASS ID System](#ojass-id-system)
2. [Referral System](#referral-system)
3. [User Registration Updates](#user-registration-updates)
4. [API Endpoints](#api-endpoints)
5. [Examples](#examples)

---

## 🆔 OJASS ID System

### What is an OJASS ID?

An OJASS ID is a unique identifier assigned to each registered user during registration.

**Format:** `OJASS26XXXX`
- Prefix: `OJASS26` (fixed)
- Suffix: `XXXX` (4 random alphanumeric characters, uppercase)
- Example: `OJASS26A7B2`, `OJASS261X9K`, `OJASS26Z0Q5`

### Features

✅ **Automatically Generated** - Created during user registration
✅ **Unique** - Each user gets a unique OJASS ID
✅ **Alphanumeric** - Uses uppercase letters (A-Z) and numbers (0-9)
✅ **4-Character Suffix** - 1,679,616 possible combinations (36^4)
✅ **Validation** - Format validation ensures consistency

### Character Pool

The 4-character suffix is generated from:
- **Letters:** A-Z (26 letters)
- **Numbers:** 0-9 (10 digits)
- **Total:** 36 possible characters per position
- **Combinations:** 36^4 = 1,679,616 unique IDs

---

## 🔗 Referral System

### How It Works

Users can refer new registrations using their OJASS ID:

1. **Existing User** shares their OJASS ID (e.g., `OJASS26A7B2`)
2. **New User** enters this code during registration as `referralCode`
3. **System** validates the code and links the accounts
4. **Referrer's** referral count increases by 1
5. **New User's** profile shows who referred them

### Referral Benefits

Each user can track:
- Their unique OJASS ID
- Number of people they've referred
- List of referred users with details
- Referral history and timestamps

### Validation

Referral codes are validated for:
- ✅ Correct format (OJASS26XXXX)
- ✅ Uppercase letters and numbers only
- ✅ Existence in database
- ✅ Active user account

---

## 👤 User Registration Updates

### New Required Fields

In addition to previous fields, registration now requires:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `gender` | String | Yes | Male, Female, or Other |
| `city` | String | Yes | User's city |
| `state` | String | Yes | User's state |
| `collegeName` | String | Conditional | Required for non-NIT JSR students |
| `referralCode` | String | No | OJASS ID of referrer (optional) |

### Automatic Field Population

1. **College Name for NIT JSR Students**
   - If email ends with `@nitjsr.ac.in`
   - College name automatically set to "NIT Jamshedpur"
   - User cannot override this

2. **OJASS ID Generation**
   - Automatically generated during registration
   - No user input required
   - Guaranteed to be unique

### College Name Logic

```
IF email ends with '@nitjsr.ac.in'
  THEN collegeName = "NIT Jamshedpur" (automatic)
ELSE
  collegeName must be provided by user (required)
```

---

## 🔌 API Endpoints

### 1. User Registration (Updated)

**Endpoint:** `POST /api/auth/register`

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
- `email` (string, valid email)
- `phone` (string, at least 10 digits)
- `password` (string, minimum 6 characters)
- `gender` (string, must be: Male, Female, or Other)
- `city` (string)
- `state` (string)
- `collegeName` (string, required only for non-NIT JSR students)

**Optional Fields:**
- `referralCode` (string, must be valid OJASS ID)
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

**Validation Errors:**

```json
// Missing required fields
{
  "error": "Name, email, phone, password, gender, city, and state are required"
}

// Invalid gender
{
  "error": "Gender must be Male, Female, or Other"
}

// Missing college name for outside students
{
  "error": "College name is required for students outside NIT Jamshedpur"
}

// Invalid referral code format
{
  "error": "Invalid referral code format"
}

// Referral code doesn't exist
{
  "error": "Referral code does not exist"
}
```

---

### 2. Validate Referral Code

**Endpoint:** `POST /api/referral/validate`

**Description:** Validate if a referral code exists (public endpoint)

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

**Response (200) - Invalid Format:**
```json
{
  "valid": false,
  "error": "Invalid referral code format. Format should be OJASS26XXXX"
}
```

---

### 3. Get Referral Statistics

**Endpoint:** `GET /api/referral/stats`

**Description:** Get referral statistics for authenticated user

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
    },
    {
      "name": "Alice Johnson",
      "email": "alice@example.com",
      "ojassId": "OJASS26B3C4",
      "registeredAt": "2025-11-06T15:20:00.000Z"
    }
  ]
}
```

---

## 📝 Examples

### Example 1: NIT JSR Student Registration

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Rahul Kumar",
    "email": "rahul@nitjsr.ac.in",
    "phone": "9876543210",
    "password": "password123",
    "gender": "Male",
    "city": "Jamshedpur",
    "state": "Jharkhand",
    "referralCode": "OJASS26A7B2"
  }'
```

**Note:** College name is NOT required and will be automatically set to "NIT Jamshedpur"

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "ojassId": "OJASS26D5E6",
    "collegeName": "NIT Jamshedpur",
    "isNitJsrStudent": true,
    "referredBy": "OJASS26A7B2"
  },
  "token": "..."
}
```

---

### Example 2: Outside Student Registration

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Priya Sharma",
    "email": "priya@gmail.com",
    "phone": "9123456789",
    "password": "password123",
    "gender": "Female",
    "city": "Delhi",
    "state": "Delhi",
    "collegeName": "Delhi University",
    "referralCode": "OJASS26D5E6"
  }'
```

**Note:** College name IS required for non-NIT JSR students

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "ojassId": "OJASS26F7G8",
    "collegeName": "Delhi University",
    "isNitJsrStudent": false,
    "referredBy": "OJASS26D5E6"
  },
  "token": "..."
}
```

---

### Example 3: Validate Referral Code

```bash
curl -X POST http://localhost:3000/api/referral/validate \
  -H "Content-Type: application/json" \
  -d '{
    "referralCode": "OJASS26A7B2"
  }'
```

**Response:**
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

---

### Example 4: Get Referral Stats

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/referral/stats
```

**Response:**
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

## 🗄️ Database Schema Updates

### User Model Fields

```javascript
{
  // Unique OJASS ID
  ojassId: {
    type: String,
    unique: true,
    required: true,
    match: /^OJASS26[A-Z0-9]{4}$/
  },
  
  // Additional User Information
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  collegeName: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  
  // Referral System
  referredBy: {
    type: String,
    match: /^OJASS26[A-Z0-9]{4}$/
  },
  referralCount: {
    type: Number,
    default: 0
  }
}
```

---

## 🔍 Utility Functions

### Available Functions (from `ojassId.util.ts`)

```typescript
// Generate unique OJASS ID
generateUniqueOjassId(): Promise<string>

// Validate OJASS ID format
isValidOjassId(ojassId: string): boolean

// Check if OJASS ID exists
ojassIdExists(ojassId: string): Promise<boolean>

// Get user by OJASS ID
getUserByOjassId(ojassId: string): Promise<User | null>

// Increment referral count
incrementReferralCount(ojassId: string): Promise<User | null>

// Get referral statistics
getReferralStats(ojassId: string): Promise<ReferralStats>
```

---

## 🎯 Use Cases

### 1. User Shares Referral Code

**Scenario:** Existing user wants to refer a friend

**Steps:**
1. User logs in and gets their OJASS ID
2. User shares OJASS ID with friend (e.g., "OJASS26A7B2")
3. Friend uses this code during registration
4. User's referral count increases

---

### 2. New User Registration with Referral

**Scenario:** New user has a referral code

**Steps:**
1. During registration, user enters referral code
2. System validates the code
3. If valid, links accounts
4. Registration completes with referral recorded

---

### 3. Track Referrals

**Scenario:** User wants to see who they've referred

**Steps:**
1. User makes authenticated request to `/api/referral/stats`
2. System returns referral count and list of referred users
3. User can track referral activity

---

## 🔒 Security Considerations

1. **OJASS ID Generation**
   - Server-side generation only
   - Collision detection
   - Maximum retry attempts (10)

2. **Referral Validation**
   - Format validation before database check
   - Case-insensitive comparison (uppercase)
   - Existence verification

3. **Referral Count**
   - Atomic increment operations
   - Failure handling (doesn't block registration)
   - Audit trail via referred users list

---

## 📊 Statistics and Analytics

### Trackable Metrics

- Total referrals per user
- Referral registration timeline
- Most active referrers
- Referral conversion rates
- Geographic distribution of referrals

### Query Examples

```javascript
// Get top referrers
User.find()
  .sort({ referralCount: -1 })
  .limit(10)
  .select('name ojassId referralCount');

// Get referral chain
User.findOne({ ojassId: 'OJASS26A7B2' })
  .then(user => User.find({ referredBy: user.ojassId }));

// Count total referrals
User.aggregate([
  { $group: { _id: null, total: { $sum: '$referralCount' } } }
]);
```

---

## 🚀 Future Enhancements

Potential features for future implementation:

1. **Referral Rewards**
   - Discount codes for referrers
   - Special badges/achievements
   - Leaderboard system

2. **Multi-Level Referrals**
   - Track referral chains
   - Sub-referral rewards
   - Network visualization

3. **Referral Analytics Dashboard**
   - Real-time statistics
   - Referral performance metrics
   - Conversion tracking

4. **QR Code Integration**
   - Generate QR codes for OJASS IDs
   - Quick referral sharing
   - Mobile-friendly scanning

---

## ✅ Testing Checklist

### Registration Testing
- [ ] Register NIT JSR student (auto college name)
- [ ] Register outside student (manual college name)
- [ ] Register with valid referral code
- [ ] Register with invalid referral code
- [ ] Register without referral code
- [ ] Test all gender options
- [ ] Verify OJASS ID uniqueness

### Referral Testing
- [ ] Validate existing referral code
- [ ] Validate non-existent referral code
- [ ] Validate invalid format
- [ ] Check referral count increment
- [ ] Get referral statistics
- [ ] Verify referred users list

---

## 📞 Support

For issues related to:
- OJASS ID generation: Check server logs
- Referral validation: Verify code format and existence
- Missing referral count: Check database referral links

---

**Last Updated:** November 7, 2025  
**Version:** 2.0 (with OJASS ID and Referral System)

