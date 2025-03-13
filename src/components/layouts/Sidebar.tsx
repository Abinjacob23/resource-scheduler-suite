
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Calendar, 
  Package, 
  BarChart, 
  ClipboardList, 
  FileText, 
  Users, 
  Lock,
  ChevronLeft,
  ChevronRight,
  Building,
  Menu
} from 'lucide-react';

interface SidebarProps {
  activeItem: string;
  onMenuItemClick: (itemId: string) => void;
}

const Sidebar = ({ activeItem, onMenuItemClick }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { id: 'event-request', label: 'Request for Event', icon: <Calendar className="h-5 w-5" /> },
    { id: 'resource-request', label: 'Request for Resource', icon: <Package className="h-5 w-5" /> },
    { id: 'fund-analysis', label: 'Fund Analysis', icon: <BarChart className="h-5 w-5" /> },
    { id: 'request-status', label: 'Status of Request', icon: <ClipboardList className="h-5 w-5" /> },
    { id: 'report', label: 'Report', icon: <FileText className="h-5 w-5" /> },
    { id: 'collaboration', label: 'Collaboration', icon: <Users className="h-5 w-5" /> },
    { id: 'change-password', label: 'Change Password', icon: <Lock className="h-5 w-5" /> },
    { id: 'resource-availability', label: 'Resource Availability', icon: <Building className="h-5 w-5" /> }
  ];

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className={cn(
      "dashboard-sidebar transition-all duration-300 ease-in-out",
      collapsed ? "dashboard-sidebar-collapsed" : "dashboard-sidebar-expanded"
    )}>
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="text-xl font-semibold text-sidebar-foreground">
            Resource Hub
          </div>
        )}
        <button 
          onClick={toggleSidebar}
          className="h-8 w-8 rounded-md flex items-center justify-center text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>

      <div className="flex-1 py-4 overflow-y-auto">
        <nav className="px-2 space-y-1">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className={cn(
                "sidebar-menu-item",
                activeItem === item.id && "active"
              )}
              onClick={() => onMenuItemClick(item.id)}
            >
              <span className="sidebar-menu-icon">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
