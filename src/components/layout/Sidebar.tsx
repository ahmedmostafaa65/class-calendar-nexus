
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { 
  SidebarToggle,
  SidebarLogo,
  SidebarNavLinks,
  LogoutButton
} from './sidebar';

export const Sidebar = () => {
  const { user, logout } = useAuth();
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
      <SidebarToggle 
        isMobileMenuOpen={isMobileMenuOpen} 
        toggleMobileMenu={toggleMobileMenu}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out md:translate-x-0",
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full justify-between">
          <div className="flex flex-col">
            <SidebarLogo />
            <SidebarNavLinks isActive={isActive} />
          </div>

          {user && <LogoutButton onLogout={logout} />}
        </div>
      </aside>

      {/* Content Spacer - ensures content isn't hidden behind sidebar on larger screens */}
      <div className="md:pl-64 transition-all duration-200">
        {/* This is just a spacer div that pushes content away from the sidebar */}
      </div>
    </>
  );
};
