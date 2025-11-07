# OJASS 2026 - Quick Start Guide

Get up and running in 5 minutes! 🚀

---

## ⚡ Quick Setup (Development)

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

```bash
# Copy the example file
cp env.example .env.local
```

**Minimum Required Variables for Development:**

```bash
# Database (required)
MONGODB_URI=your_mongodb_uri

# JWT (required)
JWT_SECRET=any_random_string_here

# Admin (required)
ADMIN_USER_ID=admin@example.com
ADMIN_PASSWORD=admin123

# Pricing (with defaults)
PRICE_NITJSR_WITH_OFFER=200
PRICE_NITJSR_WITHOUT_OFFER=300
PRICE_OUTSIDE_WITH_OFFER=400
PRICE_OUTSIDE_WITHOUT_OFFER=500
OFFER_STATUS=true

# Razorpay (required for payments)
RAZORPAY_KEY_ID=your_test_key_id
RAZORPAY_KEY_SECRET=your_test_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Email - Optional (OTP will log to console in dev mode)
BREVO_API_KEY=your_brevo_key
SENDER_EMAIL=noreply@example.com
```

### 3. Start Development Server

```bash
npm run dev
```

Server runs at: **http://localhost:3000**

---

## 🧪 Test the API

### Test User Registration

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@nitjsr.ac.in",
    "phone": "9876543210",
    "password": "password123"
  }'
```

Save the `token` from the response!

### Test Email Verification

```bash
# Send OTP
curl -X POST http://localhost:3000/api/auth/send-email-verification \
  -H "Content-Type: application/json" \
  -d '{"email": "test@nitjsr.ac.in"}'

# Check console for OTP, then verify
curl -X POST http://localhost:3000/api/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{"email": "test@nitjsr.ac.in", "otp": 123456}'
```

### Test Pricing

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/pricing
```

### Test Admin Login

```bash
curl -X POST http://localhost:3000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

---

## 📋 API Endpoints Overview

### User Authentication
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/send-email-verification` - Send OTP
- `POST /api/auth/verify-email` - Verify email
- `POST /api/auth/forgot-password` - Request reset
- `POST /api/auth/reset-password` - Reset password

### Pricing
- `GET /api/pricing` - Get pricing info

### Payment
- `POST /api/payment/create-order` - Create order
- `POST /api/payment/verify` - Verify payment
- `GET /api/payment/status` - Check status
- `POST /api/payment/webhook` - Webhook (Razorpay)

### Admin
- `POST /api/admin/auth/login` - Admin login
- `POST /api/admin/auth/logout` - Admin logout

### Events
- `GET /api/admin/events` - Get all events (public)
- `POST /api/admin/events` - Create event (admin)
- `GET /api/admin/events/[id]` - Get event (public)
- `PUT /api/admin/events/[id]` - Update event (admin)
- `DELETE /api/admin/events/[id]` - Delete event (admin)

---

## 💰 Pricing Structure

| User Type | Email Domain | With Offer | Without Offer |
|-----------|--------------|------------|---------------|
| NIT JSR   | @nitjsr.ac.in | ₹200 | ₹300 |
| Outside   | Others | ₹400 | ₹500 |

**Change offer status:**
```bash
# In .env.local
OFFER_STATUS=true   # Enable offers
OFFER_STATUS=false  # Disable offers
```

---

## 🔄 Complete User Flow

```
1. Register         → POST /api/auth/register
2. Send Email OTP   → POST /api/auth/send-email-verification
3. Verify Email     → POST /api/auth/verify-email
4. Check Pricing    → GET /api/pricing
5. Create Order     → POST /api/payment/create-order
6. Pay (Frontend)   → Razorpay Checkout
7. Verify Payment   → POST /api/payment/verify
8. ✅ Registered!
```

---

## 🧪 Razorpay Test Cards

### Success Card
```
Card Number: 4111 1111 1111 1111
CVV: 123
Expiry: 12/25
```

### Failure Card
```
Card Number: 4000 0000 0000 0002
CVV: 123
Expiry: 12/25
```

---

## 🐛 Common Issues

### Database Connection Error
**Error:** "Database connection error"

**Solution:**
```bash
# Check MONGODB_URI in .env.local
# Format: mongodb+srv://username:password@cluster.mongodb.net/database
```

### Email Not Sending
**Error:** Email OTP not received

**Solution:**
- In development, OTP is logged to console
- Check the terminal output for the OTP
- For production, configure Brevo API key

### JWT Secret Error
**Error:** "JWT_SECRET not configured"

**Solution:**
```bash
# Add to .env.local
JWT_SECRET=any_secure_random_string_here
```

### Payment Error
**Error:** "Razorpay credentials not configured"

**Solution:**
```bash
# Add to .env.local
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your_secret
```

---

## 📚 Full Documentation

- **Complete API Docs:** [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- **Setup Guide:** [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- **All Endpoints:** [README_API_ENDPOINTS.md](./README_API_ENDPOINTS.md)
- **Implementation:** [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)

---

## 🚀 Production Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

### Environment Variables for Production

```bash
# Use production MongoDB
MONGODB_URI=mongodb+srv://...

# Use Razorpay LIVE keys (not test)
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=live_secret

# Strong JWT secret
JWT_SECRET=use_a_very_strong_random_string_here

# Configure webhook URL in Razorpay Dashboard
# URL: https://yourdomain.com/api/payment/webhook
```

---

## ✅ Checklist

### Development Setup
- [ ] Install Node.js 18+
- [ ] Install dependencies (`npm install`)
- [ ] Create `.env.local` file
- [ ] Set MONGODB_URI
- [ ] Set JWT_SECRET
- [ ] Set admin credentials
- [ ] Set pricing values
- [ ] Set Razorpay test keys
- [ ] Run `npm run dev`
- [ ] Test endpoints

### Production Deployment
- [ ] Push to GitHub
- [ ] Deploy to hosting (Vercel/Netlify)
- [ ] Set all environment variables
- [ ] Use production MongoDB URI
- [ ] Use Razorpay LIVE keys
- [ ] Configure Razorpay webhook
- [ ] Set webhook URL in dashboard
- [ ] Test payment flow
- [ ] Test webhook

---

## 🎯 Next Steps

1. **Test All Endpoints** - Use the curl commands above
2. **Read Full Documentation** - Check API_DOCUMENTATION.md
3. **Configure Payment** - Set up Razorpay properly
4. **Deploy to Production** - Follow production checklist

---

## 💡 Pro Tips

1. **Development Mode**
   - OTP codes are logged to console
   - Use Razorpay test mode
   - Test cards work without real money

2. **Testing Payments**
   - Use test cards provided above
   - Check Razorpay dashboard for test transactions
   - Webhook logs available in dashboard

3. **Managing Offers**
   - Change `OFFER_STATUS` to enable/disable offers
   - Restart server after changing env variables
   - Affects all new pricing calculations

---

## 📞 Need Help?

1. Check the documentation files
2. Review common issues section
3. Check console logs for errors
4. Verify environment variables

---

**Happy Coding! 🎉**

Last Updated: November 7, 2025

