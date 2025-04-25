
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Calendar, 
  BookOpen, 
  Home, 
  Users,
  Building,
  Settings,
  BarChart,
  LogOut
} from 'lucide-react';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, href, active }) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
        active 
          ? "bg-primary text-primary-foreground" 
          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

export const Sidebar = () => {
  const location = useLocation();
  const { user, isAdmin, logout } = useAuth();
  
  if (!user) return null;
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const userMenuItems = [
    { icon: <Home className="h-4 w-4" />, label: 'Dashboard', href: '/' },
    { icon: <Calendar className="h-4 w-4" />, label: 'Book a Room', href: '/book' },
    { icon: <BookOpen className="h-4 w-4" />, label: 'My Bookings', href: '/bookings' },
  ];

  const adminMenuItems = [
    { icon: <BarChart className="h-4 w-4" />, label: 'Dashboard', href: '/admin' },
    { icon: <Users className="h-4 w-4" />, label: 'Users', href: '/admin/users' },
    { icon: <Building className="h-4 w-4" />, label: 'Classrooms', href: '/admin/classrooms' },
    { icon: <Calendar className="h-4 w-4" />, label: 'Bookings', href: '/admin/bookings' },
    { icon: <Settings className="h-4 w-4" />, label: 'Settings', href: '/admin/settings' },
  ];

  const menuItems = isAdmin ? adminMenuItems : userMenuItems;

  return (
    <div className="hidden md:flex border-r min-h-screen w-64 flex-col bg-slate-50">
      <div className="flex flex-col gap-2 p-4">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
            active={isActive(item.href)}
          />
        ))}
        
        <div className="flex-1"></div>
        
        <button 
          onClick={() => logout()}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all text-muted-foreground hover:bg-secondary hover:text-foreground mt-4"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};
