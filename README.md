# KASC Smart Transport & Maintenance System

## 🚌 Complete MERN Stack Transport Management System

A comprehensive, full-stack transport management system built for **Kongu Arts and Science College (KASC)** using MongoDB, Express.js, React.js, and Node.js.

---

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [User Roles](#user-roles)
- [Default Admin Account](#default-admin-account)

---

## ✨ Features

### Student Portal
- ✅ User Registration & Authentication
- ✅ Apply for Transport
- ✅ Change Bus Route
- ✅ Cancel Bus Route  
- ✅ View All Available Routes
- ✅ Real-time Application Status Tracking
- ✅ Dashboard with Application History
- ✅ Notification System
- ✅ QR Code Generation for Approved Applications
- ✅ Modern, Responsive UI

### Admin Panel
- ✅ Secure Admin Authentication
- ✅ Dashboard with Analytics & Charts
- ✅ Student Management
- ✅ Application Approval/Rejection System
- ✅ Bus Management
- ✅ Driver Management
- ✅ Route Management
- ✅ Maintenance Tracking
- ✅ Real-time Notifications
- ✅ Reports & Statistics

### Technical Features
- 🔐 JWT Authentication
- 🔒 Bcrypt Password Encryption
- 📊 Interactive Charts (Recharts)
- 🎨 Modern UI with Tailwind CSS & Framer Motion
- 🔌 Real-time Updates with Socket.io
- ✉️ Email Notifications Support
- 📱 Fully Responsive Design
- ⚡ Fast & Optimized Performance

---

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (MongoDB Atlas)
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Socket.io** - Real-time communication
- **Joi** - Validation
- **Nodemailer** - Email service
- **QRCode** - QR code generation

### Frontend (Client & Admin)
- **React.js** - UI library
- **React Router DOM** - Routing
- **Axios** - HTTP client
- **TailwindCSS** - Styling
- **Framer Motion** - Animations
- **Recharts** - Charts & graphs
- **Lucide React** - Icons
- **React Toastify** - Notifications
- **Socket.io Client** - Real-time updates

---

## 📁 Project Structure

```
kasc-transport-system/
├── server/                      # Backend API
│   ├── controllers/             # Route controllers
│   ├── middleware/              # Auth & validation middleware
│   ├── models/                  # Mongoose models
│   ├── routes/                  # API routes
│   ├── .env                     # Environment variables
│   ├── server.js               # Entry point
│   └── package.json
│
├── client/                      # Student Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   ├── context/            # Context API
│   │   ├── pages/              # Page components
│   │   ├── utils/              # Utilities
│   │   ├── App.js
│   │   └── index.js
│   ├── .env
│   └── package.json
│
└── admin/                       # Admin Frontend
    ├── public/
    ├── src/
    │   ├── components/         # Reusable components
    │   ├── context/            # Context API
    │   ├── pages/              # Page components
    │   ├── utils/              # Utilities
    │   ├── App.js
    │   └── index.js
    ├── .env
    └── package.json
```

---

## 🚀 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (already configured)

### Step 1: Clone or Setup Project
The project is already in `d:\Transport\kasc-transport-system`

### Step 2: Install Dependencies

#### Install Backend Dependencies
```bash
cd server
npm install
```

#### Install Client Dependencies
```bash
cd ../client
npm install
```

#### Install Admin Dependencies
```bash
cd ../admin
npm install
```

---

## ⚙️ Configuration

### Backend Configuration (server/.env)
Already configured with:
```env
PORT=5000
MONGODB_URI=mongodb+srv://db_user:sujithcs09@cluster0.3trrfye.mongodb.net/kasc_transport?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=kasc_transport_secret_key_2026_super_secure
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001
```

### Client Configuration (client/.env)
Already configured with:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

### Admin Configuration (admin/.env)
Already configured with:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
PORT=3001
```

---

## ▶️ Running the Application

### Option 1: Run All Together (Recommended)

Open **3 separate terminals**:

**Terminal 1 - Backend Server:**
```bash
cd server
npm start
```
Server runs on: http://localhost:5000

**Terminal 2 - Student Client:**
```bash
cd client
npm start
```
Client runs on: http://localhost:3000

**Terminal 3 - Admin Panel:**
```bash
cd admin
npm start
```
Admin runs on: http://localhost:3001

### Option 2: Development Mode with Nodemon

**Backend (with auto-reload):**
```bash
cd server
npm run dev
```

---

## 👥 User Roles

### Student
- Register with college details
- Login to student portal
- Apply for transport
- Change/Cancel routes
- View application status
- Receive notifications

### Admin
- Login to admin panel
- Manage students
- Approve/Reject applications
- Manage buses & drivers
- Create/Edit routes
- Track maintenance
- View analytics

---

## 🔑 Default Admin Account

To access the admin panel, you need to create an admin account in MongoDB first.

### Create Admin Account

**Method 1: Using MongoDB Compass or Atlas**
1. Connect to your database
2. Go to `users` collection
3. Insert document:
```json
{
  "name": "Admin",
  "registerNumber": "ADMIN001",
  "email": "admin@kasc.edu",
  "password": "$2a$10$YourHashedPasswordHere",
  "mobile": "1234567890",
  "department": "Administration",
  "city": "Coimbatore",
  "role": "admin",
  "isActive": true,
  "createdAt": "2026-02-11T00:00:00.000Z"
}
```

**Method 2: Register as student first, then change role**
1. Register through student portal
2. In MongoDB, find your user and change:
```json
{
  "role": "admin"
}
```

**Suggested Admin Credentials:**
- Email: `admin@kasc.edu`
- Password: `admin123` (use bcrypt hash in database)

---

## 📖 API Documentation

### Authentication Routes
```
POST   /api/auth/register    - Register new user
POST   /api/auth/login       - Login user
GET    /api/auth/me          - Get current user
```

### Student Routes (Protected)
```
POST   /api/transport/apply            - Apply for transport
POST   /api/transport/change           - Change route
POST   /api/transport/cancel           - Cancel route
GET    /api/transport/status           - Get application status
GET    /api/transport/notifications    - Get notifications
```

### Admin Routes (Protected - Admin Only)
```
GET    /api/admin/students              - Get all students
GET    /api/admin/applications          - Get all applications
PUT    /api/admin/applications/:id/approve  - Approve application
PUT    /api/admin/applications/:id/reject   - Reject application
GET    /api/admin/analytics             - Get dashboard analytics
GET    /api/admin/drivers               - Get all drivers
POST   /api/admin/drivers               - Create driver
GET    /api/admin/buses                 - Get all buses
POST   /api/admin/buses                 - Create bus
POST   /api/admin/routes                - Create route
POST   /api/admin/maintenance           - Add maintenance record
```

### Public Routes
```
GET    /api/routes           - Get all routes
GET    /api/routes/:id       - Get route details
GET    /api/routes/search    - Search routes
```

---

## 📱 Application URLs

- **Student Portal**: http://localhost:3000
- **Admin Panel**: http://localhost:3001
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

---

## 🎨 Frontend Features

### Student Portal Pages
1. **Register** - Student registration with validation
2. **Login** - Secure authentication
3. **Home** - Welcome page with quick actions
4. **Apply Transport** - Submit new application
5. **Change Route** - Request route modification
6. **Cancel Route** - Cancel transport service
7. **View Routes** - Browse available routes
8. **Dashboard** - Application tracking & notifications

### Admin Panel Pages
1. **Login** - Admin authentication
2. **Dashboard** - Analytics with charts
3. **Students** - Manage all students
4. **Applications** - Review & approve/reject
5. **Buses** - Bus management
6. **Drivers** - Driver management
7. **Routes** - Route configuration
8. **Maintenance** - Service tracking

---

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt (10 salt rounds)
- Role-based access control
- Protected API routes
- Input validation with Joi
- XSS protection with Helmet
- CORS configuration
- Secure HTTP headers

---

## 🎯 Key Highlights

✅ **Complete MERN Stack Implementation**  
✅ **Professional UI/UX Design**  
✅ **Real-time Updates**  
✅ **Comprehensive Admin Panel**  
✅ **Mobile Responsive**  
✅ **Production Ready**  
✅ **Scalable Architecture**  
✅ **Well Documented**  

---

## 📞 Support

For any issues or queries:
- Email: transport@kasc.edu
- Phone: Contact college administration

---

## 📄 License

This project is developed for **Kongu Arts and Science College (KASC)** internal use.

---

## 🙏 Acknowledgments

Developed for KASC Transport Management  
© 2026 KASC. All rights reserved.

---

**Happy Coding! 🚌✨**
