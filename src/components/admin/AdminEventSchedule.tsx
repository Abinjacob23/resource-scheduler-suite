
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

const AdminEventSchedule = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('date', { ascending: true });

        if (error) throw error;
        setEvents(data || []);
      } catch (err: any) {
        console.error('Error fetching events:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <h2 className="text-2xl font-bold mb-4">Event Schedule</h2>
        {[1, 2, 3].map(i => (
          <Card key={i} className="mb-4">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Event Schedule</h2>
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          Error loading events: {error}
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <Calendar className="mr-2 h-6 w-6" />
        Event Schedule
      </h2>
      
      {events.length === 0 ? (
        <p className="text-muted-foreground">No events scheduled at this time.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card key={event.id} className={
              event.status === 'approved' ? 'border-green-200' : 
              event.status === 'rejected' ? 'border-red-200' : ''
            }>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{event.event_name}</CardTitle>
                  <span className={`text-xs px-2 py-1 rounded ${
                    event.status === 'approved' ? 'bg-green-100 text-green-800' : 
                    event.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {event.status || 'pending'}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  {formatDate(event.date)}
                </p>
                <p className="text-sm font-medium">
                  Association: {event.association}
                </p>
                {event.description && (
                  <p className="text-sm mt-2 line-clamp-2">{event.description}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminEventSchedule;
