
import { useState } from 'react';
import { Calendar, Check } from 'lucide-react';
import { mockCalendarBookings, mockEventRequests, RESOURCE_LABELS } from '@/utils/mock-data';
import { ResourceType } from '@/types/dashboard';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ResourceAvailability = () => {
  const approvedEvents = mockEventRequests.filter(event => event.status === 'approved');
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [selectedResource, setSelectedResource] = useState<ResourceType | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Get bookings for the selected resource on the selected date
  const getResourceBookings = () => {
    if (!selectedResource || !selectedDate) return [];
    
    const dateString = selectedDate.toISOString().split('T')[0];
    return mockCalendarBookings.filter(booking => 
      booking.resourceId === selectedResource && 
      booking.start.includes(dateString)
    );
  };

  const resourceBookings = getResourceBookings();

  return (
    <div className="animate-scale-in">
      <h1 className="content-title">Resource Availability</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="dashboard-card lg:col-span-1">
          <h2 className="text-lg font-semibold mb-4">Approved Events</h2>
          <div className="space-y-2">
            {approvedEvents.map((event, index) => (
              <div 
                key={index} 
                className={`border rounded-md p-3 cursor-pointer transition-colors ${
                  selectedEvent === event.eventName 
                    ? 'bg-primary/10 border-primary' 
                    : 'hover:bg-muted/10'
                }`}
                onClick={() => setSelectedEvent(event.eventName)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{event.eventName}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                  </div>
                  {selectedEvent === event.eventName && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </div>
              </div>
            ))}
            
            {approvedEvents.length === 0 && (
              <div className="text-center p-4 text-muted-foreground">
                No approved events available.
              </div>
            )}
          </div>
        </div>
        
        {selectedEvent && (
          <div className="dashboard-card lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4">Available Resources</h2>
            
            <Tabs defaultValue="resources" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="calendar" disabled={!selectedResource}>Calendar</TabsTrigger>
              </TabsList>
              
              <TabsContent value="resources" className="animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(Object.entries(RESOURCE_LABELS) as [ResourceType, string][]).map(([value, label]) => (
                    <div 
                      key={value} 
                      className={`border rounded-md p-4 cursor-pointer transition-colors ${
                        selectedResource === value 
                          ? 'bg-primary/10 border-primary' 
                          : 'hover:bg-muted/10'
                      }`}
                      onClick={() => setSelectedResource(value)}
                    >
                      <div className="flex justify-between items-center">
                        <p className="font-medium">{label}</p>
                        {selectedResource === value && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="calendar" className="animate-fade-in">
                {selectedResource && (
                  <div>
                    <h3 className="text-base font-medium mb-3">
                      {RESOURCE_LABELS[selectedResource]} Bookings
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="bg-card border rounded-md p-3 mb-4">
                          <CalendarComponent
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            className="mx-auto"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">
                          Bookings on {selectedDate?.toLocaleDateString()}
                        </h4>
                        
                        {resourceBookings.length > 0 ? (
                          <div className="space-y-2">
                            {resourceBookings.map((booking) => (
                              <div key={booking.id} className="border rounded-md p-3">
                                <p className="font-medium">{booking.title}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(booking.start).toLocaleTimeString()} - {new Date(booking.end).toLocaleTimeString()}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center p-4 bg-muted/20 rounded-md">
                            <Calendar className="h-8 w-8 mx-auto mb-2 text-muted-foreground/60" />
                            <p className="text-muted-foreground">No bookings for this date.</p>
                            <p className="text-xs text-muted-foreground mt-1">This resource is available all day.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceAvailability;
