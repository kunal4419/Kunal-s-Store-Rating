import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useAxios from '../hooks/useAxios';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';

export default function OwnerRaters() {
  const { id } = useParams();
  const [raters, setRaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('date');
  const [sortField, setSortField] = useState('name');
  const [sortDir, setSortDir] = useState('asc');

  useEffect(() => {
    useAxios.get(`/owner/stores/${id}/ratings`, { params: { sort } })
      .then(res => {
        const arr = res.data.ratings || [];
        const mapped = arr.map(r => ({
          id: r.id,
          name: r.User?.name || r.user?.name || 'Unknown',
          email: r.User?.email || r.user?.email || '-',
          rating: r.ratingValue,
          dateRated: new Date(r.createdAt).toLocaleString(),
        }));
        setRaters(mapped);
      })
      .catch(() => setRaters([]))
      .finally(() => setLoading(false));
  }, [id, sort]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 dark:bg-gray-900">
  <Sidebar links={[{ href: '/owner/dashboard', label: 'My Stores' }, { href: '/owner/profile', label: 'Profile' }, { href: '/logout', label: 'Logout' }]} />
      <main className="flex-1 p-2 sm:p-8">
        <h1 className="text-2xl font-bold mb-6 text-blue-600 dark:text-blue-400">Raters</h1>
  <div className="mb-4 flex flex-col sm:flex-row gap-2">
          <label className="font-semibold">Sort by:</label>
          <select value={sort} onChange={e => setSort(e.target.value)} className="border rounded-2xl px-4 py-2 shadow dark:bg-gray-800 dark:text-white">
            <option value="date">Date Rated</option>
            <option value="rating">Rating</option>
          </select>
        </div>
        {loading ? <LoadingSpinner /> : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white dark:bg-gray-800 rounded-2xl shadow text-sm sm:text-base">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="px-4 py-2 text-left cursor-pointer select-none" onClick={() => { setSortField('name'); setSortDir(prev => (sortField === 'name' && prev === 'asc' ? 'desc' : 'asc')); }}>User Name {sortField === 'name' ? (sortDir === 'asc' ? '▲' : '▼') : ''}</th>
                  <th className="px-4 py-2 text-left cursor-pointer select-none" onClick={() => { setSortField('email'); setSortDir(prev => (sortField === 'email' && prev === 'asc' ? 'desc' : 'asc')); }}>User Email {sortField === 'email' ? (sortDir === 'asc' ? '▲' : '▼') : ''}</th>
                  <th className="px-4 py-2 text-left cursor-pointer select-none" onClick={() => { setSortField('rating'); setSortDir(prev => (sortField === 'rating' && prev === 'asc' ? 'desc' : 'asc')); }}>Rating {sortField === 'rating' ? (sortDir === 'asc' ? '▲' : '▼') : ''}</th>
                  <th className="px-4 py-2 text-left cursor-pointer select-none" onClick={() => { setSortField('dateRated'); setSortDir(prev => (sortField === 'dateRated' && prev === 'asc' ? 'desc' : 'asc')); }}>Date Rated {sortField === 'dateRated' ? (sortDir === 'asc' ? '▲' : '▼') : ''}</th>
                </tr>
              </thead>
              <tbody>
                {raters.length === 0 ? (
                  <tr><td colSpan={4} className="text-center text-gray-500 dark:text-gray-400">No raters found.</td></tr>
                ) : (
                  [...raters]
                    .sort((a, b) => {
                      const dir = sortDir === 'asc' ? 1 : -1;
                      if (sortField === 'rating') {
                        return ((a.rating || 0) - (b.rating || 0)) * dir;
                      }
                      if (sortField === 'dateRated') {
                        return (new Date(a.dateRated) - new Date(b.dateRated)) * dir;
                      }
                      const av = (a[sortField] || '').toString().toLowerCase();
                      const bv = (b[sortField] || '').toString().toLowerCase();
                      return av.localeCompare(bv) * dir;
                    })
                    .map(rater => (
                    <tr key={rater.id} className="border-b">
                      <td className="px-4 py-2">{rater.name}</td>
                      <td className="px-4 py-2">{rater.email}</td>
                      <td className="px-4 py-2">{rater.rating}</td>
                      <td className="px-4 py-2">{rater.dateRated}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
