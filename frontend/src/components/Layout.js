import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import OwnerNavbar from './OwnerNavbar';
import AdminNavbar from './AdminNavbar';
import UserNavbar from './UserNavbar';

const Layout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (!user) return null;
    switch (user.role) {
      case 'ADMIN':
        return '/admin/dashboard';
      case 'OWNER':
        return '/owner/dashboard';
      default:
        return '/stores';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navbar */}
      {user ? (
        user.role === 'OWNER' ? (
          <OwnerNavbar />
        ) : user.role === 'USER' ? (
          <UserNavbar />
        ) : user.role === 'ADMIN' ? (
          <AdminNavbar />
        ) : (
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                {/* Logo */}
                <Link to="/" className="flex items-center">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-lg">K</span>
                    </div>
                    <span className="ml-2 text-xl font-bold text-gray-900">Kunal's Rating Store</span>
                  </div>
                </Link>
                {/* Navigation */}
                <nav className="hidden md:flex space-x-8">
                  <Link to={getDashboardLink()} className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    Dashboard
                  </Link>
                  <Link to="/profile" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                    Profile
                  </Link>
                </nav>
                {/* User Menu */}
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-700">
                    Welcome, <span className="font-medium">{user.name}</span>
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </header>
        )
      ) : (
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <Link to="/" className="flex items-center">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">K</span>
                  </div>
                  <span className="ml-2 text-xl font-bold text-gray-900">Kunal's Rating Store</span>
                </div>
              </Link>
              {/* Navigation */}
              <nav className="hidden md:flex space-x-8"></nav>
              {/* User Menu */}
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        {children}
      </main>

      {/* Footer */}
      {user && (user.role === 'OWNER' || user.role === 'USER') ? null : (
        <footer className="bg-white border-t mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-gray-600">
              <p>&copy; 2024 Kunal's Rating Store. All rights reserved.</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;
