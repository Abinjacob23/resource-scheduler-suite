
import { useState, useEffect } from 'react';
import { BarChart, Calendar, Package, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalEvents: 0,
    resources: 0,
    approved: 0,
    pending: 0
  });
  const [eventRequests, setEventRequests] = useState([]);
  const [resourceRequests, setResourceRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch event data
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (eventsError) throw eventsError;
      
      // Fetch resource requests
      const { data: resources, error: resourcesError } = await supabase
        .from('resource_requests')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (resourcesError) throw resourcesError;
      
      // Calculate statistics
      const { data: allEvents, error: allEventsError } = await supabase
        .from('events')
        .select('status');
      
      if (allEventsError) throw allEventsError;
      
      const { data: allResources, error: allResourcesError } = await supabase
        .from('resource_requests')
        .select('id');
      
      if (allResourcesError) throw allResourcesError;
      
      const approvedEvents = allEvents.filter(event => event.status === 'approved').length;
      const pendingEvents = allEvents.filter(event => event.status === 'pending').length;
      
      setStats({
        totalEvents: allEvents.length,
        resources: allResources.length,
        approved: approvedEvents,
        pending: pendingEvents
      });
      
      setEventRequests(events || []);
      setResourceRequests(resources || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

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
            <p className="text-2xl font-semibold">{stats.totalEvents}</p>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg shadow-sm p-4 flex items-center">
          <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
            <Package className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Resources</p>
            <p className="text-2xl font-semibold">{stats.resources}</p>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg shadow-sm p-4 flex items-center">
          <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
            <Users className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Approved</p>
            <p className="text-2xl font-semibold">{stats.approved}</p>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg shadow-sm p-4 flex items-center">
          <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mr-4">
            <BarChart className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl font-semibold">{stats.pending}</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Event Requests</h2>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading...
            </div>
          ) : eventRequests.length > 0 ? (
            <div className="space-y-3">
              {eventRequests.map((event) => (
                <div key={event.id} className="border rounded-md p-3">
                  <p className="font-medium">{event.event_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {event.association} | {formatDate(event.date)}
                  </p>
                  <div className="mt-1">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      event.status === 'approved' ? 'bg-green-100 text-green-800' :
                      event.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {event.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No event requests found
            </div>
          )}
        </div>
        
        <div className="bg-card border border-border rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Resource Requests</h2>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading...
            </div>
          ) : resourceRequests.length > 0 ? (
            <div className="space-y-3">
              {resourceRequests.map((request) => (
                <div key={request.id} className="border rounded-md p-3">
                  <p className="font-medium">{request.event_name}</p>
                  <p className="text-sm text-muted-foreground">
                    Date: {formatDate(request.date)}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {request.resources.map((resource, idx) => (
                      <span key={idx} className="inline-block px-2 py-1 bg-muted rounded-full text-xs">
                        {resource.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </span>
                    ))}
                  </div>
                  <div className="mt-1">
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                      request.status === 'approved' ? 'bg-green-100 text-green-800' :
                      request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No resource requests found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
