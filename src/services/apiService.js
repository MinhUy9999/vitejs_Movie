// apiService.js

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080'; // Adjust this to match your backend URL

// Tạo một instance của axios
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Thêm interceptor để tự động thêm token vào header Authorization
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Token added to request:", config.headers.Authorization);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Function to call the register API
export async function register(email, name, password, phone, gender) {
  try {
    const response = await axiosInstance.post('/register', {
      email,
      name,
      password,
      phone,
      gender,
    });

    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      console.error('Registration error:', error.response.data.error);
      throw new Error(error.response.data.error);
    } else {
      console.error('Registration error:', error.message);
      throw new Error('Registration failed. Please try again.');
    }
  }
}

// Function to call the login API
export async function login(email, password) {
  try {
    const response = await axiosInstance.post('/login', {
      email,
      password,
    });
    console.log('Login response:', response.data);
    const { token, name, role, userID } = response.data;
    return { token, name, role, userID };
  } catch (error) {
    if (error.response && error.response.data) {
      console.error('Login error:', error.response.data.error);
      throw new Error(error.response.data.error);
    } else {
      console.error('Login error:', error.message);
      throw new Error('Login failed. Please try again.');
    }
  }
}

// Fetch all movies
export const fetchMovies = async () => {
  try {
    const response = await axiosInstance.get('/movie/');
    if (!response.data) {
      throw new Error('Failed to fetch movies');
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
};

// Fetch movie by ID
export const fetchMovieById = async (movieId) => {
  try {
    const response = await axiosInstance.get(`/movie/${movieId}`);
    if (!response.data || !response.data.movie) {
      throw new Error('Failed to fetch movie details');
    }
    return response.data.movie;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};

// Create a new movie
export const createMovie = async (movieData) => {
  try {
    const response = await axiosInstance.post('/movie/', movieData);
    if (!response.data) {
      throw new Error('Failed to create movie');
    }
    return response.data;
  } catch (error) {
    console.error('Error creating movie:', error);
    throw error;
  }
};

// Update a movie by ID
export const updateMovie = async (id, movieData) => {
  try {
    const response = await axiosInstance.put(`/movie/${id}`, movieData);
    if (!response.data) {
      throw new Error('Failed to update movie');
    }
    return response.data;
  } catch (error) {
    console.error('Error updating movie:', error);
    throw error;
  }
};

// Delete a movie by ID
export const deleteMovie = async (id) => {
  try {
    const response = await axiosInstance.delete(`/movie/${id}`);
    if (!response.data) {
      throw new Error('Failed to delete movie');
    }
    return response.data;
  } catch (error) {
    console.error('Error deleting movie:', error);
    throw error;
  }
};

// Fetch all theaters
export const fetchTheaters = async () => {
  try {
    const response = await axiosInstance.get('/theater/');
    if (!response.data) {
      throw new Error('Failed to fetch theaters');
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching theaters:', error);
    throw new Error('Could not fetch theaters. Please try again later.');
  }
};
// Create a new theater
// Create a new theater
export const createTheater = async (theaterData) => {
  try {
    const response = await axiosInstance.post('/theater/', theaterData);
    if (!response.data) {
      throw new Error('Failed to create theater');
    }
    console.log('Theater created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating theater:', error.response?.data || error.message);
    throw error.response?.data?.error || 'Failed to create theater. Please check your permissions and try again.';
  }
};

// Update a theater by ID
export const updateTheater = async (theaterID, theaterData) => {
  try {
    const response = await axiosInstance.put(`/theater/${theaterID}`, theaterData);
    if (!response.data) {
      throw new Error('Failed to update theater');
    }
    console.log('Theater updated:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating theater:', error.response?.data || error.message);
    throw error.response?.data?.error || 'Failed to update theater. Please check your permissions and try again.';
  }
};

// Delete a theater by ID
export const deleteTheater = async (theaterID) => {
  try {
    const response = await axiosInstance.delete(`/theater/${theaterID}`);
    if (!response.data) {
      throw new Error('Failed to delete theater');
    }
    console.log('Theater deleted:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error deleting theater:', error.response?.data || error.message);
    throw error.response?.data?.error || 'Failed to delete theater. Please check your permissions and try again.';
  }
};


// Fetch rooms by theater ID
// apiService.js
export const fetchRoomsByTheaterID = async (theaterID) => {
  try {
    const response = await axiosInstance.get(`/room/${theaterID}`);
    if (!response.data || !response.data.rooms) {
      throw new Error('Failed to fetch rooms');
    }
    return response.data.rooms; // Return only rooms array
  } catch (error) {
    console.error('Error fetching rooms:', error);
    throw new Error('Could not fetch rooms. Please try again later.');
  }
};
// apiService.js

// Fetch all rooms
export const fetchAllRooms = async () => {
  try {
    const response = await axiosInstance.get('/room/');
    return response.data.rooms; // Returns the list of rooms
  } catch (error) {
    console.error('Error fetching all rooms:', error);
    throw new Error('Could not fetch rooms.');
  }
};

// Create a new room
export const createRoom = async (roomData) => {
  try {
    const response = await axiosInstance.post('/room/', roomData);
    return response.data;
  } catch (error) {
    console.error('Error creating room:', error);
    throw error;
  }
};

// Update a room by ID
export const updateRoom = async (roomID, roomData) => {
  try {
    const response = await axiosInstance.put(`/room/${roomID}`, roomData);
    return response.data;
  } catch (error) {
    console.error('Error updating room:', error);
    throw error;
  }
};

// Delete a room by ID
export const deleteRoom = async (roomID) => {
  try {
    const response = await axiosInstance.delete(`/room/${roomID}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting room:', error);
    throw error;
  }
};



// Fetch screens by room ID
export const fetchScreensByRoomID = async (roomID) => {
  try {
    const response = await axiosInstance.get(`/screen/${roomID}`);
    if (!response.data || !response.data.screens) {
      throw new Error('Failed to fetch screens');
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching screens:', error);
    throw new Error('Could not fetch screens. Please try again later.');
  }
};
// Fetch all screens
export const fetchAllScreens = async () => {
  try {
    const response = await axiosInstance.get('/screen/');
    if (!response.data || !response.data.screens) {
      throw new Error('Failed to fetch screens');
    }
    return response.data.screens;
  } catch (error) {
    console.error('Error fetching all screens:', error);
    throw new Error('Could not fetch screens. Please try again later.');
  }
};

// Create a new screen
export const createScreen = async (screenData) => {
  try {
    const response = await axiosInstance.post('/screen/', screenData);
    if (!response.data) {
      throw new Error('Failed to create screen');
    }
    return response.data;
  } catch (error) {
    console.error('Error creating screen:', error);
    throw error;
  }
};

// Update a screen by ID
export const updateScreen = async (screenID, screenData) => {
  try {
    const response = await axiosInstance.put(`/screen/${screenID}`, screenData);
    if (!response.data) {
      throw new Error('Failed to update screen');
    }
    return response.data;
  } catch (error) {
    console.error('Error updating screen:', error);
    throw error;
  }
};

// Delete a screen by ID
export const deleteScreen = async (screenID) => {
  try {
    const response = await axiosInstance.delete(`/screen/${screenID}`);
    if (!response.data) {
      throw new Error('Failed to delete screen');
    }
    return response.data;
  } catch (error) {
    console.error('Error deleting screen:', error);
    throw error;
  }
};
// Fetch seats by screen ID
export const fetchSeatsByScreenID = async (screenID) => {
  try {
    const response = await axiosInstance.get(`/seats/${screenID}`);
    if (!response.data || !response.data.seats) {
      throw new Error('Failed to fetch seats');
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching seats:', error);
    throw new Error('Could not fetch seats. Please try again later.');
  }
};
export const fetchAllSeats = async () => {
  try {
    const response = await axiosInstance.get('/seats/');
    if (!response.data) {
      throw new Error('Failed to fetch seats');
    }
    return response.data.seats;
  } catch (error) {
    console.error('Error fetching seats:', error);
    throw new Error('Could not fetch seats. Please try again later.');
  }
};
// Create a new seat
export const createSeat = async (seatData) => {
  try {
    const response = await axiosInstance.post('/seats/', seatData);
    if (!response.data) {
      throw new Error('Failed to create seat');
    }
    return response.data;
  } catch (error) {
    console.error('Error creating seat:', error);
    throw error;
  }
};

// Update a seat by ID
export const updateSeat = async (seatID, seatData) => {
  try {
    const response = await axiosInstance.put(`/seats/${seatID}`, seatData);
    if (!response.data) {
      throw new Error('Failed to update seat');
    }
    return response.data;
  } catch (error) {
    console.error('Error updating seat:', error);
    throw error;
  }
};

// Delete a seat by ID
export const deleteSeat = async (seatID) => {
  try {
    const response = await axiosInstance.delete(`/seats/${seatID}`);
    if (!response.data) {
      throw new Error('Failed to delete seat');
    }
    return response.data;
  } catch (error) {
    console.error('Error deleting seat:', error);
    throw error;
  }
};
// Fetch schedules by screen ID
export const fetchSchedulesByScreenID = async (screenID) => {
  try {
    const response = await axiosInstance.get(`/schedule/screen/${screenID}`);
    if (!response.data || !response.data.schedules) {
      throw new Error('Failed to fetch schedules');
    }
    return response.data.schedules;
  } catch (error) {
    console.error('Error fetching schedules:', error);
    throw error;
  }
};

// Fetch schedule by ID
export const fetchScheduleByID = async (scheduleID) => {
  try {
    const response = await axiosInstance.get(`/schedule/${scheduleID}`);
    if (!response.data) {
      throw new Error('Failed to fetch schedule');
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching schedule:', error);
    throw error;
  }
};

export const fetchAllSchedules = async () => {
  try {
    const response = await axiosInstance.get('/schedule/');
    if (!response.data) {
      throw new Error('Failed to fetch schedules');
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching schedules:', error);
    throw new Error('Could not fetch schedules. Please try again later.');
  }
};
// Create a new schedule
export const createSchedule = async (scheduleData) => {
  try {
    const response = await axiosInstance.post('/schedule/', scheduleData);
    if (!response.data) {
      throw new Error('Failed to create schedule');
    }
    return response.data;
  } catch (error) {
    console.error('Error creating schedule:', error);
    throw error;
  }
};

// Update a schedule by ID
export const updateSchedule = async (scheduleID, scheduleData) => {
  try {
    const response = await axiosInstance.put(`/schedule/${scheduleID}`, scheduleData);
    if (!response.data) {
      throw new Error('Failed to update schedule');
    }
    return response.data;
  } catch (error) {
    console.error('Error updating schedule:', error);
    throw error;
  }
};

// Delete a schedule by ID
export const deleteSchedule = async (scheduleID) => {
  try {
    const response = await axiosInstance.delete(`/schedule/${scheduleID}`);
    if (!response.data) {
      throw new Error('Failed to delete schedule');
    }
    return response.data;
  } catch (error) {
    console.error('Error deleting schedule:', error);
    throw error;
  }
};
// Book tickets
export const bookTickets = async (scheduleID, seats) => {
  try {
    const response = await axiosInstance.post('/user/book', {
      schedule_id: scheduleID,
      seats: seats,
    });
    return response.data;
  } catch (error) {
    console.error('Error booking tickets:', error);
    throw error.response?.data || error;
  }
};
// Fetch bookings by user ID
export const fetchBookingsByUserID = async (userID) => {
  try {
    const response = await axiosInstance.get(`user/bookings/${userID}`);
    console.log('Response from /bookings/:userID:', response.data); // Log server response for debugging

    if (!response.data || !response.data.bookings) {
      throw new Error('Failed to fetch bookings');
    }

    return response.data.bookings;
  } catch (error) {
    console.error('Error fetching bookings:', error.response?.data || error.message);
    throw new Error('Could not fetch bookings. Please try again later.');
  }
};
// Fetch all bookings (Admin only)
export const fetchAllBookings = async () => {
  try {
    const response = await axiosInstance.get('/user/bookings');
    console.log('Fetched all bookings:', response.data); // Debug log
    if (!response.data || !response.data.bookings) {
      throw new Error('Failed to fetch bookings');
    }
    return response.data.bookings;
  } catch (error) {
    console.error('Error fetching all bookings:', error.response?.data || error.message);
    throw new Error('Could not fetch bookings. Please try again later.');
  }
};


// Hàm để xử lý thanh toán
export const processPayment = async (bookingId, amount) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(`http://localhost:8080/payment`, {
      booking_id: bookingId,
      amount,
      payment_status: "PENDING" // Có thể thay bằng "PAID" nếu muốn thanh toán ngay
  }, {
      headers: {
          Authorization: `Bearer ${token}`
      }
  });
  return response.data;
};


// Fetch all users (Admin only)
export const fetchAllUsers = async () => {
  try {
    const response = await axiosInstance.get('/admin/users');
    return response.data.users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Delete user by ID (Admin only)
export const deleteUserByID = async (userID) => {
  try {
    const response = await axiosInstance.delete(`/admin/delete/${userID}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

// Update user details by ID (Admin only)
export const updateUserByID = async (userID, userData) => {
  try {
    const response = await axiosInstance.put(`/admin/update/${userID}`, userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};




