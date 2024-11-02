// AdminDashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-md text-center">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p className="mt-4">Welcome to the admin dashboard.</p>
      {/* Add admin-specific content here */}
      <button
        onClick={handleLogout}
        className="mt-6 inline-block px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
}

export default AdminDashboard;
