
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

type ResourceRequest = {
  id: string;
  event_name: string;
  date: string;
  resources: string[];
  status: string;
  user_id: string;
};

const AdminResourceRequests = () => {
  const [requests, setRequests] = useState<ResourceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchResourceRequests();

    // Set up real-time listener for resource requests
    const channel = supabase
      .channel('resource-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'resource_requests'
        },
        (payload) => {
          console.log('Real-time resource request update:', payload);
          // Refresh the entire list to ensure consistent state
          fetchResourceRequests();
        }
      )
      .subscribe((status) => {
        console.log('Resource subscription status:', status);
      });

    // Cleanup on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchResourceRequests = async () => {
    try {
      console.log('Fetching resource requests...');
      setLoading(true);
      const { data, error } = await supabase
        .from('resource_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      console.log('Received resource requests:', data);
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching resource requests:', error);
      toast.error('Failed to load resource requests');
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      setProcessing(id);
      const { error } = await supabase
        .from('resource_requests')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      
      // Update local state
      setRequests(requests.map(req => 
        req.id === id ? { ...req, status } : req
      ));
      
      toast.success(`Resource request ${status} successfully`);
    } catch (error) {
      console.error(`Error ${status} resource request:`, error);
      toast.error(`Failed to ${status} resource request`);
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

  const formatResourceName = (name: string) => {
    return name.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Loading resource requests...</span>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Resource Requests</h2>
      
      {requests.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No resource requests found
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Resources</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.event_name}</TableCell>
                  <TableCell>{new Date(request.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {request.resources.map((resource, index) => (
                        <span key={index} className="inline-block px-2 py-1 bg-muted rounded-full text-xs">
                          {formatResourceName(resource)}
                        </span>
                      ))}
                    </div>
                  </TableCell>
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

export default AdminResourceRequests;
