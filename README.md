# API Overview

1. [User APIs](#user-apis)
2. [Admin APIs](#admin-apis)

## 🔒 Authorization

All protected API endpoints require a valid JWT token obtained from the login endpoint (user or admin). Include the token in the Authorization headers or in the cookies.

```
Authorization: Bearer <your_jwt_token>
```

### Token Expiration

- Token expires after few days after.
- Expired tokens will return a `401 Unauthorized` error.
- Obtain a new token by logging in again.

---

## 📋 Response Format

All API responses follow this consistent structure:

```json
{
  "statusCode": 200,
  "success": true, 
  "data": { },
  "message": "Operation completed successfully"
}
```

---
## 🚨 Error Response Format

All error responses follow this consistent format:

```json
{
  "statusCode": 400,
  "success": false,
  "data": null,
  "message": "Error message description"
}
```

Common HTTP Status Codes:

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict
- `500`: Internal Server Error
---
# USER APIs

This contains all the API endpoints for user.

---
## 🔐 User Authentication

### 1. Register User

**Endpoint:** `POST /user/register`
**Description:** Registers a new user, uploads their ID card to Cloudinary, and sends a welcome email via the Bravo API.

#### Request Body

```json
{
  "name": "Riya Sharma",
  "email": "riyaugcs097@nitjsr.ac.in",
  "password": "riya123",
  "contact": "9876543210",
  "registrationNumber": "2024UGCS097",
  "idCardFile": "<base64_encoded_image_or_file_data>"
}
```

#### ✅ Success Response

```json
{
  "statusCode": 201,
  "success": true,
  "message": "User registered successfully. Welcome message sent.",
  "data": {
    "_id": "6710c1b39f",
    "name": "Riya Sharma",
    "email": "riyaugcs097@nitjsr.ac.in",
    "contact": "9876543210",
	"registrationNumber": "2024UGCS097",
    "idCardUrl": "https://cloudinary.com/user_cards/cs097.jpg"
  }
}
```

#### ❌ Error Response

```json
{
  "statusCode": 400,
  "success": false,
  "message": "Email already exists",
  "data": {}
}
```

```json
{
  "statusCode": 400,
  "success": false,
  "message": "Password must be at least 8 characters long and contain both letters and numbers.",
  "data": {}
}
```

```json
{
  "statusCode": 500,
  "success": false,
  "message": "Failed to upload ID card. Please try again.",
  "data": {}
}
```

---

### 2. Login User

**Endpoint:** `POST /user/login`
**Description:** Authenticates a user using their email and password.

#### Request Body

```json
{
  "email": "riya@test.com",
  "password": "riya123"
}
```

#### ✅ Success Response

Also, send JWT Token via cookies

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "6710c1b39f",
      "name": "Riya Sharma",
      "email": "riya@test.com",
      "contact": "9876543210",
	  "registrationNumber": "2024UGCS097"
    }
  }
}
```

#### ❌ Error Response

```json
{
  "statusCode": 401,
  "success": false,
  "message": "Invalid email or password",
  "data": {}
}
```

---

### 3. Google Login

**Endpoint:** `POST /user/googleLogin`
**Description:** Allows login using a Google account.

#### Request Body

```json
{
  "tokenId": "<Google_OAuth_Token>"
}
```

#### ✅ Success Response

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Google login successful",
  "data": {}
}
```

#### ❌ Error Response

```json
{
  "statusCode": 400,
  "success": false,
  "message": "Google authentication failed",
  "data": {}
}
```

---

### 4. Forget Password

**Endpoint:** `POST /user/forgetPassword`
**Description:** Sends a password reset link to the user’s email.

#### Request Body

```json
{
  "email": "riya@test.com"
}
```

#### ✅ Success Response

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Password reset link sent to your email",
  "data": {}
}
```

#### ❌ Error Response

```json
{
  "statusCode": 404,
  "success": false,
  "message": "Email not found",
  "data": {}
}
```

---

### 5. Reset Password

**Endpoint:** `POST /user/resetPassword`
**Description:** Resets the user’s password using a valid token.

#### Request Body

```json
{
  "newPassword": "newRiya123"
}
```

#### ✅ Success Response

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Password updated successfully",
  "data": {}
}
```

#### ❌ Error Response

```json
{
  "statusCode": 400,
  "success": false,
  "message": "Invalid or expired token",
  "data": {}
}
```

