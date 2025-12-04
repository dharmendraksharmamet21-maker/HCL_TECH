# API Documentation - Healthcare Wellness Portal

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer {token}
```

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

Request Body:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "passwordConfirm": "password123",
  "role": "patient",
  "consentGiven": true
}
```

Response:
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGc...",
  "user": {
    "id": "507f...",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "patient"
  }
}
```

### Login
**POST** `/auth/login`

Request Body:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response: Same as register

### Get Current User
**GET** `/auth/me` (Protected)

Response:
```json
{
  "success": true,
  "data": {
    "id": "507f...",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "patient"
  }
}
```

---

## Patient Endpoints

All endpoints require authentication and `patient` role.

### Get Dashboard
**GET** `/patient/dashboard`

Response:
```json
{
  "success": true,
  "data": {
    "todayMetric": {...},
    "weekMetrics": [...],
    "upcomingReminders": [...],
    "missedReminders": [...],
    "healthTip": {...},
    "patient": {...}
  }
}
```

### Log Wellness Metrics
**POST** `/patient/metrics/log`

Request Body:
```json
{
  "steps": 5000,
  "sleepHours": 7.5,
  "waterIntake": 2,
  "activeTime": 30,
  "caloriesBurned": 400,
  "heartRate": 72,
  "bloodPressure": {
    "systolic": 120,
    "diastolic": 80
  },
  "notes": "Feeling good today"
}
```

Response:
```json
{
  "success": true,
  "message": "Wellness metrics logged successfully",
  "data": {
    "id": "507f...",
    "patientId": "507f...",
    "date": "2024-12-04T10:30:00Z",
    "steps": 5000,
    ...
  }
}
```

### Get Wellness History
**GET** `/patient/metrics/history?days=30`

Query Parameters:
- `days` (optional, default: 30) - Number of days to retrieve

Response:
```json
{
  "success": true,
  "data": {
    "metrics": [...]
  }
}
```

### Update Patient Profile
**PUT** `/patient/profile`

Request Body:
```json
{
  "allergies": ["Penicillin"],
  "medications": [
    {
      "name": "Aspirin",
      "dosage": "500mg",
      "frequency": "Daily"
    }
  ],
  "chronicConditions": ["Diabetes"],
  "emergencyContact": {
    "name": "Jane Doe",
    "relationship": "Spouse",
    "phone": "+1234567890"
  },
  "bloodType": "O+",
  "height": 175,
  "weight": 70
}
```

### Get Reminders
**GET** `/patient/reminders?status=upcoming`

Query Parameters:
- `status` (optional) - Filter by status: upcoming, missed, completed, cancelled

Response:
```json
{
  "success": true,
  "data": {
    "reminders": [
      {
        "id": "507f...",
        "title": "Annual Checkup",
        "description": "Schedule your annual checkup",
        "reminderType": "checkup",
        "dueDate": "2024-12-15",
        "status": "upcoming",
        "priority": "high"
      }
    ]
  }
}
```

### Mark Reminder as Completed
**PUT** `/patient/reminders/{reminderId}/complete`

Response:
```json
{
  "success": true,
  "message": "Reminder marked as completed",
  "data": {...}
}
```

---

## Provider Endpoints

All endpoints require authentication and `provider` role.

### Get Dashboard
**GET** `/provider/dashboard`

Response:
```json
{
  "success": true,
  "data": {
    "totalPatients": 10,
    "complianceData": [
      {
        "patientId": "507f...",
        "patientName": "John Doe",
        "totalReminders": 5,
        "completedReminders": 3,
        "missedReminders": 2,
        "compliancePercentage": 60,
        "adherenceStatus": "low"
      }
    ],
    "upcomingHighPriorityReminders": [...],
    "missedReminders": [...]
  }
}
```

### Get Assigned Patients
**GET** `/provider/patients`

Response:
```json
{
  "success": true,
  "data": {
    "patients": [
      {
        "id": "507f...",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "bloodType": "O+"
      }
    ]
  }
}
```

### Get Patient Details
**GET** `/provider/patients/{patientId}`

Response:
```json
{
  "success": true,
  "data": {
    "patient": {...},
    "recentMetrics": [...],
    "reminders": [...]
  }
}
```

### Assign Patient
**POST** `/provider/patients/assign`

Request Body:
```json
{
  "patientId": "507f..."
}
```

### Create Reminder
**POST** `/provider/reminders`

Request Body:
```json
{
  "patientId": "507f...",
  "title": "Annual Vaccination",
  "description": "Time for annual flu shot",
  "reminderType": "vaccination",
  "dueDate": "2024-12-31",
  "priority": "high"
}
```

### Update Reminder
**PUT** `/provider/reminders/{reminderId}`

Request Body:
```json
{
  "status": "completed",
  "notes": "Vaccination completed successfully"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error or missing required fields"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid token or user not authenticated"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "User does not have permission for this action"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 429 Too Many Requests
```json
{
  "success": false,
  "message": "Too many requests, please try again later"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Rate Limiting

- General API: 100 requests per 15 minutes
- Auth endpoints: 5 requests per 15 minutes
- Reminder creation: 50 reminders per hour

Rate limit info is included in response headers:
```
RateLimit-Limit: 100
RateLimit-Remaining: 95
RateLimit-Reset: 1234567890
```
