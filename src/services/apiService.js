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

// Fetch rooms by theater ID
export const fetchRoomsByTheaterID = async (theaterID) => {
  try {
    const response = await axiosInstance.get(`/room/${theaterID}`);
    if (!response.data || !response.data.rooms) {
      throw new Error('Failed to fetch rooms');
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching rooms:', error);
    throw new Error('Could not fetch rooms. Please try again later.');
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
// Lấy danh sách vé theo booking ID
export const getTicketsByBookingID = async (bookingID) => {
  try {
      console.log("Fetching tickets for booking ID:", bookingID);
      const response = await axiosInstance.get(`/tickets/booking/${bookingID}`);
      console.log("Tickets fetched successfully:", response.data);
      return response.data.tickets;
  } catch (error) {
      console.error("Error fetching tickets:", error.response ? error.response.data : error.message);
      throw error;
  }
};

// Tạo vé mới
export const createTicket = async (ticketData) => {
  try {
      console.log("Creating a new ticket with data:", ticketData);
      const response = await axiosInstance.post(`/tickets`, ticketData);
      console.log("Ticket created successfully:", response.data);
      return response.data;
  } catch (error) {
      console.error("Error creating ticket:", error.response ? error.response.data : error.message);
      throw error;
  }
};

