
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { RESOURCE_LABELS } from '@/utils/mock-data';
import { ResourceType } from '@/types/dashboard';
import CustomButton from '../ui/custom-button';
import { toast } from 'sonner';

const ResourceRequest = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    eventName: '',
    date: '',
    resources: [] as ResourceType[]
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from('resource_requests').insert({
        user_id: user.id,
        event_name: formData.eventName,
        date: formData.date,
        resources: formData.resources,
        status: 'pending'
      });
      
      if (error) throw error;
      
      toast.success("Resource request submitted successfully.");
      
      // Reset form
      setFormData({
        eventName: '',
        date: '',
        resources: []
      });
    } catch (error) {
      console.error('Error submitting resource request:', error);
      toast.error("Failed to submit resource request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-scale-in">
      <h1 className="text-2xl font-bold mb-6">Request for Resource</h1>
      
      <div className="bg-card border border-border rounded-lg shadow-sm p-6 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
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
