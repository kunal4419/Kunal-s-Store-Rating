import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Stores from './pages/Stores';
import StoreDetail from './pages/StoreDetail';
import Profile from './pages/Profile';
import OwnerDashboard from './pages/OwnerDashboard';
import OwnerStores from './pages/OwnerStores';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminStores from './pages/AdminStores';

// Components
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes with Layout */}
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/stores" element={<Layout><Stores /></Layout>} />
            <Route path="/stores/:id" element={<Layout><StoreDetail /></Layout>} />
            <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
            
            {/* Owner Routes */}
            <Route path="/owner/dashboard" element={<ProtectedRoute role="OWNER"><Layout><OwnerDashboard /></Layout></ProtectedRoute>} />
            <Route path="/owner/stores" element={<ProtectedRoute role="OWNER"><Layout><OwnerStores /></Layout></ProtectedRoute>} />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<ProtectedRoute role="ADMIN"><Layout><AdminDashboard /></Layout></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute role="ADMIN"><Layout><AdminUsers /></Layout></ProtectedRoute>} />
            <Route path="/admin/stores" element={<ProtectedRoute role="ADMIN"><Layout><AdminStores /></Layout></ProtectedRoute>} />
          </Routes>
          
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
