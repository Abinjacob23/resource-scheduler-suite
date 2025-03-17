
import { LayoutDashboard, Calendar, Package, ClipboardList, FileSpreadsheet, Users, Lock, FileText, Database, CalendarX } from 'lucide-react';

type SidebarProps = {
  activeItem: string;
  onMenuItemClick: (itemId: string) => void;
  isAdmin?: boolean;
}

const Sidebar = ({ activeItem, onMenuItemClick, isAdmin = false }: SidebarProps) => {
  // Define menu items based on isAdmin flag
  const menuItems = isAdmin 
    ? [
        { id: 'admin-dashboard', label: 'Event Schedule', icon: <Calendar className="h-5 w-5" /> },
        { id: 'event-request', label: 'Event Requests', icon: <ClipboardList className="h-5 w-5" /> },
        { id: 'resource-request', label: 'Resource Requests', icon: <Package className="h-5 w-5" /> },
        { id: 'cancel-event', label: 'Cancel Events', icon: <CalendarX className="h-5 w-5" /> },
        { id: 'change-password', label: 'Change Password', icon: <Lock className="h-5 w-5" /> },
      ]
    : [
        { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
        { id: 'event-request', label: 'Event Request', icon: <Calendar className="h-5 w-5" /> },
        { id: 'resource-availability', label: 'Resource Availability', icon: <Database className="h-5 w-5" /> },
        { id: 'cancel-event', label: 'Cancel Event', icon: <CalendarX className="h-5 w-5" /> },
        { id: 'resource-request', label: 'Resource Request', icon: <Package className="h-5 w-5" /> },
        { id: 'fund-analysis', label: 'Fund Analysis', icon: <FileSpreadsheet className="h-5 w-5" /> },
        { id: 'request-status', label: 'Request Status', icon: <ClipboardList className="h-5 w-5" /> },
        { id: 'report', label: 'Report', icon: <FileText className="h-5 w-5" /> },
        { id: 'collaboration', label: 'Collaboration', icon: <Users className="h-5 w-5" /> },
        { id: 'change-password', label: 'Change Password', icon: <Lock className="h-5 w-5" /> },
      ];

  return (
    <div className="bg-sidebar h-full w-64 overflow-y-auto border-r border-border fixed left-0 top-0 z-20">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-border">
          <h2 className="text-xl font-bold">{isAdmin ? 'Admin Panel' : 'Dashboard'}</h2>
        </div>
        
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => onMenuItemClick(item.id)}
                  className={`flex items-center w-full p-2 rounded-md transition-colors ${
                    activeItem === item.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-muted'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
