# Frontend - Resort Billing System

React.js application for the Resort Billing Authority System.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## Environment Variables

Create `.env` file in frontend root (optional):

```env
REACT_APP_API_URL=http://localhost:5000/api
```

If not set, it will use the proxy configured in `package.json`.

## Available Scripts

- `npm start` - Runs the app in development mode (http://localhost:3000)
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (one-way operation)

## Project Structure

```
src/
├── components/        # Reusable components
│   ├── Navbar.js
│   └── PrivateRoute.js
├── context/          # React context
│   └── AuthContext.js
├── pages/            # Page components
│   ├── Login.js
│   ├── Dashboard.js
│   ├── Bills.js
│   ├── NewBill.js
│   ├── BillDetail.js
│   └── AdminPanel.js
├── services/         # API services
│   └── api.js
├── App.js           # Main app component
├── index.js         # Entry point
└── index.css        # Global styles
```

## Features

### Pages

1. **Login** - Authentication page
2. **Dashboard** - Overview with statistics
3. **Bills** - List all bills with search/filter
4. **New Bill** - Create new invoice
5. **Bill Detail** - View invoice details
6. **Admin Panel** - Manage users (admin only)

### Components

- **Navbar** - Navigation bar with user info
- **PrivateRoute** - Protected route wrapper

### Context

- **AuthContext** - Global authentication state

## Styling

- Custom CSS with utility classes
- Responsive design
- Gradient backgrounds
- Modern UI with animations

## Icons

Using `lucide-react` for beautiful, consistent icons.

## Date Handling

Using `date-fns` for date formatting and manipulation.

## API Integration

All API calls go through `services/api.js` which:
- Adds JWT token to requests
- Handles 401 errors (logout)
- Provides typed API methods

## Authentication Flow

1. User logs in
2. Token stored in localStorage
3. Token added to all API requests
4. Protected routes check for token
5. Logout clears token

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

## Deployment

### Vercel
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=build
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Dependencies

- react - UI library
- react-dom - React DOM renderer
- react-router-dom - Routing
- axios - HTTP client
- lucide-react - Icons
- date-fns - Date utilities
