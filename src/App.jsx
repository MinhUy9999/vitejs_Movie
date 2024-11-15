// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginComponent from './components/LoginComponent';
import RegisterComponent from './components/RegisterComponent';
import HomePage from './components/HomePage';
import PrivateRoute from './components/PrivateRoute';
import AdminDashboard from './components/AdminDashboard';
import MovieDetail from './components/MovieDetail';
import TheaterList from './components/TheaterList';
import SeatPage from './components/SeatPage';
import PaymentPage from './components/PaymentPage';
import UserManagement from './pages/UserManagement';
import MovieManagement from './pages/MovieManagement';
import TheaterManagement from './pages/TheaterManagement';
import RoomManagement from './pages/RoomManagement';
import ScreenManagement from './pages/ScreenManagement';
import ScheduleManagement from './pages/ScheduleManagement';
import BookingManagement from './pages/BookingManagement';
import SeatManagement from './pages/SeatManagement';




function App() {
  const isLoggedIn = Boolean(localStorage.getItem('authToken')); // Kiểm tra người dùng đã đăng nhập chưa

  return (
    <Router>
      <div className='w-full flex items-center justify-center'>
        <Routes>
          {/* Nếu người dùng chưa đăng nhập, vẫn hiển thị HomePage */}
          <Route
            path="/home"
            element={<HomePage isLoggedIn={isLoggedIn} />}
          />
          
          {/* Khi nhấn vào icon person, sẽ chuyển đến trang login */}
          <Route path="/login" element={<LoginComponent />} />
          
          <Route path="/register" element={<RegisterComponent />} />
          
          <Route
            path="/admin"
            element={
              <PrivateRoute requiredRole="admin">
                <AdminDashboard />
              </PrivateRoute>
            }
          >
            {/* Nested route for User Management inside AdminDashboard */}
            <Route path="users" element={<UserManagement />} />
            <Route path="movie" element={<MovieManagement />} />
            <Route path="theater" element={<TheaterManagement />} />
            <Route path="room" element={<RoomManagement />} />
            <Route path="screen" element={<ScreenManagement />} />
            <Route path="schedule" element={<ScheduleManagement />} />
            <Route path="schedule" element={<ScheduleManagement />} />
            <Route path="seat" element={<SeatManagement />} />
            <Route path="booking" element={<BookingManagement />} />
          </Route>
    
      

          <Route path="/movies/:movieId" element={<MovieDetail />} />
          <Route path="/theaters/:movieId" element={<TheaterList />} />
          <Route path="/seats/:screenId/:scheduleId" element={<SeatPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          {/* Đặt route mặc định về trang chủ */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
