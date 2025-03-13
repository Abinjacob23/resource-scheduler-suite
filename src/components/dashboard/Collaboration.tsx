
import { useState } from 'react';
import { mockEventRequests } from '@/utils/mock-data';
import { Send } from 'lucide-react';
import CustomButton from '../ui/custom-button';

const Collaboration = () => {
  const approvedEvents = mockEventRequests.filter(event => event.status === 'approved');
  const [selectedEvent, setSelectedEvent] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Collaboration request submitted:', { eventId: selectedEvent, message });
    alert('Collaboration request sent successfully!');
    setSelectedEvent('');
    setMessage('');
  };

  return (
    <div className="animate-scale-in">
      <h1 className="content-title">Collaboration</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="dashboard-card lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Scheduled Events</h2>
          <div className="space-y-4">
            {approvedEvents.map((event, index) => (
              <div key={index} className="border rounded-md p-4 hover:bg-muted/10 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{event.eventName}</h3>
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
                    onClick={() => setSelectedEvent(event.eventName)}
                    className="flex items-center"
                  >
                    <Send className="mr-1 h-3 w-3" />
                    Collaborate
                  </CustomButton>
                </div>
              </div>
            ))}
            
            {approvedEvents.length === 0 && (
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
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="form-select"
                required
              >
                <option value="">Select an event</option>
                {approvedEvents.map((event, index) => (
                  <option key={index} value={event.eventName}>
                    {event.eventName}
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
