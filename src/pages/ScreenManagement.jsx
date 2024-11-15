import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message } from 'antd';
import { fetchScreensByRoomID, fetchAllScreens, createScreen, updateScreen, deleteScreen } from '../services/apiService';
import { PlusOutlined } from '@ant-design/icons';

const { confirm } = Modal;

const ScreenManagement = ({ roomID = null }) => {
  const [screens, setScreens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingScreen, setEditingScreen] = useState(null);
  const [form] = Form.useForm();

  const fetchScreens = async () => {
    setLoading(true);
    try {
      let data;
      if (roomID) {
        data = await fetchScreensByRoomID(roomID);
      } else {
        data = await fetchAllScreens();
      }
      setScreens(data);
    } catch (error) {
      message.error('Error fetching screens');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScreens();
  }, [roomID]);

  const openModal = (screen = null) => {
    setEditingScreen(screen);
    form.resetFields();
    if (screen) {
      form.setFieldsValue(screen);
    }
    setIsModalVisible(true);
  };

  const handleScreenSubmit = async (values) => {
    const screenData = {
      room_id: parseInt(values.room_id, 10),
      screen_number: parseInt(values.screen_number, 10),
      opacity: parseFloat(values.opacity),
    };
    try {
      if (editingScreen) {
        await updateScreen(editingScreen.screen_id, screenData);
        message.success('Screen updated successfully');
      } else {
        await createScreen(screenData);
        message.success('Screen created successfully');
      }
      fetchScreens();
      setIsModalVisible(false);
    } catch (error) {
      message.error('Error saving screen');
    }
  };

  const confirmDeleteScreen = (screenID) => {
    confirm({
      title: 'Are you sure you want to delete this screen?',
      onOk: async () => {
        try {
          await deleteScreen(screenID);
          message.success('Screen deleted successfully');
          fetchScreens();
        } catch (error) {
          message.error('Error deleting screen');
        }
      },
    });
  };

  const columns = [
    { title: 'Screen ID', dataIndex: 'screen_id', key: 'screen_id' },
    { title: 'Room ID', dataIndex: 'room_id', key: 'room_id' },
    { title: 'Screen Number', dataIndex: 'screen_number', key: 'screen_number' },
    { title: 'Opacity', dataIndex: 'opacity', key: 'opacity' },
    {
      title: 'Actions',
      render: (text, screen) => (
        <>
          <Button onClick={() => openModal(screen)} style={{ marginRight: 8 }}>Edit</Button>
          <Button type="danger" onClick={() => confirmDeleteScreen(screen.screen_id)}>Delete</Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h2>Screen Management</h2>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()} style={{ marginBottom: 16 }}>
        Add Screen
      </Button>
      <Table
        columns={columns}
        dataSource={screens}
        rowKey="screen_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
      <Modal
        title={editingScreen ? 'Edit Screen' : 'Add Screen'}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleScreenSubmit}>
          <Form.Item label="Room ID" name="room_id" rules={[{ required: true, message: 'Please enter the room ID' }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Screen Number" name="screen_number" rules={[{ required: true, message: 'Please enter the screen number' }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Opacity" name="opacity" rules={[{ required: true, message: 'Please enter the opacity' }]}>
            <Input type="number" step="0.1" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">{editingScreen ? 'Save Changes' : 'Add Screen'}</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ScreenManagement;
