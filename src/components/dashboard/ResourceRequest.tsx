
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { RESOURCE_LABELS } from '@/utils/mock-data';
import { ResourceType } from '@/types/dashboard';
import CustomButton from '../ui/custom-button';
import { useToast } from '@/hooks/use-toast';

const ResourceRequest = () => {
  const { user } = useAuth();
  const { toast } = useToast();
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
      toast({
        title: "Authentication Error",
        description: "You must be logged in to submit a resource request.",
        variant: "destructive"
      });
      return;
    }
    
    if (formData.resources.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one resource.",
        variant: "destructive"
      });
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
      
      toast({
        title: "Success!",
        description: "Resource request submitted successfully.",
      });
      
      // Reset form
      setFormData({
        eventName: '',
        date: '',
        resources: []
      });
    } catch (error) {
      console.error('Error submitting resource request:', error);
      toast({
        title: "Error",
        description: "Failed to submit resource request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-scale-in">
      <h1 className="content-title">Request for Resource</h1>
      
      <div className="dashboard-card max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
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
            <label className="form-label">Resources Required</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              {(Object.entries(RESOURCE_LABELS) as [ResourceType, string][]).map(([value, label]) => (
                <div key={value} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`resource-${value}`}
                    name="resources"
                    value={value}
                    checked={formData.resources.includes(value)}
                    onChange={handleResourceChange}
                    className="form-checkbox mr-2"
                  />
                  <label htmlFor={`resource-${value}`} className="text-sm">
                    {label}
                  </label>
                </div>
              ))}
            </div>
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

export default ResourceRequest;
