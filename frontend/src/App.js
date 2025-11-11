import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Bills from './pages/Bills';
import NewBill from './pages/NewBill';
import BillDetail from './pages/BillDetail';
import MonthlySummary from './pages/MonthlySummary';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/bills"
            element={
              <PrivateRoute>
                <Bills />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/bills/new"
            element={
              <PrivateRoute>
                <NewBill />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/bills/:id"
            element={
              <PrivateRoute>
                <BillDetail />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/monthly-summary"
            element={
              <PrivateRoute>
                <MonthlySummary />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/admin"
            element={
              <PrivateRoute adminOnly={true}>
                <AdminPanel />
              </PrivateRoute>
            }
          />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
