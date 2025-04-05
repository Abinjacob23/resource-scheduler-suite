
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { hasAdminAccess, hasFacultyAccess } from '@/utils/admin-utils';
import { EventRequest } from '@/types/admin';

/**
 * Custom hook to manage event requests for admin users
 */
export const useEventRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<EventRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventRequest | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Function to fetch event requests
  const fetchEventRequests = async () => {
    try {
      console.log('Admin/Faculty: Attempting to fetch event requests...');
      setLoading(true);
      
      // First check if user is admin or faculty
      if (!hasAdminAccess(user) && !hasFacultyAccess(user)) {
        console.error('Unauthorized user attempted to access event requests');
        toast.error('You do not have permission to view event requests');
        setLoading(false);
        return;
      }
      
      console.log('User has permission, fetching event requests...');
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching event requests:', error);
        throw error;
      }
      
      console.log('Received event requests:', data);
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching event requests:', error);
      toast.error('Failed to load event requests');
    } finally {
      setLoading(false);
    }
  };

  // Function to update request status
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

  // Function to view event details
  const viewEventDetails = (event: EventRequest) => {
    setSelectedEvent(event);
    setOpenDialog(true);
  };

  useEffect(() => {
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
          console.log('Real-time event update received:', payload);
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
  }, [user]);

  return {
    requests,
    loading,
    processing,
    selectedEvent,
    openDialog,
    setOpenDialog,
    updateRequestStatus,
    viewEventDetails
  };
};
