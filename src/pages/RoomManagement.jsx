// RoomManagement.jsx
import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Pagination } from 'antd';
import { fetchAllRooms, createRoom, updateRoom, deleteRoom } from '../services/apiService';
import { PlusOutlined } from '@ant-design/icons';

const { confirm } = Modal;

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [form] = Form.useForm();

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const data = await fetchAllRooms();
      setRooms(data);
    } catch (error) {
      message.error('Error fetching rooms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const openModal = (room = null) => {
    setEditingRoom(room);
    form.resetFields();
    if (room) {
      form.setFieldsValue(room);
    }
    setIsModalVisible(true);
  };

  const handleRoomSubmit = async (values) => {
    const roomData = {
      theater_id: parseInt(values.theater_id, 10), // Ensures theater_id is an integer
      room_number: parseInt(values.room_number, 10) // Ensures room_number is an integer
    };
    try {
      if (editingRoom) {
        // Update existing room
        await updateRoom(editingRoom.room_id, roomData);
        message.success('Room updated successfully');
      } else {
        // Create new room
        await createRoom(roomData);
        message.success('Room created successfully');
      }
      fetchRooms();
      setIsModalVisible(false);
    } catch (error) {
      message.error('Error saving room');
    }
  };
  

  const confirmDeleteRoom = (roomID) => {
    confirm({
      title: 'Are you sure you want to delete this room?',
      onOk: async () => {
        try {
          await deleteRoom(roomID);
          message.success('Room deleted successfully');
          fetchRooms();
        } catch (error) {
          message.error('Error deleting room');
        }
      },
    });
  };

  const columns = [
    { title: 'ID', dataIndex: 'room_id', key: 'room_id' },
    { title: 'Theater ID', dataIndex: 'theater_id', key: 'theater_id' },
    { title: 'Room Number', dataIndex: 'room_number', key: 'room_number' },
    {
      title: 'Actions',
      render: (text, room) => (
        <>
          <Button type="primary" onClick={() => openModal(room)} style={{ marginRight: 8 }}>
            Update
          </Button>
          <Button type="danger" onClick={() => confirmDeleteRoom(room.room_id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h2>Room Management</h2>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()} style={{ marginBottom: 16 }}>
        Add Room
      </Button>
      <Table
        columns={columns}
        dataSource={rooms}
        rowKey="room_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
      <Modal
        title={editingRoom ? 'Edit Room' : 'Add Room'}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleRoomSubmit}>
          <Form.Item label="Theater ID" name="theater_id" rules={[{ required: true, message: 'Please enter the theater ID' }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Room Number" name="room_number" rules={[{ required: true, message: 'Please enter the room number' }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingRoom ? 'Save Changes' : 'Add Room'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RoomManagement;
