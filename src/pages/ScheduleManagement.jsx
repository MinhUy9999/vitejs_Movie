import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, InputNumber, DatePicker, Input, message } from 'antd';
import dayjs from 'dayjs';
import { fetchAllSchedules, createSchedule, updateSchedule, deleteSchedule } from '../services/apiService';
import { PlusOutlined } from '@ant-design/icons';

const { confirm } = Modal;

const ScheduleManagement = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [form] = Form.useForm();

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const data = await fetchAllSchedules();
      setSchedules(data);
    } catch (error) {
      message.error('Error fetching schedules');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const openModal = (schedule = null) => {
    setEditingSchedule(schedule);
    form.resetFields();
    if (schedule) {
      form.setFieldsValue({
        ...schedule,
        showTime: schedule.showTime ? dayjs(schedule.showTime) : null, // Convert to dayjs for DatePicker
      });
    }
    setIsModalVisible(true);
  };

  const handleScheduleSubmit = async (values) => {
    const scheduleData = {
      movieID: parseInt(values.movieID, 10),
      screenID: parseInt(values.screenID, 10),
      showTime: values.showTime.format("YYYY-MM-DD HH:mm:ss"),
      availableSeats: parseInt(values.availableSeats, 10),
      fare: parseFloat(values.fare),
    };
    try {
      if (editingSchedule) {
        await updateSchedule(editingSchedule.scheduleID, scheduleData);
        message.success('Schedule updated successfully');
      } else {
        await createSchedule(scheduleData);
        message.success('Schedule created successfully');
      }
      await fetchSchedules(); // Fetch updated list to reflect changes
      setIsModalVisible(false);
    } catch (error) {
      message.error('Error saving schedule');
    }
  };
  

  const confirmDeleteSchedule = (scheduleID) => {
    confirm({
      title: 'Are you sure you want to delete this schedule?',
      onOk: async () => {
        try {
          await deleteSchedule(scheduleID);
          message.success('Schedule deleted successfully');
          fetchSchedules();
        } catch (error) {
          message.error('Error deleting schedule');
        }
      },
    });
  };

  const columns = [
    { title: 'Schedule ID', dataIndex: 'scheduleID', key: 'scheduleID' },
    { title: 'Movie ID', dataIndex: 'movieID', key: 'movieID' },
    { title: 'Screen ID', dataIndex: 'screenID', key: 'screenID' },
    { title: 'Show Time', dataIndex: 'showTime', key: 'showTime' },
    { title: 'Available Seats', dataIndex: 'availableSeats', key: 'availableSeats' },
    { title: 'Fare', dataIndex: 'fare', key: 'fare' },
    {
      title: 'Actions',
      render: (text, schedule) => (
        <>
          <Button onClick={() => openModal(schedule)} style={{ marginRight: 8 }}>Edit</Button>
          <Button type="danger" onClick={() => confirmDeleteSchedule(schedule.scheduleID)}>Delete</Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h2>Schedule Management</h2>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()} style={{ marginBottom: 16 }}>
        Add Schedule
      </Button>
      <Table
        columns={columns}
        dataSource={schedules}
        rowKey="scheduleID"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
      <Modal
        title={editingSchedule ? 'Edit Schedule' : 'Add Schedule'}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleScheduleSubmit}>
          <Form.Item label="Movie ID" name="movieID" rules={[{ required: true, message: 'Please enter the movie ID' }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Screen ID" name="screenID" rules={[{ required: true, message: 'Please enter the screen ID' }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Show Time" name="showTime" rules={[{ required: true, message: 'Please select the show time' }]}>
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
          </Form.Item>
          <Form.Item label="Available Seats" name="availableSeats" rules={[{ required: true, message: 'Please enter the available seats' }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Fare" name="fare" rules={[{ required: true, message: 'Please enter the fare' }]}>
            <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingSchedule ? 'Save Changes' : 'Add Schedule'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ScheduleManagement;
