
import { EventRequest } from '@/types/admin';
import EventStatusBadge from './EventStatusBadge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type EventDetailsDialogProps = {
  event: EventRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/**
 * Dialog component to display detailed information about an event
 */
const EventDetailsDialog = ({ event, open, onOpenChange }: EventDetailsDialogProps) => {
  if (!event) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Event Details</DialogTitle>
          <DialogDescription>
            Complete information about the event request
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div>
            <h3 className="text-sm font-medium">Association</h3>
            <p>{event.association}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium">Event Name</h3>
            <p>{event.event_name}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium">Date</h3>
            <p>{new Date(event.date).toLocaleDateString()}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium">Description</h3>
            <p className="whitespace-pre-wrap">{event.description || 'No description provided'}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium">Status</h3>
            <div className="mt-1"><EventStatusBadge status={event.status} /></div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailsDialog;
