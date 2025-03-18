
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
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
  const [requests, setRequests] = useState<EventRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchEventRequests();

    // Set up real-time listener for event requests
    const channel = supabase
      .channel('event-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'events'
        },
        (payload) => {
          console.log('Real-time event update:', payload);
          // Refresh the entire list to ensure consistent state
          fetchEventRequests();
        }
      )
      .subscribe((status) => {
        console.log('Event subscription status:', status);
      });

    // Cleanup on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchEventRequests = async () => {
    try {
      console.log('Fetching event requests...');
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      console.log('Received event requests:', data);
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching event requests:', error);
      toast.error('Failed to load event requests');
    } finally {
      setLoading(false);
    }
  };

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
      
      toast.success(`Request ${status} successfully`);
    } catch (error) {
      console.error(`Error ${status} request:`, error);
      toast.error(`Failed to ${status} request`);
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
                  <TableCell>{request.event_name}</TableCell>
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
    </div>
  );
};

export default AdminEventRequests;
