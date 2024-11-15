import React, { useEffect, useState } from 'react';
import { deleteUserByID, fetchAllUsers, updateUserByID } from './../services/apiService';
import { Table, Button, Modal, Form, Input, message, Pagination } from 'antd';


const { confirm } = Modal;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form] = Form.useForm();

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const usersData = await fetchAllUsers();
      setUsers(usersData);
    } catch (error) {
      setError('Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  // Show confirmation modal for deleting user
  const showDeleteConfirm = (userID) => {
    confirm({
      title: 'Are you sure you want to delete this user?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteUser(userID);
      },
      onCancel() {
        console.log('Cancel deletion');
      },
    });
  };

  // Delete user by ID
  const deleteUser = async (userID) => {
    try {
      await deleteUserByID(userID);
      message.success('User deleted successfully');
      setUsers(users.filter((user) => user.id !== userID));
    } catch (error) {
      setError('Error deleting user');
    }
  };

  // Open modal and set user for editing
  const openEditModal = (user) => {
    setEditingUser(user);
    form.setFieldsValue({
      email: user.email,
      name: user.name,
      phone: user.phone,
      gender: user.gender,
      role: user.role,
    });
    setIsModalVisible(true);
  };

  // Handle modal submit
  const handleUpdate = async (values) => {
    try {
      await updateUserByID(editingUser.id, values);
      message.success('User updated successfully');
      fetchUsers();
      setIsModalVisible(false);
    } catch (error) {
      setError('Error updating user');
    }
  };

  // Handle page change
  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, user) => (
        <span>
          <Button type="primary" onClick={() => openEditModal(user)} style={{ marginRight: 8 }}>
            Update
          </Button>
          <Button type="danger" onClick={() => showDeleteConfirm(user.id)}>
            Delete
          </Button>
        </span>
      ),
    },
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h2>Quản lý người dùng</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Table
        columns={columns}
        dataSource={users.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
        rowKey="id"
        loading={loading}
        pagination={false}
      />
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={users.length}
        onChange={handlePageChange}
        showSizeChanger
        pageSizeOptions={[5, 10, 20, 50]}
        onShowSizeChange={handlePageChange}
      />

      {/* Update Modal */}
      <Modal
        title="Update User"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdate}
        >
          <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please input the email!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input the name!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Phone" name="phone" rules={[{ required: true, message: 'Please input the phone number!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Gender" name="gender" rules={[{ required: true, message: 'Please select gender!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Role" name="role" rules={[{ required: true, message: 'Please select role!' }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