---

## 🎟️ Event Management

### 6. View All Events

**Endpoint:** `GET /user/allEvents`

#### ✅ Success Response

```json
{
  "statusCode": 200,
  "success": true,
  "message": "All events fetched successfully",
  "data": {
    "events": [
      {
        "_id": "some_id",
        "name": "Hackathon 2025",
        "category": "Coding",
        "isTeamEvent": true
      }
    ]
  }
}
```

#### ❌ Error Response

```json
{
  "statusCode": 500,
  "success": false,
  "message": "Failed to fetch events",
  "data": {}
}
```

---

### 7. View Event Details

**Endpoint:** `GET /user/events/:eventId`

#### ✅ Success Response

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Event details fetched successfully",
  "data": {
    "_id": "some_id",
    "name": "Hackathon 2025",
    "description": "A national-level coding hackathon",
    "teamSize": 3
  }
}
```

#### ❌ Error Response

```json
{
  "statusCode": 404,
  "success": false,
  "message": "Event not found",
  "data": {}
}
```

---

### 8. Register for Event

**Endpoint:** `POST /user/register/:eventId`
**Authentication:** Required

#### Request Body (Team)

```json
{
  "isIndividual": false,
  "teamName": "CodeCrushers",
  "members": ["Riya", "Aman", "Neelam"],
  "memberCount": 3
}
```

#### ✅ Success Response

```json
{
  "statusCode": 201,
  "success": true,
  "message": "Successfully registered for event Hackathon 2025",
  "data": {
    "registrationId": "REG2025_0123"
  }
}
```

#### ❌ Error Response

```json
{
  "statusCode": 409,
  "success": false,
  "message": "Already registered for this event",
  "data": {}
}
```

---

### 9. Unregister from Event

**Endpoint:** `DELETE /user/unregister`
**Authentication:** Required

#### ✅ Success Response

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Unregistered successfully from event",
  "data": {}
}
```

#### ❌ Error Response

```json
{
  "statusCode": 404,
  "success": false,
  "message": "Registration not found",
  "data": {}
}
```

---

## 💳 Membership

### 10. Become a Member

**Endpoint:** `POST /user/becomeMember`
**Authentication:** Required

#### ✅ Success Response

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Membership purchase initiated successfully",
  "data": {
    "paymentLink": "https://paymentgateway.com/xyz"
  }
}
```

#### ❌ Error Response

```json
{
  "statusCode": 500,
  "success": false,
  "message": "Failed to initiate membership payment",
  "data": {}
}
```

---

### 11. Validate Membership

**Endpoint:** `POST /user/validateMember`
**Authentication:** Required

#### ✅ Success Response

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Membership is valid",
  "data": {
    "expiryDate": "2026-10-17T00:00:00Z"
  }
}
```

#### ❌ Error Response

```json
{
  "statusCode": 403,
  "success": false,
  "message": "Membership expired or invalid",
  "data": {}
}
```

---

### 11.5 Payment Verification Webhook

**Endpoint:** `POST /user/webhook/paymentVerify`

#### ✅ Success Response

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Payment verification acknowledged",
  "data": {
    "transactionId": "PAY987654"
  }
}
```

#### ❌ Error Response

```json
{
  "statusCode": 400,
  "success": false,
  "message": "Invalid payment data received",
  "data": {}
}
```

---

## 👥 Team Management

### 12. Add Team Member

**Endpoint:** `POST /user/addMember`
**Authentication:** Required (Team Leader only)

#### ✅ Success Response

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Member added successfully",
  "data": {
    "memberId": "U1023"
  }
}
```

#### ❌ Error Response

```json
{
  "statusCode": 403,
  "success": false,
  "message": "Only team leader can add members",
  "data": {}
}
```

---

### 13. Remove Team Member

**Endpoint:** `DELETE /user/removeMember/:memberId`
**Authentication:** Required

Note: This route allows member removal only by:
- The **Team Leader**, or
- The **member** initiating self-removal.

#### ✅ Success Response

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Member removed successfully",
  "data": {}
}
```

#### ❌ Error Response

```json
{
  "statusCode": 404,
  "success": false,
  "message": "Member not found or unauthorized action",
  "data": {}
}
```

---

### 14. Dissolve Team

**Endpoint:** `DELETE /user/dissolveTeam/:teamId`
**Authentication:** Required

#### ✅ Success Response

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Team dissolved successfully",
  "data": {}
}
```

