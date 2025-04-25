
import { User, Classroom, Booking, UserRole } from '../types';
import { format, addDays, addHours, subDays } from 'date-fns';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'admin',
    avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'faculty',
    avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=8B5CF6&color=fff',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    role: 'student',
    avatar: 'https://ui-avatars.com/api/?name=Bob+Johnson&background=22C55E&color=fff',
  },
];

// Mock Classrooms
export const mockClassrooms: Classroom[] = [
  {
    id: '1',
    name: 'Computer Lab A',
    capacity: 30,
    building: 'Science Building',
    floor: 2,
    roomNumber: '201',
    features: ['Computers', 'Projector', 'Whiteboard'],
    available: true,
  },
  {
    id: '2',
    name: 'Lecture Hall B',
    capacity: 100,
    building: 'Main Building',
    floor: 1,
    roomNumber: '101',
    features: ['Projector', 'Whiteboard', 'Microphone'],
    available: true,
  },
  {
    id: '3',
    name: 'Study Room C',
    capacity: 10,
    building: 'Library',
    floor: 3,
    roomNumber: '305',
    features: ['Whiteboard', 'TV Screen'],
    available: true,
  },
  {
    id: '4',
    name: 'Conference Room D',
    capacity: 20,
    building: 'Admin Building',
    floor: 4,
    roomNumber: '401',
    features: ['Projector', 'Video Conference System', 'Whiteboard'],
    available: true,
  },
  {
    id: '5',
    name: 'Lab Room E',
    capacity: 25,
    building: 'Science Building',
    floor: 3,
    roomNumber: '320',
    features: ['Lab Equipment', 'Computers', 'Whiteboard'],
    available: true,
  },
];

// Generate dates for bookings
const today = new Date();
const formatDate = (date: Date) => format(date, 'yyyy-MM-dd');
const formatTime = (date: Date) => format(date, 'HH:mm');

// Mock Bookings
export const mockBookings: Booking[] = [
  {
    id: '1',
    userId: '2',
    userName: 'Jane Smith',
    classroomId: '1',
    classroomName: 'Computer Lab A',
    date: formatDate(today),
    startTime: formatTime(addHours(today, 9)),
    endTime: formatTime(addHours(today, 11)),
    purpose: 'Programming Class',
    status: 'confirmed',
  },
  {
    id: '2',
    userId: '3',
    userName: 'Bob Johnson',
    classroomId: '2',
    classroomName: 'Lecture Hall B',
    date: formatDate(addDays(today, 1)),
    startTime: '13:00',
    endTime: '15:00',
    purpose: 'Study Group',
    status: 'confirmed',
  },
  {
    id: '3',
    userId: '2',
    userName: 'Jane Smith',
    classroomId: '3',
    classroomName: 'Study Room C',
    date: formatDate(addDays(today, 2)),
    startTime: '10:00',
    endTime: '12:00',
    purpose: 'Department Meeting',
    status: 'pending',
  },
  {
    id: '4',
    userId: '3',
    userName: 'Bob Johnson',
    classroomId: '4',
    classroomName: 'Conference Room D',
    date: formatDate(subDays(today, 1)),
    startTime: '15:00',
    endTime: '17:00',
    purpose: 'Project Presentation',
    status: 'confirmed',
  },
  {
    id: '5',
    userId: '2',
    userName: 'Jane Smith',
    classroomId: '5',
    classroomName: 'Lab Room E',
    date: formatDate(today),
    startTime: formatTime(addHours(today, 14)),
    endTime: formatTime(addHours(today, 16)),
    purpose: 'Chemistry Lab',
    status: 'confirmed',
  },
];

// Add more bookings for the current week
for (let i = 6; i < 20; i++) {
  const randomDay = Math.floor(Math.random() * 7) - 3;
  const randomHour = Math.floor(Math.random() * 8) + 8; // 8 AM to 4 PM
  const randomDuration = Math.floor(Math.random() * 2) + 1; // 1 or 2 hours
  const randomUserId = Math.random() > 0.5 ? '2' : '3';
  const randomUser = mockUsers.find(user => user.id === randomUserId)!;
  const randomClassroomId = String(Math.floor(Math.random() * 5) + 1);
  const randomClassroom = mockClassrooms.find(room => room.id === randomClassroomId)!;
  
  const bookingDate = addDays(today, randomDay);
  const startTime = addHours(new Date(bookingDate.setHours(randomHour, 0, 0, 0)), 0);
  const endTime = addHours(startTime, randomDuration);
  
  const statuses: ('confirmed' | 'pending' | 'rejected' | 'cancelled')[] = ['confirmed', 'pending', 'confirmed', 'confirmed'];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  
  mockBookings.push({
    id: String(i),
    userId: randomUserId,
    userName: randomUser.name,
    classroomId: randomClassroomId,
    classroomName: randomClassroom.name,
    date: formatDate(bookingDate),
    startTime: formatTime(startTime),
    endTime: formatTime(endTime),
    purpose: ['Class', 'Study Group', 'Meeting', 'Workshop', 'Lab Session'][Math.floor(Math.random() * 5)],
    status: randomStatus,
  });
}
