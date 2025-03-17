
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import CustomButton from '../ui/custom-button';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';

const EventRequest = () => {
  const { user } = useAuth();
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
      toast.error("You must be logged in to submit an event request.");
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
      
      toast.success("Event request submitted successfully.");
      
      // Reset form
      setFormData({
        association: '',
        eventName: '',
        date: '',
        description: ''
      });
    } catch (error) {
      console.error('Error submitting event request:', error);
      toast.error("Failed to submit event request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-scale-in">
      <h1 className="text-2xl font-bold mb-6">Request for Event</h1>
      
      <div className="bg-card border border-border rounded-lg shadow-sm p-6 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="association" className="block text-sm font-medium">
              Association Name
            </label>
            <input
              type="text"
              id="association"
              name="association"
              value={formData.association}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter association name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="eventName" className="block text-sm font-medium">
              Event Name
            </label>
            <input
              type="text"
              id="eventName"
              name="eventName"
              value={formData.eventName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter event name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="date" className="block text-sm font-medium">
              Event Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium">
              Event Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter event description"
              rows={4}
              required
            />
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

export default EventRequest;
