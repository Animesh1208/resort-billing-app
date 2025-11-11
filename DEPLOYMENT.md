# 🚀 Deployment Guide

Complete guide to deploy the Resort Billing System to production.

## Table of Contents

1. [Backend Deployment](#backend-deployment)
2. [Frontend Deployment](#frontend-deployment)
3. [Database Setup](#database-setup)
4. [Environment Variables](#environment-variables)
5. [Post-Deployment](#post-deployment)

---

## Backend Deployment

### Option 1: Railway

1. **Create Account** at [railway.app](https://railway.app)

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Select `backend` folder

3. **Add Environment Variables**
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_key_minimum_32_characters
   FRONTEND_URL=https://your-frontend-url.vercel.app
   NODE_ENV=production
   PORT=5000
   ```

4. **Deploy**
   - Railway will automatically deploy
   - Note your backend URL (e.g., `https://your-app.railway.app`)

### Option 2: Render

1. **Create Account** at [render.com](https://render.com)

2. **Create New Web Service**
   - Connect your GitHub repository
   - Choose `backend` as root directory
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Add Environment Variables** (same as above)

4. **Deploy**
   - Render will deploy automatically
   - Free tier available (spins down after inactivity)

### Option 3: Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login and Create App**
   ```bash
   heroku login
   cd backend
   heroku create your-app-name
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set MONGODB_URI=your_mongodb_uri
   heroku config:set JWT_SECRET=your_secret
   heroku config:set FRONTEND_URL=your_frontend_url
   heroku config:set NODE_ENV=production
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

---

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Build and Deploy**
   ```bash
   cd frontend
   npm run build
   vercel --prod
   ```

3. **Add Environment Variable**
   - In Vercel dashboard, add:
   ```
   REACT_APP_API_URL=https://your-backend.railway.app/api
   ```

4. **Redeploy** after adding environment variable

### Option 2: Netlify

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build**
   ```bash
   cd frontend
   npm run build
   ```

3. **Deploy**
   ```bash
   netlify deploy --prod --dir=build
   ```

4. **Add Environment Variable**
   - In Netlify dashboard, add:
   ```
   REACT_APP_API_URL=https://your-backend.railway.app/api
   ```

### Option 3: GitHub Pages

1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update package.json**
   ```json
   {
     "homepage": "https://yourusername.github.io/resort-billing-app",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d build"
     }
   }
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

---

## Database Setup

### MongoDB Atlas (Recommended for Production)

1. **Create Account** at [mongodb.com/atlas](https://www.mongodb.com/atlas)

2. **Create Cluster**
   - Choose free tier (M0)
   - Select cloud provider and region
   - Create cluster

3. **Create Database User**
   - Database Access → Add New User
   - Set username and password
   - Grant "Read and write to any database"

4. **Whitelist IP Addresses**
   - Network Access → Add IP Address
   - For testing: Allow access from anywhere (0.0.0.0/0)
   - For production: Add specific IPs

5. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your password
   - Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/resort-billing?retryWrites=true&w=majority`

### Local MongoDB (Development)

```bash
# Install MongoDB Community Edition
# Windows: https://www.mongodb.com/try/download/community
# Mac: brew install mongodb-community
# Linux: apt-get install mongodb

# Start MongoDB
mongod

# Connection string
mongodb://localhost:27017/resort-billing
```

---

## Environment Variables

### Backend (.env)

```env
# Server
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/resort-billing

# Security
JWT_SECRET=super_secret_key_minimum_32_characters_long_change_this

# CORS
FRONTEND_URL=https://your-frontend-url.vercel.app
```

### Frontend (.env)

```env
REACT_APP_API_URL=https://your-backend.railway.app/api
```

---

## Post-Deployment

### 1. Create Admin User

Connect to your backend:

```bash
# SSH into your server or use Railway/Render shell

cd backend
node scripts/seedAdmin.js
```

Or manually via MongoDB:

```javascript
// MongoDB Shell or Compass
use resort-billing

db.users.insertOne({
  username: "admin",
  password: "$2a$10$hashed_password_here", // Use bcrypt to hash
  fullName: "System Administrator",
  email: "admin@resortparadise.com",
  role: "admin",
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

### 2. Test the Application

1. **Frontend URL**: https://your-app.vercel.app
2. **Login** with admin credentials
3. **Create a test bill**
4. **Download PDF** to verify PDF generation
5. **Add a staff user** from admin panel
6. **Test all features**

### 3. Security Checklist

- [ ] Change default admin password
- [ ] Use strong JWT secret (32+ characters)
- [ ] Enable MongoDB authentication
- [ ] Set up MongoDB IP whitelist
- [ ] Configure CORS properly
- [ ] Use HTTPS for all connections
- [ ] Enable rate limiting (optional)
- [ ] Set up monitoring and logging
- [ ] Regular database backups

### 4. Monitoring

#### Backend Health Check

```bash
curl https://your-backend.railway.app/api/health
```

Response:
```json
{
  "status": "OK",
  "message": "Resort Billing API is running"
}
```

#### Frontend Health Check

Visit your frontend URL and verify it loads correctly.

### 5. Custom Domain (Optional)

#### Vercel
1. Go to project settings
2. Domains → Add domain
3. Follow DNS configuration steps

#### Railway
1. Go to project settings
2. Custom Domain → Add domain
3. Configure DNS records

---

## Troubleshooting

### Common Issues

#### 1. CORS Errors
- Update `FRONTEND_URL` in backend .env
- Restart backend server

#### 2. Database Connection Failed
- Check MongoDB URI format
- Verify database user credentials
- Check IP whitelist in MongoDB Atlas

#### 3. JWT Token Invalid
- Ensure JWT_SECRET matches on backend
- Clear localStorage in browser
- Login again

#### 4. PDF Generation Fails
- Check server has enough memory
- Verify PDFKit installation
- Check server logs

#### 5. Build Fails
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear cache: `npm cache clean --force`
- Check Node.js version (v14+)

### Logs

#### Railway
- Go to project → Deployments → View Logs

#### Render
- Go to service → Logs

#### Vercel
- Go to project → Deployments → Logs

---

## Backup Strategy

### Database Backup

```bash
# MongoDB Atlas
# Use automatic backups (available in paid tiers)

# Manual backup
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/resort-billing" --out=./backup
```

### Restore Database

```bash
mongorestore --uri="mongodb+srv://user:pass@cluster.mongodb.net/resort-billing" ./backup/resort-billing
```

---

## Performance Optimization

### Backend
- Enable gzip compression
- Use connection pooling
- Add caching (Redis)
- Implement rate limiting
- Optimize database queries (indexes)

### Frontend
- Code splitting
- Lazy loading routes
- Image optimization
- Minification (done by build)
- CDN for static assets

---

## Scaling

### Horizontal Scaling
- Use load balancer
- Deploy multiple backend instances
- Use session store (Redis)

### Database Scaling
- MongoDB sharding
- Read replicas
- Connection pooling

---

## Cost Estimation

### Free Tier
- **Frontend**: Vercel/Netlify (Free)
- **Backend**: Railway/Render (Free with limits)
- **Database**: MongoDB Atlas M0 (Free 512MB)
- **Total**: $0/month

### Production Tier
- **Frontend**: Vercel Pro ($20/month)
- **Backend**: Railway Pro ($5/month)
- **Database**: MongoDB Atlas M10 ($57/month)
- **Total**: ~$82/month

---

## Support

For deployment issues:
1. Check logs first
2. Review environment variables
3. Test API endpoints
4. Contact platform support
5. Open an issue on GitHub

---

**Deployment Complete! 🎉**

Visit your live application and start billing!
