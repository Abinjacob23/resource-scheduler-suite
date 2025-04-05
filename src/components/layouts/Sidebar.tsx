import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Calendar,
  Package,
  DollarSign,
  ClipboardList,
  Lock,
  CalendarX,
  UserPlus
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { isAdmin as checkIsAdmin, isFaculty as checkIsFaculty, checkLocalAdmin, checkLocalFaculty } from '@/utils/admin-utils';

type SidebarProps = {
  activeItem: string;
  onMenuItemClick: (itemId: string) => void;
  isAdminView?: boolean;
  isFacultyView?: boolean;
};

const Sidebar = ({ activeItem, onMenuItemClick, isAdminView = false, isFacultyView = false }: SidebarProps) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<'admin' | 'faculty' | 'user'>('user');

  useEffect(() => {
    // Determine user role
    if (user) {
      if (checkIsAdmin(user.email)) {
        setUserRole('admin');
      } else if (checkIsFaculty(user.email)) {
        setUserRole('faculty');
      } else {
        setUserRole('user');
      }
    } else {
      // Check localStorage for session
      if (checkLocalAdmin()) {
        setUserRole('admin');
      } else if (checkLocalFaculty()) {
        setUserRole('faculty');
      } else {
        setUserRole('user');
      }
    }
  }, [user]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleItemClick = (itemId: string) => {
    onMenuItemClick(itemId);
    
    // Navigate to the proper route
    if (isAdminView) {
      navigate(`/admin?tab=${itemId}`);
    } else if (isFacultyView) {
      navigate(`/faculty?tab=${itemId}`);
    } else {
      navigate(`/dashboard/${itemId}`);
    }
    
    // Close the sidebar on mobile after clicking an item
    if (window.innerWidth < 768) {
      setIsMenuOpen(false);
    }
  };

  // Regular user menu items
  const userMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { id: "event-request", label: "Event Request", icon: <Calendar className="h-5 w-5" /> },
    { id: "resource-request", label: "Resource Request", icon: <Package className="h-5 w-5" /> },
    { id: "fund-analysis", label: "Fund Analysis", icon: <DollarSign className="h-5 w-5" /> },
    { id: "request-status", label: "Request Status", icon: <ClipboardList className="h-5 w-5" /> },
    { id: "report", label: "Report", icon: <ClipboardList className="h-5 w-5" /> },
    { id: "collaboration", label: "Collaboration", icon: <ClipboardList className="h-5 w-5" /> },
    { id: "resource-availability", label: "Resource Availability", icon: <Package className="h-5 w-5" /> },
    { id: "cancel-event", label: "Cancel Event", icon: <CalendarX className="h-5 w-5" /> },
    { id: "change-password", label: "Change Password", icon: <Lock className="h-5 w-5" /> },
  ];

  // Faculty menu items - only event requests, fund requests, cancel events and change password
  const facultyMenuItems = [
    { id: "faculty-dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { id: "event-request", label: "Event Requests", icon: <Calendar className="h-5 w-5" /> },
    { id: "fund-request", label: "Fund Requests", icon: <DollarSign className="h-5 w-5" /> },
    { id: "cancel-event", label: "Cancel Events", icon: <CalendarX className="h-5 w-5" /> },
    { id: "change-password", label: "Change Password", icon: <Lock className="h-5 w-5" /> },
  ];

  // Admin menu items - remove fund requests and only keep resource requests and user management
  const adminMenuItems = [
    { id: "admin-dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { id: "resource-request", label: "Resource Requests", icon: <Package className="h-5 w-5" /> },
    { id: "user-management", label: "User Management", icon: <UserPlus className="h-5 w-5" /> },
    { id: "cancel-event", label: "Cancel Events", icon: <CalendarX className="h-5 w-5" /> },
    { id: "change-password", label: "Change Password", icon: <Lock className="h-5 w-5" /> },
  ];

  // Determine which menu items to show based on role and view type
  let menuItems = userMenuItems;
  if (isAdminView) {
    menuItems = userRole === 'admin' ? adminMenuItems : userMenuItems;
  } else if (isFacultyView) {
    menuItems = userRole === 'faculty' ? facultyMenuItems : userMenuItems;
  }

  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 ease-in-out z-50",
        !isMenuOpen ? "-translate-x-full" : "", // Hide on mobile when closed
        "md:translate-x-0 md:block" // Always show on larger screens
      )}
    >
      <div className="p-4 border-b border-sidebar-border">
        <h1 className="text-xl font-bold">
          {userRole === 'admin' ? 'Administrator' : 
           userRole === 'faculty' ? 'Faculty' : 
           'Dashboard'}
        </h1>
      </div>
      <nav className="p-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleItemClick(item.id)}
            className={cn(
              "flex items-center w-full text-left px-3 py-2 rounded-md mb-1 transition-colors",
              activeItem === item.id
                ? "bg-primary text-primary-foreground"
                : "hover:bg-sidebar-accent text-sidebar-foreground"
            )}
          >
            <span className="mr-2">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
