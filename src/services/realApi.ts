
import { User, Classroom, Booking, BookingStats, UserRole } from '../types';
import apiClient from './apiClient';

// Authentication API
export const authApi = {
  login: async (email: string, password: string): Promise<User> => {
    const response = await apiClient.post('/auth/login', { email, password });
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    return user;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
    localStorage.removeItem('token');
  },

  getCurrentUser: async (): Promise<User | null> => {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data;
    } catch (error) {
      return null;
    }
  },

  register: async (name: string, email: string, password: string, role: UserRole): Promise<User> => {
    const response = await apiClient.post('/auth/register', { name, email, password, role });
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    return user;
  }
};

// Users API
export const usersApi = {
  getUsers: async (): Promise<User[]> => {
    const response = await apiClient.get('/users');
    return response.data;
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  updateUserRole: async (id: string, role: UserRole): Promise<User> => {
    const response = await apiClient.put(`/users/${id}/role`, { role });
    return response.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  }
};

// Classrooms API
export const classroomsApi = {
  getClassrooms: async (): Promise<Classroom[]> => {
    const response = await apiClient.get('/classrooms');
    return response.data;
  },

  getClassroomById: async (id: string): Promise<Classroom> => {
    const response = await apiClient.get(`/classrooms/${id}`);
    return response.data;
  },

  addClassroom: async (classroom: Omit<Classroom, 'id'>): Promise<Classroom> => {
    const response = await apiClient.post('/classrooms', classroom);
    return response.data;
  },

  updateClassroom: async (id: string, updates: Partial<Classroom>): Promise<Classroom> => {
    const response = await apiClient.put(`/classrooms/${id}`, updates);
    return response.data;
  },

  deleteClassroom: async (id: string): Promise<void> => {
    await apiClient.delete(`/classrooms/${id}`);
  }
};

// Bookings API
export const bookingsApi = {
  getBookings: async (): Promise<Booking[]> => {
    const response = await apiClient.get('/bookings');
    return response.data;
  },

  getUserBookings: async (userId: string): Promise<Booking[]> => {
    const response = await apiClient.get(`/bookings/user/${userId}`);
    return response.data;
  },

  getClassroomBookings: async (classroomId: string): Promise<Booking[]> => {
    const response = await apiClient.get(`/bookings/classroom/${classroomId}`);
    return response.data;
  },

  createBooking: async (booking: Omit<Booking, 'id' | 'status'>): Promise<Booking> => {
    const response = await apiClient.post('/bookings', booking);
    return response.data;
  },

  updateBookingStatus: async (id: string, status: Booking['status']): Promise<Booking> => {
    const response = await apiClient.put(`/bookings/${id}/status`, { status });
    return response.data;
  },

  cancelBooking: async (id: string): Promise<Booking> => {
    const response = await apiClient.put(`/bookings/${id}/cancel`);
    return response.data;
  },

  getBookingStats: async (): Promise<BookingStats> => {
    const response = await apiClient.get('/bookings/stats');
    return response.data;
  },

  getBookingsForDate: async (date: Date): Promise<Booking[]> => {
    const formattedDate = date.toISOString().split('T')[0];
    const response = await apiClient.get(`/bookings/date/${formattedDate}`);
    return response.data;
  },

  checkAvailability: async (
    classroomId: string, 
    date: string, 
    startTime: string, 
    endTime: string
  ): Promise<boolean> => {
    const response = await apiClient.post('/bookings/check-availability', {
      classroomId,
      date,
      startTime,
      endTime
    });
    return response.data.available;
  }
};
