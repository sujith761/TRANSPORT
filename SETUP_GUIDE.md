# KASC Transport System - Quick Setup Guide

## 🚀 Quick Start (5 Minutes)

### Step 1: Install Dependencies

Open PowerShell in the project root directory and run:

```powershell
# Install Backend Dependencies
cd server
npm install

# Install Client Dependencies
cd ..\client
npm install

# Install Admin Dependencies
cd ..\admin
npm install

cd ..
```

### Step 2: Run the Application

Open **3 separate PowerShell terminals** and run:

**Terminal 1 - Start Backend Server:**
```powershell
cd server
npm start
```
✅ Server will start on: http://localhost:5000

**Terminal 2 - Start Student Portal:**
```powershell
cd client
npm start
```
✅ Student portal will open at: http://localhost:3000

**Terminal 3 - Start Admin Panel:**
```powershell
cd admin
npm start
```
✅ Admin panel will open at: http://localhost:3001

### Step 3: Create Admin Account

Since the database is fresh, you need to create an admin account:

1. **Option A: Register through Student Portal first**
   - Go to http://localhost:3000/register
   - Register with any details
   - Go to MongoDB Atlas → users collection
   - Find your user and change `"role": "student"` to `"role": "admin"`

2. **Option B: Direct MongoDB Insert**
   - Go to MongoDB Atlas
   - Database: kasc_transport
   - Collection: users
   - Insert this document (use any password, it will be hashed on first login):

```json
{
  "name": "System Admin",
  "registerNumber": "ADMIN001",
  "email": "admin@kasc.edu",
  "password": "$2a$10$XYZ...",
  "mobile": "9876543210",
  "department": "Administration",
  "city": "Coimbatore",
  "role": "admin",
  "isActive": true,
  "createdAt": "2026-02-11T00:00:00.000Z"
}
```

**Quick Admin Setup:**
1. Register as student with email: admin@kasc.edu
2. Change role to "admin" in database
3. Login at http://localhost:3001

---

## 📍 Access Points

| Service | URL | Purpose |
|---------|-----|---------|
| Backend API | http://localhost:5000 | REST API Server |
| Student Portal | http://localhost:3000 | Student Interface |
| Admin Panel | http://localhost:3001 | Admin Interface |
| API Health | http://localhost:5000/api/health | Check server status |

---

## 🔑 Test Accounts

### Student Account (Create by registering)
- Go to: http://localhost:3000/register
- Fill in the form
- Login with your credentials

### Admin Account (After setup)
- Email: admin@kasc.edu
- Password: (whatever you set)
- Login at: http://localhost:3001

---

## 📝 Sample Data Setup

To test the application properly, you should add:

### 1. Create Routes (Admin Panel)
```json
{
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
    },
    {
      "stopName": "Ukkadam",
      "arrivalTime": "07:15 AM"
    },
    {
      "stopName": "Singanallur",
      "arrivalTime": "07:30 AM"
    },
    {
      "stopName": "KASC Campus",
      "arrivalTime": "08:30 AM"
    }
  ],
  "isActive": true
}
```

### 2. Create Buses
You can create buses through admin panel or MongoDB

### 3. Create Drivers
Add driver information through admin panel

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Backend server is running (http://localhost:5000/api/health should return success)
- [ ] Student portal is accessible (http://localhost:3000)
- [ ] Admin panel is accessible (http://localhost:3001)
- [ ] MongoDB connection is working (check server console for "MongoDB Connected")
- [ ] Can register a new student
- [ ] Can login as student
- [ ] Can login as admin
- [ ] Can view routes
- [ ] Can submit applications
- [ ] Can approve/reject applications (admin)

---

## 🐛 Troubleshooting

### Problem: "Cannot connect to MongoDB"
**Solution:** Check if MongoDB URI is correct in server/.env

### Problem: "Port already in use"
**Solution:** 
```powershell
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Kill process on port 3001
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

### Problem: "Module not found"
**Solution:** 
```powershell
cd server
npm install

cd ../client
npm install

cd ../admin
npm install
```

### Problem: "Cannot login as admin"
**Solution:** Make sure user role is "admin" in database

---

## 📚 Next Steps

1. **Add Sample Routes** - Create 3-5 bus routes
2. **Add Buses** - Add bus information
3. **Add Drivers** - Add driver details
4. **Test Student Flow** - Register → Apply → Check Status
5. **Test Admin Flow** - Login → View Applications → Approve/Reject

---

## 🎯 Common Tasks

### Run in Development Mode (with auto-reload):
```powershell
cd server
npm run dev
```

### Build for Production:
```powershell
# Build Client
cd client
npm run build

# Build Admin
cd ../admin
npm run build
```

---

## 📞 Need Help?

Check the main README.md for detailed documentation.

---

**That's it! Your KASC Transport System is ready! 🚌✨**
