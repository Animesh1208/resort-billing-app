# 📡 API Documentation

Complete REST API reference for the Resort Billing System.

## Base URL

```
Development: http://localhost:5000/api
Production: https://your-backend.railway.app/api
```

## Authentication

All protected endpoints require JWT token in the Authorization header:

```http
Authorization: Bearer <your_jwt_token>
```

## Response Format

### Success Response
```json
{
  "data": {},
  "message": "Success message"
}
```

### Error Response
```json
{
  "message": "Error message",
  "stack": "Error stack trace (development only)"
}
```

---

## Authentication Endpoints

### 1. Login

Authenticate user and receive JWT token.

**Endpoint:** `POST /auth/login`

**Access:** Public

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:** `200 OK`
```json
{
  "_id": "64f5a1b2c3d4e5f6a7b8c9d0",
  "username": "admin",
  "fullName": "System Administrator",
  "email": "admin@resortparadise.com",
  "role": "admin",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid credentials
- `401 Unauthorized` - Account deactivated

---

### 2. Register User

Create a new staff account (Admin only).

**Endpoint:** `POST /auth/register`

**Access:** Private (Admin only)

**Headers:**
```http
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "securepassword123",
  "fullName": "John Doe",
  "email": "john@resortparadise.com",
  "role": "staff"
}
```

**Response:** `201 Created`
```json
{
  "_id": "64f5a1b2c3d4e5f6a7b8c9d1",
  "username": "johndoe",
  "fullName": "John Doe",
  "email": "john@resortparadise.com",
  "role": "staff"
}
```

**Error Responses:**
- `400 Bad Request` - User already exists
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not admin

---

### 3. Get Profile

Get current user's profile information.

**Endpoint:** `GET /auth/profile`

**Access:** Private

**Headers:**
```http
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "_id": "64f5a1b2c3d4e5f6a7b8c9d0",
  "username": "admin",
  "fullName": "System Administrator",
  "email": "admin@resortparadise.com",
  "role": "admin",
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

---

## Bill Endpoints

### 1. Get All Bills

Retrieve all bills with optional filtering and pagination.

**Endpoint:** `GET /bills`

**Access:** Private

**Query Parameters:**
- `search` (optional) - Search by customer name or invoice number
- `status` (optional) - Filter by status: `paid`, `pending`, `cancelled`
- `startDate` (optional) - Filter by date range (ISO format)
- `endDate` (optional) - Filter by date range (ISO format)
- `roomNumber` (optional) - Filter by room number
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 20)

**Example:**
```
GET /bills?search=john&status=paid&page=1&limit=20
```

**Response:** `200 OK`
```json
{
  "bills": [
    {
      "_id": "64f5a1b2c3d4e5f6a7b8c9d2",
      "invoiceNumber": "INV-202401-0001",
      "customerName": "John Smith",
      "roomNumber": "101",
      "checkIn": "2024-01-10T00:00:00.000Z",
      "checkOut": "2024-01-15T00:00:00.000Z",
      "numberOfDays": 5,
      "roomCharges": 500.00,
      "foodCharges": 150.00,
      "otherCharges": 50.00,
      "subtotal": 700.00,
      "tax": 126.00,
      "taxPercentage": 18,
      "totalAmount": 826.00,
      "paymentMethod": "card",
      "status": "paid",
      "notes": "Late checkout approved",
      "createdBy": {
        "_id": "64f5a1b2c3d4e5f6a7b8c9d0",
        "fullName": "System Administrator",
        "username": "admin"
      },
      "createdAt": "2024-01-15T14:30:00.000Z",
      "updatedAt": "2024-01-15T14:30:00.000Z"
    }
  ],
  "page": 1,
  "pages": 5,
  "total": 87
}
```

---

### 2. Create Bill

Create a new customer bill.

**Endpoint:** `POST /bills`

**Access:** Private

**Request Body:**
```json
{
  "customerName": "Jane Doe",
  "roomNumber": "205",
  "checkIn": "2024-01-20",
  "checkOut": "2024-01-25",
  "roomCharges": 600.00,
  "foodCharges": 200.00,
  "otherCharges": 100.00,
  "taxPercentage": 18,
  "paymentMethod": "cash",
  "notes": "Customer requested invoice copy via email"
}
```

**Response:** `201 Created`
```json
{
  "_id": "64f5a1b2c3d4e5f6a7b8c9d3",
  "invoiceNumber": "INV-202401-0002",
  "customerName": "Jane Doe",
  "roomNumber": "205",
  "checkIn": "2024-01-20T00:00:00.000Z",
  "checkOut": "2024-01-25T00:00:00.000Z",
  "numberOfDays": 5,
  "roomCharges": 600.00,
  "foodCharges": 200.00,
  "otherCharges": 100.00,
  "subtotal": 900.00,
  "tax": 162.00,
  "taxPercentage": 18,
  "totalAmount": 1062.00,
  "paymentMethod": "cash",
  "status": "paid",
  "notes": "Customer requested invoice copy via email",
  "createdBy": {
    "_id": "64f5a1b2c3d4e5f6a7b8c9d0",
    "fullName": "System Administrator",
    "username": "admin"
  },
  "createdAt": "2024-01-20T10:15:00.000Z",
  "updatedAt": "2024-01-20T10:15:00.000Z"
}
```

**Error Responses:**
- `400 Bad Request` - Check-out date must be after check-in date
- `400 Bad Request` - Total charges must be greater than zero

---

### 3. Get Bill by ID

Retrieve a single bill's details.

**Endpoint:** `GET /bills/:id`

**Access:** Private

