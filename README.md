# KASC Transport Management System

A comprehensive transport management system for KASC, featuring three main modules:

## 🚀 Project Structure

- **Admin Module (`/admin`)**: A React-based dashboard for managing buses, students, drivers, routes, and maintenance.
- **Client Module (`/client`)**: interface for students to view routes, apply for transport, and receive notifications.
- **Server (`/server`)**: Node.js & Express backend with MongoDB integration, handling authentication, data management, and real-time updates via Socket.IO.

## 🛠️ Tech Stack

- **Frontend**: React, Tailwind CSS, Framer Motion, Lucide React, Recharts.
- **Backend**: Node.js, Express, Mongoose (MongoDB).
- **Other**: JWT Authentication, Socket.IO, QR Code generation.

## 📦 Getting Started

1. Clone the repository.
2. Install dependencies for each module:
   ```bash
   cd admin && npm install
   cd ../client && npm install
   cd ../server && npm install
   ```
3. Set up environment variables in each module's `.env` file.
4. Start the services:
   ```bash
   # In separate terminals
   cd admin && npm start
   cd client && npm start
   cd server && npm start
   ```
