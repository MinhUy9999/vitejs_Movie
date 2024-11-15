import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import MovieList from './MovieList';
import Chat from './Chat';

function HomePage() {
  const name = localStorage.getItem('name') || 'User';
  const role = localStorage.getItem('role') || 'user';
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('role');
    localStorage.removeItem('bookingID'); // Remove bookingID on logout
    navigate('/login');
  };

  const goToPayment = () => {
    navigate('/payment'); // Navigate to the payment page
  };

  return (
    <div className="w-full">
      {/* Header Section */}
      <header className="flex items-center justify-between py-4 bg-gray-800 text-white px-6">
        <Link to="/home" className="text-lg font-bold">Welcome, {name}!</Link>

        {/* Conditionally render the admin link if the role is 'admin' */}
        {role === 'admin' && (
          <Link
            to="/admin"
            className="text-blue-400 hover:text-blue-200"
          >
            Admin Dashboard
          </Link>
        )}

        {/* Payment page button, always visible */}
        <button
          onClick={goToPayment}
          className="ml-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Đi đến trang thanh toán
        </button>

        {role === 'admin' ? (
          <button
            onClick={handleLogout}
            className="ml-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Login
          </Link>
        )}
      </header>

      {/* Main Content */}
      <main className="mt-6 text-center">
        <MovieList />
        <Chat />
      </main>
    </div>
  );
}

export default HomePage;
