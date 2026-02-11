# KASC Transport System - Deployment Guide

## 📦 Production Deployment

This guide covers deploying the KASC Transport System to production.

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Backend Deployment](#backend-deployment)
3. [Frontend Deployment](#frontend-deployment)
4. [Environment Variables](#environment-variables)
5. [Database Setup](#database-setup)
6. [Testing](#testing)
7. [Monitoring](#monitoring)

---

## Prerequisites

### Required Services:
- MongoDB Atlas (Already configured)
- Hosting platform for backend (Heroku, Railway, Render, etc.)
- Hosting platform for frontend (Vercel, Netlify, etc.)
- Domain name (optional)

---

## Backend Deployment

### Option 1: Deploy to Heroku

1. **Install Heroku CLI**
```bash
npm install -g heroku
```

2. **Login to Heroku**
```bash
heroku login
```

3. **Create Heroku App**
```bash
cd server
heroku create kasc-transport-api
```

4. **Set Environment Variables**
```bash
heroku config:set MONGODB_URI="mongodb+srv://db_user:sujithcs09@cluster0.3trrfye.mongodb.net/kasc_transport?retryWrites=true&w=majority&appName=Cluster0"
heroku config:set JWT_SECRET="kasc_transport_secret_key_2026_super_secure"
heroku config:set JWT_EXPIRE="7d"
heroku config:set NODE_ENV="production"
heroku config:set CLIENT_URL="https://kasc-transport.vercel.app"
heroku config:set ADMIN_URL="https://kasc-admin.vercel.app"
```

5. **Deploy**
```bash
git init
git add .
git commit -m "Initial commit"
git push heroku main
```

### Option 2: Deploy to Railway

1. Go to https://railway.app
2. Connect GitHub repository
3. Select the `server` folder
4. Add environment variables
5. Deploy

### Option 3: Deploy to Render

1. Go to https://render.com
2. Create new Web Service
3. Connect repository
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables

---

## Frontend Deployment

### Client (Student Portal)

#### Deploy to Vercel:

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy Client**
```bash
cd client
vercel
```

3. **Set Environment Variables in Vercel Dashboard**
```
REACT_APP_API_URL=https://kasc-transport-api.herokuapp.com/api
REACT_APP_SOCKET_URL=https://kasc-transport-api.herokuapp.com
```

4. **Build & Deploy**
```bash
vercel --prod
```

### Admin Panel

Same steps as client, just from the `admin` folder:

```bash
cd admin
vercel
```

Set environment variables:
```
REACT_APP_API_URL=https://kasc-transport-api.herokuapp.com/api
REACT_APP_SOCKET_URL=https://kasc-transport-api.herokuapp.com
```

---

## Environment Variables

### Backend (Production)
```env
PORT=5000
MONGODB_URI=mongodb+srv://db_user:sujithcs09@cluster0.3trrfye.mongodb.net/kasc_transport?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=kasc_transport_secret_key_2026_super_secure
JWT_EXPIRE=7d
NODE_ENV=production
CLIENT_URL=https://your-client-domain.com
ADMIN_URL=https://your-admin-domain.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=KASC Transport <noreply@kasc.edu>
```

### Client (Production)
```env
REACT_APP_API_URL=https://your-api-domain.com/api
REACT_APP_SOCKET_URL=https://your-api-domain.com
```

### Admin (Production)
```env
REACT_APP_API_URL=https://your-api-domain.com/api
REACT_APP_SOCKET_URL=https://your-api-domain.com
PORT=3001
```

---

## Database Setup

### Production Database (MongoDB Atlas)

Already configured! Current URI:
```
mongodb+srv://db_user:sujithcs09@cluster0.3trrfye.mongodb.net/kasc_transport
```

### Important Database Indexes

Create these indexes for better performance:

```javascript
// Users collection
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ registerNumber: 1 }, { unique: true })

// Applications collection
db.transportapplications.createIndex({ user: 1 })
db.transportapplications.createIndex({ status: 1 })
db.transportapplications.createIndex({ createdAt: -1 })

// Routes collection
db.routes.createIndex({ routeNumber: 1 }, { unique: true })
db.routes.createIndex({ isActive: 1 })

// Buses collection
db.buses.createIndex({ busNumber: 1 }, { unique: true })
db.buses.createIndex({ route: 1 })
```

---

## Build for Production

### Build Backend
```bash
cd server
npm install --production
```

### Build Client
```bash
cd client
npm run build
# This creates a 'build' folder with optimized files
```

### Build Admin
```bash
cd admin
npm run build
# This creates a 'build' folder with optimized files
```

---

## Security Checklist

- [ ] Change JWT_SECRET to a strong random string
- [ ] Enable HTTPS/SSL certificates
- [ ] Set up CORS properly for your domains
- [ ] Enable MongoDB authentication
- [ ] Use environment variables for all secrets
- [ ] Set up rate limiting
- [ ] Enable Helmet security headers
- [ ] Keep dependencies updated
- [ ] Set up database backups
- [ ] Configure firewall rules

---

## Performance Optimization

### Backend:
- Enable gzip compression
- Use PM2 for process management
- Set up load balancing (if needed)
- Enable database connection pooling
- Implement caching (Redis)

### Frontend:
- Code splitting
- Lazy loading
- Image optimization
- Service workers
- CDN for static assets

---

## Monitoring & Logging

### Recommended Tools:
- **Backend Monitoring**: New Relic, DataDog
- **Error Tracking**: Sentry
- **Logging**: Winston + LogDNA/Papertrail
- **Uptime Monitoring**: Uptime Robot

### Basic Monitoring Setup:

```javascript
// Add to server.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

---

## Testing Production

### Health Checks:
```bash
# Backend health
curl https://your-api-domain.com/api/health

# Expected response:
{
  "status": "success",
  "message": "KASC Transport API is running",
  "timestamp": "2026-02-11T..."
}
```

### Smoke Tests:
1. Register a new user
2. Login with the user
3. View routes
4. Submit an application
5. Login as admin
6. Approve an application
7. Check notifications

---

## Backup Strategy

### Database Backups:
- MongoDB Atlas provides automatic backups
- Enable point-in-time recovery
- Schedule regular exports

### Manual Backup:
```bash
mongodump --uri="mongodb+srv://db_user:sujithcs09@cluster0.3trrfye.mongodb.net/kasc_transport" --out=./backup
```

### Restore:
```bash
mongorestore --uri="mongodb+srv://db_user:sujithcs09@cluster0.3trrfye.mongodb.net/kasc_transport" ./backup/kasc_transport
```

---

## Scaling Considerations

### Horizontal Scaling:
- Use load balancer (Nginx, AWS ELB)
- Multiple server instances
- Session management with Redis

### Database Scaling:
- MongoDB Atlas auto-scaling
- Read replicas for heavy read operations
- Sharding for very large datasets

---

## Custom Domain Setup

### Backend:
1. Get your domain from Heroku/Railway/Render
2. Point your custom domain (e.g., api.kasc.edu) to the hosting
3. Update CORS settings with new domain

### Frontend:
1. In Vercel/Netlify, add custom domain
2. Update DNS records
3. Enable HTTPS

---

## Production Checklist

- [ ] All environment variables set
- [ ] Database indexes created
- [ ] Admin account created
- [ ] Sample routes added
- [ ] HTTPS enabled
- [ ] CORS configured
- [ ] Error logging setup
- [ ] Monitoring enabled
- [ ] Backups configured
- [ ] Documentation updated
- [ ] Load testing completed
- [ ] Security audit done

---

## Maintenance

### Regular Tasks:
- Weekly: Check error logs
- Monthly: Update dependencies
- Quarterly: Security audit
- Yearly: Performance review

### Update Dependencies:
```bash
npm outdated
npm update
npm audit fix
```

---

## Support & Troubleshooting

### Common Issues:

**Issue: CORS errors**
Solution: Update CORS origin in server.js to include production domains

**Issue: Socket.io not connecting**
Solution: Check if WebSocket connections are allowed on your hosting

**Issue: Environment variables not loading**
Solution: Verify variables are set in hosting platform dashboard

---

## Rollback Plan

If deployment fails:
1. Revert to previous Git commit
2. Redeploy previous version
3. Check logs for errors
4. Fix issues in development
5. Test thoroughly before redeploying

---

## Contact

For deployment support:
- Technical Team: tech@kasc.edu
- Infrastructure: infra@kasc.edu

---

## License

This deployment guide is part of the KASC Transport Management System.
© 2026 KASC. All rights reserved.

---

**Happy Deploying! 🚀**
