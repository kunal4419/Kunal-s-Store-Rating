import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Stores() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStores();
  }, [search]);

  const loadStores = async () => {
    setLoading(true);
    try {
      const response = await api.get('/user/stores', {
        params: { search }
      });
      setStores(response.data || []);
    } catch (error) {
      console.error('Error loading stores:', error);
      setStores([]);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Stores</h1>
        <p className="text-gray-600">Discover and rate stores in your area</p>
      </div>

      {/* Search */}
      <div className="max-w-md mx-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="Search stores..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Stores Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stores.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🏪</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No stores found</h3>
              <p className="text-gray-600">Try adjusting your search terms</p>
            </div>
          ) : (
            stores.map((store) => (
              <div key={store.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{store.name}</h3>
                  <div className="flex items-center">
                    {renderStars(parseFloat(store.avgRating) || 0)}
                    <span className="ml-1 text-sm text-gray-600">
                      ({typeof store.avgRating === 'number' ? store.avgRating.toFixed(2) : (parseFloat(store.avgRating) ? parseFloat(store.avgRating).toFixed(2) : '0.00')})
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">{store.address || 'No address provided'}</p>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {store.ratingCount || 0} reviews
                  </span>
                  <Link
                    to={`/stores/${store.id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
