import React, { useState, useEffect, useContext } from 'react';
import AddUserModal from '../components/AddUserModal';
import Modal from '../components/Modal';
import { toast } from 'react-toastify';
import { AuthContext } from '../contexts/AuthContext';
import api from '../api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function AdminUsers() {
  const { user: currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nameFilter, setNameFilter] = useState('');
  const [emailFilter, setEmailFilter] = useState('');
  const [addressFilter, setAddressFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [sortField, setSortField] = useState('name');
  const [sortDir, setSortDir] = useState('asc');
  const handleAddUser = async (userData) => {
    try {
      await api.post('/admin/users', userData);
      toast.success('User added successfully');
      loadUsers();
    } catch (error) {
      toast.error('Failed to add user');
    }
  };

  const [pendingName, setPendingName] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');
  const [pendingAddress, setPendingAddress] = useState('');
  const [pendingRole, setPendingRole] = useState('');

  useEffect(() => {
    loadUsers();
  }, [nameFilter, emailFilter, addressFilter, roleFilter]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const params = {};
      if (nameFilter) params.name = nameFilter;
      if (emailFilter) params.email = emailFilter;
      if (addressFilter) params.address = addressFilter;
      if (roleFilter) params.role = roleFilter;
      const response = await api.get('/admin/users', { params });
      setUsers(response.data || []);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };


  // Modal state for delete confirmation
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      await api.delete(`/admin/users/${userToDelete.id}`);
      toast.success('User deleted successfully');
      loadUsers();
    } catch (error) {
      toast.error('Failed to delete user');
    } finally {
      closeDeleteModal();
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
        </div>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-2xl shadow"
          onClick={() => setAddModalOpen(true)}
        >
          + Add User
        </button>
      </div>
  <AddUserModal open={addModalOpen} onClose={() => setAddModalOpen(false)} onAdd={handleAddUser} />

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              placeholder="Filter by name..."
              value={pendingName}
              onChange={(e) => setPendingName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') setNameFilter(pendingName); }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="text"
              placeholder="Filter by email..."
              value={pendingEmail}
              onChange={(e) => setPendingEmail(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') setEmailFilter(pendingEmail); }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              type="text"
              placeholder="Filter by address..."
              value={pendingAddress}
              onChange={(e) => setPendingAddress(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') setAddressFilter(pendingAddress); }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={pendingRole}
              onChange={(e) => setPendingRole(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') setRoleFilter(pendingRole); }}
              onBlur={() => setRoleFilter(pendingRole)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Roles</option>
              <option value="USER">User</option>
              <option value="OWNER">Owner</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">All Users ({users.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                  onClick={() => { setSortField('name'); setSortDir(prev => (sortField === 'name' && prev === 'asc' ? 'desc' : 'asc')); }}
                >
                  Name {sortField === 'name' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                  onClick={() => { setSortField('email'); setSortDir(prev => (sortField === 'email' && prev === 'asc' ? 'desc' : 'asc')); }}
                >
                  Email {sortField === 'email' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                  onClick={() => { setSortField('role'); setSortDir(prev => (sortField === 'role' && prev === 'asc' ? 'desc' : 'asc')); }}
                >
                  Role {sortField === 'role' ? (sortDir === 'asc' ? '▲' : '▼') : ''}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    <div className="text-gray-400 text-4xl mb-2">👥</div>
                    No users found
                  </td>
                </tr>
              ) : (
                [...users]
                  .sort((a, b) => {
                    const dir = sortDir === 'asc' ? 1 : -1;
                    const av = (a[sortField] || '').toString().toLowerCase();
                    const bv = (b[sortField] || '').toString().toLowerCase();
                    return av.localeCompare(bv) * dir;
                  })
                  .map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-blue-600 font-medium text-sm">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          {user.role === 'OWNER' && user.store && (
                            <div className="text-xs text-gray-600 mt-1">
                              Store: <span className="font-semibold">{user.store.name}</span>
                              {user.store.avgRating !== undefined && (
                                <span> &middot; Rating: {user.store.avgRating.toFixed(1)}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.address || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                        user.role === 'OWNER' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {/* Prevent deleting admin users */}
                      {user.id !== currentUser?.id && user.role !== 'ADMIN' && (
                        <button
                          onClick={() => openDeleteModal(user)}
                          className="text-red-600 hover:text-red-900 font-medium"
                        >
                          Delete
                        </button>
                      )}
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
          <div className="text-lg font-semibold text-gray-900 dark:text-white">Are you sure you want to delete this user?</div>
          <div className="flex space-x-4 mt-2">
            <button
              onClick={confirmDeleteUser}
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
