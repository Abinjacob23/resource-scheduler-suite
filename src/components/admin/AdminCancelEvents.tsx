
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { CalendarX } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const AdminCancelEvents = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eventToCancel, setEventToCancel] = useState<any>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true })
        .not('status', 'eq', 'rejected'); // Don't show already rejected events

      if (error) throw error;
      setEvents(data || []);
    } catch (err: any) {
      console.error('Error fetching events:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEvent = async () => {
    if (!eventToCancel) return;
    
    try {
      setIsCancelling(true);
      
      const { error } = await supabase
        .from('events')
        .update({ status: 'rejected' })
        .eq('id', eventToCancel.id);
      
      if (error) throw error;
      
      toast({
        title: "Event Cancelled",
        description: `${eventToCancel.event_name} has been cancelled successfully.`,
      });
      
      // Update local state
      setEvents(events.map(event => 
        event.id === eventToCancel.id ? { ...event, status: 'rejected' } : event
      ));
      
      setEventToCancel(null);
    } catch (err: any) {
      console.error('Error cancelling event:', err);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsCancelling(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <h2 className="text-2xl font-bold mb-4">Cancel Events</h2>
        {[1, 2, 3].map(i => (
          <Card key={i} className="mb-4">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-9 w-24" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Cancel Events</h2>
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          Error loading events: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <CalendarX className="mr-2 h-6 w-6" />
        Cancel Events
      </h2>
      
      {events.length === 0 ? (
        <p className="text-muted-foreground">No events available to cancel.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card key={event.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{event.event_name}</CardTitle>
                  <span className={`text-xs px-2 py-1 rounded ${
                    event.status === 'approved' ? 'bg-green-100 text-green-800' : 
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
              <CardFooter>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="destructive"
                      onClick={() => setEventToCancel(event)}
                    >
                      Cancel Event
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Cancel Event</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to cancel the event "{eventToCancel?.event_name}"? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button 
                        variant="outline"
                        onClick={() => setEventToCancel(null)}
                      >
                        Nevermind
                      </Button>
                      <Button 
                        variant="destructive"
                        onClick={handleCancelEvent}
                        disabled={isCancelling}
                      >
                        {isCancelling ? 'Cancelling...' : 'Yes, Cancel Event'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCancelEvents;
