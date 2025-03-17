
import { BarChart, Calendar, Package, Users } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="animate-scale-in">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-card border border-border rounded-lg shadow-sm p-4 flex items-center">
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
            <Calendar className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Events</p>
            <p className="text-2xl font-semibold">0</p>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg shadow-sm p-4 flex items-center">
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
            <Package className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Resources</p>
            <p className="text-2xl font-semibold">0</p>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg shadow-sm p-4 flex items-center">
          <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
            <Users className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Approved</p>
            <p className="text-2xl font-semibold">0</p>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg shadow-sm p-4 flex items-center">
          <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mr-4">
            <BarChart className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl font-semibold">0</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Event Requests</h2>
          <div className="text-center py-8 text-muted-foreground">
            No event requests found
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Resource Requests</h2>
          <div className="text-center py-8 text-muted-foreground">
            No resource requests found
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
