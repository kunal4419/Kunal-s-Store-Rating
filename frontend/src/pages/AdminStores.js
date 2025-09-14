import React, { useState, useEffect, useCallback } from 'react';
import AddStoreModal from '../components/AddStoreModal';
import EditStoreModal from '../components/EditStoreModal';
import { toast } from 'react-toastify';
import api from '../api';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';

export default function AdminStores() {
  const [stores, setStores] = useState([]);
  const [sortField, setSortField] = useState('name');
  const [sortDir, setSortDir] = useState('asc'); // 'asc' | 'desc'
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState(null);
  const handleAddStore = async (storeData) => {
    try {
      await api.post('/admin/stores', storeData);
      toast.success('Store added successfully');
      loadStores();
    } catch (error) {
      console.error('Error adding store:', error);
      const errorMessage = error.response?.data?.message || 'Failed to add store';
      toast.error(errorMessage);
    }
  };

  const handleEditStore = async (storeData) => {
    try {
      await api.put(`/admin/stores/${storeData.id}`, storeData);
      toast.success('Store updated successfully');
      loadStores();
    } catch (error) {
      console.error('Error updating store:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update store';
      toast.error(errorMessage);
    }
  };

  const loadStores = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      
      const response = await api.get('/admin/stores', { params });
  const data = response.data || [];
  setStores(data);
    } catch (error) {
      console.error('Error loading stores:', error);
      toast.error('Failed to load stores');
    } finally {
      setLoading(false);
    }
  }, [search]);

  const handleEditClick = (store) => {
    setEditingStore(store);
    setEditModalOpen(true);
  };

  useEffect(() => {
    loadStores();
  }, [loadStores]);

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
      await api.delete(`/admin/stores/${storeToDelete.id}`);
      toast.success('Store deleted successfully');
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Stores Management</h1>
        </div>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-2xl shadow"
          onClick={() => setAddModalOpen(true)}
        >
          + Add Store
        </button>
      </div>
  <AddStoreModal open={addModalOpen} onClose={() => setAddModalOpen(false)} onAdd={handleAddStore} />
  <EditStoreModal 
    open={editModalOpen} 
    onClose={() => {
      setEditModalOpen(false);
      setEditingStore(null);
    }} 
    onEdit={handleEditStore}
    store={editingStore}
  />

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input
            type="text"
            placeholder="Search by store name or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Stores List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">All Stores ({stores.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                  onClick={() => {
                    setSortField('name');
                    setSortDir(prev => (sortField === 'name' && prev === 'asc' ? 'desc' : 'asc'));
                  }}
                >
                  Store Name {sortField === 'name' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                  onClick={() => {
                    setSortField('avgRating');
                    setSortDir(prev => (sortField === 'avgRating' && prev === 'asc' ? 'desc' : 'asc'));
                  }}
                >
                  Rating {sortField === 'avgRating' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stores.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <div className="text-gray-400 text-4xl mb-2">🏪</div>
                    No stores found
                  </td>
                </tr>
              ) : (
                [...stores]
                  .sort((a, b) => {
                    const dir = sortDir === 'asc' ? 1 : -1;
                    if (sortField === 'avgRating') {
                      const av = Number(a.avgRating) || 0;
                      const bv = Number(b.avgRating) || 0;
                      return (av - bv) * dir;
                    }
                    const av = (a[sortField] || '').toString().toLowerCase();
                    const bv = (b[sortField] || '').toString().toLowerCase();
                    return av.localeCompare(bv) * dir;
                  })
                  .map((store) => (
                  <tr key={store.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{store.name}</div>
                      <div className="text-sm text-gray-500">{store.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">{store.address}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {renderStars(Math.round(store.avgRating || 0))}
                        <span className="ml-2 text-sm text-gray-600">
                          ({store.avgRating && !isNaN(store.avgRating) && Number(store.avgRating) > 0 ? Number(store.avgRating).toFixed(2) : 'N/A'})
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditClick(store)}
                          className="text-blue-600 hover:text-blue-900 font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openDeleteModal(store)}
                          className="text-red-600 hover:text-red-900 font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Delete Confirmation Modal */}
      <Modal open={deleteModalOpen} onClose={closeDeleteModal}>
        <div className="flex flex-col items-center space-y-4">
          <div className="text-lg font-semibold text-gray-900 dark:text-white">Are you sure you want to delete this store?</div>
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
