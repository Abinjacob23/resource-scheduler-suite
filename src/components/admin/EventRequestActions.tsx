
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

type EventRequestActionsProps = {
  id: string;
  status: string;
  processing: string | null;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
};

/**
 * Component to display approval/rejection actions for event requests
 */
const EventRequestActions = ({ 
  id, 
  status, 
  processing, 
  onApprove, 
  onReject 
}: EventRequestActionsProps) => {
  if (status !== 'pending') {
    return (
      <span className="text-sm text-muted-foreground">
        No actions available
      </span>
    );
  }

  return (
    <div className="flex justify-end gap-2">
      <Button
        size="sm"
        variant="outline"
        className="text-green-600 border-green-600"
        onClick={() => onApprove(id)}
        disabled={!!processing}
      >
        {processing === id ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <CheckCircle className="h-4 w-4 mr-2" />
        )}
        Approve
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="text-red-600 border-red-600"
        onClick={() => onReject(id)}
        disabled={!!processing}
      >
        {processing === id ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <XCircle className="h-4 w-4 mr-2" />
        )}
        Reject
      </Button>
    </div>
  );
};

export default EventRequestActions;