#### ❌ Error Response

```json
{
  "statusCode": 403,
  "success": false,
  "message": "Only team leader can dissolve the team",
  "data": {}
}
```

---

## 🏅 Certificates

### 15. Generate Certificate

**Endpoint:** `POST /user/generateCertificate`
**Authentication:** Required

#### ✅ Success Response

```json
{
  "statusCode": 200,
  "success": true,
  "message": "Certificate generated successfully",
  "data": {
    "certificateUrl": "https://cdn.ojass2026.com/certificates/Riya_Hackathon2025.pdf"
  }
}
```

#### ❌ Error Response

```json
{
  "statusCode": 400,
  "success": false,
  "message": "Invalid event or user not eligible for certificate",
  "data": {}
}
```

---

# ADMIN APIs

This contains all the API endpoints for admin.

---

## 🔐 Admin Authentication Endpoints

### 1. Admin Login

**POST** `/admin/login`

Authenticate admin user and receive access token.

**Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "email": "admin@example.com",
  "password": "adminPassword123"
}
```

**Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "data": {
    "admin": {
      "_id": "admin_id",
      "email": "admin@example.com",
      "role": "admin"
    }
  },
  "message": "Admin login successful!"
}
```

**Error Response (401):**

```json
{
  "statusCode": 401,
  "success": false,
  "data": null,
  "message": "Invalid credentials"
}
```

**Other Error Responses:**

- `400`: Missing email or password
- `403`: Insufficient permissions

---

## 📅 Event Management Endpoints

### 2. Get All Events

**GET** `/admin/allEvents`

Retrieve a list of all events in the system.

**Headers:**

```
Authorization: Bearer <admin_jwt_token>
```

**Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "data": {
    "events": [
      {
        "_id": "event_id_1",
        "name": "Hack De Science",
        "date": "2025-11-15",
        "status": "upcoming",
        "registeredCount": 324
      },
      {
        "_id": "event_id_2",
        "name": "Code Mania",
        "date": "2025-12-20",
        "status": "active",
        "registeredCount": 150
      }
    ],
    "total": 2
  },
  "message": "Events retrieved successfully"
}
```

**Error Response (401):**

```json
{
  "statusCode": 401,
  "success": false,
  "data": null,
  "message": "Unauthorized - Invalid or missing token"
}
```

---

### 3. Get Event by ID

**GET** `/admin/events/:eventId`

Retrieve detailed information about a specific event.

**Headers:**

```
Authorization: Bearer <admin_jwt_token>
```

**URL Parameters:**

- `eventId` - The unique identifier of the event

**Example:**

```
GET /admin/events/evt_123456
```

**Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "data": {
    "event": {
      "_id": "evt_123456",
      "name": "Tech Conference 2025",
      "description": "Annual technology conference",
      "date": "2025-11-15",
      "capacity": 500,
      "registeredUsers": 324,
      "status": "upcoming",
      "created_at": "2025-01-15T10:30:00Z"
    }
  },
  "message": "Event details retrieved successfully"
}
```

**Error Response (404):**

```json
{
  "statusCode": 404,
  "success": false,
  "data": null,
  "message": "Event not found"
}
```

---

### 4. Add New Event

**POST** `/admin/addEvent`

Create a new event in the system.

**Headers:**

```
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "name": "Tech Conference 2025",
  "description": "Annual technology conference",
  "date": "2025-11-15",
  "capacity": 500,
  "category": "Technology",
  "price": 99.99
}
```

**Response (201):**

```json
{
  "statusCode": 201,
  "success": true,
  "data": {
    "event": {
      "_id": "new_event_id",
      "name": "Tech Conference 2025",
      "date": "2025-11-15",
      "capacity": 500,
      "created_at": "2025-10-16T10:30:00Z"
    }
  },
  "message": "Event created successfully"
}
```

**Error Response (400):**

```json
{
  "statusCode": 400,
  "success": false,
  "data": null,
  "message": "Missing required fields: name, date, location"
}
```

**Other Error Responses:**

- `401`: Unauthorized
- `409`: Event already exists

---

### 5. Delete Event

**DELETE** `/admin/deleteEvent`

Delete an existing event from the system.

**Headers:**

```
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "eventId": "evt_123456"
}
```

**Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "data": {
    "deletedEventId": "evt_123456"
  },
  "message": "Event deleted successfully"
}
```

**Error Response (404):**

```json
{
  "statusCode": 404,
  "success": false,
  "data": null,
  "message": "Event not found"
}
```

**Other Error Responses:**

- `400`: Missing event ID
- `401`: Unauthorized

---

### 6. Modify Event

**PUT** `/admin/modifyEvent`

Update details of an existing event.

**Headers:**

```
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json
```

**Request Body:**

```json
{
  "eventId": "evt_123456",
  "name": "Updated Tech Conference 2025",
  "description": "Updated description",
  "date": "2025-11-20",
  "capacity": 600,
  "price": 89.99
}
```

**Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "data": {
    "event": {
      "_id": "evt_123456",
      "name": "Updated Tech Conference 2025",
      "date": "2025-11-20",
      "capacity": 600,
      "updated_at": "2025-10-16T10:30:00Z"
    }
  },
  "message": "Event updated successfully"
}
```

**Error Response (404):**

```json
{
  "statusCode": 404,
  "success": false,
  "data": null,
  "message": "Event not found"
}
```

**Other Error Responses:**

- `400`: Missing event ID or invalid data
- `401`: Unauthorized

---

### 7. Declare Event Result

**POST** `/admin/declareResult/:eventId`

Declare the results for a completed event.

**Headers:**

```
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json
```

**URL Parameters:**

- `eventId` - The unique identifier of the event

**Request Body:**

```json
{
  "winners": [
    {
      "position": 1,
      "teamId": "team_001"
    },
    {
      "position": 2,
      "teamId": "team_002"
    },
    {
      "position": 3,
      "teamId": "team_003"
    }
  ]
}
```

**Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "data": {
    "eventId": "evt_123456",
    "winners": [
      {
        "position": 1,
        "teamId": "team_001",
        "teamName": "#include <winners>"
      },
      {
        "position": 2,
        "teamId": "team_002",
        "teamName": "<Hello World />"
      },
        {
        "position": 3,
        "teamId": "team_003",
        "teamName": "GOATed"
      }
    ]
  },
  "message": "Event results declared successfully"
}
```

**Error Response (404):**

```json
{
  "statusCode": 404,
  "success": false,
  "data": null,
  "message": "Event not found"
}
```

**Other Error Responses:**

- `400`: Invalid data
- `401`: Unauthorized

---

## 👥 User Management Endpoints

### 8. Get All Users

**GET** `/admin/allUsers`

Retrieve a list of all registered users.

**Headers:**

```
Authorization: Bearer <admin_jwt_token>
```

**Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "data": {
    "users": [
      {
        "_id": "user_001",
        "name": "John Doe",
        "email": "2024ugee029@nitjsr.ac.in",
        "phone": "+1234567890",
        "verified": true,
        "created_at": "2025-01-10T08:30:00Z"
      },
      {
        "_id": "user_002",
        "name": "Jane Smith",
        "email": "2024ugcs000@nitjsr.ac.in",
        "phone": "+1234567891",
        "verified": true,
        "created_at": "2025-01-12T10:15:00Z"
      }
    ],
    "total": 2
  },
  "message": "Users retrieved successfully"
}
```

**Error Response (401):**

```json
{
  "statusCode": 401,
  "success": false,
  "data": null,
  "message": "Unauthorized - Invalid or missing token"
}
```

---

### 9. Get Users by User ID

**GET** `/admin/allUsers/:userId`

Retrieve detailed information about a specific user.

**Headers:**

```
Authorization: Bearer <admin_jwt_token>
```

**URL Parameters:**

- `userid` - The unique identifier of the user

**Example:**

```
GET /admin/allUsers/user_001
```

**Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "data": {
    "user": {
      "_id": "user_001",
      "name": "John Doe",
      "email": "2024ugee029@nitjsr.ac.in",
      "phone": "+1234567890",
      "verified": true,
      "eventsRegistered": ["evt_123", "evt_456"],
      "created_at": "2025-01-10T08:30:00Z"
    }
  },
  "message": "User details retrieved successfully"
}
```

**Error Response (404):**

```json
{
  "statusCode": 404,
  "success": false,
  "data": null,
  "message": "User not found"
}
```

---

## 🏆 Team Management Endpoints

### 10. Get All Teams

**GET** `/admin/allTeams`

Retrieve a list of all teams registered in the system.

**Headers:**

```
Authorization: Bearer <admin_jwt_token>
```

**Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "data": {
    "teams": [
      {
        "_id": "team_001",
        "name": "Tech Warriors",
        "leaderId": "user_001",
        "members": ["user_001", "user_002", "user_003"],
        "created_at": "2025-02-01T09:00:00Z"
      },
      {
        "_id": "team_002",
        "name": "Code Ninjas",
        "leaderId": "user_004",
        "members": ["user_004", "user_005"],
        "created_at": "2025-02-02T10:30:00Z"
      }
    ],
    "total": 2
  },
  "message": "Teams retrieved successfully"
}
```

**Error Response (401):**

```json
{
  "statusCode": 401,
  "success": false,
  "data": null,
  "message": "Unauthorized - Invalid or missing token"
}
```

---

### 11. Get Team by Team ID

**GET** `/admin/team/:teamId`

Retrieve detailed information about a specific team.

**Headers:**

```
Authorization: Bearer <admin_jwt_token>
```

**URL Parameters:**

- `teamid` - The unique identifier of the team

**Example:**

```
GET /admin/team/team_001
```

**Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "data": {
    "team": {
      "_id": "team_001",
      "name": "Tech Warriors",
      "eventName": "Tech Conference 2025",
      "leader": {
        "_id": "user_001",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "members": [
        {
          "_id": "user_001",
          "name": "John Doe",
          "role": "leader"
        },
        {
          "_id": "user_002",
          "name": "Jane Smith",
          "role": "member"
        },
         {
          "_id": "user_003",
          "name": "Jane Willsmith",
          "role": "member"
        }
      ],
      "created_at": "2025-02-01T09:00:00Z"
    }
  },
  "message": "Team details retrieved successfully"
}
```

**Error Response (404):**

```json
{
  "statusCode": 404,
  "success": false,
  "data": null,
  "message": "Team not found!"
}
```

---

### 12. Get Event Registered Users by Event ID

**GET** `/admin/eventRegisteredUsers/:eventId`

Retrieve all users who have registered for a specific event.

**Headers:**

```
Authorization: Bearer <admin_jwt_token>
```

**URL Parameters:**

- `eventId` - The unique identifier of the event

**Example:**

```
GET /admin/eventRegisteredUsers/evt_123
```

**Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "data": {
    "eventId": "evt_123",
    "eventName": "Tech Conference 2025",
    "registeredUsers": [
      {
        "_id": "user_001",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+1234567890",
        "registrationDate": "2025-01-20T14:30:00Z",
        "teamId": "team_001"
      },
      {
        "_id": "user_002",
        "name": "Jane Smith",
        "email": "jane@example.com",
        "phone": "+1234567891",
        "registrationDate": "2025-01-21T09:15:00Z",
        "teamId": "team_001"
      }
    ],
    "total_registered": 2
  },
  "message": "Event registered users retrieved successfully"
}
```

**Error Response (404):**

```json
{
  "statusCode": 404,
  "success": false,
  "data": null,
  "message": "Event not found"
}
```

---

### 13. Get Events Registered Teams by Event ID

**GET** `/admin/eventsRegisteredTeams/:eventId`

Retrieve all teams that have registered for a specific event.

**Headers:**

```
Authorization: Bearer <admin_jwt_token>
```

**URL Parameters:**

- `eventId` - The unique identifier of the event

**Example:**

```
GET /admin/eventsRegisteredTeams/evt_123
```

**Response (200):**

```json
{
  "statusCode": 200,
  "success": true,
  "data": {
    "eventId": "evt_123",
    "eventName": "Tech Conference 2025",
    "registeredTeams": [
      {
        "_id": "team_001",
        "name": "Tech Warriors",
        "leaderName": "John Doe",
        "memberCount": 3,
        "registrationDate": "2025-02-01T09:00:00Z"
      },
      {
        "_id": "team_002",
        "name": "Code Ninjas",
        "leaderName": "Mike Johnson",
        "memberCount": 2,
        "registrationDate": "2025-02-02T10:30:00Z"
      }
    ],
    "totalTeams": 2
  },
  "message": "Event registered teams retrieved successfully"
}
```

**Error Response (404):**

```json
{
  "statusCode": 404,
  "success": false,
  "data": null,
  "message": "Event not found"
}
```

---