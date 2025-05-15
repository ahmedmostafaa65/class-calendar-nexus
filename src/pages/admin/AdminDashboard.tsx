
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Navigate, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { bookingsApi, usersApi, classroomsApi } from '@/services/api';
import { BookingCard } from '@/components/BookingCard';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { format, subDays, isSameDay } from 'date-fns';
import { 
  Users, 
  Building, 
  CalendarCheck, 
  Clock, 
  UserPlus, 
  BarChart as BarChartIcon
} from 'lucide-react';

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  // Fetch all data regardless of admin status - we'll handle redirect after
  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: usersApi.getUsers,
  });
  
  const { data: classrooms = [] } = useQuery({
    queryKey: ['classrooms'],
    queryFn: classroomsApi.getClassrooms,
  });
  
  const { data: bookings = [] } = useQuery({
    queryKey: ['bookings'],
    queryFn: bookingsApi.getBookings,
  });
  
  const { data: bookingStats } = useQuery({
    queryKey: ['bookingStats'],
    queryFn: bookingsApi.getBookingStats,
  });
  
  // Redirect if not admin - moved after all hooks are called
  if (!isAdmin) {
    return <Navigate to="/" />;
  }
  
  // Prepare data for pie chart
  const pieData = bookingStats ? [
    { name: 'Confirmed', value: bookingStats.confirmed, color: '#22c55e' },
    { name: 'Pending', value: bookingStats.pending, color: '#f97316' },
    { name: 'Cancelled', value: bookingStats.cancelled, color: '#1e293b' },
    { name: 'Rejected', value: bookingStats.rejected, color: '#ef4444' },
  ] : [];
  
  // Prepare data for bar chart
  const today = new Date();
  const getDailyBookings = (days: number) => {
    const daily = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(today, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      
      const dailyBookings = bookings.filter(booking => booking.date === dateStr);
      
      daily.push({
        date: format(date, 'MMM dd'),
        bookings: dailyBookings.length,
      });
    }
    return daily;
  };
  
  const dailyBookingsData = getDailyBookings(7);
  
  // Get recent bookings
  const recentBookings = [...bookings]
    .sort((a, b) => parseInt(b.id) - parseInt(a.id))
    .slice(0, 5);
  
  return (
    <MainLayout>
      <div className="container px-4 py-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Admin Dashboard</h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                {users?.filter(u => u.role === 'student')?.length || 0} students, {users?.filter(u => u.role === 'faculty')?.length || 0} faculty
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Classrooms</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{classrooms?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                {classrooms?.filter(c => c.available)?.length || 0} available
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <CalendarCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookingStats?.total || 0}</div>
              <p className="text-xs text-muted-foreground">
                {bookingStats?.confirmed || 0} confirmed, {bookingStats?.pending || 0} pending
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Bookings</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {bookings?.filter(b => b.date === format(today, 'yyyy-MM-dd'))?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                For {format(today, 'MMMM d, yyyy')}
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7 mb-8">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Weekly Booking Overview</CardTitle>
              <CardDescription>
                Number of bookings over the past 7 days
              </CardDescription>
            </CardHeader>
            <CardContent className="px-2">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyBookingsData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="bookings" name="Bookings" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Booking Status</CardTitle>
              <CardDescription>
                Distribution of booking statuses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight">Recent Bookings</h2>
            <Button variant="outline" onClick={() => navigate('/admin/bookings')}>
              View all
            </Button>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recentBookings?.map((booking) => (
              <BookingCard key={booking.id} booking={booking} showActions={false} />
            ))}
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">User Management</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Manage system users, including students and faculty members.
              </p>
              <Button onClick={() => navigate('/admin/users')} variant="outline" className="w-full">
                Manage Users
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Booking Analytics</CardTitle>
              <BarChartIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                View detailed analytics about classroom bookings.
              </p>
              <Button onClick={() => navigate('/admin/bookings')} variant="outline" className="w-full">
                View Analytics
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
