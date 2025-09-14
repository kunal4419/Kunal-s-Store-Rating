import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function NavBar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center rounded-2xl shadow-lg mb-6">
      <div className="font-bold text-xl">Kunal's Rating Store</div>
      <div className="space-x-4">
        {user && user.role === 'ADMIN' ? (
          <>
            <Link to="/admin/dashboard" className="hover:text-blue-400">Dashboard</Link>
            <Link to="/admin/users" className="hover:text-blue-400">Users</Link>
            {/* Removed Stores button */}
          </>
        ) : user && user.role === 'USER' ? (
          <>
            {/* Removed Stores button */}
            <Link to="/profile" className="hover:text-blue-400">Profile</Link>
            <button
              className="hover:text-blue-400 bg-transparent border-none cursor-pointer"
              style={{ padding: 0, background: 'none', border: 'none' }}
              onClick={() => { logout(); navigate('/login'); }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            {/* Removed Stores button */}
            <Link to="/login" className="hover:text-blue-400">Login</Link>
            <Link to="/register" className="hover:text-blue-400">Register</Link>
          </>
        )}
      </div>
      {user && <span className="ml-4">Role: <strong>{user.role}</strong></span>}
    </nav>
  );
}
