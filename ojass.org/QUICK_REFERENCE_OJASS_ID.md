# OJASS ID & Referral System - Quick Reference

## 🆔 OJASS ID Format

```
OJASS26XXXX

Prefix: OJASS26 (fixed)
Suffix: XXXX (4 random A-Z, 0-9)

Examples:
✅ OJASS26A7B2
✅ OJASS261X9K
✅ OJASS26Z0Q5
```

---

## 📝 Updated Registration Fields

### ✅ Required for All Users
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "password": "string (min 6 chars)",
  "gender": "Male | Female | Other",
  "city": "string",
  "state": "string"
}
```

### ⚠️ Conditional (Based on Email)
```
If @nitjsr.ac.in:
  ✅ collegeName = "NIT Jamshedpur" (automatic)
  ❌ User cannot provide collegeName

If other email:
  ✅ collegeName = required (user input)
```

### ⭕ Optional
```json
{
  "referralCode": "OJASS26XXXX",
  "idCardImageUrl": "string",
  "idCardCloudinaryId": "string"
}
```

---

## 🔗 Referral System

### Share Your Code
```
1. Register and get your OJASS ID (e.g., OJASS26A7B2)
2. Share with friends
3. They enter it as referralCode during registration
4. Your referralCount increases
```

### Track Referrals
```bash
GET /api/referral/stats
Authorization: Bearer <token>

Returns:
- Your OJASS ID
- Total referral count
- List of referred users
```

### Validate Code Before Registration
```bash
POST /api/referral/validate
{
  "referralCode": "OJASS26A7B2"
}

Returns:
- Valid/Invalid status
- Referrer's name
```

---

## 🚀 Registration Examples

### NIT JSR Student (No College Name Needed)
```bash
curl -X POST /api/auth/register -d '{
  "name": "Rahul Kumar",
  "email": "rahul@nitjsr.ac.in",
  "phone": "9876543210",
  "password": "pass123",
  "gender": "Male",
  "city": "Jamshedpur",
  "state": "Jharkhand",
  "referralCode": "OJASS26A7B2"
}'
```

### Outside Student (College Name Required)
```bash
curl -X POST /api/auth/register -d '{
  "name": "Priya Sharma",
  "email": "priya@gmail.com",
  "phone": "9123456789",
  "password": "pass123",
  "gender": "Female",
  "city": "Delhi",
  "state": "Delhi",
  "collegeName": "Delhi University",
  "referralCode": "OJASS26D5E6"
}'
```

---

## 📊 New Endpoints

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/referral/validate` | POST | No | Validate referral code |
| `/api/referral/stats` | GET | Yes | Get referral statistics |

---

## ⚠️ Common Errors

### Missing Required Field
```json
{
  "error": "Name, email, phone, password, gender, city, and state are required"
}
```

### Invalid Gender
```json
{
  "error": "Gender must be Male, Female, or Other"
}
```

### Missing College Name (Outside Students)
```json
{
  "error": "College name is required for students outside NIT Jamshedpur"
}
```

### Invalid Referral Code Format
```json
{
  "error": "Invalid referral code format"
}
```

### Referral Code Doesn't Exist
```json
{
  "error": "Referral code does not exist"
}
```

---

## 💡 Quick Tips

1. **NIT JSR Students**
   - Don't send collegeName in request
   - It's automatically set to "NIT Jamshedpur"

2. **Outside Students**
   - Must provide collegeName
   - Can be any college/university

3. **Referral Codes**
   - Optional but recommended
   - Must be exactly 10 characters: OJASS26XXXX
   - Case insensitive (converted to uppercase)

4. **Gender Field**
   - Must be one of: Male, Female, Other
   - Exactly as shown (case sensitive)

---

## 📱 User Response Example

```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "673c98...",
    "name": "John Doe",
    "email": "john@example.com",
    "ojassId": "OJASS26X1Y2",
    "gender": "Male",
    "collegeName": "ABC College",
    "city": "Mumbai",
    "state": "Maharashtra",
    "referredBy": "OJASS26A7B2",
    "referralCount": 0,
    "isNitJsrStudent": false,
    "isEmailVerified": false
  },
  "token": "eyJhbGciOiJ..."
}
```

---

## 🔍 Referral Stats Example

```json
{
  "success": true,
  "ojassId": "OJASS26A7B2",
  "referralCount": 3,
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

## ✅ Testing Checklist

Quick test scenarios:

- [ ] Register NIT JSR student without collegeName
- [ ] Register outside student with collegeName
- [ ] Register with valid referral code
- [ ] Register with invalid referral code
- [ ] Validate existing referral code
- [ ] Validate non-existent referral code
- [ ] Get referral stats
- [ ] Verify OJASS ID in response

---

## 📚 Full Documentation

For complete details, see:
- **OJASS_ID_AND_REFERRAL_SYSTEM.md** - Complete guide
- **API_DOCUMENTATION.md** - Full API reference
- **UPDATE_SUMMARY_OJASS_ID.md** - What changed

---

**Last Updated:** November 7, 2025

