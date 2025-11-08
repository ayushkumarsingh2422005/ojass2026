# OJASS 2026 - Setup Guide

This guide will help you set up the OJASS 2026 API system from scratch.

## Prerequisites

- Node.js 18+ installed
- MongoDB database (local or MongoDB Atlas)
- Razorpay account
- Brevo (formerly Sendinblue) account for emails
- Cloudinary account (optional, for image uploads)

---

## Step 1: Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd ojass.org

# Install dependencies
npm install
```

---

## Step 2: Environment Configuration

Create a `.env.local` file in the root directory:

```bash
cp env.example .env.local
```

Edit `.env.local` with your actual credentials:

### Database Configuration

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ojass2026?retryWrites=true&w=majority
```

### Email Configuration (Brevo)

1. Sign up at [Brevo](https://www.brevo.com/)
2. Go to Settings > API Keys > Create API Key
3. Verify your sender email in Settings > Senders & IP

```bash
BREVO_API_KEY=your_brevo_api_key_here
SENDER_EMAIL=noreply@yourdomain.com
SENDER_NAME=OJASS 2026
EMAIL_THEME=utopia
```

### JWT and Admin Configuration

```bash
# Generate a strong random string for JWT_SECRET
JWT_SECRET=your_super_secure_random_string_here

# Admin credentials (comma-separated for multiple admins)
ADMIN_USER_ID=admin@yourdomain.com,admin2@yourdomain.com
ADMIN_PASSWORD=secure_password_1,secure_password_2
```

### Razorpay Configuration

1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Go to Settings > API Keys
3. Generate Test/Live mode keys

```bash
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret_key
```

### Webhook Configuration

1. In Razorpay Dashboard, go to Settings > Webhooks
2. Create a new webhook with URL: `https://yourdomain.com/api/payment/webhook`
3. Select events: `payment.authorized`, `payment.captured`, `payment.failed`
4. Copy the webhook secret

```bash
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here
```

### Pricing Configuration

Set your pricing structure (amounts in Indian Rupees):

```bash
# NIT JSR students with offer
PRICE_NITJSR_WITH_OFFER=200

# NIT JSR students without offer
PRICE_NITJSR_WITHOUT_OFFER=300

# Outside students with offer
PRICE_OUTSIDE_WITH_OFFER=400

# Outside students without offer
PRICE_OUTSIDE_WITHOUT_OFFER=500

# Set to 'true' to enable offer pricing, 'false' to disable
OFFER_STATUS=true
```

### Cloudinary Configuration (Optional)

```bash
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## Step 3: Run the Development Server

```bash
npm run dev
```

The server will start at `http://localhost:3000`

---

## Step 4: Test the API

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

### Test Admin Login

```bash
curl -X POST http://localhost:3000/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@yourdomain.com",
    "password": "secure_password_1"
  }'
```

### Test Pricing Endpoint

```bash
curl http://localhost:3000/api/pricing
```

---

## Step 5: Production Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Import project to Vercel
3. Add all environment variables in Vercel project settings
4. Deploy

### Environment Variables in Production

Make sure to set all environment variables in your hosting platform:
- Use production MongoDB connection string
- Use Razorpay live mode keys (not test mode)
- Update webhook URL to production domain
- Use strong JWT secret

---

## Step 6: Configure Razorpay Webhook (Production)

After deployment:

1. Go to Razorpay Dashboard > Settings > Webhooks
2. Update webhook URL to: `https://yourdomain.com/api/payment/webhook`
3. Ensure the webhook secret matches your environment variable

---

## User Flow Overview

### Registration and Payment Flow

```
1. User Registration
   POST /api/auth/register
   ↓
2. Email Verification
   POST /api/auth/send-email-verification
   POST /api/auth/verify-email
   ↓
3. Check Pricing
   GET /api/pricing (with auth token)
   ↓
4. Create Payment Order
   POST /api/payment/create-order
   ↓
5. Complete Payment (Frontend Razorpay)
   ↓
6. Verify Payment
   POST /api/payment/verify
   ↓
7. Webhook Confirmation (Automatic)
   POST /api/payment/webhook (called by Razorpay)
   ↓
8. Access Events (User is now fully registered)
```

---

## Pricing Logic

The system automatically determines pricing based on:

1. **User Type Detection**
   - Email ending with `@nitjsr.ac.in` → NIT JSR student
   - Any other email → Outside student

2. **Offer Status** (controlled by `OFFER_STATUS` env variable)
   - `true` → Apply offer pricing
   - `false` → Apply regular pricing

3. **Pricing Matrix**

| User Type | Offer Active | Price |
|-----------|--------------|-------|
| NIT JSR   | Yes         | ₹200  |
| NIT JSR   | No          | ₹300  |
| Outside   | Yes         | ₹400  |
| Outside   | No          | ₹500  |

---

## Admin Operations

### Available Admin Operations

1. **Admin Login/Logout**
   - POST `/api/admin/auth/login`
   - POST `/api/admin/auth/logout`

2. **Event Management**
   - GET `/api/admin/events` (public - all users)
   - POST `/api/admin/events` (admin only - create event)
   - GET `/api/admin/events/[eventId]` (public - single event)
   - PUT `/api/admin/events/[eventId]` (admin only - update event)
   - DELETE `/api/admin/events/[eventId]` (admin only - delete event)

### Managing Offer Status

To change offer status, update the environment variable:

```bash
# Enable offers
OFFER_STATUS=true

# Disable offers
OFFER_STATUS=false
```

Then restart your server or redeploy.

---

## Security Best Practices

1. **JWT Secret**
   - Use a strong, randomly generated string
   - Never commit to version control
   - Rotate periodically in production

2. **Admin Passwords**
   - Use strong passwords
   - Consider implementing password hashing for admin credentials
   - Rotate regularly

3. **Razorpay Keys**
   - Use test keys in development
   - Use live keys only in production
   - Never expose keys in frontend code

4. **Webhook Security**
   - Always verify webhook signatures
   - Log suspicious webhook attempts
   - Monitor webhook failures

5. **Database**
   - Use strong database passwords
   - Whitelist IP addresses if possible
   - Enable MongoDB authentication

---

## Troubleshooting

### Email Not Sending

**Issue:** OTP emails not being received

**Solutions:**
1. Verify sender email in Brevo dashboard
2. Check BREVO_API_KEY is correct
3. Check spam folder
4. In development, OTP is logged to console

### Payment Verification Failing

**Issue:** Payment signature verification fails

**Solutions:**
1. Ensure RAZORPAY_KEY_SECRET is correct
2. Check that order_id matches in database
3. Verify payment details are sent correctly from frontend

### Webhook Not Working

**Issue:** Webhook not receiving calls from Razorpay

**Solutions:**
1. Verify webhook URL is correct in Razorpay dashboard
2. Ensure webhook URL is publicly accessible (not localhost)
3. Check RAZORPAY_WEBHOOK_SECRET matches
4. Review webhook logs in Razorpay dashboard

### Database Connection Error

**Issue:** Cannot connect to MongoDB

**Solutions:**
1. Check MONGODB_URI format
2. Verify database credentials
3. Check IP whitelist in MongoDB Atlas
4. Ensure network connectivity

---

## Development Tips

### Testing Payments (Test Mode)

Razorpay provides test cards for development:

**Success Card:**
- Card Number: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date

**Failure Card:**
- Card Number: `4000 0000 0000 0002`
- CVV: Any 3 digits
- Expiry: Any future date

### Testing Webhooks Locally

Use ngrok to expose local server:

```bash
# Install ngrok
npm install -g ngrok

# Expose local port
ngrok http 3000

# Use the ngrok URL in Razorpay webhook settings
https://your-ngrok-url.ngrok.io/api/payment/webhook
```

### Viewing Logs

Check console output for:
- OTP codes (in development)
- Database connection status
- Payment events
- Webhook calls

---

## API Documentation

For complete API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

---

## Support

For issues or questions:
1. Check this setup guide
2. Review API documentation
3. Contact the development team

---

**Last Updated:** November 7, 2025

