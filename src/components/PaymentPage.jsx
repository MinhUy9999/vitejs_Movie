import React, { useEffect, useState } from 'react';
import { fetchBookingsByUserID } from '../services/apiService';

const PaymentPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllBookingsForUser = async () => {
      const userID = localStorage.getItem('userID');
      if (!userID) {
        setError('Không tìm thấy User ID.');
        setLoading(false);
        return;
      }

      try {
        const userBookings = await fetchBookingsByUserID(userID);
        
        if (userBookings.length === 0) {
          setError('Không có vé nào được tìm thấy cho người dùng này.');
          return;
        }

        setBookings(userBookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError(error.message || 'Không thể tải danh sách vé.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllBookingsForUser();
  }, []);

  if (loading) {
    return <div className="text-center text-lg py-4">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="text-center text-lg text-red-500 py-4">{error}</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">Tất Cả Vé Đã Đặt</h2>
        <p className="text-center text-gray-700 mb-8">Dưới đây là danh sách tất cả các vé mà bạn đã đặt:</p>

        {bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.booking_id} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold text-indigo-700 mb-2">Mã Booking: {booking.booking_id}</h3>
                <p><strong>Mã Phim:</strong> {booking.movie_id}</p>
                <p><strong>Ngày Đặt:</strong> {new Date(booking.booking_date).toLocaleString('vi-VN')}</p>
                <p><strong>Số Ghế Đã Đặt:</strong> {booking.seats_booked}</p>
                <p><strong>Danh Sách Ghế:</strong> {booking.seat_ids.join(', ')}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-700">Không có vé nào được tìm thấy cho booking này.</p>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
