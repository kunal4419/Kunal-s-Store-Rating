import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import api from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import { toast } from 'react-toastify';

export default function OwnerStores() {
  const { user } = useContext(AuthContext);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStore, setNewStore] = useState({ name: '', email: '', address: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    setLoading(true);
    try {
      const response = await api.get('/owner/stores');
      setStores(response.data || []);
    } catch (error) {
      console.error('Error loading stores:', error);
      toast.error('Failed to load stores');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStore = async (e) => {
    e.preventDefault();
    
    // Client-side validation
    if (!newStore.name.trim()) {
      toast.error('Store name is required');
      return;
    }
    if (!newStore.email.trim()) {
      toast.error('Store email is required');
      return;
    }
    if (!newStore.address.trim()) {
      toast.error('Store address is required');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newStore.email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    setSubmitting(true);
    try {
      const response = await api.post('/owner/stores', newStore);
      toast.success(response.data.message || 'Store added successfully!');
      setShowAddModal(false);
      setNewStore({ name: '', email: '', address: '' });
      loadStores();
    } catch (error) {
      console.error('Error adding store:', error);
      const errorMessage = error.response?.data?.message || 'Failed to add store';
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Modal state for delete confirmation
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [storeToDelete, setStoreToDelete] = useState(null);

  const openDeleteModal = (store) => {
    setStoreToDelete(store);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setStoreToDelete(null);
  };

  const confirmDeleteStore = async () => {
    if (!storeToDelete) return;
    try {
      const response = await api.delete(`/owner/stores/${storeToDelete.id}`);
      toast.success(response.data.message || 'Store deleted successfully!');
      loadStores();
    } catch (error) {
      console.error('Error deleting store:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete store';
      toast.error(errorMessage);
    } finally {
      closeDeleteModal();
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
          <h1 className="text-3xl font-bold text-gray-900">Manage Stores</h1>
          <p className="text-gray-600">Add and manage your stores</p>
        </div>
      </div>

      {/* Stores List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Your Stores ({stores.length})</h2>
        </div>
        <div className="p-6">
          {stores.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🏪</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to Store Management!</h3>
              <p className="text-gray-600 mb-4">You haven't added any stores yet. Get started by creating your first store to begin receiving customer ratings.</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors text-lg"
              >
                Create Your First Store
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {stores.map((store) => (
                <div key={store.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{store.name}</h3>
                    <p className="text-sm text-gray-600">{store.email}</p>
                    <p className="text-sm text-gray-600">{store.address}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      {renderStars(Math.round(store.avgRating || 0))}
                      <span className="ml-2 text-sm text-gray-600">
                        ({typeof store.avgRating === 'number' ? store.avgRating.toFixed(2) : (parseFloat(store.avgRating) ? parseFloat(store.avgRating).toFixed(2) : '0.00')})
                      </span>
                    </div>
                    <button
                      onClick={() => openDeleteModal(store)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Store Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Store</h3>
            <form onSubmit={handleAddStore} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Store Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={newStore.name}
                  onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Store Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={newStore.email}
                  onChange={(e) => setNewStore({ ...newStore, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  id="address"
                  value={newStore.address}
                  onChange={(e) => setNewStore({ ...newStore, address: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Adding...' : 'Add Store'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      <Modal open={deleteModalOpen} onClose={closeDeleteModal}>
        <div className="flex flex-col items-center space-y-4">
          <div className="text-lg font-semibold text-gray-900 dark:text-white">Are you sure you want to delete this store? </div>
          <div className="flex space-x-4 mt-2">
            <button
              onClick={confirmDeleteStore}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-2xl font-semibold focus:outline-none"
            >
              OK
            </button>
            <button
              onClick={closeDeleteModal}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-2xl font-semibold focus:outline-none"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