**Response:** `200 OK`
```json
{
  "_id": "64f5a1b2c3d4e5f6a7b8c9d2",
  "invoiceNumber": "INV-202401-0001",
  "customerName": "John Smith",
  ...
}
```

**Error Responses:**
- `404 Not Found` - Bill not found

---

### 4. Delete Bill

Delete a bill (Admin only).

**Endpoint:** `DELETE /bills/:id`

**Access:** Private (Admin only)

**Response:** `200 OK`
```json
{
  "message": "Bill removed"
}
```

**Error Responses:**
- `404 Not Found` - Bill not found
- `403 Forbidden` - Not admin

---

### 5. Download Bill PDF

Generate and download bill as PDF.

**Endpoint:** `GET /bills/:id/pdf`

**Access:** Private

**Response:** `200 OK`
- Content-Type: `application/pdf`
- Content-Disposition: `attachment; filename=invoice-INV-202401-0001.pdf`

**Error Responses:**
- `404 Not Found` - Bill not found

---

### 6. Get Dashboard Statistics

Retrieve revenue and billing statistics.

**Endpoint:** `GET /bills/stats/dashboard`

**Access:** Private

**Response:** `200 OK`
```json
{
  "todayRevenue": 2450.00,
  "monthRevenue": 45780.00,
  "lastMonthRevenue": 38920.00,
  "totalBills": 342,
  "todayBills": 8
}
```

---

## User Management Endpoints (Admin Only)

### 1. Get All Users

Retrieve all system users.

**Endpoint:** `GET /users`

**Access:** Private (Admin only)

**Response:** `200 OK`
```json
[
  {
    "_id": "64f5a1b2c3d4e5f6a7b8c9d0",
    "username": "admin",
    "fullName": "System Administrator",
    "email": "admin@resortparadise.com",
    "role": "admin",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  {
    "_id": "64f5a1b2c3d4e5f6a7b8c9d1",
    "username": "johndoe",
    "fullName": "John Doe",
    "email": "john@resortparadise.com",
    "role": "staff",
    "isActive": true,
    "createdAt": "2024-01-05T00:00:00.000Z",
    "updatedAt": "2024-01-05T00:00:00.000Z"
  }
]
```

---

### 2. Get User by ID

Retrieve a single user's details.

**Endpoint:** `GET /users/:id`

**Access:** Private (Admin only)

**Response:** `200 OK`
```json
{
  "_id": "64f5a1b2c3d4e5f6a7b8c9d1",
  "username": "johndoe",
  "fullName": "John Doe",
  "email": "john@resortparadise.com",
  "role": "staff",
  "isActive": true,
  "createdAt": "2024-01-05T00:00:00.000Z",
  "updatedAt": "2024-01-05T00:00:00.000Z"
}
```

---

### 3. Update User

Update user information.

**Endpoint:** `PUT /users/:id`

**Access:** Private (Admin only)

**Request Body:**
```json
{
  "fullName": "John David Doe",
  "email": "john.doe@resortparadise.com",
  "role": "admin",
  "isActive": true,
  "password": "newpassword123"
}
```

Note: All fields are optional. Include `password` only if changing it.

**Response:** `200 OK`
```json
{
  "_id": "64f5a1b2c3d4e5f6a7b8c9d1",
  "username": "johndoe",
  "fullName": "John David Doe",
  "email": "john.doe@resortparadise.com",
  "role": "admin",
  "isActive": true
}
```

---

### 4. Delete User

Delete a user account.

**Endpoint:** `DELETE /users/:id`

**Access:** Private (Admin only)

**Response:** `200 OK`
```json
{
  "message": "User removed"
}
```

**Error Responses:**
- `400 Bad Request` - Cannot delete your own account
- `404 Not Found` - User not found

---

### 5. Toggle User Status

Activate or deactivate a user account.

**Endpoint:** `PATCH /users/:id/toggle-status`

**Access:** Private (Admin only)

**Response:** `200 OK`
```json
{
  "_id": "64f5a1b2c3d4e5f6a7b8c9d1",
  "username": "johndoe",
  "fullName": "John Doe",
  "isActive": false
}
```

**Error Responses:**
- `400 Bad Request` - Cannot deactivate your own account

---

## Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error |

---

## Rate Limiting

Currently, no rate limiting is implemented. Consider adding for production:

- Login attempts: 5 per 15 minutes
- API requests: 100 per minute
- PDF generation: 10 per minute

---

## Postman Collection

Import this collection to test all endpoints:

```json
{
  "info": {
    "name": "Resort Billing API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{jwt_token}}",
        "type": "string"
      }
    ]
  },
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:5000/api"
    },
    {
      "key": "jwt_token",
      "value": ""
    }
  ]
}
```

---

## Testing with cURL

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Get Bills (with token)
```bash
curl http://localhost:5000/api/bills \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Create Bill
```bash
curl -X POST http://localhost:5000/api/bills \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test Customer",
    "roomNumber": "101",
    "checkIn": "2024-01-20",
    "checkOut": "2024-01-25",
    "roomCharges": 500,
    "foodCharges": 100,
    "otherCharges": 50,
    "taxPercentage": 18,
    "paymentMethod": "cash"
  }'
```

---

## WebSocket Support

Currently not implemented. Future enhancement for real-time updates.

---

## Versioning

Current API Version: **v1**

Future versions will use URL versioning: `/api/v2/...`

---

## Support

For API questions or issues:
- 📧 Email: api-support@resortbilling.com
- 📚 Documentation: Check this file
- 🐛 Issues: GitHub Issues page

---

**API Documentation Complete! 🎉**
