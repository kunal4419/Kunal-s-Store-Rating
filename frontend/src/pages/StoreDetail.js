import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import api from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';

export default function StoreDetail() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [store, setStore] = useState(null);
  const [myRating, setMyRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadStore();
  }, [id]);

  const loadStore = async () => {
    try {
      const response = await api.get(`/user/stores/${id}`);
      setStore(response.data);
      setMyRating(parseInt(response.data.userRating) || 0);
    } catch (error) {
      console.error('Error loading store:', error);
      toast.error('Failed to load store details');
    } finally {
      setLoading(false);
    }
  };

  const handleRate = async (rating) => {
    if (!user) {
      toast.error('Please log in to rate stores');
      return;
    }

    setSubmitting(true);
    try {
      await api.post(`/user/stores/${id}/rating`, { ratingValue: rating });
      setMyRating(rating);
      toast.success('Rating submitted successfully!');
      // Reload store to get updated average rating
      loadStore();
    } catch (error) {
      toast.error('Failed to submit rating');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating, interactive = false) => {
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        onClick={() => interactive && handleRate(i + 1)}
        disabled={!interactive || submitting}
        className={`text-2xl transition-colors ${
          i < rating ? 'text-yellow-400' : 'text-gray-300'
        } ${interactive ? 'hover:text-yellow-500 cursor-pointer' : 'cursor-default'} ${
          submitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        ★
      </button>
    ));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  if (!store) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">❌</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Store not found</h3>
        <p className="text-gray-600 mb-4">The store you're looking for doesn't exist.</p>
        <Link
          to="/stores"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Back to Stores
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <Link
        to="/stores"
        className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Stores
      </Link>

      {/* Store Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{store.name}</h1>
        <p className="text-gray-600 mb-4">{store.address || 'No address provided'}</p>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-2">Average Rating:</span>
            <div className="flex items-center">
              {renderStars(Math.round(parseFloat(store.avgRating) || 0))}
              <span className="ml-2 text-gray-600">({typeof store.avgRating === 'number' ? store.avgRating.toFixed(2) : (parseFloat(store.avgRating) ? parseFloat(store.avgRating).toFixed(2) : '0.00')})</span>
            </div>
          </div>
          <span className="text-gray-400">•</span>
          <span className="text-sm text-gray-600">{store.ratingCount || 0} reviews</span>
        </div>
      </div>

      {/* Rating Section */}
      {user ? (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Rate this Store</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              {renderStars(myRating, true)}
            </div>
            {submitting && (
              <span className="text-blue-600 text-sm">Saving...</span>
            )}
          </div>
          {myRating > 0 && (
            <p className="mt-2 text-sm text-gray-600">You rated this store {myRating} star{myRating !== 1 ? 's' : ''}.</p>
          )}
        </div>
      ) : (
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-6 text-center">
          <h3 className="text-lg font-medium text-blue-900 mb-2">Want to rate this store?</h3>
          <p className="text-blue-700 mb-4">Sign in to share your experience with others.</p>
          <Link
            to="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Sign In
          </Link>
        </div>
      )}
    </div>
  );
}
