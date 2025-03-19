
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { RESOURCE_LABELS } from '@/utils/mock-data';
import { ResourceType } from '@/types/dashboard';
import CustomButton from '../ui/custom-button';
import { toast } from 'sonner';

const ResourceRequest = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [approvedEvents, setApprovedEvents] = useState<Array<{id: string, event_name: string}>>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    eventId: '',
    eventName: '',
    date: '',
    resources: [] as ResourceType[]
  });

  useEffect(() => {
    if (user) {
      fetchApprovedEvents();
    }
  }, [user]);

  const fetchApprovedEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('id, event_name, date')
        .eq('status', 'approved')
        .eq('user_id', user?.id || '');
      
      if (error) throw error;
      
      console.log('Approved events:', data);
      setApprovedEvents(data || []);
    } catch (error) {
      console.error('Error fetching approved events:', error);
      toast.error('Failed to load approved events');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'eventId' && value) {
      const selectedEvent = approvedEvents.find(event => event.id === value);
      if (selectedEvent) {
        setFormData(prev => ({ 
          ...prev, 
          [name]: value,
          eventName: selectedEvent.event_name
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleResourceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const resourceValue = value as ResourceType;
    
    setFormData(prev => {
      if (checked) {
        return { ...prev, resources: [...prev.resources, resourceValue] };
      } else {
        return { ...prev, resources: prev.resources.filter(r => r !== resourceValue) };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to submit a resource request.");
      return;
    }
    
    if (formData.resources.length === 0) {
      toast.error("Please select at least one resource.");
      return;
    }
    
    if (!formData.eventId) {
      toast.error("Please select an approved event.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      toast.loading("Submitting your resource request...");
      
      const { error } = await supabase.from('resource_requests').insert({
        user_id: user.id,
        event_name: formData.eventName,
        date: formData.date || new Date().toISOString().split('T')[0],
        resources: formData.resources,
        status: 'pending'
      });
      
      if (error) throw error;
      
      toast.dismiss();
      toast.success("Resource request submitted successfully. Admins can now review it.");
      
      // Reset form
      setFormData({
        eventId: '',
        eventName: '',
        date: '',
        resources: []
      });
    } catch (error) {
      console.error('Error submitting resource request:', error);
      toast.dismiss();
      toast.error("Failed to submit resource request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-scale-in p-6">
        <h1 className="text-2xl font-bold mb-6">Request for Resource</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Loading approved events...</span>
        </div>
      </div>
    );
  }

  if (approvedEvents.length === 0) {
    return (
      <div className="animate-scale-in p-6">
        <h1 className="text-2xl font-bold mb-6">Request for Resource</h1>
        <div className="bg-card border border-border rounded-lg shadow-sm p-6 max-w-2xl mx-auto">
          <div className="text-center py-8">
            <h2 className="text-lg font-medium mb-2">No Approved Events</h2>
            <p className="text-muted-foreground mb-4">
              You need to have an approved event before you can request resources.
            </p>
            <CustomButton onClick={() => window.location.href = '/dashboard/event-request'} className="mt-2">
              Create an Event Request
            </CustomButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-scale-in">
      <h1 className="text-2xl font-bold mb-6">Request for Resource</h1>
      
      <div className="bg-card border border-border rounded-lg shadow-sm p-6 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="eventId" className="block text-sm font-medium">
              Select Approved Event
            </label>
            <select
              id="eventId"
              name="eventId"
              value={formData.eventId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="">Select an approved event</option>
              {approvedEvents.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.event_name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="date" className="block text-sm font-medium">
              Request Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-muted-foreground">
              Optional. If not specified, today's date will be used.
            </p>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Resources Required
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2 p-3 border border-input rounded-md bg-background/50">
              {(Object.entries(RESOURCE_LABELS) as [ResourceType, string][]).map(([value, label]) => (
                <div key={value} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`resource-${value}`}
                    name="resources"
                    value={value}
                    checked={formData.resources.includes(value)}
                    onChange={handleResourceChange}
                    className="h-4 w-4 rounded border-input text-primary focus:ring-primary mr-2"
                  />
                  <label htmlFor={`resource-${value}`} className="text-sm">
                    {label}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="pt-2">
            <CustomButton type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResourceRequest;
