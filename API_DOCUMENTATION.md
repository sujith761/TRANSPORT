# API Documentation - KASC Transport System

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

Register a new student account.

**Request Body:**
```json
{
  "name": "John Doe",
  "registerNumber": "21KASC001",
  "email": "john@example.com",
  "password": "password123",
  "mobile": "9876543210",
  "department": "B.Sc CS",
  "city": "Coimbatore"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "registerNumber": "21KASC001",
      "department": "B.Sc CS",
      "role": "student"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Login
**POST** `/auth/login`

Login with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Get Current User
**GET** `/auth/me`

Get currently logged-in user details.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "registerNumber": "21KASC001",
    "department": "B.Sc CS",
    "role": "student"
  }
}
```

---

## Student Transport Endpoints

### Apply for Transport
**POST** `/transport/apply`

Submit a new transport application.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "John Doe",
  "registerNumber": "21KASC001",
  "department": "B.Sc CS",
  "academicYear": "I Year",
  "mobile": "9876543210",
  "email": "john@example.com",
  "address": "123 Main St, Coimbatore",
  "route": "route_id_here",
  "applicationType": "new"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Transport application submitted successfully",
  "data": {
    "_id": "...",
    "status": "pending",
    "createdAt": "2026-02-11T..."
  }
}
```

---

### Change Route
**POST** `/transport/change`

Request to change bus route.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "John Doe",
  "registerNumber": "21KASC001",
  "department": "B.Sc CS",
  "academicYear": "I Year",
  "mobile": "9876543210",
  "email": "john@example.com",
  "address": "123 Main St",
  "currentRoute": "route_id_1",
  "newRoute": "route_id_2",
  "reason": "Changed residence location"
}
```

---

### Cancel Route
**POST** `/transport/cancel`

Request to cancel transport service.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "John Doe",
  "registerNumber": "21KASC001",
  "department": "B.Sc CS",
  "academicYear": "I Year",
  "mobile": "9876543210",
  "email": "john@example.com",
  "address": "123 Main St",
  "currentRoute": "route_id",
  "reason": "No longer need transport"
}
```

---

### Get Application Status
**GET** `/transport/status`

Get all applications submitted by the student.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "...",
      "applicationType": "new",
      "status": "approved",
      "route": {
        "routeName": "Gandhipuram Route",
        "routeNumber": "RT001"
      },
      "qrCode": "data:image/png;base64...",
      "createdAt": "2026-02-11T..."
    }
  ]
}
```

---

### Get Notifications
**GET** `/transport/notifications`

Get notifications for the student.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "...",
      "title": "Application Approved",
      "message": "Your transport application has been approved",
      "type": "success",
      "isRead": false,
      "createdAt": "2026-02-11T..."
    }
  ]
}
```

---

## Route Endpoints (Public)

### Get All Routes
**GET** `/routes`

Get all active bus routes.

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "...",
      "routeName": "Gandhipuram Route",
      "routeNumber": "RT001",
      "startingPoint": "Gandhipuram",
      "endingPoint": "KASC Campus",
      "startTime": "07:00 AM",
      "endTime": "08:30 AM",
      "stops": [
        {
          "stopName": "Gandhipuram Bus Stand",
          "arrivalTime": "07:00 AM"
        }
      ]
    }
  ]
}
```

---

### Get Single Route
**GET** `/routes/:id`

Get details of a specific route.

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "routeName": "Gandhipuram Route",
    "routeNumber": "RT001",
    "stops": [...]
  }
}
```

---

### Get Route with Bus Details
**GET** `/routes/:id/details`

Get route with assigned bus and driver information.

**Response:**
```json
{
  "success": true,
  "data": {
    "route": {
      "routeName": "Gandhipuram Route",
      "stops": [...]
    },
    "bus": {
      "busNumber": "TN37AB1234",
      "capacity": 40,
      "driver": {
        "name": "Driver Name",
        "phone": "9876543210"
      }
    }
  }
}
```

---

## Admin Endpoints

### Get All Students
**GET** `/admin/students`

Get list of all registered students.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "count": 100,
  "data": [
    {
      "_id": "...",
      "name": "John Doe",
      "registerNumber": "21KASC001",
      "department": "B.Sc CS",
      "email": "john@example.com",
      "mobile": "9876543210",
      "isActive": true
    }
  ]
}
```

---

### Get All Applications
**GET** `/admin/applications`

Get all transport applications. Can filter by status and type.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `status` - pending | approved | rejected
- `type` - new | change | cancel

**Example:**
```
GET /admin/applications?status=pending
```

**Response:**
```json
{
  "success": true,
  "count": 25,
  "data": [
    {
      "_id": "...",
      "user": {
        "name": "John Doe",
        "registerNumber": "21KASC001"
      },
      "applicationType": "new",
      "status": "pending",
      "route": {...}
    }
  ]
}
```

---

### Approve Application
**PUT** `/admin/applications/:id/approve`

Approve a pending application.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Application approved successfully",
  "data": {
    "_id": "...",
    "status": "approved",
    "qrCode": "data:image/png;base64...",
    "approvedAt": "2026-02-11T..."
  }
}
```

---

### Reject Application
**PUT** `/admin/applications/:id/reject`

Reject a pending application.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "reason": "Incomplete information provided"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Application rejected",
  "data": {
    "status": "rejected",
    "rejectionReason": "Incomplete information provided"
  }
}
```

---

### Get Dashboard Analytics
**GET** `/admin/analytics`

Get comprehensive dashboard statistics.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalStudents": 500,
    "totalApplications": 450,
    "pendingApplications": 25,
    "approvedApplications": 400,
    "totalBuses": 15,
    "activeBuses": 12,
    "totalDrivers": 15,
    "totalRoutes": 10,
    "applicationsByType": [
      { "_id": "new", "count": 350 },
      { "_id": "change", "count": 75 },
      { "_id": "cancel", "count": 25 }
    ],
    "studentsPerRoute": [
      {
        "routeName": "Gandhipuram Route",
        "routeNumber": "RT001",
        "students": 45
      }
    ]
  }
}
```

---

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "success": false,
  "message": "Error message here"
}
```

### Common Error Codes:
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting

Currently, there is no rate limiting implemented. In production, consider adding rate limiting middleware.

---

## WebSocket Events (Socket.io)

The server emits real-time events:

### Events:
- `newApplication` - New transport application submitted
- `applicationApproved` - Application approved by admin
- `applicationRejected` - Application rejected by admin
- `routeChangeRequest` - Route change requested
- `cancellationRequest` - Cancellation requested

**Client Connection:**
```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

socket.on('applicationApproved', (data) => {
  console.log('Application approved:', data);
});
```

---

**For more information, check the source code or contact the development team.**
