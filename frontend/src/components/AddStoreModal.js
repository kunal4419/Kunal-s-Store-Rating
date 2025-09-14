import React, { useState } from 'react';
import OwnerSelector from './OwnerSelector';

export default function AddStoreModal({ open, onClose, onAdd }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [ownerId, setOwnerId] = useState('');
  const [error, setError] = useState('');

  const nameValid = name.length >= 3 && name.length <= 60;
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const addressValid = address.length > 0 && address.length <= 400;
  const ownerValid = ownerId.length > 0;

  const handleSubmit = e => {
    e.preventDefault();
    if (!nameValid || !addressValid || !emailValid || !ownerValid) {
      setError('Please fix validation errors.');
      return;
    }
    onAdd({ name, email, address, ownerId });
    setName(''); setEmail(''); setAddress(''); setOwnerId(''); setError('');
    onClose();
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add New Store</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Store Name</label>
            <input type="text" className={`w-full px-3 py-2 border rounded-2xl ${!nameValid && name ? 'border-red-500' : 'border-gray-300'}`} value={name} onChange={e => setName(e.target.value)} required />
            {!nameValid && name && <span className="text-red-500 text-xs">Name must be 3–60 characters.</span>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Store Email</label>
            <input type="email" className={`w-full px-3 py-2 border rounded-2xl ${!emailValid && email ? 'border-red-500' : 'border-gray-300'}`} value={email} onChange={e => setEmail(e.target.value)} required />
            {!emailValid && email && <span className="text-red-500 text-xs">Enter a valid email address.</span>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <input type="text" className={`w-full px-3 py-2 border rounded-2xl ${!addressValid && address ? 'border-red-500' : 'border-gray-300'}`} value={address} onChange={e => setAddress(e.target.value)} required />
            {!addressValid && address && <span className="text-red-500 text-xs">Address is required and max 400 characters.</span>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Owner</label>
            <OwnerSelector 
              value={ownerId} 
              onChange={setOwnerId}
              error={!ownerValid && ownerId ? 'Please select an owner' : ''}
            />
          </div>
          {error && <div className="text-red-500 text-xs text-center">{error}</div>}
          <div className="flex gap-2 justify-end mt-4">
            <button type="button" className="px-4 py-2 rounded-2xl bg-gray-300 dark:bg-gray-700" onClick={onClose}>Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-2xl bg-blue-500 text-white" disabled={!nameValid || !addressValid || !emailValid || !ownerValid}>Add Store</button>
          </div>
        </form>
      </div>
    </div>
  );
}
