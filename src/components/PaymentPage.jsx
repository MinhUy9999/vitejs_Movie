// components/PaymentPage.jsx
import React, { useEffect, useState } from 'react';
import { getTicketsByBookingID } from '../services/apiService';

const PaymentPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Lấy bookingID từ localStorage
    const bookingID = localStorage.getItem('bookingID');
    

    if (bookingID) {
      // Gọi API lấy danh sách vé
      getTicketsByBookingID(bookingID)
        .then((data) => {
          // Kiểm tra và gán dữ liệu vé nếu có
          setTickets(data || []);
        })
        .catch((error) => {
          console.error("Error fetching tickets:", error);
          setError('Không thể tải danh sách vé.');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setError('Không tìm thấy booking ID.');
      setLoading(false);
    }

    // Xóa trạng thái bookingComplete khỏi localStorage nếu cần
    return () => {
      localStorage.removeItem('bookingComplete');
    };
  }, []);

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="w-full max-w-md mx-auto my-5 p-4">
      <h2 className="text-2xl font-bold text-center mb-4">Trang Thanh Toán</h2>
      <p>Cảm ơn bạn đã đặt vé thành công. Dưới đây là thông tin vé của bạn:</p>

      {tickets.length > 0 ? (
        <ul className="mt-4">
          {tickets.map((ticket) => (
            <li key={ticket.ticketID} className="border-b py-2">
              <p><strong>Mã vé:</strong> {ticket.ticketID}</p>
              <p><strong>Mã booking:</strong> {ticket.bookingID}</p>
              <p><strong>Mã ghế:</strong> {ticket.seatID}</p>
              <p><strong>Giá vé:</strong> {ticket.fare.toLocaleString('vi-VN')} VND</p>
              <p><strong>Ngày phát hành:</strong> {new Date(ticket.issuedAt).toLocaleString('vi-VN')}</p>
              {ticket.qrCode && (
                <p><strong>QR Code:</strong> {ticket.qrCode}</p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>Không có vé nào được tìm thấy cho booking này.</p>
      )}
    </div>
  );
};

export default PaymentPage;
