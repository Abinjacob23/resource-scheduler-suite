
import { BarChart, Calendar, Package, Users } from 'lucide-react';
import { mockEventRequests, mockResourceRequests } from '@/utils/mock-data';

const Dashboard = () => {
  const totalEvents = mockEventRequests.length;
  const approvedEvents = mockEventRequests.filter(event => event.status === 'approved').length;
  const pendingEvents = mockEventRequests.filter(event => event.status === 'pending').length;

  const totalResources = mockResourceRequests.length;
  const resourcesApproved = mockResourceRequests.filter(req => req.status === 'approved').length;

  return (
    <div className="animate-scale-in">
      <h1 className="content-title">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="dashboard-card flex items-center">
          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
            <Calendar className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Events</p>
            <p className="text-2xl font-semibold">{totalEvents}</p>
          </div>
        </div>
        
        <div className="dashboard-card flex items-center">
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
            <Package className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Resources</p>
            <p className="text-2xl font-semibold">{totalResources}</p>
          </div>
        </div>
        
        <div className="dashboard-card flex items-center">
          <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
            <Users className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Approved</p>
            <p className="text-2xl font-semibold">{approvedEvents}</p>
          </div>
        </div>
        
        <div className="dashboard-card flex items-center">
          <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mr-4">
            <BarChart className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl font-semibold">{pendingEvents}</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="dashboard-card">
          <h2 className="text-lg font-semibold mb-4">Recent Event Requests</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left pb-2 font-medium text-muted-foreground">Event</th>
                  <th className="text-left pb-2 font-medium text-muted-foreground">Date</th>
                  <th className="text-left pb-2 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockEventRequests.slice(0, 3).map((event, index) => (
                  <tr key={index} className="border-b border-muted/30 last:border-0">
                    <td className="py-3">{event.eventName}</td>
                    <td className="py-3">{new Date(event.date).toLocaleDateString()}</td>
                    <td className="py-3">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        event.status === 'approved' ? 'bg-green-100 text-green-800' :
                        event.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {event.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="dashboard-card">
          <h2 className="text-lg font-semibold mb-4">Recent Resource Requests</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left pb-2 font-medium text-muted-foreground">Event</th>
                  <th className="text-left pb-2 font-medium text-muted-foreground">Resources</th>
                  <th className="text-left pb-2 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockResourceRequests.slice(0, 3).map((request, index) => (
                  <tr key={index} className="border-b border-muted/30 last:border-0">
                    <td className="py-3">{request.eventName}</td>
                    <td className="py-3">{request.resources.length} items</td>
                    <td className="py-3">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        request.status === 'approved' ? 'bg-green-100 text-green-800' :
                        request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {request.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
