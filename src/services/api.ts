
import { User, Classroom, Booking, CalendarEvent, BookingStats, UserRole } from '../types';
import { mockUsers, mockClassrooms, mockBookings } from './mockData';
import { format, parseISO, isSameDay } from 'date-fns';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock authentication state
let currentUser: User | null = mockUsers[0]; // Default to admin for demo

// Authentication API
export const authApi = {
  login: async (email: string, password: string): Promise<User> => {
    await delay(500);
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    currentUser = user;
    return user;
  },
  logout: async (): Promise<void> => {
    await delay(300);
    currentUser = null;
  },
  getCurrentUser: async (): Promise<User | null> => {
    await delay(300);
    return currentUser;
  },
  register: async (name: string, email: string, password: string, role: UserRole): Promise<User> => {
    await delay(500);
    const newUser: User = {
      id: (mockUsers.length + 1).toString(),
      name,
      email,
      role,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`,
    };
    // In a real app, we would add this to the database
    currentUser = newUser;
    return newUser;
  }
};

// Users API
export const usersApi = {
  getUsers: async (): Promise<User[]> => {
    await delay(500);
    return [...mockUsers];
  },
  getUserById: async (id: string): Promise<User> => {
    await delay(300);
    const user = mockUsers.find(u => u.id === id);
    if (!user) {
      throw new Error('User not found');
    }
    return { ...user };
  },
  updateUserRole: async (id: string, role: UserRole): Promise<User> => {
    await delay(500);
    const index = mockUsers.findIndex(u => u.id === id);
    if (index === -1) {
      throw new Error('User not found');
    }
    // In a real app, we would update the database
    return { ...mockUsers[index], role };
  },
  deleteUser: async (id: string): Promise<void> => {
    await delay(500);
    // In a real app, we would delete from the database
  }
};

// Classrooms API
export const classroomsApi = {
  getClassrooms: async (): Promise<Classroom[]> => {
    await delay(500);
    return [...mockClassrooms];
  },
  getClassroomById: async (id: string): Promise<Classroom> => {
    await delay(300);
    const classroom = mockClassrooms.find(c => c.id === id);
    if (!classroom) {
      throw new Error('Classroom not found');
    }
    return { ...classroom };
  },
  addClassroom: async (classroom: Omit<Classroom, 'id'>): Promise<Classroom> => {
    await delay(500);
    const newClassroom: Classroom = {
      id: (mockClassrooms.length + 1).toString(),
      ...classroom
    };
    // In a real app, we would add this to the database
    return newClassroom;
  },
  updateClassroom: async (id: string, updates: Partial<Classroom>): Promise<Classroom> => {
    await delay(500);
    const index = mockClassrooms.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Classroom not found');
    }
    // In a real app, we would update the database
    const updatedClassroom = { ...mockClassrooms[index], ...updates };
    return updatedClassroom;
  },
  deleteClassroom: async (id: string): Promise<void> => {
    await delay(500);
    // In a real app, we would delete from the database
  }
};

// Bookings API
export const bookingsApi = {
  getBookings: async (): Promise<Booking[]> => {
    await delay(500);
    return [...mockBookings];
  },
  getBookingById: async (id: string): Promise<Booking> => {
    await delay(300);
    const booking = mockBookings.find(b => b.id === id);
    if (!booking) {
      throw new Error('Booking not found');
    }
    return { ...booking };
  },
  getUserBookings: async (userId: string): Promise<Booking[]> => {
    await delay(500);
    return mockBookings.filter(b => b.userId === userId);
  },
  getClassroomBookings: async (classroomId: string): Promise<Booking[]> => {
    await delay(500);
    return mockBookings.filter(b => b.classroomId === classroomId);
  },
  createBooking: async (booking: Omit<Booking, 'id' | 'status'>): Promise<Booking> => {
    await delay(800);
    
    // Check for conflicts
    const conflicts = mockBookings.filter(
      b => b.classroomId === booking.classroomId && 
           b.date === booking.date && 
           ((booking.startTime >= b.startTime && booking.startTime < b.endTime) || 
            (booking.endTime > b.startTime && booking.endTime <= b.endTime) ||
            (booking.startTime <= b.startTime && booking.endTime >= b.endTime))
    );
    
    if (conflicts.length > 0) {
      throw new Error('This classroom is already booked for this time');
    }
    
    const newBooking: Booking = {
      id: (mockBookings.length + 1).toString(),
      ...booking,
      status: 'pending'
    };
    
    // In a real app, we would add this to the database
    return newBooking;
  },
  updateBookingStatus: async (id: string, status: Booking['status']): Promise<Booking> => {
    await delay(500);
    const index = mockBookings.findIndex(b => b.id === id);
    if (index === -1) {
      throw new Error('Booking not found');
    }
    // In a real app, we would update the database
    const updatedBooking = { ...mockBookings[index], status };
    return updatedBooking;
  },
  cancelBooking: async (id: string): Promise<Booking> => {
    await delay(500);
    return bookingsApi.updateBookingStatus(id, 'cancelled');
  },
  getCalendarEvents: async (startDate?: Date, endDate?: Date): Promise<CalendarEvent[]> => {
    await delay(500);
    
    return mockBookings.map(booking => {
      const start = `${booking.date}T${booking.startTime}`;
      const end = `${booking.date}T${booking.endTime}`;
      
      return {
        id: booking.id,
        title: `${booking.classroomName}: ${booking.purpose}`,
        start,
        end,
        classroomId: booking.classroomId,
        booking,
      };
    }).filter(event => {
      if (!startDate || !endDate) return true;
      
      const eventDate = parseISO(event.start);
      return eventDate >= startDate && eventDate <= endDate;
    });
  },
  getBookingStats: async (): Promise<BookingStats> => {
    await delay(700);
    
    const total = mockBookings.length;
    const confirmed = mockBookings.filter(b => b.status === 'confirmed').length;
    const pending = mockBookings.filter(b => b.status === 'pending').length;
    const rejected = mockBookings.filter(b => b.status === 'rejected').length;
    const cancelled = mockBookings.filter(b => b.status === 'cancelled').length;
    
    return {
      total,
      confirmed,
      pending,
      rejected,
      cancelled
    };
  },
  getBookingsForDate: async (date: Date): Promise<Booking[]> => {
    await delay(500);
    
    const formattedDate = format(date, 'yyyy-MM-dd');
    return mockBookings.filter(b => b.date === formattedDate);
  },
  checkAvailability: async (classroomId: string, date: string, startTime: string, endTime: string): Promise<boolean> => {
    await delay(300);
    
    const conflicts = mockBookings.filter(
      b => b.classroomId === classroomId && 
           b.date === date && 
           ((startTime >= b.startTime && startTime < b.endTime) || 
            (endTime > b.startTime && endTime <= b.endTime) ||
            (startTime <= b.startTime && endTime >= b.endTime)) &&
           b.status !== 'cancelled' && b.status !== 'rejected'
    );
    
    return conflicts.length === 0;
  }
};
