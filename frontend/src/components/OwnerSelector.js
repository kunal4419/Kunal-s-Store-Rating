import React, { useState, useEffect } from 'react';
import api from '../api';

export default function OwnerSelector({ value, onChange, error: propError, disabled = false }) {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    loadOwners();
  }, []);

  const loadOwners = async () => {
    try {
      setLoading(true);
      setFetchError('');
      
      // Fetch all users with OWNER role
      const response = await api.get('/admin/users', { 
        params: { role: 'OWNER' } 
      });
      
      // Fetch all stores to check which owners already have stores
      const storesResponse = await api.get('/admin/stores');
      const ownersWithStores = new Set(storesResponse.data.map(store => store.ownerId));
      
      // Mark owners who already have stores
      const ownersData = response.data.map(owner => ({
        ...owner,
        hasStore: ownersWithStores.has(owner.id)
      }));
      
      setOwners(ownersData);
    } catch (error) {
      console.error('Error loading owners:', error);
      setFetchError('Failed to load owners');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full px-3 py-2 border border-gray-300 rounded-2xl bg-gray-100">
        <span className="text-gray-500 text-sm">Loading owners...</span>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="w-full px-3 py-2 border border-red-500 rounded-2xl bg-red-50">
        <span className="text-red-500 text-sm">{fetchError}</span>
      </div>
    );
  }

  return (
    <div>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full px-3 py-2 border rounded-2xl ${
          propError ? 'border-red-500' : 'border-gray-300'
        } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
        required
      >
        <option value="">Select an owner</option>
        {owners.map((owner) => (
          <option 
            key={owner.id} 
            value={owner.id}
            disabled={owner.hasStore}
            className={owner.hasStore ? 'text-gray-400' : ''}
          >
            {owner.name} ({owner.email}) {owner.hasStore ? '- Already has a store' : ''}
          </option>
        ))}
      </select>
      {propError && <span className="text-red-500 text-xs">{propError}</span>}
      {owners.filter(owner => !owner.hasStore).length === 0 && (
        <span className="text-yellow-600 text-xs">
          All owners already have stores. One user can only own one store.
        </span>
      )}
    </div>
  );
}
