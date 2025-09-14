import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import api from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';

function DashboardCard({ title, value, icon }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/dashboard');
      setStats(response.data || { totalUsers: 0, totalStores: 0, totalRatings: 0 });
    } catch (error) {
      console.error('Error loading dashboard:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header - Removed welcome message as it's now in the navbar */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard title="Total Users" value={stats.totalUsers} icon="👥" />
        <DashboardCard title="Total Stores" value={stats.totalStores} icon="🏪" />
        <DashboardCard title="Total Ratings" value={stats.totalRatings} icon="⭐" />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/admin/users"
            className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-xl">👥</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Manage Users</h3>
              <p className="text-sm text-gray-600">View and manage all users</p>
            </div>
          </Link>
          
          <Link
            to="/admin/stores"
            className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
              <span className="text-xl">🏪</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Manage Stores</h3>
              <p className="text-sm text-gray-600">View and manage all stores</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
