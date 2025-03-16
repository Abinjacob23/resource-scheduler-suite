
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { CalendarX } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const CancelEvent = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    fetchUserEvents();
  }, [user]);

  const fetchUserEvents = async () => {
    try {
      setIsLoading(true);
      if (!user?.id) return;

      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', user.id)
        .not('status', 'eq', 'rejected')
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

  const handleCancelEvent = async () => {
    if (!selectedEvent) return;
    
    try {
      setIsCancelling(true);
      
      const { error } = await supabase
        .from('events')
        .update({ status: 'rejected' })
        .eq('id', selectedEvent.id);
      
      if (error) throw error;
      
      toast({
        title: "Event Cancelled",
        description: `${selectedEvent.event_name} has been cancelled successfully.`,
      });
      
      // Remove the event from the list
      setEvents(events.filter(event => event.id !== selectedEvent.id));
      setSelectedEvent(null);
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
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <div className="flex items-center mb-6">
          <CalendarX className="h-6 w-6 mr-2" />
          <h2 className="text-2xl font-bold">Cancel Event</h2>
        </div>
        <p className="text-muted-foreground mb-4">Loading your events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-fade-in">
        <div className="flex items-center mb-6">
          <CalendarX className="h-6 w-6 mr-2" />
          <h2 className="text-2xl font-bold">Cancel Event</h2>
        </div>
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          Error loading events: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center mb-6">
        <CalendarX className="h-6 w-6 mr-2" />
        <h2 className="text-2xl font-bold">Cancel Event</h2>
      </div>
      
      {events.length === 0 ? (
        <div className="text-center p-6 bg-muted rounded-lg">
          <CalendarX className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No Events Found</h3>
          <p className="mt-2 text-muted-foreground">
            You don't have any active events to cancel.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card key={event.id}>
              <CardHeader>
                <CardTitle className="text-lg flex justify-between">
                  <span>{event.event_name}</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    event.status === 'approved' ? 'bg-green-100 text-green-800' : 
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {event.status || 'pending'}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  {formatDate(event.date)}
                </p>
                {event.description && (
                  <p className="text-sm mb-4">{event.description}</p>
                )}
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="destructive"
                      className="w-full"
                      onClick={() => setSelectedEvent(event)}
                    >
                      Cancel This Event
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm Event Cancellation</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to cancel "{selectedEvent?.event_name}"? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button 
                        variant="outline"
                        onClick={() => setSelectedEvent(null)}
                      >
                        Keep Event
                      </Button>
                      <Button 
                        variant="destructive"
                        onClick={handleCancelEvent}
                        disabled={isCancelling}
                      >
                        {isCancelling ? 'Cancelling...' : 'Yes, Cancel It'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CancelEvent;
