
import { useState } from 'react';
import {
  LayoutDashboard,
  Calendar,
  Package,
  DollarSign,
  ClipboardList,
  Lock,
  CalendarX
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

type SidebarProps = {
  activeItem: string;
  onMenuItemClick: (itemId: string) => void;
  isAdmin?: boolean;
};

const Sidebar = ({ activeItem, onMenuItemClick, isAdmin = false }: SidebarProps) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleItemClick = (itemId: string) => {
    onMenuItemClick(itemId);
    
    // Navigate to the proper route
    navigate(isAdmin ? `/admin?tab=${itemId}` : `/dashboard/${itemId}`);
    
    // Close the sidebar on mobile after clicking an item
    if (window.innerWidth < 768) {
      setIsMenuOpen(false);
    }
  };

  const menuItems = [
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

  const adminMenuItems = [
    { id: "admin-dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { id: "event-request", label: "Event Requests", icon: <Calendar className="h-5 w-5" /> },
    { id: "resource-request", label: "Resource Requests", icon: <Package className="h-5 w-5" /> },
    { id: "fund-request", label: "Fund Requests", icon: <DollarSign className="h-5 w-5" /> },
    { id: "cancel-event", label: "Cancel Events", icon: <CalendarX className="h-5 w-5" /> },
    { id: "change-password", label: "Change Password", icon: <Lock className="h-5 w-5" /> },
  ];

  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 ease-in-out z-50",
        !isMenuOpen ? "-translate-x-full" : "", // Hide on mobile when closed
        "md:translate-x-0 md:block" // Always show on larger screens
      )}
    >
      <div className="p-4 border-b border-sidebar-border">
        <h1 className="text-xl font-bold">Dashboard</h1>
      </div>
      <nav className="p-2">
        {(isAdmin ? adminMenuItems : menuItems).map((item) => (
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
