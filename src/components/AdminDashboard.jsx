import React from 'react';
import { Layout, Menu } from 'antd';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { DashboardOutlined, VideoCameraOutlined, CalendarOutlined, UserOutlined, ShoppingCartOutlined } from '@ant-design/icons';

const { Sider, Content } = Layout;
const { SubMenu } = Menu;

function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={250} theme="dark">
        <div className="logo" style={{ padding: '20px', color: 'white', textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}>
          ADMIN
        </div>
        <Menu theme="dark" mode="inline" defaultOpenKeys={['sub1', 'sub2']}>
          <Menu.Item key="1" icon={<DashboardOutlined />}>
            <Link to="/admin/dashboard">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<VideoCameraOutlined/>}>
            <Link to="/admin/movie">Quản lý phim</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<VideoCameraOutlined/>}>
            <Link to="/admin/theater">Quản lý rạp</Link>
          </Menu.Item>
          <Menu.Item key="4" icon={<VideoCameraOutlined/>}>
            <Link to="/admin/room">Quản lý phòng</Link>
          </Menu.Item>
          <Menu.Item key="5" icon={<VideoCameraOutlined/>}>
            <Link to="/admin/screen">Quản lý màn hình</Link>
          </Menu.Item>
          <Menu.Item key="6" icon={<CalendarOutlined/>}>
            <Link to="/admin/schedule">Quản lý xuất chiếu</Link>
          </Menu.Item>
          <Menu.Item key="7" icon={<ShoppingCartOutlined />}>
            <Link to="/admin/seat">Quản lý ghế</Link>
          </Menu.Item>
         

          <Menu.Item key="8" icon={<ShoppingCartOutlined />}>
            <Link to="/admin/booking">Quản lý đặt vé</Link>
          </Menu.Item>

          <Menu.Item key="9" icon={<UserOutlined />}>
            <Link to="/admin/users">Quản lý user</Link>
          </Menu.Item>

          <Menu.Item key="10" onClick={handleLogout}>
            <span>Logout</span>
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout>
        <Content style={{ padding: '24px', minHeight: '100vh' }}>
          {/* Render nested routes here */}
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default AdminDashboard;
