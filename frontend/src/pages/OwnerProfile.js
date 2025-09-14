import React, { useState } from 'react';
import useAxios from '../hooks/useAxios';
import Modal from '../components/Modal';
import { toast } from 'react-toastify';
import Sidebar from '../components/Sidebar';

export default function OwnerProfile() {
  const [showModal, setShowModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('All fields are required.');
      toast.error('All fields are required.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      toast.error('New passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await useAxios.put('/owner/password', {
        currentPassword: oldPassword,
        newPassword,
      });
      setSuccess('Password updated successfully!');
      toast.success('Password updated successfully!');
      setShowModal(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to update password.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar links={[{ href: '/owner/dashboard', label: 'My Stores' }, { href: '/owner/profile', label: 'Profile' }, { href: '/logout', label: 'Logout' }]} />
      <main className="flex-1 p-2 sm:p-8">
        <div className="max-w-xl">
          <h2 className="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">Owner Profile</h2>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-2xl mb-4" onClick={() => setShowModal(true)}>
            Update Password
          </button>
          {success && <div className="text-green-500 mb-2">{success}</div>}
          <Modal open={showModal} onClose={() => setShowModal(false)}>
            <form onSubmit={handleSubmit} className="space-y-4 p-2">
              <h3 className="text-lg font-bold mb-2">Update Password</h3>
              <div>
                <label className="block font-semibold mb-1">Current Password</label>
                <input type="password" className="border rounded-2xl px-4 py-2 w-full" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required />
              </div>
              <div>
                <label className="block font-semibold mb-1">New Password</label>
                <input type="password" className="border rounded-2xl px-4 py-2 w-full" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
              </div>
              <div>
                <label className="block font-semibold mb-1">Confirm New Password</label>
                <input type="password" className="border rounded-2xl px-4 py-2 w-full" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
              </div>
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <div className="flex gap-2 justify-end mt-4">
                <button type="button" className="px-4 py-2 rounded-2xl bg-gray-300" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-2xl bg-blue-500 text-white" disabled={loading}>Update</button>
              </div>
            </form>
          </Modal>
        </div>
      </main>
    </div>
  );
}
