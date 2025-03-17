
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from 'lucide-react';

const RequestStatus = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("events");
  const [eventRequests, setEventRequests] = useState([]);
  const [resourceRequests, setResourceRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchRequests();
    }
  }, [user]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      
      // Fetch events
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (eventsError) throw eventsError;
      
      // Fetch resource requests
      const { data: resources, error: resourcesError } = await supabase
        .from('resource_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (resourcesError) throw resourcesError;
      
      setEventRequests(events || []);
      setResourceRequests(resources || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStatusBadge = (status) => {
    return (
      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
        status === 'approved' ? 'bg-green-100 text-green-800' :
        status === 'rejected' ? 'bg-red-100 text-red-800' :
        'bg-amber-100 text-amber-800'
      }`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="animate-scale-in">
        <h1 className="content-title">Status of Requests</h1>
        <div className="dashboard-card">
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
            <span>Loading requests...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-scale-in">
      <h1 className="content-title">Status of Requests</h1>
      
      <div className="dashboard-card">
        <Tabs defaultValue="events" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="events">Event Requests</TabsTrigger>
            <TabsTrigger value="resources">Resource Requests</TabsTrigger>
          </TabsList>
          
          <TabsContent value="events" className="animate-fade-in">
            <div className="overflow-x-auto">
              {eventRequests.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/30">
                      <th className="text-left p-3 font-medium text-muted-foreground">Association</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Event Name</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventRequests.map((event) => (
                      <tr key={event.id} className="border-b border-muted/30 hover:bg-muted/10 transition-colors">
                        <td className="p-3">{event.association}</td>
                        <td className="p-3">{event.event_name}</td>
                        <td className="p-3">{new Date(event.date).toLocaleDateString()}</td>
                        <td className="p-3">
                          {renderStatusBadge(event.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No event requests found
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="resources" className="animate-fade-in">
            <div className="overflow-x-auto">
              {resourceRequests.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/30">
                      <th className="text-left p-3 font-medium text-muted-foreground">Event Name</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Date</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Resources</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resourceRequests.map((request) => (
                      <tr key={request.id} className="border-b border-muted/30 hover:bg-muted/10 transition-colors">
                        <td className="p-3">{request.event_name}</td>
                        <td className="p-3">{new Date(request.date).toLocaleDateString()}</td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1">
                            {request.resources.map((resource, rIndex) => (
                              <span key={rIndex} className="inline-block px-2 py-1 bg-muted rounded-full text-xs">
                                {resource.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-3">
                          {renderStatusBadge(request.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No resource requests found
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RequestStatus;
