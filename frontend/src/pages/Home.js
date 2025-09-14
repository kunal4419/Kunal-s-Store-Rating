import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="text-center py-16">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Rate & Discover
          <span className="text-blue-600 block">Amazing Stores</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Share your experiences and discover the best stores in your area. 
          Join our community of reviewers today.
        </p>
  {/* Buttons removed as requested */}
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="text-center p-6 bg-white rounded-lg shadow-sm">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⭐</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">Rate Stores</h3>
          <p className="text-gray-600">Share your experience by rating stores you've visited.</p>
        </div>
        
        <div className="text-center p-6 bg-white rounded-lg shadow-sm">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🏪</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">Discover Places</h3>
          <p className="text-gray-600">Find the best stores in your area based on real reviews.</p>
        </div>
        
        <div className="text-center p-6 bg-white rounded-lg shadow-sm">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">👥</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">Join Community</h3>
          <p className="text-gray-600">Connect with other users and share recommendations.</p>
        </div>
      </div>

      {/* CTA Section */}
      {!user && (
        <div className="bg-blue-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-blue-100 mb-6">Create your account and start rating stores today.</p>
          <Link
            to="/register"
            className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-3 rounded-lg text-lg font-medium transition-colors inline-block"
          >
            Sign Up Free
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;
