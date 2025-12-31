# SENTIC - Civic Issue Reporting Platform

![SENTIC](https://img.shields.io/badge/Status-Production%20Ready-success)
![Backend](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-green)
![Frontend](https://img.shields.io/badge/Frontend-React%20%7C%20TypeScript-blue)

## 📖 Introduction

**SENTIC** is a civic-issue reporting platform that allows citizens to report infrastructure problems (potholes, garbage dumps, fallen trees) through image uploads. An AI model automatically identifies the issue type and assigns a severity score (0-100) for objective prioritization.

### Key Features

- 📸 Image-based issue reporting with location tracking
- 🤖 AI-powered classification and severity scoring // UPCOMING
- 📊 Public dashboard with filtering and sorting
- 👮 Protected admin panel for issue management
- 🔒 JWT-based authentication

---

## 🏗️ Tech Stack

**Backend**: Node.js, Express, MongoDB, JWT, Multer  
**Frontend**: React, TypeScript, Vite, Tailwind CSS, Shadcn UI  
**Storage**: MongoDB (Base64 images)  
**Deployment**: Render (Backend), Vercel/Netlify (Frontend)

---

## 🚀 Quick Start

### Backend Setup

```bash
cd backend
npm install
node seedAdmin.js  # Create admin user
npm run dev        
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev        
```

---

## 📡 API Endpoints

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/api/reports` | Create report (multipart/form-data) |
| GET | `/api/reports` | Get all reports (no reporter info) |
| GET | `/api/reports/:id` | Get single report |

### Admin Endpoints (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/login` | Admin login (returns JWT) |
| GET | `/api/admin/reports` | Get all reports (with reporter info) |
| PATCH | `/api/admin/reports/:id/status` | Update report status |

**Note**: Admin endpoints require `Authorization: Bearer <token>` header.

---

## 📝 Data Models

### Report
```javascript
{
  imageData: String,        // Base64 encoded
  imageMimeType: String,
  issueType: String,        // "pothole" | "garbage" | "tree_fall"
  severity: Number,         // 0-100
  location: { area, latitude, longitude },
  reporter: { name, phone },
  status: String,           // "open" | "resolved" | "flagged"
  createdAt: Date
}
```

---

## 🧪 Testing with Postman

### 1. Create Report
```
POST https://your-backend-url.com/api/reports
Body: form-data
- image: [file]
- area: "Downtown"
- latitude: 40.7128
- longitude: -74.006
- name: "John Doe"
- phone: "+1234567890"
```

### 2. Admin Login
```
POST https://your-backend-url.com/api/admin/login
Body: raw JSON
{
  "username": "your_username",
  "password": "your_password"
}
```

### 3. Get Admin Reports
```
GET https://your-backend-url.com/api/admin/reports
Headers:
- Authorization: Bearer <your_token>
```

### 4. Update Status
```
PATCH https://your-backend-url.com/api/admin/reports/:id/status
Headers:
- Authorization: Bearer <your_token>
Body: raw JSON
{
  "status": "resolved"
}
```

## 📄 License

MIT License

---

**Built for better civic infrastructure monitoring** ❤️
