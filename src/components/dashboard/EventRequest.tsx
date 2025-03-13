
import { useState } from 'react';
import CustomButton from '../ui/custom-button';

const EventRequest = () => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Event request submitted:', formData);
    // Here you would normally send the data to a server
    alert('Event request submitted successfully!');
    setFormData({
      association: '',
      eventName: '',
      date: '',
      description: ''
    });
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
            <CustomButton type="submit">
              Submit Request
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventRequest;
