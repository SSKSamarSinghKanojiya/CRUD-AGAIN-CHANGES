ser Management API Documentation

This API provides endpoints for user management operations such as signup, login, fetching user details, updating profiles, and deleting accounts.

Base URL

http://localhost:3000/api

1. User Signup

Endpoint: POST /signup

Description: Allows users to create an account.

Request Body:

{
  "username": "johndoe",
  "email": "johndoe@example.com",
  "password": "password123"
}

Response:

{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "_id": "6500abc123",
    "username": "johndoe",
    "email": "johndoe@example.com",
    "createdAt": "2024-03-25T10:00:00Z"
  }
}

2. User Login

Endpoint: POST /login

Description: Logs in a user and returns a JWT token.

Request Body:

{
  "email": "johndoe@example.com",
  "password": "password123"
}

Response:

{
  "success": true,
  "message": "Login successful",
  "token": "your_jwt_token_here"
}

3. Get All User Details

Endpoint: GET /users

Description: Fetches details of all users (Admin only).

Headers:

Authorization: Bearer <token>

Response:

[
  {
    "_id": "6500abc123",
    "username": "johndoe",
    "email": "johndoe@example.com",
    "createdAt": "2024-03-25T10:00:00Z"
  }
]

4. Get User Profile

Endpoint: GET /users/:id

Description: Fetches details of a single user by ID.

Headers:

Authorization: Bearer <token>

Response:

{
  "_id": "6500abc123",
  "username": "johndoe",
  "email": "johndoe@example.com",
  "createdAt": "2024-03-25T10:00:00Z"
}

5. Update User Profile

Endpoint: PUT /users/:id

Description: Updates the details of a user.

Headers:

Authorization: Bearer <token>

Request Body:

{
  "username": "john_doe_updated"
}

Response:

{
  "success": true,
  "message": "User profile updated successfully",
  "user": {
    "_id": "6500abc123",
    "username": "john_doe_updated",
    "email": "johndoe@example.com",
    "createdAt": "2024-03-25T10:00:00Z"
  }
}

6. Delete User Account

Endpoint: DELETE /users/:id

Description: Deletes a user account.

Headers:

Authorization: Bearer <token>

Response:

{
  "success": true,
  "message": "User account deleted successfully"
}

7. User Logout

Endpoint: POST /logout

Description: Logs out a user by invalidating the token.

Headers:

Authorization: Bearer <token>

Response:

{
  "success": true,
  "message": "Logout successful"
}

Error Response Format:

{
  "success": false,
  "message": "Error message here"
}

Notes:

Ensure you include the JWT token in the Authorization header for all secured routes.

All dates are in UTC.

Validation errors return status 400.

Unauthorized errors return status 401.

Forbidden errors return status 403.

