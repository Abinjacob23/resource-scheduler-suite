
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, CheckCircle, XCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from '@/contexts/AuthContext';

type EventRequest = {
  id: string;
  association: string;
  event_name: string;
  date: string;
  description: string | null;
  status: string;
  user_id: string;
};

const AdminEventRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<EventRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventRequest | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    // Check if user is admin before fetching data
    const checkIsAdmin = async () => {
      // Check if user email is admin email
      if (!user) {
        const adminSession = localStorage.getItem('adminSession');
        return adminSession === 'admin@example.com' || adminSession === 'admin@gmail.com';
      }
      
      const email = user.email;
      // List of admin emails
      const adminEmails = ['admin@example.com', 'test@example.com', 'admin@gmail.com'];
      return adminEmails.includes(email || '');
    };

    // Fetch event requests if user is admin
    const fetchEventRequests = async () => {
      try {
        console.log('Admin: Attempting to fetch event requests...');
        setLoading(true);
        
        // First check if user is admin
        const isAdmin = await checkIsAdmin();
        if (!isAdmin) {
          console.error('Non-admin user attempted to access event requests');
          toast.error('You do not have permission to view event requests');
          setLoading(false);
          return;
        }
        
        console.log('Admin: User is admin, fetching event requests...');
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching event requests:', error);
          throw error;
        }
        
        console.log('Admin: Received event requests:', data);
        setRequests(data || []);
      } catch (error) {
        console.error('Error fetching event requests:', error);
        toast.error('Failed to load event requests');
      } finally {
        setLoading(false);
      }
    };

    fetchEventRequests();

    // Set up real-time listener for event requests
    const channel = supabase
      .channel('admin-event-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'events'
        },
        (payload) => {
          console.log('Admin: Real-time event update received:', payload);
          // Refresh the entire list to ensure consistent state
          fetchEventRequests();
        }
      )
      .subscribe((status) => {
        console.log('Admin event subscription status:', status);
      });

    // Cleanup on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const updateRequestStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      setProcessing(id);
      const { error } = await supabase
        .from('events')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      
      // Update local state
      setRequests(requests.map(req => 
        req.id === id ? { ...req, status } : req
      ));
      
      toast.success(`Event request ${status} successfully`);
    } catch (error) {
      console.error(`Error ${status} request:`, error);
      toast.error(`Failed to ${status} event request`);
    } finally {
      setProcessing(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
      default:
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Pending</Badge>;
    }
  };

  const viewEventDetails = (event: EventRequest) => {
    setSelectedEvent(event);
    setOpenDialog(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Loading requests...</span>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Event Requests</h2>
      
      {requests.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No event requests found
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Association</TableHead>
                <TableHead>Event Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.association}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="mr-2">{request.event_name}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => viewEventDetails(request)}
                        className="h-6 w-6 rounded-full"
                      >
                        <Info className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(request.date).toLocaleDateString()}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell className="text-right">
                    {request.status === 'pending' && (
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 border-green-600"
                          onClick={() => updateRequestStatus(request.id, 'approved')}
                          disabled={!!processing}
                        >
                          {processing === request.id ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <CheckCircle className="h-4 w-4 mr-2" />
                          )}
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-600"
                          onClick={() => updateRequestStatus(request.id, 'rejected')}
                          disabled={!!processing}
                        >
                          {processing === request.id ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <XCircle className="h-4 w-4 mr-2" />
                          )}
                          Reject
                        </Button>
                      </div>
                    )}
                    {request.status !== 'pending' && (
                      <span className="text-sm text-muted-foreground">
                        No actions available
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Event Details</DialogTitle>
            <DialogDescription>
              Complete information about the event request
            </DialogDescription>
          </DialogHeader>
          
          {selectedEvent && (
            <div className="space-y-4 mt-4">
              <div>
                <h3 className="text-sm font-medium">Association</h3>
                <p>{selectedEvent.association}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium">Event Name</h3>
                <p>{selectedEvent.event_name}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium">Date</h3>
                <p>{new Date(selectedEvent.date).toLocaleDateString()}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium">Description</h3>
                <p className="whitespace-pre-wrap">{selectedEvent.description || 'No description provided'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium">Status</h3>
                <div className="mt-1">{getStatusBadge(selectedEvent.status)}</div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminEventRequests;
