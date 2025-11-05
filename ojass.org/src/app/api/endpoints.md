# Main Module API Endpoints

## Authentication Endpoints

### User Registration
- **POST** `/api/auth/register`
  - Methods: POST
  - Purpose: Register new user with email/phone and ID card upload (one-time)

### User Login
- **POST** `/api/auth/login`
  - Methods: POST
  - Purpose: Login via email or phone number

### User Logout
- **POST** `/api/auth/logout`
  - Methods: POST
  - Purpose: Logout user session

### Password Reset
- **POST** `/api/auth/forgot-password`
  - Methods: POST
  - Purpose: Send password reset link

- **POST** `/api/auth/reset-password`
  - Methods: POST
  - Purpose: Reset password with otp

### Email Verification
- **POST** `/api/auth/send-email-verification`
  - Methods: POST
  - Purpose: Send email verification code

- **POST** `/api/auth/verify-email`
  - Methods: POST
  - Purpose: Verify email address with verification code

## Media Management Endpoints

### File Upload
- **POST** `/api/media/upload`
  - Methods: POST
  - Purpose: Upload files (ID cards, documents) and get public URL (one-time upload for ID card)

### File Management
- **GET** `/api/media/:fileId`
  - Methods: GET
  - Purpose: Get file details

- **DELETE** `/api/media/:fileId`
  - Methods: DELETE
  - Purpose: Delete uploaded file

- **GET** `/api/media/user/:userId`
  - Methods: GET
  - Purpose: Get all user's uploaded files

## User Profile Endpoints

### Profile Management
- **GET** `/api/user/profile`
  - Methods: GET
  - Purpose: Get user profile

- **PUT** `/api/user/profile`
  - Methods: PUT
  - Purpose: Update user profile

- **GET** `/api/user/dashboard`
  - Methods: GET
  - Purpose: Get user dashboard data

## Event Management Endpoints

### Events
- **GET** `/api/events`
  - Methods: GET
  - Purpose: Get all available events

- **GET** `/api/events/:eventId`
  - Methods: GET
  - Purpose: Get specific event details

- **GET** `/api/events/category/:category`
  - Methods: GET
  - Purpose: Get events by category

### Event Registration
- **POST** `/api/events/:eventId/register`
  - Methods: POST
  - Purpose: Register for individual event

- **GET** `/api/events/:eventId/registered`
  - Methods: GET
  - Purpose: Check if user is registered for event

- **DELETE** `/api/events/:eventId/unregister`
  - Methods: DELETE
  - Purpose: Unregister from event

## Team Management Endpoints

### Team Creation
- **POST** `/api/teams`
  - Methods: POST
  - Purpose: Create new team

- **GET** `/api/teams`
  - Methods: GET
  - Purpose: Get user's teams

- **GET** `/api/teams/:teamId`
  - Methods: GET
  - Purpose: Get team details

- **PUT** `/api/teams/:teamId`
  - Methods: PUT
  - Purpose: Update team details

- **DELETE** `/api/teams/:teamId`
  - Methods: DELETE
  - Purpose: Delete team

### Team Members
- **GET** `/api/teams/:teamId/members`
  - Methods: GET
  - Purpose: Get team members

- **POST** `/api/teams/:teamId/invite`
  - Methods: POST
  - Purpose: Send team invitation

- **POST** `/api/teams/join/:inviteToken`
  - Methods: POST
  - Purpose: Join team via invitation link

- **DELETE** `/api/teams/:teamId/members/:memberId`
  - Methods: DELETE
  - Purpose: Remove team member

- **POST** `/api/teams/:teamId/leave`
  - Methods: POST
  - Purpose: Leave team

### Team Event Registration
- **POST** `/api/teams/:teamId/events/:eventId/register`
  - Methods: POST
  - Purpose: Register team for event

- **GET** `/api/teams/:teamId/events`
  - Methods: GET
  - Purpose: Get team's registered events

- **DELETE** `/api/teams/:teamId/events/:eventId/unregister`
  - Methods: DELETE
  - Purpose: Unregister team from event

## Payment Endpoints

### Registration Fee Payment
- **POST** `/api/payments/registration`
  - Methods: POST
  - Purpose: Process registration fee payment

- **GET** `/api/payments/status/:paymentId`
  - Methods: GET
  - Purpose: Check payment status

- **POST** `/api/payments/verify`
  - Methods: POST
  - Purpose: Verify payment completion

### Payment History
- **GET** `/api/payments/history`
  - Methods: GET
  - Purpose: Get user's payment history

- **GET** `/api/payments/:paymentId`
  - Methods: GET
  - Purpose: Get specific payment details

## Certificates & Results Endpoints

### Certificates
- **GET** `/api/certificates`
  - Methods: GET
  - Purpose: Get user's certificates

- **GET** `/api/certificates/:certificateId`
  - Methods: GET
  - Purpose: Get specific certificate

- **GET** `/api/certificates/download/:certificateId`
  - Methods: GET
  - Purpose: Download certificate

### Event Results
- **GET** `/api/events/:eventId/results`
  - Methods: GET
  - Purpose: Get event results and winners

- **GET** `/api/events/:eventId/leaderboard`
  - Methods: GET
  - Purpose: Get event leaderboard

## Referral System Endpoints

### Referral Management
- **GET** `/api/referrals/code`
  - Methods: GET
  - Purpose: Get user's referral code

- **GET** `/api/referrals/stats`
  - Methods: GET
  - Purpose: Get referral statistics

- **GET** `/api/referrals/referred-users`
  - Methods: GET
  - Purpose: Get list of referred users

## Notification Endpoints

### Notifications
- **GET** `/api/notifications`
  - Methods: GET
  - Purpose: Get user notifications

- **PUT** `/api/notifications/:notificationId/read`
  - Methods: PUT
  - Purpose: Mark notification as read

- **PUT** `/api/notifications/mark-all-read`
  - Methods: PUT
  - Purpose: Mark all notifications as read

## Search & Filter Endpoints

### Search
- **GET** `/api/search/events`
  - Methods: GET
  - Purpose: Search events

- **GET** `/api/search/teams`
  - Methods: GET
  - Purpose: Search teams

- **GET** `/api/search/users`
  - Methods: GET
  - Purpose: Search users
