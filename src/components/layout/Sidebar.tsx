
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { 
  BookOpen, Calendar, HelpCircle, Home, LogOut, Mail, Settings, 
  FileText, Users, Building, DownloadCloud, LogIn, UserPlus
} from 'lucide-react';

export const Sidebar = () => {
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button
        onClick={toggleMobileMenu}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md"
      >
        <div className="w-5 h-5 flex flex-col justify-between">
          <span className={`block w-full h-0.5 bg-gray-800 transition-transform ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-full h-0.5 bg-gray-800 transition-opacity ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-full h-0.5 bg-gray-800 transition-transform ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </div>
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out",
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <Link to="/" className="flex items-center space-x-2">
              <Calendar className="h-6 w-6 text-booking-primary" />
              <span className="text-lg font-bold">ClassRoom Booking</span>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {!user ? (
              // Public navigation (not logged in)
              <>
                <Link
                  to="/login"
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-slate-100",
                    isActive('/login') && "bg-slate-100 text-booking-primary font-medium"
                  )}
                >
                  <LogIn className="h-5 w-5" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-slate-100",
                    isActive('/register') && "bg-slate-100 text-booking-primary font-medium"
                  )}
                >
                  <UserPlus className="h-5 w-5" />
                  <span>Register</span>
                </Link>
                <Link
                  to="/about"
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-slate-100",
                    isActive('/about') && "bg-slate-100 text-booking-primary font-medium"
                  )}
                >
                  <BookOpen className="h-5 w-5" />
                  <span>About</span>
                </Link>
                <Link
                  to="/contact"
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-slate-100",
                    isActive('/contact') && "bg-slate-100 text-booking-primary font-medium"
                  )}
                >
                  <Mail className="h-5 w-5" />
                  <span>Contact</span>
                </Link>
                <Link
                  to="/help"
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-slate-100",
                    isActive('/help') && "bg-slate-100 text-booking-primary font-medium"
                  )}
                >
                  <HelpCircle className="h-5 w-5" />
                  <span>Help</span>
                </Link>
              </>
            ) : (
              // User navigation (logged in)
              <>
                <Link
                  to="/"
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-slate-100",
                    isActive('/') && "bg-slate-100 text-booking-primary font-medium"
                  )}
                >
                  <Home className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/book"
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-slate-100",
                    isActive('/book') && "bg-slate-100 text-booking-primary font-medium"
                  )}
                >
                  <Calendar className="h-5 w-5" />
                  <span>Book Classroom</span>
                </Link>
                <Link
                  to="/bookings"
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-slate-100",
                    isActive('/bookings') && "bg-slate-100 text-booking-primary font-medium"
                  )}
                >
                  <FileText className="h-5 w-5" />
                  <span>My Bookings</span>
                </Link>

                {isAdmin && (
                  <>
                    <div className="pt-4 pb-2">
                      <div className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        ADMIN
                      </div>
                    </div>
                    <Link
                      to="/admin"
                      className={cn(
                        "flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-slate-100",
                        isActive('/admin') && "bg-slate-100 text-booking-primary font-medium"
                      )}
                    >
                      <Settings className="h-5 w-5" />
                      <span>Admin Dashboard</span>
                    </Link>
                    <Link
                      to="/admin/classrooms"
                      className={cn(
                        "flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-slate-100",
                        isActive('/admin/classrooms') && "bg-slate-100 text-booking-primary font-medium"
                      )}
                    >
                      <Building className="h-5 w-5" />
                      <span>Manage Classrooms</span>
                    </Link>
                    <Link
                      to="/admin/users"
                      className={cn(
                        "flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-slate-100",
                        isActive('/admin/users') && "bg-slate-100 text-booking-primary font-medium"
                      )}
                    >
                      <Users className="h-5 w-5" />
                      <span>Manage Users</span>
                    </Link>
                    <Link
                      to="/admin/export"
                      className={cn(
                        "flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-slate-100",
                        isActive('/admin/export') && "bg-slate-100 text-booking-primary font-medium"
                      )}
                    >
                      <DownloadCloud className="h-5 w-5" />
                      <span>Export Data</span>
                    </Link>
                  </>
                )}

                <div className="pt-4 pb-2">
                  <div className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    GENERAL
                  </div>
                </div>
                <Link
                  to="/profile"
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-slate-100",
                    isActive('/profile') && "bg-slate-100 text-booking-primary font-medium"
                  )}
                >
                  <Settings className="h-5 w-5" />
                  <span>Profile</span>
                </Link>
                <Link
                  to="/about"
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-slate-100",
                    isActive('/about') && "bg-slate-100 text-booking-primary font-medium"
                  )}
                >
                  <BookOpen className="h-5 w-5" />
                  <span>About</span>
                </Link>
                <Link
                  to="/contact"
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-slate-100",
                    isActive('/contact') && "bg-slate-100 text-booking-primary font-medium"
                  )}
                >
                  <Mail className="h-5 w-5" />
                  <span>Contact</span>
                </Link>
                <Link
                  to="/help"
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-slate-100",
                    isActive('/help') && "bg-slate-100 text-booking-primary font-medium"
                  )}
                >
                  <HelpCircle className="h-5 w-5" />
                  <span>Help</span>
                </Link>
              </>
            )}
          </nav>

          {user && (
            <div className="p-4 border-t">
              <button
                onClick={() => logout()}
                className="flex items-center space-x-2 w-full px-3 py-2 text-left rounded-md hover:bg-slate-100"
              >
                <LogOut className="h-5 w-5 text-red-500" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
