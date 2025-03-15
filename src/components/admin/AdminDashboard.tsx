
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminEventRequests from './AdminEventRequests';
import AdminResourceRequests from './AdminResourceRequests';
import { useAuth } from '@/contexts/AuthContext';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('events');
  const { user } = useAuth();

  return (
    <div className="animate-scale-in p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          Logged in as: <span className="font-medium">{user?.email}</span>
        </div>
      </div>
      
      <div className="dashboard-card bg-card p-6 rounded-lg border shadow-sm">
        <Tabs defaultValue="events" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="events">Event Requests</TabsTrigger>
            <TabsTrigger value="resources">Resource Requests</TabsTrigger>
          </TabsList>
          
          <TabsContent value="events" className="animate-fade-in">
            <AdminEventRequests />
          </TabsContent>
          
          <TabsContent value="resources" className="animate-fade-in">
            <AdminResourceRequests />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
