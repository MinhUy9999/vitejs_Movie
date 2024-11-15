import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Switch, message } from 'antd';
import { fetchAllSeats, createSeat, updateSeat, deleteSeat } from '../services/apiService';
import { PlusOutlined } from '@ant-design/icons';

const { confirm } = Modal;

const SeatManagement = () => {
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSeat, setEditingSeat] = useState(null);
  const [form] = Form.useForm();

  // Function to fetch all seats
  const fetchSeats = async () => {
    setLoading(true);
    try {
      const data = await fetchAllSeats();
      setSeats(data);
      console.log(data)
    } catch (error) {
      message.error('Failed to fetch seats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeats();
  }, []);

  // Function to open modal for creating or editing seat
  const openModal = (seat = null) => {
    setEditingSeat(seat);
    form.resetFields();
    if (seat) {
      form.setFieldsValue(seat);
    }
    setIsModalVisible(true);
  };

  // Function to handle seat form submission
  const handleSeatSubmit = async (values) => {
    const seatData = {
      screen_id: parseInt(values.screen_id, 10),
      seat_number: parseInt(values.seat_number, 10),
      is_booked: values.is_booked,
    };
    try {
      if (editingSeat) {
        await updateSeat(editingSeat.seat_id, seatData);
        message.success('Seat updated successfully');
      } else {
        await createSeat(seatData);
        message.success('Seat created successfully');
      }
      fetchSeats();
      setIsModalVisible(false);
    } catch (error) {
      message.error('Error saving seat');
    }
  };

  // Function to confirm seat deletion
  const confirmDeleteSeat = (seatID) => {
    confirm({
      title: 'Are you sure you want to delete this seat?',
      onOk: async () => {
        try {
          await deleteSeat(seatID);
          message.success('Seat deleted successfully');
          fetchSeats();
        } catch (error) {
          message.error('Error deleting seat');
        }
      },
    });
  };

  // Define table columns
  const columns = [
    { title: 'Seat ID', dataIndex: 'seat_id', key: 'seat_id' },
    { title: 'Screen ID', dataIndex: 'screen_id', key: 'screen_id' },
    { title: 'Seat Number', dataIndex: 'seat_number', key: 'seat_number' },
    { title: 'Is Booked', dataIndex: 'is_booked', key: 'is_booked', render: (isBooked) => (isBooked ? 'Yes' : 'No') },
    {
      title: 'Actions',
      render: (text, seat) => (
        <>
          <Button onClick={() => openModal(seat)} style={{ marginRight: 8 }}>Edit</Button>
          <Button type="danger" onClick={() => confirmDeleteSeat(seat.seat_id)}>Delete</Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h2>Seat Management</h2>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()} style={{ marginBottom: 16 }}>
        Add Seat
      </Button>
      <Table
        columns={columns}
        dataSource={seats}
        rowKey="seat_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
      <Modal
        title={editingSeat ? 'Edit Seat' : 'Add Seat'}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSeatSubmit}>
          <Form.Item label="Screen ID" name="screen_id" rules={[{ required: true, message: 'Please enter the screen ID' }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Seat Number" name="seat_number" rules={[{ required: true, message: 'Please enter the seat number' }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Is Booked" name="is_booked" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingSeat ? 'Save Changes' : 'Add Seat'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SeatManagement;
