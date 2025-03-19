
import { Loader2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useEventRequests } from '@/hooks/use-event-requests';
import EventStatusBadge from './EventStatusBadge';
import EventDetailsDialog from './EventDetailsDialog';
import EventRequestActions from './EventRequestActions';

/**
 * Admin component to manage event requests
 */
const AdminEventRequests = () => {
  const {
    requests,
    loading,
    processing,
    selectedEvent,
    openDialog,
    setOpenDialog,
    updateRequestStatus,
    viewEventDetails
  } = useEventRequests();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Loading requests...</span>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Event Requests</h2>
      
      {requests.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No event requests found
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Association</TableHead>
                <TableHead>Event Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.association}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="mr-2">{request.event_name}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => viewEventDetails(request)}
                        className="h-6 w-6 rounded-full"
                      >
                        <Info className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(request.date).toLocaleDateString()}</TableCell>
                  <TableCell><EventStatusBadge status={request.status} /></TableCell>
                  <TableCell className="text-right">
                    <EventRequestActions
                      id={request.id}
                      status={request.status}
                      processing={processing}
                      onApprove={(id) => updateRequestStatus(id, 'approved')}
                      onReject={(id) => updateRequestStatus(id, 'rejected')}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <EventDetailsDialog 
        event={selectedEvent} 
        open={openDialog} 
        onOpenChange={setOpenDialog} 
      />
    </div>
  );
};

export default AdminEventRequests;
