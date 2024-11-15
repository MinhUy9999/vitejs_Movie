// components/SeatPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchSeatsByScreenID, bookTickets, fetchScheduleByID, fetchBookingsByUserID} from '../services/apiService';

const SeatPage = () => {
  const { screenId, scheduleId } = useParams();
  const [seats, setSeats] = useState([]);
  const [loadingSeats, setLoadingSeats] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [schedule, setSchedule] = useState(null);
  const [loadingSchedule, setLoadingSchedule] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadSeatsAndSchedule = async () => {
      try {
        const seatsData = await fetchSeatsByScreenID(screenId);
        setSeats(seatsData.seats);

        const scheduleData = await fetchScheduleByID(scheduleId);
        setSchedule(scheduleData);
      } catch (err) {
        setError('Cannot load data.');
      } finally {
        setLoadingSeats(false);
        setLoadingSchedule(false);
      }
    };

    loadSeatsAndSchedule();
  }, [screenId, scheduleId]);

  const handleSeatChange = (seatId) => {
    setSelectedSeats((prevSelectedSeats) => 
      prevSelectedSeats.includes(seatId)
        ? prevSelectedSeats.filter(id => id !== seatId)
        : [...prevSelectedSeats, seatId]
    );
  };

  const handleBooking = async () => {
    try {
      // Book the selected seats
      const booking = await bookTickets(parseInt(scheduleId), selectedSeats);
  
      if (!booking || !booking.booking_id) {
        throw new Error("Booking failed or booking ID is missing.");
      }
  
      alert('Đặt vé thành công!');
      console.log("Booking successful. Booking ID:", booking.booking_id);
  
      // Save bookingID to localStorage for retrieval on the payment page
      localStorage.setItem('bookingID', booking.booking_id);
  
      // Fetch all bookings for the current user by user ID (if needed for logging or further processing)
      const userID = localStorage.getItem('userID'); // Assuming userID is stored in localStorage after login
      const userBookings = await fetchBookingsByUserID(userID);
      console.log("User's Bookings:", userBookings); // Logs all bookings for this user
  
      // Navigate to the payment page
      navigate('/payment');
    } catch (error) {
      alert('Booking failed: ' + (error.response?.data?.error || error.message));
      console.error('Booking error:', error);
    }
  };
  
  
  

  if (loadingSeats || loadingSchedule) {
    return <div>Loading data...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const fare = schedule ? schedule.fare : 0;
  const totalPrice = selectedSeats.length * fare;

  return (
    <div className="flex flex-col items-center p-4 bg-gray-800 text-white min-h-screen">
      <h3 className="text-3xl font-bold mb-4">Chọn ghế của bạn</h3>
      <p className="text-lg mb-4">Giá vé mỗi ghế: {fare.toLocaleString('vi-VN')} VND</p>

      {/* Screen area */}
      <div className="w-full flex justify-center mt-6 mb-4">
        <div className="w-3/4 bg-gray-700 text-center py-2 rounded-lg text-white font-bold">Màn hình</div>
      </div>

      {/* Seat grid */}
      <div className="space-y-2 max-w-4xl mx-auto">
        {Array.from({ length: 18 }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex justify-center space-x-2">
            {seats
              .filter((_, index) => Math.floor(index / 14) === rowIndex)
              .map(seat => (
                <button
                  key={seat.seat_id}
                  className={`w-10 h-10 flex items-center justify-center rounded-md text-sm font-medium ${
                    seat.is_booked ? 'bg-gray-500 cursor-not-allowed' :
                    selectedSeats.includes(seat.seat_id) ? 'bg-yellow-400 text-black' :
                    'bg-white text-gray-800'
                  }`}
                  onClick={() => handleSeatChange(seat.seat_id)}
                  disabled={seat.is_booked}
                >
                  {seat.seat_number}
                </button>
              ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex justify-center space-x-6 mt-6">
        <div className="flex items-center space-x-2">
          <span className="w-6 h-6 bg-white border rounded-md"></span>
          <span>Ghế Thường</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-6 h-6 bg-yellow-400 border rounded-md"></span>
          <span>Ghế Chọn</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-6 h-6 bg-gray-500 border rounded-md"></span>
          <span>Ghế Đã Đặt</span>
        </div>
      </div>

      {/* Booking summary */}
      {selectedSeats.length > 0 && (
        <div className="mt-6 text-center">
          <h4 className="text-xl font-semibold">Bạn đã chọn {selectedSeats.length} ghế</h4>
          <h4 className="text-xl font-semibold">Tổng cộng: {totalPrice.toLocaleString('vi-VN')} VND</h4>
          <button
            onClick={handleBooking}
            className="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg"
          >
            Đặt vé
          </button>
        </div>
      )}
    </div>
  );
};

export default SeatPage;
