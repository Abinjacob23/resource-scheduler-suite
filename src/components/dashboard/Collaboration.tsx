
import { useState, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import CustomButton from '../ui/custom-button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Collaboration = () => {
  const { user } = useAuth();
  const [approvedEvents, setApprovedEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState({ id: '', name: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

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
        .select('*')
        .eq('status', 'approved');
      
      if (error) throw error;
      setApprovedEvents(data || []);
    } catch (error) {
      console.error('Error fetching approved events:', error);
      toast.error('Failed to load approved events');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to send a collaboration request');
      return;
    }
    
    if (!selectedEvent.id || !message.trim()) {
      toast.error('Please select an event and write a message');
      return;
    }

    try {
      const { error } = await supabase
        .from('collaborations')
        .insert({
          event_id: selectedEvent.id,
          event_name: selectedEvent.name,
          user_id: user.id,
          message: message
        });
      
      if (error) throw error;
      
      toast.success('Collaboration request sent successfully!');
      setSelectedEvent({ id: '', name: '' });
      setMessage('');
    } catch (error) {
      console.error('Error sending collaboration request:', error);
      toast.error('Failed to send collaboration request');
    }
  };

  if (loading) {
    return (
      <div className="animate-scale-in">
        <h1 className="content-title">Collaboration</h1>
        <div className="dashboard-card">
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
            <span>Loading events...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-scale-in">
      <h1 className="content-title">Collaboration</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="dashboard-card lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Scheduled Events</h2>
          <div className="space-y-4">
            {approvedEvents.length > 0 ? (
              approvedEvents.map((event) => (
                <div key={event.id} className="border rounded-md p-4 hover:bg-muted/10 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{event.event_name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Association: {event.association}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Date: {new Date(event.date).toLocaleDateString()}
                      </p>
                    </div>
                    <CustomButton 
                      size="sm" 
                      variant="outline"
                      onClick={() => setSelectedEvent({ 
                        id: event.id, 
                        name: event.event_name 
                      })}
                      className="flex items-center"
                    >
                      <Send className="mr-1 h-3 w-3" />
                      Collaborate
                    </CustomButton>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-4 text-muted-foreground">
                No approved events available for collaboration.
              </div>
            )}
          </div>
        </div>
        
        <div className="dashboard-card">
          <h2 className="text-lg font-semibold mb-4">Send Collaboration Request</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="event" className="form-label">Select Event</label>
              <select
                id="event"
                value={selectedEvent.id}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  const selectedEvent = approvedEvents.find(event => event.id === selectedId);
                  setSelectedEvent({ 
                    id: selectedId, 
                    name: selectedEvent ? selectedEvent.event_name : '' 
                  });
                }}
                className="form-select"
                required
              >
                <option value="">Select an event</option>
                {approvedEvents.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.event_name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="message" className="form-label">Collaboration Message</label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="form-textarea"
                placeholder="Describe how you would like to collaborate..."
                rows={5}
                required
              />
            </div>
            
            <div className="mt-4">
              <CustomButton type="submit" className="w-full">
                Send Request
              </CustomButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Collaboration;
