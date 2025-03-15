
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import CustomButton from '../ui/custom-button';
import { useToast } from '@/hooks/use-toast';

const EventRequest = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    association: '',
    eventName: '',
    date: '',
    description: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to submit an event request.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from('events').insert({
        user_id: user.id,
        association: formData.association,
        event_name: formData.eventName,
        date: formData.date,
        description: formData.description,
        status: 'pending'
      });
      
      if (error) throw error;
      
      toast({
        title: "Success!",
        description: "Event request submitted successfully.",
      });
      
      // Reset form
      setFormData({
        association: '',
        eventName: '',
        date: '',
        description: ''
      });
    } catch (error) {
      console.error('Error submitting event request:', error);
      toast({
        title: "Error",
        description: "Failed to submit event request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-scale-in">
      <h1 className="content-title">Request for Event</h1>
      
      <div className="dashboard-card max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="association" className="form-label">Association Name</label>
            <input
              type="text"
              id="association"
              name="association"
              value={formData.association}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter association name"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="eventName" className="form-label">Event Name</label>
            <input
              type="text"
              id="eventName"
              name="eventName"
              value={formData.eventName}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter event name"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="date" className="form-label">Event Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description" className="form-label">Event Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-textarea"
              placeholder="Enter event description"
              rows={4}
              required
            />
          </div>
          
          <div className="mt-6">
            <CustomButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventRequest;
