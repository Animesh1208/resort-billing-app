# Backend - Resort Billing API

Express.js REST API for the Resort Billing Authority System.

## Quick Start

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your settings

# Create admin user
node scripts/seedAdmin.js

# Start development server
npm run dev

# Start production server
npm start
```

## Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/resort-billing
JWT_SECRET=your_super_secret_jwt_key_change_this
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## API Routes

### Authentication (`/api/auth`)
- `POST /login` - Login
- `POST /register` - Register new user (admin only)
- `GET /profile` - Get current user profile

### Bills (`/api/bills`)
- `GET /` - Get all bills
- `POST /` - Create new bill
- `GET /:id` - Get bill by ID
- `DELETE /:id` - Delete bill (admin only)
- `GET /:id/pdf` - Download PDF
- `GET /stats/dashboard` - Dashboard statistics

### Users (`/api/users`) - Admin Only
- `GET /` - Get all users
- `GET /:id` - Get user by ID
- `PUT /:id` - Update user
- `DELETE /:id` - Delete user
- `PATCH /:id/toggle-status` - Toggle user status

## Database Models

### User Model
- username (unique)
- password (hashed)
- fullName
- email (unique)
- role (admin/staff)
- isActive (boolean)

### Bill Model
- invoiceNumber (auto-generated)
- customerName
- roomNumber
- checkIn/checkOut dates
- charges (room, food, other)
- tax and totals
- paymentMethod
- status
- createdBy (user reference)

## Authentication

JWT token required in header:
```
Authorization: Bearer <token>
```

Token expires in 30 days.

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `node scripts/seedAdmin.js` - Create admin user

## Dependencies

- express - Web framework
- mongoose - MongoDB ODM
- bcryptjs - Password hashing
- jsonwebtoken - JWT tokens
- cors - CORS middleware
- dotenv - Environment variables
- pdfkit - PDF generation
- express-validator - Input validation
