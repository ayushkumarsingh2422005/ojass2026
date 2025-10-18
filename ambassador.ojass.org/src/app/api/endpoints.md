# Ambassador Module API Endpoints

## Authentication Endpoints

### Ambassador Login
- **POST** `/api/auth/login`
  - Methods: POST
  - Purpose: Login for existing users in database (no signup)

### Ambassador Logout
- **POST** `/api/auth/logout`
  - Methods: POST
  - Purpose: Logout ambassador session

### Session Verification
- **GET** `/api/auth/verify`
  - Methods: GET
  - Purpose: Verify ambassador session

## Referral Management Endpoints

### Referred Users
- **GET** `/api/referrals/users`
  - Methods: GET
  - Purpose: Get all users who registered using ambassador's OJASS ID

- **GET** `/api/referrals/users/:userId`
  - Methods: GET
  - Purpose: Get specific referred user details

## Dashboard Endpoints

### Ambassador Dashboard
- **GET** `/api/dashboard`
  - Methods: GET
  - Purpose: Get ambassador dashboard with referred users and payment status

### Statistics
- **GET** `/api/stats`
  - Methods: GET
  - Purpose: Get basic referral statistics (total referred, paid, unpaid)