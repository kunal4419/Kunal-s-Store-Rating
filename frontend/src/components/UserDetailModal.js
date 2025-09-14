import React, { useState, useEffect } from 'react';

export default function UserDetailModal({ open, onClose, user, onSave }) {
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    address: user?.address || '',
    role: user?.role || '',
  });

  useEffect(() => {
    setForm({
      name: user?.name || '',
      email: user?.email || '',
      address: user?.address || '',
      role: user?.role || '',
    });
  }, [user]);

  if (!open || !user) return null;

  const isAdmin = user.role === 'ADMIN';

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit User</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Name</label>
            <input name="name" value={form.name} onChange={handleChange} className="border rounded-2xl px-4 py-2 w-full" disabled={isAdmin} />
          </div>
          <div>
            <label className="block font-semibold mb-1">Email</label>
            <input name="email" value={form.email} onChange={handleChange} className="border rounded-2xl px-4 py-2 w-full" disabled={isAdmin} />
          </div>
          <div>
            <label className="block font-semibold mb-1">Address</label>
            <input name="address" value={form.address} onChange={handleChange} className="border rounded-2xl px-4 py-2 w-full" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Role</label>
            <select name="role" value={form.role} onChange={handleChange} className="border rounded-2xl px-4 py-2 w-full" disabled={isAdmin}>
              <option value="USER">User</option>
              <option value="OWNER">Owner</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          {user.role === 'OWNER' && (
            <div>
              <label className="block font-semibold mb-1">Rating</label>
              <span className="block px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-2xl">{user.rating ?? '-'}</span>
            </div>
          )}
          <div className="flex justify-end mt-6 gap-2">
            <button type="button" className="px-4 py-2 rounded-2xl bg-gray-400 text-white" onClick={onClose}>Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-2xl bg-blue-500 text-white" disabled={isAdmin}>Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
