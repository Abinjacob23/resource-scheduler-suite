
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminEventRequests from './AdminEventRequests';
import AdminResourceRequests from './AdminResourceRequests';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, 
  Calendar, 
  Package, 
  ClipboardList, 
  Lock,
  CalendarX
} from 'lucide-react';
import { cn } from '@/lib/utils';
import AdminCancelEvents from './AdminCancelEvents';
import AdminEventSchedule from './AdminEventSchedule';
import AdminChangePassword from './AdminChangePassword';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { id: 'events', label: 'Event Schedule', icon: <Calendar className="h-5 w-5" /> },
    { id: 'event-requests', label: 'Event Requests', icon: <CalendarX className="h-5 w-5" /> },
    { id: 'resource-requests', label: 'Resource Requests', icon: <Package className="h-5 w-5" /> },
    { id: 'cancel-events', label: 'Cancel Events', icon: <CalendarX className="h-5 w-5" /> },
    { id: 'change-password', label: 'Change Password', icon: <Lock className="h-5 w-5" /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">Welcome to Admin Dashboard</h2>
          <p className="text-muted-foreground">Select an option from the sidebar to manage your application.</p>
        </div>;
      case 'events':
        return <AdminEventSchedule />;
      case 'event-requests':
        return <AdminEventRequests />;
      case 'resource-requests':
        return <AdminResourceRequests />;
      case 'cancel-events':
        return <AdminCancelEvents />;
      case 'change-password':
        return <AdminChangePassword />;
      default:
        return <div>Select an option</div>;
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="h-full w-64 bg-sidebar border-r border-border">
        <div className="p-4 border-b border-border">
          <h2 className="text-xl font-bold">Admin Panel</h2>
          <div className="text-xs text-muted-foreground mt-1">
            Logged in as: <span className="font-medium">{user?.email || localStorage.getItem('adminSession')}</span>
          </div>
        </div>
        <nav className="p-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex items-center w-full text-left px-3 py-2 rounded-md mb-1 transition-colors",
                activeTab === item.id 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-muted text-foreground"
              )}
            >
              <span className="mr-2">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-background">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
