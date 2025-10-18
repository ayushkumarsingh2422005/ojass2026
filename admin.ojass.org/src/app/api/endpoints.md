# Admin Module API Endpoints

## Authentication Endpoints

### Admin Login
- **POST** `/api/auth/login`
  - Methods: POST
  - Purpose: Admin login with hardcoded credentials (no signup)

### Admin Logout
- **POST** `/api/auth/logout`
  - Methods: POST
  - Purpose: Admin logout

### Session Management
- **GET** `/api/auth/verify`
  - Methods: GET
  - Purpose: Verify admin session

- **GET** `/api/auth/profile`
  - Methods: GET
  - Purpose: Get admin profile

## Event Management Endpoints

### Event CRUD Operations
- **GET** `/api/events`
  - Methods: GET
  - Purpose: Get all events

- **POST** `/api/events`
  - Methods: POST
  - Purpose: Create new event

- **GET** `/api/events/:eventId`
  - Methods: GET
  - Purpose: Get specific event details

- **PUT** `/api/events/:eventId`
  - Methods: PUT
  - Purpose: Update event details

- **DELETE** `/api/events/:eventId`
  - Methods: DELETE
  - Purpose: Delete event


### Event Registration Management
- **GET** `/api/events/:eventId/registrations`
  - Methods: GET
  - Purpose: Get all registered teams/individuals for event

- **GET** `/api/events/:eventId/registrations/:registrationId`
  - Methods: GET
  - Purpose: Get specific registration details

- **GET** `/api/events/:eventId/registrations/pending-verification`
  - Methods: GET
  - Purpose: Get registered teams/individuals pending verification

- **POST** `/api/events/:eventId/registrations/:registrationId/verify`
  - Methods: POST
  - Purpose: Verify team/individual was present during participation

- **POST** `/api/events/:eventId/registrations/:registrationId/reject`
  - Methods: POST
  - Purpose: Reject verification (team/individual was not present)

- **GET** `/api/events/:eventId/registrations/verified`
  - Methods: GET
  - Purpose: Get verified registrations

- **GET** `/api/events/:eventId/registrations/rejected`
  - Methods: GET
  - Purpose: Get rejected registrations

### Team Members Management
- **GET** `/api/registrations/:registrationId/members`
  - Methods: GET
  - Purpose: Get team members for specific registration

- **PUT** `/api/registrations/:registrationId/members/:memberId`
  - Methods: PUT
  - Purpose: Update team member details

- **DELETE** `/api/registrations/:registrationId/members/:memberId`
  - Methods: DELETE
  - Purpose: Remove team member

- **POST** `/api/registrations/:registrationId/members/:memberId/verify`
  - Methods: POST
  - Purpose: Verify individual team member participation

## User Management Endpoints

### User Administration
- **GET** `/api/users`
  - Methods: GET
  - Purpose: Get all users

- **GET** `/api/users/:userId`
  - Methods: GET
  - Purpose: Get specific user details

- **PUT** `/api/users/:userId`
  - Methods: PUT
  - Purpose: Update user information

- **DELETE** `/api/users/:userId`
  - Methods: DELETE
  - Purpose: Delete user account

- **POST** `/api/users/:userId/suspend`
  - Methods: POST
  - Purpose: Suspend user account

- **POST** `/api/users/:userId/activate`
  - Methods: POST
  - Purpose: Activate user account

### User Verification
- **GET** `/api/users/pending-verification`
  - Methods: GET
  - Purpose: Get users pending verification

- **POST** `/api/users/:userId/verify`
  - Methods: POST
  - Purpose: Verify user account

- **POST** `/api/users/:userId/reject`
  - Methods: POST
  - Purpose: Reject user verification

### Individual Participants
- **GET** `/api/users/individuals`
  - Methods: GET
  - Purpose: Get individual participants

- **GET** `/api/users/individuals/:userId/events`
  - Methods: GET
  - Purpose: Get events for individual participant

- **POST** `/api/users/individuals/:userId/verify`
  - Methods: POST
  - Purpose: Verify individual participation

## Certificate Management Endpoints

### Certificate Data
- **GET** `/api/certificates`
  - Methods: GET
  - Purpose: Get all automatically generated certificates

- **GET** `/api/certificates/event/:eventId`
  - Methods: GET
  - Purpose: Get certificates for specific event

- **GET** `/api/certificates/:certificateId`
  - Methods: GET
  - Purpose: Get specific certificate data

## Media Management Endpoints

### Event Poster Images
- **GET** `/api/media/posters`
  - Methods: GET
  - Purpose: Get all event poster images

- **POST** `/api/media/posters/upload`
  - Methods: POST
  - Purpose: Upload event poster image

- **GET** `/api/media/posters/:imageId`
  - Methods: GET
  - Purpose: Get specific poster image details

- **DELETE** `/api/media/posters/:imageId`
  - Methods: DELETE
  - Purpose: Delete poster image

## Payment Management Endpoints

### Payment Overview
- **GET** `/api/payments`
  - Methods: GET
  - Purpose: Get all payments

- **GET** `/api/payments/:paymentId`
  - Methods: GET
  - Purpose: Get specific payment details

- **PUT** `/api/payments/:paymentId/status`
  - Methods: PUT
  - Purpose: Update payment status


### Refund Management
- **POST** `/api/payments/:paymentId/refund`
  - Methods: POST
  - Purpose: Process refund

- **GET** `/api/payments/refunds`
  - Methods: GET
  - Purpose: Get all refunds

- **GET** `/api/payments/refunds/:refundId`
  - Methods: GET
  - Purpose: Get specific refund details


## Ambassador Management Endpoints

### Ambassador Overview
- **GET** `/api/ambassadors`
  - Methods: GET
  - Purpose: Get all ambassadors

- **GET** `/api/ambassadors/:ambassadorId`
  - Methods: GET
  - Purpose: Get specific ambassador details

- **PUT** `/api/ambassadors/:ambassadorId`
  - Methods: PUT
  - Purpose: Update ambassador information

### Ambassador Referrals
- **GET** `/api/ambassadors/:ambassadorId/referrals`
  - Methods: GET
  - Purpose: Get ambassador referrals

## Notification Management Endpoints

### System Notifications
- **GET** `/api/notifications`
  - Methods: GET
  - Purpose: Get all notifications

- **POST** `/api/notifications`
  - Methods: POST
  - Purpose: Send system notification

- **PUT** `/api/notifications/:notificationId`
  - Methods: PUT
  - Purpose: Update notification

- **DELETE** `/api/notifications/:notificationId`
  - Methods: DELETE
  - Purpose: Delete notification

### Bulk Notifications
- **POST** `/api/notifications/bulk`
  - Methods: POST
  - Purpose: Send bulk notifications

- **POST** `/api/notifications/event/:eventId`
  - Methods: POST
  - Purpose: Send notification to event participants

- **POST** `/api/notifications/ambassadors`
  - Methods: POST
  - Purpose: Send notification to all ambassadors
