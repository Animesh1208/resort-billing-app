# 🏨 Resort Billing Authority System

A comprehensive web application for resort staff to manage customer billing, generate invoices, and track revenue. Built with modern technologies and security best practices.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.2.0-blue.svg)

## ✨ Features

### 🔐 Authentication & Security
- Secure JWT-based authentication
- Bcrypt password hashing
- Role-based access control (Admin/Staff)
- Protected API endpoints

### 💰 Billing Management
- Create detailed customer bills
- Auto-calculate totals with tax
- Multiple payment methods support
- Unique invoice number generation
- Real-time bill calculations

### 📊 Dashboard & Analytics
- Revenue statistics (daily, monthly)
- Bill count tracking
- Quick action shortcuts
- Beautiful, responsive UI

### 📄 Invoice Generation
- PDF invoice generation
- Professional invoice templates
- Download and print functionality
- Detailed charge breakdown

### 🔍 Bill History
- Search by customer name or invoice number
- Filter by status and date range
- Pagination support
- View and reprint old bills

### 👥 Admin Panel
- Add/remove staff accounts
- Activate/deactivate users
- User management dashboard
- Role assignment

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **PDFKit** - PDF generation

### Frontend
- **React.js** - UI framework
- **React Router** - Navigation
- **Axios** - HTTP client
- **Lucide React** - Icons
- **date-fns** - Date formatting

## 📁 Project Structure

```
resort-billing-app/
│
├── backend/
│   ├── config/
│   │   └── db.js                 # Database configuration
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── billController.js     # Bill management
│   │   └── userController.js     # User management
│   ├── middleware/
│   │   └── auth.js               # JWT verification
│   ├── models/
│   │   ├── User.js               # User schema
│   │   └── Bill.js               # Bill schema
│   ├── routes/
│   │   ├── authRoutes.js         # Auth endpoints
│   │   ├── billRoutes.js         # Bill endpoints
│   │   └── userRoutes.js         # User endpoints
│   ├── scripts/
│   │   └── seedAdmin.js          # Create admin user
│   ├── utils/
│   │   └── generateToken.js      # JWT token generation
│   ├── server.js                 # Entry point
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── Navbar.css
│   │   │   └── PrivateRoute.js
│   │   ├── context/
│   │   │   └── AuthContext.js    # Auth state management
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Bills.js
│   │   │   ├── NewBill.js
│   │   │   ├── BillDetail.js
│   │   │   ├── AdminPanel.js
│   │   │   └── *.css             # Page styles
│   │   ├── services/
│   │   │   └── api.js            # API service
│   │   ├── App.js                # Main component
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
cd C:\Users\anime\CascadeProjects\resort-billing-app
```

2. **Setup Backend**
```bash
cd backend
npm install

# Create .env file
copy .env.example .env

# Edit .env with your configuration:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/resort-billing
# JWT_SECRET=your_super_secret_jwt_key
# FRONTEND_URL=http://localhost:3000
```

3. **Setup Frontend**
```bash
cd ../frontend
npm install
```

4. **Start MongoDB**

Make sure MongoDB is running on your system.

For local MongoDB:
```bash
mongod
```

5. **Create Admin User**
```bash
cd ../backend
node scripts/seedAdmin.js
```

**Default Admin Credentials:**
- Username: `admin`
- Password: `admin123`

⚠️ **Important:** Change the admin password after first login!

6. **Start Backend Server**
```bash
npm run dev
# Server runs on http://localhost:5000
```

7. **Start Frontend (in new terminal)**
```bash
cd ../frontend
npm start
# App opens on http://localhost:3000
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Register user (admin only)
- `GET /api/auth/profile` - Get user profile

### Bills
- `GET /api/bills` - Get all bills (with filters)
- `POST /api/bills` - Create new bill
- `GET /api/bills/:id` - Get bill by ID
- `DELETE /api/bills/:id` - Delete bill (admin only)
- `GET /api/bills/:id/pdf` - Download bill PDF
- `GET /api/bills/stats/dashboard` - Get dashboard statistics

### Users (Admin Only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `PATCH /api/users/:id/toggle-status` - Activate/deactivate user

## 🗄️ Database Schema

### User Schema
```javascript
{
  username: String (unique),
  password: String (hashed),
  fullName: String,
  email: String (unique),
  role: Enum['admin', 'staff'],
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Bill Schema
```javascript
{
  invoiceNumber: String (auto-generated),
  customerName: String,
  roomNumber: String,
  checkIn: Date,
  checkOut: Date,
  numberOfDays: Number,
  roomCharges: Number,
  foodCharges: Number,
  otherCharges: Number,
  subtotal: Number,
  tax: Number,
  taxPercentage: Number,
  totalAmount: Number,
  paymentMethod: Enum['cash', 'card', 'upi', 'bank-transfer'],
  notes: String,
  status: Enum['paid', 'pending', 'cancelled'],
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

## 🎨 Features Walkthrough

### 1. Login
- Staff/Admin login with credentials
- Secure JWT token-based session
- Remember user across sessions

### 2. Dashboard
- Overview of revenue statistics
- Today's and monthly revenue
- Quick action buttons
- Beautiful gradient cards

### 3. Create Bill
- Fill customer details
- Add room, food, and other charges
- Auto-calculate tax and total
- Select payment method
- Add optional notes

### 4. Bills Management
- View all bills in table format
- Search by name or invoice number
- Filter by payment status
- Download PDF invoices
- View detailed bill information

### 5. Admin Panel (Admin Only)
- Add new staff members
- Activate/deactivate users
- Delete users
- Assign roles (admin/staff)

## 🔒 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Protected API routes
- ✅ Role-based access control
- ✅ HTTP-only token storage
- ✅ Input validation
- ✅ SQL injection prevention (Mongoose)
- ✅ CORS configuration

## 📱 Responsive Design

The application is fully responsive and works on:
- 💻 Desktop
- 📱 Tablet
- 📱 Mobile devices

## 🚀 Deployment

### Backend Deployment (Railway/Render)

1. Push code to GitHub
2. Connect to Railway/Render
3. Add environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `FRONTEND_URL`
   - `NODE_ENV=production`
4. Deploy

### Frontend Deployment (Vercel/Netlify)

1. Build the app: `npm run build`
2. Deploy `build` folder
3. Set environment variable:
   - `REACT_APP_API_URL=your_backend_url`

## 🧪 Testing

### Backend Testing
```bash
cd backend
# Test API health
curl http://localhost:5000/api/health
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built with ❤️ for Resort Management

## 🐛 Known Issues

None at the moment. Please report any bugs in the issues section.

## 🔮 Future Enhancements

- [ ] Email invoice to customers
- [ ] QR code on invoices
- [ ] Multi-branch support
- [ ] Advanced analytics dashboard
- [ ] Export reports (CSV/Excel)
- [ ] Dark mode
- [ ] SMS notifications
- [ ] Payment gateway integration
- [ ] Booking management
- [ ] Inventory tracking

## 📞 Support

For support, email support@resortbilling.com or create an issue in the repository.

---

**Happy Billing! 🎉**
#   r e s o r t - b i l l i n g - a p p  
 #   r e s o r t - b i l l i n g - a p p  
 