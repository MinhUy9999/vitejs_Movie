import React, { useEffect, useState } from 'react';
import { fetchTheaters, createTheater, updateTheater, deleteTheater } from './../services/apiService';
import { Table, Button, Modal, Form, Input, message, Pagination } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { confirm } = Modal;

const TheaterManagement = () => {
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTheater, setEditingTheater] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [form] = Form.useForm();

  // Fetch all theaters
  const fetchAllTheaters = async () => {
    setLoading(true);
    try {
      const response = await fetchTheaters();
      console.log("Fetched theaters data:", response);
      setTheaters(Array.isArray(response.theaters) ? response.theaters : []);
    } catch (error) {
      message.error('Error fetching theaters');
    } finally {
      setLoading(false);
    }
  };

  // Show confirmation modal for deleting a theater
  const showDeleteConfirm = (theaterID) => {
    confirm({
      title: 'Are you sure you want to delete this theater?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleDeleteTheater(theaterID);
      },
    });
  };

  // Delete theater
  const handleDeleteTheater = async (theaterID) => {
    try {
      await deleteTheater(theaterID);
      message.success('Theater deleted successfully');
      setTheaters(theaters.filter((theater) => theater.theater_id !== theaterID));
      
    } catch (error) {
      message.error(error.response?.data?.error || 'Error deleting theater');
    }
  };

  // Open modal to add or edit a theater
  const openEditModal = (theater = null) => {
    setEditingTheater(theater);
    if (theater) {
      form.setFieldsValue({
        name: theater.name,
        location: theater.location,
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  // Handle theater submission
  const handleTheaterSubmit = async (values) => {
    try {
      if (editingTheater) {
        // Update existing theater
        await updateTheater(editingTheater.theater_id, values);
        message.success('Theater updated successfully');
      } else {
        // Create new theater
        await createTheater(values);
        message.success('Theater created successfully');
      }
      fetchAllTheaters();
      setIsModalVisible(false);
    } catch (error) {
      message.error(error.response?.data?.error || 'Error saving theater');
    }
  };

  // Handle page change
  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  useEffect(() => {
    fetchAllTheaters();
  }, []);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'theater_id',
      key: 'theater_id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, theater) => (
        <span>
          <Button type="primary" onClick={() => openEditModal(theater)} style={{ marginRight: 8 }}>
            Update
          </Button>
          <Button type="danger" onClick={() => showDeleteConfirm(theater.theater_id)}>
            Delete
          </Button>
        </span>
      ),
    },
  ];

  return (
    <div>
      <h2>Quản lí rạp</h2>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => openEditModal(null)} style={{ marginBottom: 16 }}>
        Add Theater
      </Button>
      <Table
        columns={columns}
        dataSource={theaters.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
        rowKey="theater_id"
        loading={loading}
        pagination={false}
      />
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={theaters.length}
        onChange={handlePageChange}
        showSizeChanger
        pageSizeOptions={[5, 10, 20, 50]}
        onShowSizeChange={handlePageChange}
      />

      {/* Theater Form Modal */}
      <Modal
        title={editingTheater ? 'Update Theater' : 'Add Theater'}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleTheaterSubmit}>
          <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input the theater name!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Location" name="location" rules={[{ required: true, message: 'Please input the location!' }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingTheater ? 'Save Changes' : 'Create Theater'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TheaterManagement;
