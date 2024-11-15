import React, { useEffect, useState } from 'react';
import { Table, Typography, Spin, Alert } from 'antd';
import { fetchAllBookings } from '../services/apiService';

const { Title } = Typography;

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getBookings = async () => {
      try {
        const allBookings = await fetchAllBookings();
        setBookings(allBookings);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    getBookings();
  }, []);

  // Define columns for the Ant Design table
  const columns = [
    {
      title: 'Booking ID',
      dataIndex: 'booking_id',
      key: 'booking_id',
    },
    {
      title: 'User ID',
      dataIndex: 'user_id',
      key: 'user_id',
    },
    {
      title: 'Movie ID',
      dataIndex: 'movie_id',
      key: 'movie_id',
    },
    {
      title: 'Screen ID',
      dataIndex: 'screen_id',
      key: 'screen_id',
    },
    {
      title: 'Booking Date',
      dataIndex: 'booking_date',
      key: 'booking_date',
      render: (text) => new Date(text).toLocaleString(), // Format date
    },
  
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>Quản lí đặt vé</Title>
      {loading ? (
        <Spin tip="Loading bookings..." />
      ) : error ? (
        <Alert message="Error" description={error} type="error" showIcon />
      ) : (
        <Table
          columns={columns}
          dataSource={bookings}
          rowKey="booking_id" // Unique key for each row
          pagination={{ pageSize: 10 }} // Adjust page size as needed
        />
      )}
    </div>
  );
};

export default BookingManagement;
