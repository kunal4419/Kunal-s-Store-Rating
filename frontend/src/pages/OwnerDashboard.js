import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import api from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';

export default function OwnerDashboard() {
  const { user } = useContext(AuthContext);
  const [stores, setStores] = useState([]);
  const [stats, setStats] = useState({ totalStores: 0, totalRatings: 0, avgRating: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/owner/dashboard');
      setStores(response.data.stores || []);
      setStats(response.data.stats || { totalStores: 0, totalRatings: 0, avgRating: 0 });
    } catch (error) {
      console.error('Error loading dashboard:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
        ★
      </span>
    ));
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Owner Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}!</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⭐</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Ratings</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalRatings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Rating</p>
              <p className="text-2xl font-bold text-gray-900">
                {typeof stats.avgRating === 'number' ? stats.avgRating.toFixed(2) : (parseFloat(stats.avgRating) ? parseFloat(stats.avgRating).toFixed(2) : '0.00')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stores and Ratings */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Your Stores & Ratings</h2>
        </div>
        <div className="p-6">
          {stores.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 text-6xl mb-4">🏪</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No stores yet</h3>
              <p className="text-gray-600 mb-4">Contact an administrator to add your first store.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {stores.map((store) => (
                <div key={store.id} className="border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-medium text-gray-900 text-lg">{store.name}</h3>
                      <p className="text-sm text-gray-600">{store.email}</p>
                      <p className="text-sm text-gray-500">{store.address}</p>
                    </div>
                    <div className="flex items-center">
                      {renderStars(Math.round(store.avgRating || 0))}
                      <span className="ml-2 text-sm text-gray-600">
                        ({typeof store.avgRating === 'number' ? store.avgRating.toFixed(2) : (parseFloat(store.avgRating) ? parseFloat(store.avgRating).toFixed(2) : '0.00')})
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">
                      Recent Ratings ({store.ratings.length})
                    </h4>
                    {store.ratings.length === 0 ? (
                      <p className="text-gray-500 text-sm">No ratings yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {store.ratings.slice(0, 5).map((rating) => (
                          <div key={rating.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center">
                              <div className="flex items-center mr-3">
                                {renderStars(rating.ratingValue)}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{rating.user.name}</p>
                                <p className="text-xs text-gray-500">{rating.user.email}</p>
                              </div>
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(rating.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        ))}
                        {store.ratings.length > 5 && (
                          <p className="text-xs text-gray-500 text-center">
                            ... and {store.ratings.length - 5} more ratings
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
