# 🚀 Quick Setup Guide

Follow these steps to get the Resort Billing System running on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- ✅ [Node.js](https://nodejs.org/) (v14 or higher)
- ✅ [MongoDB](https://www.mongodb.com/try/download/community) (local or Atlas account)
- ✅ [Git](https://git-scm.com/)
- ✅ Text editor (VS Code recommended)

## Step-by-Step Setup

### 1. Navigate to Project Directory

```bash
cd C:\Users\anime\CascadeProjects\resort-billing-app
```

### 2. Backend Setup

#### 2.1 Install Dependencies

```bash
cd backend
npm install
```

#### 2.2 Configure Environment

Create a `.env` file in the `backend` folder:

```bash
# Windows Command Prompt
copy .env.example .env

# PowerShell
Copy-Item .env.example .env
```

Edit `.env` file with your settings:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/resort-billing
JWT_SECRET=my_super_secret_jwt_key_change_this_in_production_12345
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**Important:** Change the `JWT_SECRET` to a strong random string!

#### 2.3 Start MongoDB

**Windows:**
```bash
# Start MongoDB service
net start MongoDB

# Or run mongod directly
mongod
```

**Mac:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

#### 2.4 Create Admin User

```bash
node scripts/seedAdmin.js
```

You should see:
```
MongoDB Connected...
Admin user created successfully!
Username: admin
Password: admin123
⚠️  Please change the password after first login!
```

#### 2.5 Start Backend Server

```bash
# Development mode (with auto-restart)
npm run dev

# Or production mode
npm start
```

You should see:
```
MongoDB Connected: localhost
Server running in development mode on port 5000
```

**Keep this terminal open!**

### 3. Frontend Setup

Open a **new terminal** window.

#### 3.1 Install Dependencies

```bash
cd C:\Users\anime\CascadeProjects\resort-billing-app\frontend
npm install
```

#### 3.2 Start Frontend

```bash
npm start
```

The app will automatically open in your browser at `http://localhost:3000`

### 4. Login and Test

#### 4.1 Login

Use the default admin credentials:
- **Username:** `admin`
- **Password:** `admin123`

#### 4.2 Change Password (Recommended)

After first login, add a new admin user with a secure password and delete the default admin.

#### 4.3 Test Features

1. ✅ **Dashboard** - View statistics
2. ✅ **Create Bill** - Add a test bill
3. ✅ **Download PDF** - Generate invoice
4. ✅ **Admin Panel** - Add a staff user
5. ✅ **Logout/Login** - Test authentication

## Troubleshooting

### Issue: MongoDB Connection Failed

**Error:** `MongoServerError: connect ECONNREFUSED`

**Solution:**
1. Make sure MongoDB is running
2. Check the connection string in `.env`
3. Try: `mongod --dbpath C:\data\db`

### Issue: Port Already in Use

**Error:** `EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process (Windows)
taskkill /PID <PID> /F

# Or change PORT in .env to 5001
```

### Issue: Cannot find module

**Error:** `Error: Cannot find module 'express'`

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### Issue: CORS Error

**Error:** `Access to XMLHttpRequest blocked by CORS`

**Solution:**
1. Check `FRONTEND_URL` in backend `.env`
2. Restart backend server
3. Clear browser cache

### Issue: React App Not Opening

**Solution:**
```bash
# Clear React cache
rm -rf node_modules/.cache
npm start
```

## Verify Installation

### Backend Health Check

Open browser and visit: `http://localhost:5000/api/health`

Expected response:
```json
{
  "status": "OK",
  "message": "Resort Billing API is running"
}
```

### Frontend Check

Visit: `http://localhost:3000`

You should see the login page.

## Database Management

### View Database (MongoDB Compass)

1. Download [MongoDB Compass](https://www.mongodb.com/try/download/compass)
2. Connect to: `mongodb://localhost:27017`
3. Select database: `resort-billing`
4. View collections: `users`, `bills`

### Reset Database

```bash
# Connect to MongoDB
mongo

# Delete database
use resort-billing
db.dropDatabase()

# Recreate admin
cd backend
node scripts/seedAdmin.js
```

## Development Tips

### Hot Reload

Both backend and frontend support hot reload:
- **Backend:** Using `nodemon` - changes auto-restart server
- **Frontend:** Using React dev server - changes auto-refresh browser

### Recommended VS Code Extensions

- ESLint
- Prettier
- MongoDB for VS Code
- REST Client
- GitLens

### Testing API Endpoints

Use [Postman](https://www.postman.com/) or [Insomnia](https://insomnia.rest/)

Example request:
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

## Next Steps

1. ✅ **Customize Resort Info** - Edit resort name and details in code
2. ✅ **Add Logo** - Add your resort logo to invoices
3. ✅ **Configure Tax** - Update default tax percentage
4. ✅ **Add Staff Users** - Create accounts for your team
5. ✅ **Start Billing** - Create your first real invoice!

## Need Help?

- 📚 Read the [README.md](README.md) for detailed documentation
- 🚀 Check [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
- 🐛 Report issues on GitHub
- 💬 Ask questions in discussions

---

**Setup Complete! 🎉**

You're ready to start using the Resort Billing System!
